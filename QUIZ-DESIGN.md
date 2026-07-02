# Kvízy — návrh funkcionality (design doc)

> Stav: návrh k diskusi · Datum: 2026-07-02
> Cíl: interaktivní kvízy k událostem (výročí, sezónní akce, kampaně) se sběrem e-mailů, 4 jazyky, minimální rozpočet.

## 1. Shrnutí požadavků

| # | Požadavek | Řešení v tomto návrhu |
|---|-----------|----------------------|
| a | Samostatné URL pro jednotlivé kvízy | `/{locale}/{kviz-slug}/{quiz-slug}` — dynamická route, kvíz = obsahová položka |
| b | 4jazyčné rozhraní (de/en/cs/ru) | Stejný vzor jako zbytek webu — per-locale obsah v Keystaticu + `src/i18n/ui.ts` pro UI texty |
| c | 5–30 otázek, i otevřené | Typy otázek: single-choice, multiple-choice, otevřená (text). Jedna otázka na obrazovku |
| d | Sběr e-mailů (jméno, příjmení, e-mail, souhlas, zdroj: kvíz + jazyk) | **MailerLite jako primární databáze** (už integrováno přes `/api/newsletter`), volitelně Supabase pro odpovědi |
| e | Mobile-first, funkční i na desktopu | React island podle vzoru `TreatmentQuiz.tsx`, Tailwind, krokový wizard |

**Rozpočet: 0 Kč / měsíc.** Vše běží na stávající infrastruktuře (Vercel + MailerLite free tier do 1 000 odběratelů; pár stovek mailů se vejde s velkou rezervou).

## 2. Zvažované varianty

### Varianta A — vlastní řešení v Astro (doporučeno ✅)
Kvízy jako obsahová kolekce v Keystaticu, React island pro interakci, API endpoint pro odeslání do MailerLite.

- ✅ Nulové provozní náklady, plná kontrola nad designem (Ensana paleta, Cormorant/DM Sans)
- ✅ Konzistentní se zbytkem webu — existuje už `TreatmentQuiz.tsx`, `/api/newsletter` (MailerLite), `/api/story-submission` (formulář se jménem + souhlasem), anti-spam vzory (honeypot, timing, rate-limit)
- ✅ Redakce zakládá nové kvízy sama v Keystatic adminu, bez zásahu vývojáře
- ✅ SEO: každý kvíz má vlastní indexovatelnou URL s hreflang
- ⚠️ Cca 2–3 dny vývoje (jednorázově)

### Varianta B — hotový SaaS (Tally / Typeform / MailerLite forms)
Embed formuláře třetí strany do stránky.

- ✅ Hotovo za hodiny
- ❌ 4 jazyky = 4 samostatné formuláře **na každý kvíz** (údržba ×4)
- ❌ Omezený branding (free tiery), cizí JS na webu (výkon, privacy — web je záměrně bez third-party trackerů)
- ❌ Data v další službě, nutný export/synchronizace do MailerLite
- ❌ Typeform free: 10 odpovědí/měsíc — nepoužitelné; placené tiery popírají „minimální rozpočet“

**Doporučení: Varianta A.** SaaS dává smysl jen jako jednorázový rychlý test konceptu.

## 3. Architektura (Varianta A)

```
Keystatic (kolekce quizzes)          React island Quiz.tsx           API endpoint
src/content/quizzes/{slug}/    →     wizard, 1 otázka/krok,    →     /api/quiz-submission
  de.json en.json cs.json ru.json    progress bar, výsledek          → MailerLite (kontakt)
                                                                     → Supabase (odpovědi, volitelně)
```

### 3.1 URL struktura

Podle vzoru `routes` v `src/i18n/config.ts` přibude sekce `quiz`:

| Locale | Prefix sekce | Příklad URL |
|--------|-------------|-------------|
| de | `quiz` | `/de/quiz/130-jahre-neue-baeder` |
| en | `quiz` | `/en/quiz/130-years-new-baths` |
| cs | `kviz` | `/cs/kviz/130-let-nove-lazne` |
| ru | `viktorina` | `/ru/viktorina/130-let-novye-bany` |

Implementace: dynamické routy `src/pages/{de,en,cs,ru}/{quiz|kviz|viktorina}/[slug].astro` (SSR, obsah čtený přes `src/content/reader.ts`). Volitelně i přehledová stránka `/cs/kviz/` se seznamem aktivních kvízů. Hreflang mezi mutacemi zajistí stávající mechanismus v `Base.astro`.

### 3.2 Obsahový model (Keystatic kolekce `quizzes`)

Jeden kvíz = složka se 4 jazykovými soubory (vzor `campaigns`/`homepage`). Schéma jednoho locale souboru:

```jsonc
{
  "title": "130 let Nových lázní",
  "slug": "130-let-nove-lazne",          // lokalizovaný slug
  "description": "Otestujte své znalosti…",
  "heroImage": "/images/content/quizzes/…",
  "event": "neue-baeder-130",             // interní klíč události (jednotný napříč jazyky)
  "active": true,                          // vypnutí po skončení akce
  "questions": [
    {
      "id": "q1",                          // stabilní napříč jazyky (párování odpovědí)
      "type": "single",                    // single | multiple | open
      "text": "Kdy byly otevřeny Nové lázně?",
      "options": [
        { "id": "a", "text": "1896", "correct": true },
        { "id": "b", "text": "1905" }
      ],
      "explanation": "Volitelné vysvětlení po odpovědi"
    },
    { "id": "q2", "type": "open", "text": "Co pro vás znamenají lázně?", "maxLength": 500 }
  ],
  "results": [                             // pásma podle skóre (otevřené otázky se nebodují)
    { "minPercent": 80, "title": "Lázeňský expert!", "message": "…" },
    { "minPercent": 40, "title": "Skoro znalec", "message": "…" },
    { "minPercent": 0,  "title": "Přijeďte to poznat naživo", "message": "…" }
  ],
  "emailGate": {
    "heading": "Chcete vědět víc?",
    "text": "Nechte nám e-mail a pošleme vám…",
    "incentive": "např. sleva / e-book / výsledky losování",
    "consentLabel": "Souhlasím se zasíláním novinek… (odkaz na ochranu údajů)"
  }
}
```

V Keystaticu se typy otázek řeší přes `fields.conditional` (výběr typu → odpovídající pole). Validaci 5–30 otázek hlídá build/runtime kontrola.

### 3.3 Frontend — `Quiz.tsx` (React island)

Vzor: existující `TreatmentQuiz.tsx` (props: `locale`, data, `translations` — UI texty se předávají ze serveru, island je bez i18n logiky).

- **Krokový wizard, jedna otázka na obrazovku** — na mobilu zásadní: velká tlačítka (min. 44 px touch target), progress bar („7/20“), tlačítka Zpět/Další
- **Typy otázek:** radio karty (single), checkbox karty (multiple), `<textarea>` (open)
- **Rozpracovaný stav v `sessionStorage`** — u 30 otázek nesmí reload smazat postup
- **Vyhodnocení na klientu** (znalostní skóre) → výsledková obrazovka s pásmem podle `results`
- **E-mail formulář na konci**: jméno, příjmení, e-mail, checkbox souhlasu (nepředvyplněný — GDPR), honeypot + timestamp proti botům
- **Pořadí doporučuji:** výsledek ukázat hned, e-mail formulář pod ním s incentivem („pošleme vám …“). Tvrdý email-gate před výsledkem zvedá konverzi, ale frustruje a u cílové skupiny 50+ působí nátlakově — v rozporu s tone of voice. (Lze později A/B otestovat.)
- `prefers-reduced-motion` respektovat u přechodů mezi kroky (stávající princip webu)

### 3.4 Backend — `/api/quiz-submission`

Nový endpoint podle vzoru `newsletter.ts` + `story-submission.ts` (CORS whitelist, rate-limit, honeypot, timing check, validace e-mailu):

1. **MailerLite** (`connect.mailerlite.com/api/subscribers`):
   - `email`, `fields: { name, last_name, locale, quiz_slug, quiz_event, consent_at }`
   - zařazení do skupiny — doporučené schéma: **stávající jazykové skupiny** (`MAILERLITE_GROUP_DE/EN/CS/RU`) **+ skupina per událost** (`MAILERLITE_GROUP_QUIZ_<EVENT>`); segmentace „z jakého kvízu a jazyka přišel“ je pak v MailerLite triviální
   - doporučuji zapnout **double opt-in** v MailerLite (čistší GDPR souhlas, méně spamu v databázi)
2. **Supabase (volitelný krok 2):** uložení kompletních odpovědí — hlavně otevřených otázek, které do MailerLite nepatří:

```sql
create table quiz_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  quiz_slug text not null,
  quiz_event text not null,
  locale text not null,
  first_name text, last_name text, email text,
  consent boolean not null,
  consent_at timestamptz,
  answers jsonb not null,      -- { "q1": "a", "q2": "volný text…" }
  score_percent int
);
-- RLS zapnuto, žádný veřejný přístup; insert jen přes service-role key z API routy
```

**Kde budou e-maily uložené — odpověď na otázku „MailerLite databáze v Supabase?“:**
- **Primární úložiště kontaktů = MailerLite** (tam se s nimi stejně bude pracovat — kampaně, automatizace, odhlašování, GDPR export/výmaz zdarma v ceně). Duplikovat kontakty do Supabase nedoporučuji — dvě databáze = dvojí GDPR agenda.
- **Supabase jen na odpovědi kvízu** (anonymizovatelné, analytika), a to až když bude potřeba otevřené odpovědi skutečně číst/vyhodnocovat. Fáze 1 se bez Supabase obejde úplně — odpovědi se jen vyhodnotí na klientu a neukládají se.
- Alternativy zvážené a zamítnuté: Vercel Postgres/KV (placené limity, další služba), Google Sheets přes API (křehké, service account údržba), e-mail notifikace s odpověďmi (neškáluje, GDPR nepořádek ve schránce).

### 3.5 GDPR

- Souhlas: samostatný, nepředvyplněný checkbox s odkazem na `/…/datenschutz` (existuje ve všech jazycích); text souhlasu per-locale v obsahu kvízu
- Ukládat `consent_at` (timestamp) — prokazatelnost souhlasu; double opt-in v MailerLite jako druhá vrstva
- Otevřené odpovědi: pokyn v UI „neuvádějte osobní ani zdravotní údaje“ (zdravotní údaje = zvláštní kategorie, těm se vyhnout)
- Bez cookies — konzistentní s privacy-first přístupem webu (Plausible)

## 4. Fáze realizace

| Fáze | Obsah | Odhad |
|------|-------|-------|
| 1 | Obsahový model + Keystatic kolekce + první kvíz (4 jazyky) jako pilot | 0,5 dne |
| 2 | `Quiz.tsx` island + dynamické routy + UI texty v `ui.ts` | 1–1,5 dne |
| 3 | `/api/quiz-submission` + MailerLite pole/skupiny + testy anti-spamu | 0,5 dne |
| 4 | Styling (Ensana paleta), mobil QA, OG obrázky, hreflang, build | 0,5–1 den |
| 5 *(volitelně později)* | Supabase tabulka odpovědí + jednoduchý export | 0,5 dne |

## 5. Otevřené otázky před implementací

1. **První kvíz / událost** — ke které akci pilot? (nabízí se „130 let Nových lázní“ — obsah už na webu existuje)
2. **Incentiva za e-mail** — sleva, losování, e-book…? Ovlivňuje texty email gate i MailerLite automatizaci
3. **E-mail gate před vs. po výsledku** — návrh říká „po“, potvrdit
4. **Ukládat odpovědi (Supabase) hned, nebo až ve fázi 5?** — návrh říká fáze 5
5. **Double opt-in v MailerLite** — zapnout? (doporučeno ano)
