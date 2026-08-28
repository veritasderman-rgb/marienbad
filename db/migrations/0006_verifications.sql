-- 0006_verifications.sql — prověrky partnerů v Hlídači státu (NAVRH 5.5).
-- Append-only: každá kontrola = nový řádek, historie zůstává.
--
-- `raw` nese FILTROVANÝ snímek odpovědi (bez polí zvláštní kategorie dle
-- čl. 9 GDPR — political_Involvement a příbuzná se NIKDY neukládají; filtr
-- je v kódu, ne dohoda). Ukládá se kvůli doložitelnosti rozhodnutí.

CREATE TABLE crm.partner_verifications (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id                  uuid NOT NULL REFERENCES crm.partners(id) ON DELETE CASCADE,
  ico                         text NOT NULL,
  checked_at                  timestamptz NOT NULL DEFAULT now(),
  source                      text NOT NULL DEFAULT 'hlidac_statu',
  insolvency_as_debtor_open   boolean,
  insolvency_as_debtor_count  integer,
  vat_unreliable_now          boolean,
  vat_ever_listed             boolean,
  criminal_records_count      integer,
  employees_band              text,
  turnover_band               text,
  vat_payer_status            text,
  risk_level                  text NOT NULL CHECK (risk_level IN ('ok','watch','alert')),
  raw                         jsonb,
  source_url                  text,   -- odkaz na kartu subjektu (licence Hlídače)
  created_at                  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX partner_verifications_partner_idx ON crm.partner_verifications (partner_id, checked_at DESC);

GRANT SELECT, INSERT ON crm.partner_verifications TO portal_app;

ALTER TABLE crm.partner_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.partner_verifications FORCE  ROW LEVEL SECURITY;
CREATE POLICY app_all   ON crm.partner_verifications TO portal_app   USING (true) WITH CHECK (true);
CREATE POLICY owner_all ON crm.partner_verifications TO neondb_owner USING (true) WITH CHECK (true);
