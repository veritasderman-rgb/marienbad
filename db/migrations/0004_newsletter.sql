-- 0004_newsletter.sql — newslettery: koncepty, schvalování, archiv, snímek
-- příjemců a append-only statistiky. NAVRH.md sekce 4 a 5.1.

CREATE TABLE crm.newsletters (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                   text NOT NULL UNIQUE,
  subject                text NOT NULL,
  preheader              text,
  locale                 text NOT NULL DEFAULT 'de' CHECK (locale IN ('de','en','cs')),
  html_body              text NOT NULL,           -- VŽDY sanitizované (server při uložení)
  plain_body             text,
  segment_definition     jsonb,                   -- {audience: 'partners'|'leads', locales: [...], segments: [...], tiers: [...]}
  status                 text NOT NULL DEFAULT 'draft'
                         CHECK (status IN ('draft','approved','scheduled','sent')),
  mailerlite_campaign_id text,
  sent_at                timestamptz,
  recipients_count       integer,
  created_by             uuid REFERENCES crm.portal_users(id),
  created_via            text NOT NULL DEFAULT 'portal' CHECK (created_via IN ('portal','intake')),
  approved_by            uuid REFERENCES crm.portal_users(id),
  approved_at            timestamptz,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX newsletters_status_idx ON crm.newsletters (status, created_at DESC);

CREATE TRIGGER newsletters_updated_at
  BEFORE UPDATE ON crm.newsletters
  FOR EACH ROW EXECUTE FUNCTION crm.set_updated_at();

-- Snímek příjemců k okamžiku odeslání — kontakt se může později změnit či smazat
CREATE TABLE crm.newsletter_recipients (
  newsletter_id  uuid NOT NULL REFERENCES crm.newsletters(id) ON DELETE CASCADE,
  partner_id     uuid,          -- bez FK CASCADE: snímek přežívá smazání partnera
  contact_id     uuid,
  email_snapshot text NOT NULL,
  PRIMARY KEY (newsletter_id, email_snapshot)
);

-- Append-only: každý měsíční sběr = nový řádek (časová řada)
CREATE TABLE crm.newsletter_stats (
  id                   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  newsletter_id        uuid NOT NULL REFERENCES crm.newsletters(id) ON DELETE CASCADE,
  fetched_at           timestamptz NOT NULL DEFAULT now(),
  sent                 integer,
  opens_count          integer,
  unique_opens_count   integer,
  open_rate            numeric(6,4),
  clicks_count         integer,
  unique_clicks_count  integer,
  click_rate           numeric(6,4),
  click_to_open_rate   numeric(6,4),
  unsubscribes_count   integer,
  spam_count           integer,
  hard_bounces_count   integer,
  soft_bounces_count   integer
);
CREATE INDEX newsletter_stats_nl_idx ON crm.newsletter_stats (newsletter_id, fetched_at DESC);

CREATE TABLE crm.newsletter_link_stats (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  newsletter_id uuid NOT NULL REFERENCES crm.newsletters(id) ON DELETE CASCADE,
  url           text NOT NULL,
  clicks_count  integer,
  fetched_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX newsletter_link_stats_nl_idx ON crm.newsletter_link_stats (newsletter_id, fetched_at DESC);

-- Zámky proti souběhu cron jobů (pg advisory locky nepřežijí pooler — tabulka)
CREATE TABLE crm.job_locks (
  name       text PRIMARY KEY,
  locked_at  timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);

GRANT SELECT, INSERT, UPDATE ON crm.newsletters            TO portal_app;
GRANT SELECT, INSERT         ON crm.newsletter_recipients  TO portal_app;
GRANT SELECT, INSERT         ON crm.newsletter_stats       TO portal_app;
GRANT SELECT, INSERT         ON crm.newsletter_link_stats  TO portal_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON crm.job_locks      TO portal_app;

ALTER TABLE crm.newsletters           ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.newsletters           FORCE  ROW LEVEL SECURITY;
ALTER TABLE crm.newsletter_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.newsletter_recipients FORCE  ROW LEVEL SECURITY;
ALTER TABLE crm.newsletter_stats      ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.newsletter_stats      FORCE  ROW LEVEL SECURITY;
ALTER TABLE crm.newsletter_link_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.newsletter_link_stats FORCE  ROW LEVEL SECURITY;
ALTER TABLE crm.job_locks             ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.job_locks             FORCE  ROW LEVEL SECURITY;

CREATE POLICY app_all   ON crm.newsletters           TO portal_app   USING (true) WITH CHECK (true);
CREATE POLICY owner_all ON crm.newsletters           TO neondb_owner USING (true) WITH CHECK (true);
CREATE POLICY app_all   ON crm.newsletter_recipients TO portal_app   USING (true) WITH CHECK (true);
CREATE POLICY owner_all ON crm.newsletter_recipients TO neondb_owner USING (true) WITH CHECK (true);
CREATE POLICY app_all   ON crm.newsletter_stats      TO portal_app   USING (true) WITH CHECK (true);
CREATE POLICY owner_all ON crm.newsletter_stats      TO neondb_owner USING (true) WITH CHECK (true);
CREATE POLICY app_all   ON crm.newsletter_link_stats TO portal_app   USING (true) WITH CHECK (true);
CREATE POLICY owner_all ON crm.newsletter_link_stats TO neondb_owner USING (true) WITH CHECK (true);
CREATE POLICY app_all   ON crm.job_locks             TO portal_app   USING (true) WITH CHECK (true);
CREATE POLICY owner_all ON crm.job_locks             TO neondb_owner USING (true) WITH CHECK (true);
