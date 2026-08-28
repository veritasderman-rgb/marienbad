-- 0002_crm.sql — CRM: partneři, kontaktní osoby, historie komunikace.
-- Datový model dle NAVRH.md sekce 4.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE crm.partners (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name               text NOT NULL,
  legal_name         text,
  ico                text CHECK (ico ~ '^[0-9]{8}$'),
  dic                text,
  country            text NOT NULL DEFAULT 'CZ',   -- ISO 3166-1 alpha-2
  city               text,
  website            text,
  segment            text NOT NULL DEFAULT 'other'
                     CHECK (segment IN ('travel_agency','tour_operator','corporate','insurer','other')),
  tier               text CHECK (tier IN ('A','B','C')),
  status             text NOT NULL DEFAULT 'prospect'
                     CHECK (status IN ('active','prospect','inactive')),
  owner_user_id      uuid REFERENCES crm.portal_users(id),
  acquisition_source text,                         -- 'veletrh:ITB-2026' | 'import:2026-03' | 'manual'
  acquired_at        date,
  acquired_by        uuid REFERENCES crm.portal_users(id),
  languages          text[] NOT NULL DEFAULT '{}', -- jazyk rozesílky: de/en/cs
  notes              text,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);
-- IČO je unikátní, ale nepovinné (zahraniční partneři ho nemají)
CREATE UNIQUE INDEX partners_ico_key ON crm.partners (ico) WHERE ico IS NOT NULL;
CREATE INDEX partners_name_trgm ON crm.partners USING gin (name gin_trgm_ops);
CREATE INDEX partners_segment_idx ON crm.partners (segment, status);
CREATE INDEX partners_owner_idx ON crm.partners (owner_user_id);

CREATE TRIGGER partners_updated_at
  BEFORE UPDATE ON crm.partners
  FOR EACH ROW EXECUTE FUNCTION crm.set_updated_at();

CREATE TABLE crm.partner_contacts (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id               uuid NOT NULL REFERENCES crm.partners(id) ON DELETE CASCADE,
  first_name               text NOT NULL DEFAULT '',
  last_name                text NOT NULL DEFAULT '',
  email                    citext,
  phone                    text,
  position                 text,
  is_primary               boolean NOT NULL DEFAULT false,
  newsletter_opt_in        boolean NOT NULL DEFAULT false,
  lawful_basis             text CHECK (lawful_basis IN ('legitimate_interest','consent','contract')),
  consent_basis            text CHECK (consent_basis IN ('lead_scanner','business_card','explicit_signup','unknown')),
  opt_in_source            text,      -- konkrétní akce, např. 'veletrh:ITB-2026'
  opt_in_at                date,
  opt_in_evidence          text,      -- doklad, jak souhlas vznikl
  unsubscribed_at          timestamptz,
  mailerlite_subscriber_id text,
  anonymized_at            timestamptz,  -- GDPR výmaz: osobní pole vyprázdněná, agregáty zůstávají
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX partner_contacts_partner_idx ON crm.partner_contacts (partner_id);
CREATE INDEX partner_contacts_email_idx ON crm.partner_contacts (email) WHERE email IS NOT NULL;
CREATE INDEX partner_contacts_newsletter_idx ON crm.partner_contacts (newsletter_opt_in)
  WHERE newsletter_opt_in AND unsubscribed_at IS NULL;

CREATE TRIGGER partner_contacts_updated_at
  BEFORE UPDATE ON crm.partner_contacts
  FOR EACH ROW EXECUTE FUNCTION crm.set_updated_at();

CREATE TABLE crm.interactions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id  uuid NOT NULL REFERENCES crm.partners(id) ON DELETE CASCADE,
  contact_id  uuid REFERENCES crm.partner_contacts(id) ON DELETE SET NULL,
  type        text NOT NULL CHECK (type IN ('call','email','meeting','fair','note','other')),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  subject     text NOT NULL,
  body        text,
  created_by  uuid REFERENCES crm.portal_users(id),
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX interactions_partner_idx ON crm.interactions (partner_id, occurred_at DESC);

-- Práva: owner smí mazat (vynucuje aplikace podle role), proto DELETE grant zde
GRANT SELECT, INSERT, UPDATE, DELETE ON crm.partners         TO portal_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON crm.partner_contacts TO portal_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON crm.interactions     TO portal_app;

ALTER TABLE crm.partners         ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.partners         FORCE  ROW LEVEL SECURITY;
ALTER TABLE crm.partner_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.partner_contacts FORCE  ROW LEVEL SECURITY;
ALTER TABLE crm.interactions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.interactions     FORCE  ROW LEVEL SECURITY;

CREATE POLICY app_all   ON crm.partners         TO portal_app   USING (true) WITH CHECK (true);
CREATE POLICY owner_all ON crm.partners         TO neondb_owner USING (true) WITH CHECK (true);
CREATE POLICY app_all   ON crm.partner_contacts TO portal_app   USING (true) WITH CHECK (true);
CREATE POLICY owner_all ON crm.partner_contacts TO neondb_owner USING (true) WITH CHECK (true);
CREATE POLICY app_all   ON crm.interactions     TO portal_app   USING (true) WITH CHECK (true);
CREATE POLICY owner_all ON crm.interactions     TO neondb_owner USING (true) WITH CHECK (true);
