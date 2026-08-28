-- 0001_base.sql — základ portálu: schéma crm, uživatelé, sessions, audit log,
-- aplikační role portal_app s minimálními právy, RLS (enable + FORCE) všude.
--
-- Spouští se pod rolí vlastníka (neondb_owner) přes přímý endpoint.
-- Heslo role portal_app se nastavuje ručně v Neon konzoli (Roles → Reset password),
-- nikdy v SQL — viz runbook.

CREATE EXTENSION IF NOT EXISTS citext;

CREATE SCHEMA IF NOT EXISTS crm;

-- ---------------------------------------------------------------------------
-- Aplikační role: SELECT/INSERT/UPDATE, žádné DDL, žádný DELETE, žádný BYPASSRLS
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'portal_app') THEN
    CREATE ROLE portal_app LOGIN;
  END IF;
END $$;

GRANT USAGE ON SCHEMA crm TO portal_app;

-- ---------------------------------------------------------------------------
-- Uživatelé portálu
-- ---------------------------------------------------------------------------
CREATE TABLE crm.portal_users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         citext NOT NULL UNIQUE,
  display_name  text NOT NULL DEFAULT '',
  role          text NOT NULL CHECK (role IN ('owner','editor','analyst','viewer')),
  password_hash text,               -- argon2id; NULL dokud pozvánka nebyla přijata
  totp_secret_enc text,             -- AES-256-GCM šifrované PORTAL_TOTP_KEY
  totp_enabled  boolean NOT NULL DEFAULT false,
  is_active     boolean NOT NULL DEFAULT true,
  invited_by    uuid REFERENCES crm.portal_users(id),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz
);

-- Jednorázové tokeny (pozvánka, reset hesla) — ukládá se jen SHA-256 otisk
CREATE TABLE crm.user_tokens (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES crm.portal_users(id) ON DELETE CASCADE,
  kind       text NOT NULL CHECK (kind IN ('invite','password_reset')),
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX user_tokens_user_idx ON crm.user_tokens (user_id, kind);

-- Sessions: cookie drží (id, tajemství); v DB jen otisk tajemství.
-- Tajemství se rotuje ~1× za hodinu (krátkodobý access + rotace),
-- prev_token_hash s krátkou platností kryje souběh požadavků při rotaci.
CREATE TABLE crm.portal_sessions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES crm.portal_users(id) ON DELETE CASCADE,
  token_hash          text NOT NULL,
  prev_token_hash     text,
  rotated_at          timestamptz NOT NULL DEFAULT now(),
  created_at          timestamptz NOT NULL DEFAULT now(),
  last_seen_at        timestamptz NOT NULL DEFAULT now(),
  absolute_expires_at timestamptz NOT NULL,
  revoked_at          timestamptz,
  ip                  text,
  user_agent          text
);
CREATE INDEX portal_sessions_user_idx  ON crm.portal_sessions (user_id);
CREATE INDEX portal_sessions_token_idx ON crm.portal_sessions (token_hash);

-- Události pro rate limiting a alerty (přihlášení i strojové cesty) — append-only
CREATE TABLE crm.auth_events (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kind       text NOT NULL,   -- login_fail | login_ok | totp_fail | machine_401 | reset_request | invite_fail
  identifier citext,          -- e-mail účtu nebo jméno strojového tokenu
  ip         text,
  at         timestamptz NOT NULL DEFAULT now(),
  meta       jsonb
);
CREATE INDEX auth_events_ident_idx ON crm.auth_events (kind, identifier, at);
CREATE INDEX auth_events_ip_idx    ON crm.auth_events (kind, ip, at);

-- ---------------------------------------------------------------------------
-- Audit log — append-only i pro service přístup (audit N-09)
-- ---------------------------------------------------------------------------
CREATE TABLE crm.audit_log (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id   uuid,            -- NULL = stroj (cron / intake)
  action     text NOT NULL,   -- create | update | delete | export | send | login | ...
  entity     text NOT NULL,
  entity_id  text,
  diff       jsonb,
  ip         text,
  user_agent text,
  at         timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audit_log_entity_idx ON crm.audit_log (entity, entity_id);
CREATE INDEX audit_log_at_idx     ON crm.audit_log (at);

CREATE FUNCTION crm.audit_log_block_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'crm.audit_log is append-only (N-09)';
END $$;

CREATE TRIGGER audit_log_immutable
  BEFORE UPDATE OR DELETE ON crm.audit_log
  FOR EACH ROW EXECUTE FUNCTION crm.audit_log_block_mutation();

-- Mazat smí jen retenční job přes tuto funkci; trigger se vypíná jen uvnitř
-- (SECURITY DEFINER běží jako vlastník tabulky). RLS politika níže navíc
-- omezuje DELETE na záznamy starší 12 měsíců.
CREATE FUNCTION crm.audit_log_purge(min_age interval DEFAULT interval '12 months')
RETURNS bigint
LANGUAGE plpgsql SECURITY DEFINER SET search_path = crm, pg_temp AS $$
DECLARE n bigint;
BEGIN
  IF min_age < interval '12 months' THEN
    RAISE EXCEPTION 'audit_log retence je minimálně 12 měsíců';
  END IF;
  ALTER TABLE crm.audit_log DISABLE TRIGGER audit_log_immutable;
  DELETE FROM crm.audit_log WHERE at < now() - min_age;
  GET DIAGNOSTICS n = ROW_COUNT;
  ALTER TABLE crm.audit_log ENABLE TRIGGER audit_log_immutable;
  RETURN n;
END $$;
REVOKE ALL ON FUNCTION crm.audit_log_purge(interval) FROM PUBLIC;

-- ---------------------------------------------------------------------------
-- updated_at trigger (sdílený)
-- ---------------------------------------------------------------------------
CREATE FUNCTION crm.set_updated_at() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END $$;

CREATE TRIGGER portal_users_updated_at
  BEFORE UPDATE ON crm.portal_users
  FOR EACH ROW EXECUTE FUNCTION crm.set_updated_at();

-- ---------------------------------------------------------------------------
-- Práva: minimální grants pro portal_app
-- ---------------------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE ON crm.portal_users    TO portal_app;
GRANT SELECT, INSERT, UPDATE ON crm.user_tokens     TO portal_app;
GRANT SELECT, INSERT, UPDATE ON crm.portal_sessions TO portal_app;
GRANT SELECT, INSERT         ON crm.auth_events     TO portal_app;
GRANT SELECT, INSERT         ON crm.audit_log       TO portal_app;
-- identity sloupce potřebují USAGE na sekvencích
GRANT USAGE ON ALL SEQUENCES IN SCHEMA crm TO portal_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA crm GRANT USAGE ON SEQUENCES TO portal_app;

-- ---------------------------------------------------------------------------
-- RLS: enable + FORCE všude (obrana do hloubky).
-- portal_app má plošné politiky (jemné řízení dělá aplikace podle role);
-- vlastník (neondb_owner) má provozní politiky pro migrace a údržbu —
-- s výjimkou audit_log, kde smí jen číst a mazat záznamy starší 12 měsíců.
--
-- Ověřeno na Neonu: neondb_owner má atribut BYPASSRLS, takže na vlastníka RLS
-- fakticky nedopadá ani s FORCE — proti kompromitaci owner přístupu chrání
-- audit_log trigger výše (N-09). RLS vrstva je reálná pro portal_app
-- (rolbypassrls = false), což je jediná role, pod kterou běží aplikace.
-- ---------------------------------------------------------------------------
ALTER TABLE crm.portal_users    ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.portal_users    FORCE  ROW LEVEL SECURITY;
ALTER TABLE crm.user_tokens     ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.user_tokens     FORCE  ROW LEVEL SECURITY;
ALTER TABLE crm.portal_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.portal_sessions FORCE  ROW LEVEL SECURITY;
ALTER TABLE crm.auth_events     ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.auth_events     FORCE  ROW LEVEL SECURITY;
ALTER TABLE crm.audit_log       ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.audit_log       FORCE  ROW LEVEL SECURITY;

CREATE POLICY app_all   ON crm.portal_users    TO portal_app    USING (true) WITH CHECK (true);
CREATE POLICY owner_all ON crm.portal_users    TO neondb_owner  USING (true) WITH CHECK (true);
CREATE POLICY app_all   ON crm.user_tokens     TO portal_app    USING (true) WITH CHECK (true);
CREATE POLICY owner_all ON crm.user_tokens     TO neondb_owner  USING (true) WITH CHECK (true);
CREATE POLICY app_all   ON crm.portal_sessions TO portal_app    USING (true) WITH CHECK (true);
CREATE POLICY owner_all ON crm.portal_sessions TO neondb_owner  USING (true) WITH CHECK (true);
CREATE POLICY app_all   ON crm.auth_events     TO portal_app    USING (true) WITH CHECK (true);
CREATE POLICY owner_all ON crm.auth_events     TO neondb_owner  USING (true) WITH CHECK (true);

-- audit_log: aplikace čte a zapisuje; vlastník čte, DELETE jen přes purge
-- funkci a jen na záznamy starší 12 měsíců (RLS podmínka), UPDATE nikdo.
CREATE POLICY app_select   ON crm.audit_log FOR SELECT TO portal_app   USING (true);
CREATE POLICY app_insert   ON crm.audit_log FOR INSERT TO portal_app   WITH CHECK (true);
CREATE POLICY owner_select ON crm.audit_log FOR SELECT TO neondb_owner USING (true);
CREATE POLICY owner_purge  ON crm.audit_log FOR DELETE TO neondb_owner
  USING (at < now() - interval '12 months');
