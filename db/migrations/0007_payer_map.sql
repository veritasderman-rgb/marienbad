-- 0007_payer_map.sql — mapování plátců z PMS na partnery (NAVRH 6.2).
--
-- Párování VŽDY potvrzuje člověk: řádek s confirmed_at IS NULL je fronta
-- „čeká na přiřazení" a jeho obrat se nikam nezapočítává. partner_id NULL
-- u potvrzeného řádku znamená „vědomě není partner" (kind ≠ 'partner').
-- Nespárované dávky zůstávají ve staging příslušného crm.imports řádku
-- (kind 'performance_pms') a po potvrzení mapování se přehrají — upsert je
-- idempotentní, žádný řádek se neztratí.

CREATE TABLE crm.partner_payer_map (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id      uuid REFERENCES crm.partners(id) ON DELETE SET NULL,
  payer_name_raw  text NOT NULL,   -- přesně jak to píše PMS
  payer_name_norm text NOT NULL UNIQUE,  -- bez diakritiky, malá písmena, bez právních forem
  kind            text CHECK (kind IN ('partner','aggregate','direct','insurer_internal','natural_person','ignore')),
  confirmed_by    uuid REFERENCES crm.portal_users(id),
  confirmed_at    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  -- potvrzený záznam musí mít kind; kind 'partner' vyžaduje partner_id
  CONSTRAINT confirmed_has_kind CHECK (confirmed_at IS NULL OR kind IS NOT NULL),
  CONSTRAINT partner_kind_has_partner CHECK (kind IS DISTINCT FROM 'partner' OR partner_id IS NOT NULL OR confirmed_at IS NULL)
);
CREATE INDEX partner_payer_map_pending_idx ON crm.partner_payer_map (created_at) WHERE confirmed_at IS NULL;
CREATE INDEX partner_payer_map_partner_idx ON crm.partner_payer_map (partner_id);

GRANT SELECT, INSERT, UPDATE ON crm.partner_payer_map TO portal_app;

ALTER TABLE crm.partner_payer_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.partner_payer_map FORCE  ROW LEVEL SECURITY;
CREATE POLICY app_all   ON crm.partner_payer_map TO portal_app   USING (true) WITH CHECK (true);
CREATE POLICY owner_all ON crm.partner_payer_map TO neondb_owner USING (true) WITH CHECK (true);
