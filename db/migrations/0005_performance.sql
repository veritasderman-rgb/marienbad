-- 0005_performance.sql — měsíční výkonnost partnerů + srovnávací view
-- (MoM / YoY / R12). Datový model a view dle NAVRH.md sekce 4 a 4.1.

CREATE TABLE crm.partner_performance (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id     uuid NOT NULL REFERENCES crm.partners(id) ON DELETE CASCADE,
  period_month   date NOT NULL CHECK (period_month = date_trunc('month', period_month)::date),
  hotel_slug     text NOT NULL,
  bookings       integer,
  room_nights    integer,
  guests         integer,
  cancellations  integer,
  revenue_amount numeric(14,2),
  currency       text NOT NULL DEFAULT 'CZK',
  fx_rate        numeric(12,6),
  revenue_eur    numeric(14,2),
  extra          jsonb,
  import_id      uuid REFERENCES crm.imports(id) ON DELETE SET NULL,
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (partner_id, period_month, hotel_slug)
);
CREATE INDEX partner_performance_period_idx ON crm.partner_performance (period_month);
CREATE INDEX partner_performance_partner_idx ON crm.partner_performance (partner_id, period_month);

GRANT SELECT, INSERT, UPDATE ON crm.partner_performance TO portal_app;

ALTER TABLE crm.partner_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.partner_performance FORCE  ROW LEVEL SECURITY;
CREATE POLICY app_all   ON crm.partner_performance TO portal_app   USING (true) WITH CHECK (true);
CREATE POLICY owner_all ON crm.partner_performance TO neondb_owner USING (true) WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- Srovnávací view (NAVRH 4.1). Dva kroky před oknem nejsou kosmetika:
-- LAG posouvá o ŘÁDKY, ne o měsíce — bez agregace na jeden řádek na partnera
-- a měsíc a bez dopočtu chybějících měsíců jako nul by srovnání tiše
-- ukazovalo špatná čísla.
-- ---------------------------------------------------------------------------
CREATE VIEW crm.v_performance_compare AS
WITH monthly AS (
  SELECT partner_id,
         period_month,
         SUM(revenue_eur)  AS revenue_eur,
         SUM(room_nights)  AS room_nights
  FROM crm.partner_performance
  GROUP BY partner_id, period_month
),
series AS (
  -- Souvislá řada měsíců pro každého partnera; měsíc bez dat = nula.
  -- Konec řady = poslední NAIMPORTOVANÝ měsíc, ne dnešek — jinak by R12
  -- klesalo jen proto, že data ještě nikdo nenahrál.
  SELECT p.partner_id,
         g.month::date              AS period_month,
         COALESCE(m.revenue_eur, 0) AS revenue_eur,
         COALESCE(m.room_nights, 0) AS room_nights
  FROM (SELECT DISTINCT partner_id FROM monthly) p
  CROSS JOIN generate_series(
               (SELECT MIN(period_month) FROM monthly),
               (SELECT MAX(period_month) FROM monthly),
               interval '1 month'
             ) AS g(month)
  LEFT JOIN monthly m
         ON m.partner_id   = p.partner_id
        AND m.period_month = g.month::date
)
SELECT
  partner_id,
  period_month,
  revenue_eur,
  room_nights,
  LAG(revenue_eur, 1)  OVER w AS revenue_prev_month,
  LAG(revenue_eur, 12) OVER w AS revenue_same_month_last_year,
  LAG(room_nights, 1)  OVER w AS room_nights_prev_month,
  LAG(room_nights, 12) OVER w AS room_nights_same_month_last_year,
  SUM(revenue_eur) OVER (w ROWS BETWEEN 11 PRECEDING AND CURRENT ROW)  AS revenue_r12,
  SUM(revenue_eur) OVER (w ROWS BETWEEN 23 PRECEDING AND 12 PRECEDING) AS revenue_r12_prev,
  COUNT(*)         OVER (w ROWS BETWEEN 23 PRECEDING AND 12 PRECEDING) AS r12_prev_months
FROM series
WINDOW w AS (PARTITION BY partner_id ORDER BY period_month);

-- Rozpad po hotelech — stejná stavba, partition po (partner_id, hotel_slug)
CREATE VIEW crm.v_performance_compare_hotel AS
WITH monthly AS (
  SELECT partner_id, hotel_slug,
         period_month,
         SUM(revenue_eur)  AS revenue_eur,
         SUM(room_nights)  AS room_nights
  FROM crm.partner_performance
  GROUP BY partner_id, hotel_slug, period_month
),
series AS (
  SELECT p.partner_id, p.hotel_slug,
         g.month::date              AS period_month,
         COALESCE(m.revenue_eur, 0) AS revenue_eur,
         COALESCE(m.room_nights, 0) AS room_nights
  FROM (SELECT DISTINCT partner_id, hotel_slug FROM monthly) p
  CROSS JOIN generate_series(
               (SELECT MIN(period_month) FROM monthly),
               (SELECT MAX(period_month) FROM monthly),
               interval '1 month'
             ) AS g(month)
  LEFT JOIN monthly m
         ON m.partner_id   = p.partner_id
        AND m.hotel_slug   = p.hotel_slug
        AND m.period_month = g.month::date
)
SELECT
  partner_id,
  hotel_slug,
  period_month,
  revenue_eur,
  room_nights,
  LAG(revenue_eur, 1)  OVER w AS revenue_prev_month,
  LAG(revenue_eur, 12) OVER w AS revenue_same_month_last_year,
  SUM(revenue_eur) OVER (w ROWS BETWEEN 11 PRECEDING AND CURRENT ROW)  AS revenue_r12,
  SUM(revenue_eur) OVER (w ROWS BETWEEN 23 PRECEDING AND 12 PRECEDING) AS revenue_r12_prev
FROM series
WINDOW w AS (PARTITION BY partner_id, hotel_slug ORDER BY period_month);

GRANT SELECT ON crm.v_performance_compare       TO portal_app;
GRANT SELECT ON crm.v_performance_compare_hotel TO portal_app;
