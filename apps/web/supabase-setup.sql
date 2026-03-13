-- ============================================================
-- MARIENBAD.COM — Supabase Setup & Seed Data
-- ============================================================
--
-- IMPORTANT: Payload CMS creates all tables automatically via
-- the `push: true` setting in payload.config.ts.
--
-- This file handles:
--   1. Supabase-specific configuration (extensions, permissions)
--   2. Seed data for initial content
--
-- HOW TO USE:
--   1. Create a new Supabase project
--   2. Copy the DATABASE_URL from: Settings > Database > Connection string > URI
--      Format: postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
--   3. Add DATABASE_URL to Vercel Environment Variables
--   4. Deploy — Payload will create all tables on first request
--   5. THEN run this SQL in Supabase SQL Editor to seed initial data
--
-- ============================================================


-- ============================================================
-- STEP 1: Pre-deployment — Run BEFORE first deploy
-- ============================================================

-- Ensure required extensions are enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant permissions for Payload CMS to manage schema
-- (Payload needs to create tables, indexes, enums, etc.)
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;


-- ============================================================
-- STEP 2: Post-deployment — Run AFTER Payload creates tables
-- ============================================================
-- After the first successful load of /admin, Payload will have
-- created all tables. Then run the seed data below.
--
-- IMPORTANT: First create an admin user via /admin UI,
-- then run the seed SQL below.
-- ============================================================


-- ------------------------------------------------------------
-- Seed: Categories
-- ------------------------------------------------------------
-- Note: Payload table names follow the pattern: collection slug
-- Fields use snake_case. Localized fields get suffixed: _de, _en, _ru, _cs

-- You'll insert these via the /admin UI or API after first deploy.
-- Below is the reference data structure for planning:

/*
CATEGORIES to create in /admin:
  1. Mineral Springs / Mineralquellen / Минеральные источники / Minerální prameny
     slug: mineral-springs
  2. Wellness & Spa / Wellness & Spa / Велнес и Спа / Wellness a Spa
     slug: wellness-spa
  3. History & Culture / Geschichte & Kultur / История и Культура / Historie a Kultura
     slug: history-culture
  4. Things to Do / Aktivitäten / Чем заняться / Co dělat
     slug: things-to-do
  5. Accommodation / Unterkünfte / Размещение / Ubytování
     slug: accommodation
  6. Practical Info / Praktische Infos / Полезная информация / Praktické informace
     slug: practical-info
  7. Food & Drink / Essen & Trinken / Еда и Напитки / Jídlo a Pití
     slug: food-drink
  8. Events / Veranstaltungen / Мероприятия / Akce
     slug: events
*/


-- ------------------------------------------------------------
-- Seed: Authors
-- ------------------------------------------------------------
/*
AUTHORS to create in /admin:
  1. Name: "Marienbad.com Redaktion"
     Title (DE): "Redaktionsteam"
     Title (EN): "Editorial Team"
     Bio (DE): "Das Redaktionsteam von Marienbad.com — Einheimische und Experten, die Mariánské Lázně lieben."
     Bio (EN): "The Marienbad.com editorial team — locals and experts who love Mariánské Lázně."
     isEnsanaExpert: false

  2. Name: "Dr. Jana Nováková"
     Title (DE): "Kurärtzin bei Ensana Nové Lázně"
     Title (EN): "Spa Doctor at Ensana Nové Lázně"
     isEnsanaExpert: true
*/


-- ------------------------------------------------------------
-- Seed: Site Settings (Global)
-- ------------------------------------------------------------
/*
SITE SETTINGS to configure in /admin > Globals > Site Settings:
  - siteName: "Marienbad.com"
  - tagline (DE): "Ihr Guide für Mariánské Lázně"
  - tagline (EN): "Your Guide to Mariánské Lázně"
  - tagline (RU): "Ваш путеводитель по Марианским Лазням"
  - tagline (CS): "Váš průvodce po Mariánských Lázních"
  - ga4MeasurementId: [YOUR_GA4_ID]
  - gscVerification: [YOUR_GSC_CODE]
  - ensanaDefaults:
      baseUrl: "https://www.ensanahotels.com"
      utmSource: "marienbad.com"
      utmMedium: "referral"
*/


-- ------------------------------------------------------------
-- Seed: Navigation (Global)
-- ------------------------------------------------------------
/*
NAVIGATION to configure in /admin > Globals > Navigation:
  mainMenu:
    1. label (DE): "Mineralquellen" | (EN): "Mineral Springs"
       url: /mineral-springs
    2. label (DE): "Aktivitäten" | (EN): "Things to Do"
       url: /things-to-do
    3. label (DE): "Unterkünfte" | (EN): "Accommodation"
       url: /accommodation
    4. label (DE): "Geschichte" | (EN): "History"
       url: /history
    5. label (DE): "Praktisches" | (EN): "Practical Info"
       url: /practical-info
    6. label (DE): "Menschen" | (EN): "People"
       url: /people
    7. label (DE): "Magazin" | (EN): "Magazine"
       url: /magazine
*/


-- ------------------------------------------------------------
-- Seed: Footer (Global)
-- ------------------------------------------------------------
/*
FOOTER to configure in /admin > Globals > Footer:
  aboutText (DE): "Marienbad.com ist der unabhängige Reiseführer für Mariánské Lázně — Tschechiens berühmtesten Kurort."
  aboutText (EN): "Marienbad.com is the independent travel guide to Mariánské Lázně — Czechia's most famous spa town."
  quickLinks:
    1. label: "Impressum" | url: /impressum
    2. label: "Datenschutz" | url: /datenschutz
    3. label: "Kontakt" | url: /kontakt
  socialLinks:
    instagram: https://instagram.com/marienbad.com
    facebook: https://facebook.com/marienbad.com
    youtube: ""
*/


-- ------------------------------------------------------------
-- Seed: Pages (Pillar Pages)
-- ------------------------------------------------------------
/*
PILLAR PAGES to create in /admin (6 pages):

1. MINERAL SPRINGS
   title (DE): "Mineralquellen in Marienbad"
   title (EN): "Mineral Springs in Marienbad"
   slug (DE): "mineralquellen"
   slug (EN): "mineral-springs"
   type: "pillar"
   status: "published"
   hero:
     headline (DE): "Die Heilquellen von Marienbad"
     headline (EN): "The Healing Springs of Marienbad"
     subheadline (DE): "40+ Mineralquellen mit einzigartiger Heilkraft"
     subheadline (EN): "40+ mineral springs with unique healing properties"

2. THINGS TO DO
   title (DE): "Aktivitäten in Marienbad"
   title (EN): "Things to Do in Marienbad"
   slug (DE): "aktivitaeten"
   slug (EN): "things-to-do"
   type: "pillar"
   status: "published"

3. ACCOMMODATION
   title (DE): "Unterkünfte in Marienbad"
   title (EN): "Accommodation in Marienbad"
   slug (DE): "unterkuenfte"
   slug (EN): "accommodation"
   type: "pillar"
   status: "published"

4. HISTORY & CULTURE
   title (DE): "Geschichte & Kultur von Marienbad"
   title (EN): "History & Culture of Marienbad"
   slug (DE): "geschichte"
   slug (EN): "history"
   type: "pillar"
   status: "published"

5. PRACTICAL INFO
   title (DE): "Praktische Informationen"
   title (EN): "Practical Information"
   slug (DE): "praktische-infos"
   slug (EN): "practical-info"
   type: "info-hub"
   status: "published"

6. PEOPLE OF COLONNADE (Landing)
   title (DE): "Menschen der Kolonnade"
   title (EN): "People of the Colonnade"
   slug (DE): "menschen"
   slug (EN): "people"
   type: "landing"
   status: "published"
*/
