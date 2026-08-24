# Návrh kampaně: Medical Promo −25 % na marienbad.com

**Kampaň Ensana HQ:** Medical Promo, prodejní okno 22.–30. 9. 2026
**Zadání:** e-mail Lukáše Beka (Group Director of Digital Marketing) z 10. 8. 2026 + doplnění Revenue (Dan) a Kristiny Kováčové
**Stav dokumentu:** návrh k internímu schválení, verze 1 (24. 8. 2026)

---

## 1. Fakta z centrálního zadání (neměnná)

| Parametr | Hodnota |
|---|---|
| Nabídka | **−25 %** na léčebné (medical) produkty při rezervaci přes IBE (web) |
| Prodejní období (IBE) | **22.–30. 9. 2026** |
| Teasing | **17.–22. 9. 2026** (countdown) |
| Období pobytu | **15. 10. 2026 – 30. 6. 2027** |
| Podmínky | 30% nevratná záloha, 30% storno poplatek, 1 změna rezervace zdarma |
| Platnost | Pouze nové rezervace – přebookování existujících rezervací není možné |
| CK / touroperátoři | Dodatečných −10 % z dohodnutých ceníků, start už od 17. 9. |
| Produkty na promo LP (Mariánské Lázně) | **Healthy In** a **Traditional Spa** (povinné) + **Immunity Booster** (návrh HQ pro CZ cluster) |
| Rate kódy | Nové kódy končící **MP** (např. `MIHBHIMP`) v Synxis; nepoužívat staré SP kódy |
| Deadline pro sheet s rate kódy | **28. 8. 2026** (dle e-mailu Kristiny; Lukáš v původním e-mailu uvádí 28. 9. – pravděpodobně překlep, řídit se 28. 8.) ⚠️ |
| Vizuály | Dodá Ensana HQ |
| Ads, e-mailing, SMS, DOOH, pop-upy v IBE | Řeší centrálně HQ Praha |

**Cílové stránky Ensana (pro naše 4 jazyky):**

| Jazyk | Landing page (od 22. 9.) | Countdown (17.–22. 9.) |
|---|---|---|
| DE | `ensanahotels.com/de/kur-programme-promo` | `ensanahotels.com/de/kur-programme-countdown` |
| EN | `ensanahotels.com/en/medical-programmes-promo` | `ensanahotels.com/en/medical-programmes-countdown` |
| CS | `ensanahotels.com/cs/lecebne-programy-promo` | `ensanahotels.com/cs/lecebne-programy-countdown` |
| RU | `ensanahotels.com/ru/medical-programmes-promo` | `ensanahotels.com/ru/medical-programmes-countdown` |

---

## 2. Role marienbad.com v kampani

Marienbad.com není rezervační web – je to destinační portál a hlavní zdroj
kvalifikovaného „Kur" publika (DACH 50+, zdravotně motivovaní hosté). Naše role:

1. **Přivést připravenou poptávku** na Ensana promo LP / countdown v okamžiku,
   kdy je uživatel v rozhodovací fázi (obsah o pramenech, léčbě, hotelech).
2. **Vysvětlit hodnotu léčebného pobytu** – HQ landing page prodává slevu,
   my prodáváme důvod jet: imunita na podzim, tradice Kur, prameny, indikace.
3. **Zachytit teasing fázi** – countdown mechanika už na webu existuje
   (CampaignPopup), stačí přidat novou kampaň.

Vše stavíme na existující infrastruktuře z letní kampaně (Jubilee + Summer
Sale) – **žádný nový systém, jen nová kampaň v datech + landing stránky.**

---

## 3. Koncept a messaging

**Pracovní název:** „Podzimní Medical Promo – 25 % na léčebné pobyty“

**Hlavní sdělení (CS, analogicky DE/EN/RU):**

- Eyebrow: `LÉČEBNÉ POBYTY −25 %`
- Headline: `Devět dní, kdy se o vás postaráme\nza čtvrtinu méně`
- Teaser text (17.–21. 9.): „Už 22. září startuje sleva 25 % na léčebné pobyty
  v Mariánských Lázních. Pobyt si vyberete od 15. října 2026 do 30. června 2027.“
- Sale text (22.–30. 9.): „Jen do 30. září: rezervujte léčebný pobyt se slevou
  25 %. Healthy In, Traditional Spa nebo Immunity Booster – termíny až do
  konce června 2027.“
- CTA: „Rezervovat se slevou 25 %“ → Ensana LP (per jazyk, s UTM)

**Tón:** v souladu s brand guidelines – vřelý, důvěryhodný, smyslový; sleva je
argument, ale hrdinou je léčba a tradice (200+ let Kur kultury). Žádná
„výprodejová“ rétorika.

**Produktové akcenty pro Mariánské Lázně:**

| Produkt | Úhel komunikace |
|---|---|
| Immunity Booster | Podzimní téma č. 1 – posílení imunity před zimou, prameny + CO₂ terapie |
| Healthy In | Vstupní/kratší léčebný pobyt – ideální pro první návštěvu |
| Traditional Spa | Klasická komplexní Kur – jádro pro DACH publikum 50+ |

Popisy produktů čerpat výhradně z `data/ensana_knowledge_base.json`
(indikace, prameny, procedury) – žádné vymýšlení zdravotních tvrzení.

---

## 4. Mechanika na webu (implementační plán)

### 4.1 Datová vrstva – rozšíření kampaňového systému

- Do `src/content/campaigns/{de,en,cs,ru}.json` přidat objekt `medicalPromo`
  se stejným tvarem jako `summerSale` (teaserStart `2026-09-17`, saleStart
  `2026-09-22`, saleEnd `2026-09-30`, stayPeriod, texty, CTA URL, podmínky).
- Rozšířit interface v `src/lib/campaign.ts` a schéma v `keystatic.config.tsx`,
  aby marketing mohl texty ladit v CMS bez nasazení.

### 4.2 Site-wide popup (CampaignPopup)

- Přidat fáze `medical-teaser` (17.–21. 9., s countdownem do startu prodeje)
  a `medical-active` (22.–30. 9.) do `CampaignPopup.astro`.
- Mechanika per-phase dismissal v localStorage už existuje – zavřený teaser
  nesmí skrýt aktivní fázi.
- CTA v teaser fázi → Ensana **countdown** stránka; v aktivní fázi → **promo LP**.

### 4.3 Kampaňová landing page (4 jazyky)

Nová komponenta `MedicalPromoLanding.astro` podle vzoru `SummerSaleLanding.astro`
(hero, 3 karty klíčových údajů, podmínky, CTA) + navíc sekce tří produktů
(Healthy In / Traditional Spa / Immunity Booster) a blok „Proč Mariánské Lázně“
s odkazy na pilířové stránky (prameny, CO₂ terapie, hotely).

Navržené URL (vzor `letni-sleva-2026` / `sommer-sale-2026`):

| Jazyk | URL |
|---|---|
| CS | `/cs/lecebne-programy-sleva-2026` |
| DE | `/de/kur-programme-sale-2026` |
| EN | `/en/medical-promo-2026` |
| RU | `/ru/medical-promo-2026` |

SEO: `noindex` **ne**dávat, ale nastavit korektní hreflang mezi 4 mutacemi;
po 30. 9. stránka zůstává s textem „akce skončila“ + CTA na standardní
nabídku hotelů (stejné chování jako `SummerSaleLanding` po `saleEnd`).

### 4.4 Podpůrná místa na webu

- **Homepage:** promo banner/sekce v období 17.–30. 9. (nad foldem badge
  v hero, případně vlastní sekce s CTA) – jen v době kampaně, řízeno daty.
- **Hotelové stránky** (`/[locale]/hotel/[slug]`): dočasný upozorňovací pruh
  „−25 % na léčebné pobyty do 30. 9.“ s odkazem na kampaňovou landing page.
- **Relevantní pilířové stránky** (mineralní prameny, CO₂ terapie,
  peloidní terapie): `TreatmentHighlightBox` s promo CTA.
- **BookingCtaBar** (sticky mobil): po dobu kampaně přesměrovat na promo LP.

### 4.5 Obsahová podpora – magazín

Článek do magazínu ve 4 jazycích, publikovat **17. 9.** (start teasingu):

> „Immunity Booster: jak si v Mariánských Lázních posílit imunitu na celou zimu“

Obsah: proč podzim, role pramenů a CO₂ terapie, co program obsahuje (z knowledge
base), praktické info + promo box s podmínkami akce a CTA. Interní prolinkování
z/na kampaňovou landing page.

### 4.6 Odkazy a měření

- Všechny odchozí CTA na ensanahotels.com opatřit UTM:
  `?utm_source=marienbad.com&utm_medium=referral&utm_campaign=medical-promo-2026&utm_content={popup|landing|hotel-bar|magazine}`
- GA4 (consent-gated, beze změny privacy nastavení): sledovat zobrazení/kliky
  popupu a outbound kliky na Ensana LP stejnou konvencí jako u Summer Sale.
- Reporting konsoliduje HQ (formát jako SP/SS/BF) – naše čísla = dodaný traffic
  a kliky na IBE, poskytneme na vyžádání z GA4.

---

## 5. Časová osa

| Termín | Milník | Vlastník |
|---|---|---|
| do 28. 8. | Rate kódy MP vyplněné v HQ sheetu (Synxis) – **mimo web, hlídat!** | Revenue/Rezervace ML |
| do 5. 9. | Schválení tohoto návrhu + finální produkty pro ML | Marketing ML |
| do 12. 9. | Implementace na webu hotová (data, popup, LP, texty 4 jazyky), PR review | Web |
| do 15. 9. | Vizuály od HQ zapracované (`pnpm images`), QA na preview, magazínový článek připraven | Web + Marketing |
| 16. 9. | Deploy na produkci (kampaň neaktivní – fáze se spíná daty, nic se nezobrazí dřív) | Web |
| **17. 9.** | Teaser fáze živě (popup + countdown CTA), publikace článku | – automaticky |
| **22. 9.** | Přepnutí na aktivní fázi, CTA na promo LP | – automaticky |
| **30. 9.** | Konec prodeje (23:59), popup zhasne | – automaticky |
| 1.–2. 10. | Landing page do režimu „akce skončila“, sundání banerů, mini-report z GA4 | Web + Marketing |

Díky datovému řízení fází (jako u letní kampaně) není v průběhu akce potřeba
žádný ruční zásah ani deploy.

---

## 6. Podmínky, které musí web viditelně komunikovat

Na landing page a v popupu (zkráceně) uvádět:

1. Sleva 25 % platí pro rezervace přes web (IBE) 22.–30. 9. 2026.
2. Pobyty v termínu 15. 10. 2026 – 30. 6. 2027.
3. Záloha 30 % z ceny, nevratná; storno poplatek 30 %.
4. 1 změna rezervace zdarma.
5. Platí pouze pro nové rezervace; nelze kombinovat s úpravou existující rezervace.

---

## 7. Otevřené otázky / co potřebujeme od HQ a hotelu

1. **Potvrzení produktu za ML** – návrh HQ je Immunity Booster; potvrdit, že to
   je i naše volba do sheetu (deadline 28. 8.).
2. **Vizuály HQ** – formáty a termín dodání (potřeba nejpozději 12. 9., ať
   stihneme WebP generování a QA).
3. **Souhlas HQ s vlastní landing page na marienbad.com** – alternativa je
   linkovat výhradně Ensana LP; doporučujeme vlastní LP kvůli SEO a kontextu
   destinace, s CTA vždy na Ensana IBE.
4. **UTM konvence HQ** – pokud HQ vyžaduje vlastní tagging pro konsolidovaný
   reporting, převezmeme jejich.
5. **Sociální sítě** – čekáme na instrukce od Jasminy Csalové; obsah z magazínu
   (Immunity Booster) můžeme nabídnout jako podklad.

---

## 8. Rozsah prací na webu (odhad)

| Úkol | Odhad |
|---|---|
| Rozšíření campaign dat + Keystatic schéma + `campaign.ts` | 0,5 dne |
| Fáze medical-teaser/active v `CampaignPopup.astro` | 0,5 dne |
| `MedicalPromoLanding.astro` + 4 stránky + hreflang | 1 den |
| Texty 4 jazyky (CS/DE/EN/RU) vč. korektur | 1 den |
| Bannery na homepage / hotelech / pilířích | 0,5 dne |
| Magazínový článek 4 jazyky | 1 den |
| QA, vizuály, deploy | 0,5 dne |
| **Celkem** | **~5 člověkodnů** |

Implementaci navrhujeme rozdělit do 2–3 samostatných PR (infrastruktura+popup,
landing pages, obsah), v souladu s workflow projektu.
