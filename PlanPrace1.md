# PlanPrace1 — akční roadmapa pro web Marienbad.com

> Poznámka: Tento plán záměrně **neřeší produkční doménu**. `marienbad.vercel.app` je v této fázi brán jako testovací doména a roadmapa se soustředí na ostatní oblasti: SEO logiku, CMS, chyby, security, obsah, UX a funkční rozvoj.

## 1. Cíl plánu

Cílem je posunout web z aktuálního stavu dobře postaveného testovacího MVP do stavu produkčně připraveného obsahového a destination webu:

- technicky stabilního,
- bezpečnějšího,
- redakčně lépe spravovatelného,
- vizuálně důvěryhodnějšího,
- a funkčně silnějšího pro návštěvníka plánujícího pobyt.

---

## 2. Prioritní rámec

### P1 — řešit okamžitě

Úkoly s nejvyšším dopadem na důvěryhodnost, chyby, bezpečnost a použitelnost:

1. opravit broken / nedokončené prvky ve footeru,
2. opravit chybné odkazy v destination mapě,
3. doplnit ochranu newsletter formuláře,
4. doplnit security headers,
5. opravit hreflang logiku pro detailní stránky,
6. zklikatelnost klíčových preview bloků na homepage.

### P2 — další sprint

Úkoly pro stabilizaci CMS, SEO kvality a redakční konzistence:

1. sjednotit source of truth mezi Keystatic a `i18n`,
2. zavést content schema validaci,
3. doplnit Article schema pro magazín,
4. zavést publikační workflow a checklisty,
5. lokalizačně a UX dočistit interaktivní prvky.

### P3 — rozvoj

Úkoly s vyšším dopadem na kvalitu značky, konverze a dlouhodobý růst:

1. nahradit placeholdery reálnými fotkami,
2. zavést image komponentu a optimalizaci obrázků,
3. doplnit trust/conversion obsah,
4. přidat planner, itineráře a další praktické funkce.

---

## 3. FÁZE 1 — Stabilizace a odstranění viditelných problémů

### 3.1 Footer a právní minimum

#### Úkoly

- vytvořit a napojit funkční stránky:
  - Privacy Policy,
  - Imprint / provozovatel,
  - případně Kontakt / Editorial Policy,
- odstranit `href="#"`,
- buď doplnit reálné social odkazy, nebo placeholder social ikonky z footeru odstranit.

#### Definition of done

- v patičce nejsou mrtvé odkazy,
- všechny právní a kontaktní odkazy vedou na reálné stránky,
- žádný vizuální placeholder nepůsobí jako nedodělaný prvek.

#### Priorita

P1

---

### 3.2 Destination map — oprava rout a lokalizace

#### Úkoly

- nahradit ručně skládané URL centrálním routováním,
- opravit chybné cesty v mapových markerech,
- lokalizovat popup texty i pro CS/RU,
- zkontrolovat všechny odkazy z mapy kliknutím.

#### Definition of done

- každý marker vede na existující stránku,
- popup CTA je lokalizované ve všech podporovaných jazycích,
- mapový modul negeneruje broken links.

#### Priorita

P1

---

### 3.3 Homepage preview bloky

#### Úkoly

- udělat klikací magazín preview,
- udělat klikací stories/people preview,
- u hotelových bloků zkontrolovat hlavní CTA a případně rozšířit proklik celého cardu,
- doplnit mikrocopy typu:
  - „Číst více“,
  - „Příběh“,
  - „Zobrazit hotel“.

#### Definition of done

- klíčové preview bloky mají jasný interakční cíl,
- homepage lépe propojuje obsahové sekce,
- zlepší se interní prolinkování.

#### Priorita

P1

---

## 4. FÁZE 2 — Security a formuláře

### 4.1 Newsletter ochrana proti spamu a abuse

#### Úkoly

- přidat rate limiting,
- přidat honeypot pole,
- přidat bot ochranu (např. Cloudflare Turnstile),
- oddělit mock/dev subscribe režim od reálného odběru,
- doplnit logování chyb a abuse patternů,
- doplnit souhlas / disclaimer podle finální právní logiky.

#### Definition of done

- endpoint není snadno zneužitelný spam boty,
- existuje minimální auditovatelnost requestů,
- uživatelská komunikace formuláře je srozumitelná a konzistentní.

#### Priorita

P1

---

### 4.2 Bezpečnostní hlavičky

#### Úkoly

- doplnit do konfigurace:
  - `Content-Security-Policy`,
  - `Strict-Transport-Security`,
  - `Referrer-Policy`,
  - `X-Content-Type-Options`,
  - `Permissions-Policy`,
  - případně ochranu proti embedování.

#### Definition of done

- projekt má minimální security baseline přes response headers,
- konfigurace je otestovaná pro web i klíčové endpointy.

#### Priorita

P1

---

### 4.3 Markdoc / HTML render governance

#### Úkoly

- definovat pravidla, co editor smí a nesmí vkládat,
- ověřit, že raw HTML není nekontrolovaně propouštěno,
- případně doplnit sanitizační vrstvu nebo allowlist renderer.

#### Definition of done

- existují jasná redakční pravidla,
- obsah z CMS má kontrolovaný render model,
- riziko XSS přes obsah je snížené.

#### Priorita

P2

---

## 5. FÁZE 3 — CMS a obsahová správa

### 5.1 Sjednocení source of truth

#### Úkoly

- rozhodnout, které texty jsou:
  - systémové UI texty,
  - editovatelný obsah,
  - SEO metadata,
- odstranit duplicitu mezi Keystatic settings a `src/i18n/ui.ts`,
- sjednotit způsob načítání textů v layoutu a komponentách.

#### Definition of done

- každý typ textu má jedno jasné místo správy,
- editor ví, co mění v CMS a kde se změna projeví,
- odpadne riziko nekonzistence mezi languages a vrstvami.

#### Priorita

P2

---

### 5.2 Content schema validace

#### Úkoly

- přidat `src/content.config.ts`,
- zavést validační schémata pro:
  - pages,
  - articles,
  - stories,
  - homepage/settings data,
- validovat povinná pole jako:
  - locale,
  - slug,
  - title,
  - meta title,
  - meta description,
  - date,
  - category,
  - případně image reference.

#### Definition of done

- build selže při chybějících nebo nevalidních datech,
- redakční data jsou typově a obsahově kontrolovaná,
- projekt není závislý jen na ruční opatrnosti editorů.

#### Priorita

P2

---

### 5.3 Publikační workflow a checklisty

#### Úkoly

- zavést stav obsahu:
  - draft,
  - published,
- vytvořit checklists pro:
  - SEO,
  - jazykovou kontrolu,
  - content QA,
  - legal minimum,
- sjednotit naming conventions pro obsah.

#### Definition of done

- redakční workflow je opakovatelné,
- nové články a stránky se publikují konzistentně,
- sníží se riziko “hotovo, ale rozbité/napůl”.

#### Priorita

P2

---

## 6. FÁZE 4 — SEO dokončení bez řešení domény

### 6.1 Hreflang pro detailní stránky

#### Úkoly

- zavést explicitní mapování ekvivalentních detailních stránek mezi jazyky,
- nepoužívat pouze fallback podle section,
- u stránek bez ekvivalentu nevypisovat zavádějící hreflang.

#### Definition of done

- detailní podstránky odkazují na skutečné jazykové ekvivalenty,
- hreflang nevytváří chybné nebo zavádějící vazby.

#### Priorita

P1

---

### 6.2 Article schema pro magazín

#### Úkoly

- doplnit na detail článku structured data typu:
  - `Article` nebo `BlogPosting`,
- zahrnout minimálně:
  - headline,
  - description,
  - datePublished,
  - inLanguage,
  - author,
  - publisher,
  - image,
  - mainEntityOfPage.

#### Definition of done

- magazínové články mají plnohodnotná structured data,
- page type “article” je SEO-kompletní stejně jako hotel/FAQ typy.

#### Priorita

P2

---

### 6.3 SEO checklist pro všechny typy stránek

#### Úkoly

Vytvořit checklist pro:

- homepage,
- pillar pages,
- subpages,
- article detail,
- story detail,
- hotel detail,
- FAQ.

Checklist má hlídat:

- title,
- description,
- canonical,
- hreflang,
- schema,
- interní odkazy,
- CTA,
- social preview.

#### Definition of done

- každý typ stránky má definovaný standard kvality,
- SEO kontrola je systematická, ne nahodilá.

#### Priorita

P2

---

## 7. FÁZE 5 — Vizuální a obsahové dotažení

### 7.1 Nahrazení placeholderů reálným obsahem

#### Úkoly

- hero fotografie,
- hotel fotografie,
- seasonal fotografie,
- portréty / stories,
- článkové preview obrázky,
- případně procedury a destination detaily.

#### Definition of done

- homepage ani klíčové sekce nepůsobí jako wireframe,
- web má autentickou vizuální identitu,
- výrazně se zlepší důvěryhodnost značky.

#### Priorita

P3

---

### 7.2 Image komponenta a optimalizace

#### Úkoly

- vytvořit reusable image komponentu,
- doplnit:
  - width/height,
  - lazy loading,
  - priority image,
  - alt text policy,
  - moderní formáty,
  - případně blur/LQIP strategii.

#### Definition of done

- obrázky jsou výkonově i SEO správně nasazené,
- zlepší se CLS/LCP i celkový dojem z webu.

#### Priorita

P3

---

### 7.3 Trust a conversion content vrstva

#### Úkoly

- doplnit bloky typu:
  - why trust us,
  - editorial note,
  - recommended for,
  - seasonal highlights,
  - booking motivation,
  - practical summary boxes.

#### Definition of done

- obsah nejen informuje, ale i naviguje a přesvědčuje,
- uživatel lépe chápe, co dělat dál.

#### Priorita

P3

---

## 8. FÁZE 6 — Funkční rozvoj

### 8.1 Treatment finder / spa planner

#### Návrh

Interaktivní pomocník:

- důvod návštěvy,
- délka pobytu,
- wellness vs medical,
- preferovaný styl pobytu,
- doporučené procedury a hotely.

#### Priorita

P3

---

### 8.2 Itineráře a practical planning

#### Návrh

Obsahové a funkční moduly:

- 1 den v Mariánských Lázních,
- 3 dny,
- 7 dní,
- jaro / léto / podzim / zima,
- practical planner podle typu návštěvníka.

#### Priorita

P3

---

### 8.3 Event kalendář s reálnými daty

#### Návrh

- napojit EventCalendar na reálný obsahový model,
- doplnit filtrování,
- doplnit sezónní a kulturní akce,
- vytvořit z toho plnohodnotný practical module.

#### Priorita

P3

---

## 9. Návrh sprintů

### Sprint 1 — stabilizace

- footer a právní minimum,
- broken links v mapě,
- klikatelnost homepage bloků,
- newsletter ochrana,
- security headers.

### Sprint 2 — CMS a SEO základ

- source of truth cleanup,
- content schema validace,
- hreflang pro detailní stránky,
- Article schema,
- SEO checklisty.

### Sprint 3 — vizuální důvěryhodnost

- reálné fotografie,
- image komponenta,
- vizuální polish,
- trust / conversion content.

### Sprint 4 — rozvoj

- planner,
- itineráře,
- event kalendář,
- practical UX rozšíření.

---

## 10. Nejbližší doporučené pořadí realizace

### Udělat jako první

1. footer legal + odstranění mrtvých prvků,
2. oprava mapových linků,
3. newsletter protection,
4. security headers,
5. hreflang detailních stránek.

### Hned potom

6. CMS source-of-truth cleanup,
7. content schema validation,
8. article structured data,
9. SEO checklist.

### Poté

10. reálné fotografie,
11. image optimization,
12. conversion/trust obsah,
13. planner a další rozvojové funkce.

---

## 11. Výstup pro další krok

Z tohoto dokumentu lze přímo vytvořit:

- GitHub Issues,
- sprint board,
- implementační checklist,
- odhad pracnosti po modulech,
- nebo technický backlog po souborech/komponentách.
