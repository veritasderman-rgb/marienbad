-- 0003_imports.sql — společná evidence importů (veletržní CSV, později Excel
-- výkonnosti a PMS push) + uložené šablony mapování sloupců. NAVRH.md sekce 4.
--
-- `staging` drží rozparsované řádky mezi kroky průvodce (serverless nemá
-- sdílenou paměť); po commitu importu se čistí. Zdrojový soubor jde do R2
-- (storage_path), staging je jen pracovní mezistav.

CREATE TABLE crm.import_templates (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind           text NOT NULL CHECK (kind IN ('performance','partners')),
  name           text NOT NULL,
  column_mapping jsonb NOT NULL,
  created_by     uuid REFERENCES crm.portal_users(id),
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kind, name)
);

CREATE TABLE crm.imports (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind           text NOT NULL CHECK (kind IN ('performance','partners','performance_pms')),
  filename       text,
  sha256         text,
  storage_path   text,             -- klíč v R2; NULL = úložiště nebylo nakonfigurováno
  template_id    uuid REFERENCES crm.import_templates(id) ON DELETE SET NULL,
  encoding       text,             -- detekované kódování (utf-8 / windows-1250)
  delimiter      text,             -- detekovaný oddělovač (';' / ',')
  rows_total     integer NOT NULL DEFAULT 0,
  rows_ok        integer NOT NULL DEFAULT 0,
  rows_failed    integer NOT NULL DEFAULT 0,
  rows_duplicate integer NOT NULL DEFAULT 0,
  status         text NOT NULL DEFAULT 'uploaded'
                 CHECK (status IN ('uploaded','committed','failed')),
  error_log      jsonb,
  params         jsonb,            -- mapování, opt-in nastavení, rozhodnutí u fuzzy shod
  staging        jsonb,            -- rozparsované řádky mezi kroky průvodce
  uploaded_by    uuid REFERENCES crm.portal_users(id),
  uploaded_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX imports_kind_idx ON crm.imports (kind, uploaded_at DESC);

GRANT SELECT, INSERT, UPDATE ON crm.import_templates TO portal_app;
GRANT SELECT, INSERT, UPDATE ON crm.imports          TO portal_app;

ALTER TABLE crm.import_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.import_templates FORCE  ROW LEVEL SECURITY;
ALTER TABLE crm.imports          ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.imports          FORCE  ROW LEVEL SECURITY;

CREATE POLICY app_all   ON crm.import_templates TO portal_app   USING (true) WITH CHECK (true);
CREATE POLICY owner_all ON crm.import_templates TO neondb_owner USING (true) WITH CHECK (true);
CREATE POLICY app_all   ON crm.imports          TO portal_app   USING (true) WITH CHECK (true);
CREATE POLICY owner_all ON crm.imports          TO neondb_owner USING (true) WITH CHECK (true);
