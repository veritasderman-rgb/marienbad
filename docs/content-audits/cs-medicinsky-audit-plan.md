# Medicínský audit článků a léčebných stránek: plán a rešerše

**Rozsah:** 80 českých magazínových článků v `src/content/articles/cs-*`, léčebné pilířové stránky (`cs-co2-terapie`, `cs-klimatoterapie`, `cs-peloidni-terapie`, `cs-mineralni-prameny`, `cs-prehled-pramenu`), FAQ a Ubytování.
**Stav:** návrh redakčního plánu. Tento dokument texty na webu nemění. Navazuje na `cs-copy-audit.md`, který medicínská tvrzení výslovně vynechal.
**Zdroje rešerše:** PubMed (MCP konektor, výsledky uvedeny s DOI) a Consensus (Semantic Scholar/Scopus, odkazy na consensus.app). Rešerše proběhla 11. 9. 2026. Všechny ověřené studie jsou uloženy v `data/evidence/balneology_evidence.json` (viz `data/evidence/README.md`); nové zdroje přidávat tam.

---

## 1. Shrnutí

Největší riziko webu dnes nejsou superlativy, ale **konkrétní zdravotní sliby bez zdroje** a — což je závažnější — **odkazy na studie a instituce, které se nepodařilo dohledat**. Několik článků cituje „studie Českého inspektorátu lázní a zřídel", „výzkum Univerzity Karlovy", „Balneologický ústav v Mariánských Lázních", „Státní zdravotní ústav", *European Journal of Preventive Cardiology* nebo *Journal of Rehabilitation Medicine (2023)* s velmi přesnými čísly (34 %, 40–60 %, 8–12 mmHg, 23 %). Ani jeden z těchto odkazů nemá DOI a v PubMed se nepodařilo najít odpovídající práci. Dokud se zdroj nedoloží, je třeba s takovými pasážemi zacházet jako s neexistujícími a odstranit je.

Dobrá zpráva: tři novější články (`cs-lazenska-lecba-traviciho-ustroji`, `cs-lazenska-lecba-obehoveho-ustroji`, `cs-hubnuti-a-metabolicka-lecba…`) už ukazují, jak to má vypadat — citují konkrétní práci s DOI, uvádějí velikost souboru i omezení (financování výrobcem, jiné složení vody) a končí střízlivým závěrem. Tento styl je vzor pro celý zbytek.

Rešerše zároveň potvrdila, že **pro řadu tvrzení existují seriózní zdroje** (artróza, chronická bolest zad, fibromyalgie, postcovidová únava, rehabilitace po karcinomu prsu, lesní koupel a krátkodobý stres). Není tedy nutné texty jen „změkčovat" — mnohde jde tvrzení naopak posílit správnou citací a přesnějším vymezením.

---

## 2. Co jsem v repozitáři našel

### 2.1 Neověřitelné citace institucí a časopisů (nejvyšší priorita)

| Soubor | Řádek | Tvrzení | Stav ověření |
|---|---|---|---|
| `cs-lecba-ledvin-mocovych-cest` | 103–105 | „Studie provedené v rámci Českého inspektorátu lázní a zřídel dokládají … snižuje recidivu urolitiázy o 40 až 60 %"; „Výzkumy z Ústavu pro výzkum a využití léčivých zdrojů … změny přetrvávají tři až šest měsíců" | ČIL je dozorový orgán Ministerstva zdravotnictví, ne výzkumné pracoviště. Žádná taková publikace nenalezena. |
| `cs-prevence-novy-luxus-v-laznich` | 101–105 | „Studie ČIL": o 34 % nižší výskyt kardiovaskulárních příhod, o 28 % nižší spotřeba léků, o 41 % lepší kvalita života | Nenalezeno. Čísla působí smyšleně. |
| `cs-pohyb-v-laznich-prodluzuje-zivot` | 75–80 | „Longitudinální studie v *European Journal of Preventive Cardiology*": −8–12 mmHg, +15–20 % zdatnosti, −23 % kortizolu, 78 % lepší spánek | V PubMed žádná práce tohoto časopisu o terénní kúře v lázních s těmito výsledky. |
| `cs-rehabilitace-po-covidu` | 78–82 | „Pozorování Státního zdravotního ústavu", „Balneologický ústav v Mariánských Lázních", „přehledová studie v *Journal of Rehabilitation Medicine* (2023) … s důrazem na výsledky z českých lázní" | Dotaz na *J Rehabil Med* + balneoterapie + COVID vrací 0 výsledků. Balneologický ústav v ML v současnosti neexistuje. |
| `cs-plynove-injekce-co2` | 95–99 | „Balneologický ústav v ML … transkutánní oxymetrie", „Výzkum Univerzity Karlovy … diabetická neuropatie", „studie z oboru bioklimatologie (2020) … CO₂ injekce vs. fyzioterapie u bolestí zad" | Nenalezeno. Pro plynové injekce existují jen přehledy, kazuistiky a preklinické práce (viz 4.4). |
| `cs-co2-koupele-veda` | 36, 40, 66 | „Výzkum na Univerzitě Karlově … laserová dopplerovská flowmetrie", „Balneologický ústav … pokles až o 15 mmHg", „studie hodnocené Českou balneologickou společností" | Nenalezeno. |
| `cs-burnout-prevence-lazne` | 81 | „Výzkum Univerzity Karlovy … Maslach Burnout Inventory … vs. běžná dovolená" | Nenalezeno. Žádná RCT lázeňské léčby u diagnózy vyhoření není v literatuře. |
| `cs-lecba-pohyboveho-aparatu` | 72 | „Výzkum Revmatologického ústavu v Praze … rašelinové zábaly v Mariánských Lázních … WOMAC" | Nenalezeno. |
| `cs-den-mozku-nervovy-system` | 73 | „Studie z *PNAS* prokázaly, že dvě hodiny ticha denně stimulují neurogenezi v hipokampu" | Chybná atribuce. Jde o pokus na myších (Kirste et al. 2015, *Brain Structure and Function*, [DOI 10.1007/s00429-013-0679-3](https://doi.org/10.1007/s00429-013-0679-3)), ne o PNAS a ne o lidi. |

Naopak **správně dohledatelné** citace: `cs-burnout-prevence-lazne` ř. 55 (japonská studie 2019 v *Environmental Health and Preventive Medicine* = Wen et al. 2019, systematický přehled), `cs-lesni-koupel…` ř. 104 (Stanford, 90minutová procházka = Bratman et al. 2015, *PNAS*), `cs-lazenska-lecba-traviciho-ustroji` ř. 67–69, `cs-lazenska-lecba-obehoveho-ustroji` ř. 25.

### 2.2 „Prokazatelně" a jiné kategorické formulace bez zdroje

| Soubor | Řádek | Formulace |
|---|---|---|
| `cs-lecba-ledvin-mocovych-cest` | 11, 40, 48, 119 | pitná kúra „pomáhá při … prevenci"; minerální látky „podporují přirozenou obranyschopnost sliznic"; pobyty „prokazatelně snižují frekvenci recidiv"; „plný efekt se rozvíjí až ve třetím týdnu" |
| `cs-lecba-pohyboveho-aparatu` | 11, 37, 68, 129, 131 | procedury „prokazatelně tlumí zánět"; léčba „prokazatelně zpomaluje postup nemoci"; efekt „přetrvává čtyři až šest měsíců" (ř. 68) **vs.** „šest až devět měsíců" (ř. 129) — vnitřní rozpor; „nižší spotřebu analgetik a méně pracovních neschopností" |
| `cs-imunita-prevence-lazne` | 11–12, 28–30, 47–55, 117 | celý rámec „lázně jsou výcvikový tábor imunity"; železo/hořčík/pH jako posílení imunity; „ideální délka pro měřitelné posílení imunity 10–14 dní" |
| `cs-burnout-prevence-lazne` | 11, 107, 109 | „prokazatelně obnovuje psychickou i fyzickou odolnost"; „žádná chemie"; „prostředí k resetování" |
| `cs-lesni-koupel-mindfulness-slavkovsky-les` | 20, 34, 96, 114, 118, 122 | „les léčí"; „na důkazech založená přírodní medicína"; „už 20 minut významně snižuje kortizol"; „minimálně dvě hodiny"; „na počátku léta je účinek nejsilnější" |
| `cs-lazne-civilizacni-choroby` | 38, 47, 51, 59 | pitná kúra „prokazatelně ovlivňuje metabolismus glukózy", prameny „podporují funkci pankreatu"; CO₂ „nejúčinnější nefarmakologická metoda"; „pokles o 10–15 mmHg … bez jakýchkoliv vedlejších účinků"; „detoxikace" |
| `cs-rehabilitace-po-covidu` | 11 | „prokazatelně pomáhá s únavou, dušností i brain fogem" |
| `cs-den-mozku-nervovy-system` | 12 | procedury „prokazatelně regenerují nervový systém" |
| `cs-lazenska-lecba-pruvodce` | 34, 52 | pobyt 14–21 dní „prokazatelně urychluje návrat"; cíl „posílit imunitní systém" |
| `cs-lazenska-lecba-koznich-onemocneni` | 44 | zdroje mají „prokazatelně příznivý účinek" |
| `cs-klasicka-tritydenni-kura-marianske-lazne` | 26, 44–46 | „skutečná kúra trvá … přesně jednadvacet dnů"; nadpis „Klinické důkazy"; „křivka udržitelnosti po 21 dnech je výrazně strmější" |
| `cs-lecba-raselinou-marianske-lazne` | 48, 59, 134 | huminové kyseliny „prokázané protizánětlivé účinky … pronikají do hlubších tkání"; „řízená umělá horečka, která stimuluje imunitní systém"; „mezinárodní studie potvrzují" |
| `cs-postonkologicky-lazensky-program` | 65, 71 | strava „na podporu imunitního systému", poradenství k „posílení imunity" |
| `cs-utek-pred-vedrem` | 58 | „jediné místo na světě, které prokazatelně disponuje všemi čtyřmi přírodními léčivými zdroji" |
| `cs-14denni-lazenska-kura…` | 157 | CO₂ procedury „trvale rozšiřují cévy" |
| `cs-zima-v-marianskych-laznich` | 51 | teplotní kontrast „posiluje imunitní systém" |
| `cs-marienbad-therme` | 55 | saunový rituál „rozproudí … i imunitu" |
| `pages/cs-klimatoterapie` | 35, 37, 99 | „imunostimulační vlastnosti" fytoncidů; „zvýšení erytropoézy" v 630 m n. m.; „léto … nejintenzivnější koncentrace fytoncidů, zima posiluje imunitní systém, 14–21 dnů pro trvalé účinky" |
| `pages/cs-co2-terapie` | 78–84 | „nejdůkladněji prozkoumaná forma balneoterapie"; −10–15 mmHg; „měřitelné zlepšení hojení ran" |
| `pages/cs-peloidni-terapie` | 73–78 | „četné klinické studie potvrzují"; „snížení CRP, IL-6"; „až 6 měsíců" |
| `pages/cs-mineralni-prameny` | 46 | Ferdinandův pramen „k celkovému posílení imunitního systému" |
| `pages/cs-prehled-pramenu` | 18, 56 | „voda … začala svou cestu přibližně před 14 000 lety"; „procházka … zesiluje léčivý účinek" |
| `pages/cs-ubytovani` | 168, 178–180 | „minimálně 7 nocí … ideální 14 až 21 nocí" (léčebné doporučení na hotelové stránce) |

### 2.3 Rozpory mezi stránkami (stejná informace, různá čísla)

- **Délka kúry:** 7 nocí (Ubytování) · 10–14 dní (Imunita) · 14–21 dní (Průvodce léčbou, Klimatoterapie) · „přesně 21 dní" (Třítýdenní kúra, Pohybový aparát, Ledviny). Potřebuje jednu autoritativní větu — viz 4.13.
- **Délka příspěvkové péče:** „14 nebo 21 dní" (Trávicí ústrojí ř. 44) vs. „obvykle 21 dní" (Lázeňský poukaz ř. 42).
- **Trvání efektu:** 4–6 měsíců (Pohybový aparát ř. 68) · 6–9 měsíců (tamtéž ř. 129) · 3–6 měsíců (Ledviny) · „až 6 měsíců" (Peloidy).
- **Počet pramenů:** „více než 40" vs. „40" vs. „šest se využívá ke koupelím" — sjednotit s `data/ensana_knowledge_base.json`.

---

## 3. Pravidla pro zdravotní tvrzení (návrh redakčního standardu)

### 3.1 Tři kategorie tvrzení

| Kategorie | Co lze napsat | Jak to formulovat | Co je nutné doložit |
|---|---|---|---|
| **A. Oficiální indikace** | že se dané onemocnění v Mariánských Lázních léčí a hradí | „Onemocnění X patří mezi indikace lázeňské léčby v Mariánských Lázních (indikační skupina …)." | odkaz na indikační seznam (vyhláška č. 2/2015 Sb., příloha) a na `data/ensana_knowledge_base.json` → `medical_indications` |
| **B. Možný / obvyklý přínos** | k čemu se procedura používá, co je jejím cílem | „používá se ke", „cílem je", „lázeňští lékaři ji zařazují u", „v některých studiích bylo pozorováno" | **buď** výslovné označení jako tradiční / praktické použití s odkazem na indikační seznam nebo léčebný program Ensana, **nebo** alespoň jeden přehledový zdroj (§4). Žádná čísla, žádné „prokazatelně". **Kde není ani jedno, přínos vůbec neuvádět** a popsat jen, co procedura je a jak probíhá. |
| **C. Prokázaný účinek** | konkrétní výsledek s velikostí efektu | „V randomizované studii s N pacienty s diagnózou Y … (autor, rok, DOI)." + věta o omezeních | citace s DOI, populace, délka sledování, hlavní limit |

Změkčení slovesa („může pomoci" místo „pomáhá") samo o sobě tvrzení nedokládá. U procedur, pro které kontrolované studie chybějí (například plynové injekce CO₂, §4.4), je jediná přípustná forma kategorie B věta typu „v Mariánských Lázních se používají u … na základě dlouholeté lázeňské praxe; kontrolované studie zatím chybějí".

**Pravidlo „bez měřitelného výstupu nic":** kde chybí jasný, měřitelný a doložený výstup, přínos se neuvádí vůbec; procedura se jen popíše. Negativní nebo neprůkazné studie do textu nepatří (web je PR portál) — evidují se v databázi se štítkem `upozorneni`, aby se tvrzení nepoužilo.

### 3.2 Slovník: co nahradit

| Vyřadit | Nahradit |
|---|---|
| prokazatelně, vědecky prokázáno, klinické studie potvrzují (bez citace) | „podle dostupných studií", „v malých studiích bylo pozorováno", nebo věta zcela odstranit |
| posiluje imunitu, trénuje imunitní systém, obranyschopnost sliznic | „může podpořit celkovou kondici a regeneraci"; imunitu nezmiňovat, pokud není citován konkrétní marker a studie |
| detox, detoxikace, reset mozku, žádná chemie | „odpočinek", „změna režimu", „přírodní léčivé zdroje" |
| les léčí, přírodní medicína založená na důkazech | „pobyt v lese je spojován s krátkodobým snížením stresu" |
| nejúčinnější nefarmakologická metoda, nejdůkladněji prozkoumaná | „jedna z tradičních metod", „jedna z nejčastěji používaných procedur" |
| bez jakýchkoliv vedlejších účinků | „obvykle dobře snášená; o vhodnosti rozhoduje lékař" + kontraindikace |
| zpomaluje postup artrózy, trvale rozšiřuje cévy, regeneruje nervový systém | „zmírňuje bolest a ztuhlost", „krátkodobě zlepšuje prokrvení", „podporuje regeneraci" |
| „přesně 21 dní", „plný efekt až ve třetím týdnu", „10–14 dní pro měřitelné posílení" | délka podle indikačního seznamu a doporučení lékaře (4.13) |

### 3.3 Pravidla pro citace

1. Každá citace má **autora, rok, časopis a DOI** (nebo odkaz na registr studie). Formát již použitý v `cs-lazenska-lecba-traviciho-ustroji`: `([Antonelli a kol., 2021](https://doi.org/…), *Int J Biometeorol*)`.
2. Citovat **přehledy a RCT**, ne jednotlivé kazuistiky. U malých studií (< 50 osob) vždy uvést počet účastníků.
3. U každé citované studie jedna věta o **omezení** (jiná voda, jiná země, bez kontrolní skupiny, financováno výrobcem).
4. Interní data Ensana (např. OnkoFit-Spa) označit jako **interní sledování**, uvést rok, počet účastníků a to, že nebyla publikována v recenzovaném časopise (pokud byla, doplnit DOI).
5. Nikdy necitovat instituci bez konkrétní publikace („studie Univerzity Karlovy" není citace).
6. Do frontmatteru článků doplnit pole `sources` (seznam) a `medicalReviewDate` — úprava `keystatic.config.tsx` (kolekce articles, kolem ř. 840) a vykreslení sekce „Zdroje" v šabloně článku. Do té doby psát sekci `## Zdroje` ručně na konec článku.

---

## 4. Rešerše: co říká literatura a co z toho lze použít

Podle PubMed a Consensus. U každého tématu: **síla důkazů → co lze na webu tvrdit → co nelze → zdroje.**

### 4.1 Artróza a pohybový aparát (balneoterapie, peloidy)

**Síla důkazů:** střední. Několik systematických přehledů a metaanalýz; kvalita primárních studií nízká až střední, vysoká heterogenita, ale výsledky konzistentně ve prospěch lázeňské léčby u bolesti, ztuhlosti a funkce.

**Lze tvrdit:**
- Lázeňská léčba (koupele v minerální vodě, peloidy, cvičení) zmírňuje bolest a ztuhlost a zlepšuje funkci u artrózy kolene; efekt bývá klinicky významný **3–6 měsíců, někdy až 9 měsíců** po kúře.
- Třítýdenní lázeňská léčba u artrózy kolene zlepšila funkci a bolest ještě po 6 měsících oproti běžné péči (RCT, 145 analyzovaných pacientů, Francie, 2025).
- Ve studiích byla pozorována nižší spotřeba analgetik a NSAID po kúře (u artrózy kolene i ruky, u chronické bolesti zad).
- Kvalita důkazů je omezená (malé soubory, chybí zaslepení).

**Nelze tvrdit:** že léčba „zpomaluje postup nemoci" (žádná studie neměří strukturální progresi); že opakování „jednou ročně" dává lepší výsledky než jednorázový pobyt (nesrovnáváno); že snižuje pracovní neschopnost (jediná RCT byla nedostatečně velká a rozdíl nebyl významný).

**Zdroje:**
- Forestier R et al. 2016, *Ann Phys Rehabil Med* — systematický přehled, efekt 3–6, někdy 9 měsíců. [Consensus](https://consensus.app/papers/details/163b339826a2536eb7f05ce9b9111754/?utm_source=claude_desktop)
- Forestier R et al. 2025, *Int J Biometeorol* — ANGELLO RCT, 3 týdny, 6 měsíců sledování. [Consensus](https://consensus.app/papers/details/ec2bd40091555fb8918ed883777a3427/?utm_source=claude_desktop)
- Antonelli M et al. 2018, *Rheumatol Int* — metaanalýza kvality života u artrózy kolene. [DOI 10.1007/s00296-018-4081-6](https://doi.org/10.1007/s00296-018-4081-6)
- Matsumoto H et al. 2017, *Clin Rheumatol* — metaanalýza WOMAC, heterogenita 88–93 %. [Consensus](https://consensus.app/papers/details/7633beab80a1540daf33f7876b289d50/?utm_source=claude_desktop)
- Protano C et al. 2023, *Rheumatol Int* — systematický přehled, 17 studií. [Consensus](https://consensus.app/papers/details/91d911ec6204570fbe193ad6f832ac02/?utm_source=claude_desktop)
- D'Angelo D et al. 2021, *Int J Biometeorol* — přehled přehledů, kvalita „nízká až kriticky nízká". [Consensus](https://consensus.app/papers/details/fd920d9c36465218a35bb46819682ba8/?utm_source=claude_desktop)
- Verhagen AP et al. 2007, Cochrane — balneoterapie u artrózy. [DOI 10.1002/14651858.CD006864](https://doi.org/10.1002/14651858.CD006864)
- Fioravanti A et al. 2010, *Am J Phys Med Rehabil* — RCT, 2 týdny peloidy + koupele, efekt 9 měsíců, nižší spotřeba léků. [Consensus](https://consensus.app/papers/details/117ceeafb8b45fcb8ed8113fbdbc701c/?utm_source=claude_desktop)
- Fioravanti A et al. 2013, *Int J Biometeorol* — RCT artróza ruky, 12 měsíců sledování. [Consensus](https://consensus.app/papers/details/a9ae19925a445df187a2b18c976ea4a7/?utm_source=claude_desktop)
- Morer C et al. 2017, *Int J Biometeorol* — dvojitě zaslepené RCT minerální vs. obyčejná voda. [Consensus](https://consensus.app/papers/details/76dbda4cbab159d2972fa806e323b1a1/?utm_source=claude_desktop)
- Montvydaitė‑Kreivaitienė O et al. 2025, *Int J Biometeorol* — 40 kontrolovaných studií, lázně vs. běžná rehabilitace. [Consensus](https://consensus.app/papers/details/1c3b89a927ee5550b463873139004fd6/?utm_source=claude_desktop)
- Nguyen C et al. 2017, *Sci Rep* — RCT návrat do práce, nedostatečná síla, rozdíl nevýznamný. [Consensus](https://consensus.app/papers/details/c5c45c3697d050349fbf681e841610e2/?utm_source=claude_desktop)

### 4.2 Chronická bolest zad a fibromyalgie

**Síla důkazů:** střední (starší, ale randomizované francouzské studie; novější RCT u fibromyalgie).

**Lze tvrdit:** třítýdenní lázeňská léčba u chronické bolesti zad zlepšila bolest, pohyblivost a spotřebu léků, s částečným udržením po 6–9 měsících; u fibromyalgie 18denní kúra zvýšila podíl pacientů s klinicky významným zlepšením po 6 měsících (45 % vs. 28 %).

**Zdroje:**
- Guillemin F et al. 1994, *Br J Rheumatol* — RCT, 3 týdny, 9 měsíců. [Consensus](https://consensus.app/papers/details/ae6044021e235aad9e5bb9e81e6e18c1/?utm_source=claude_desktop)
- Constant F et al. 1995, *J Rheumatol* — RCT, 121 pacientů, nižší spotřeba analgetik po 6 měsících. [Consensus](https://consensus.app/papers/details/c40f2f7cb25b57788b900083c0151358/?utm_source=claude_desktop)
- Constant F et al. 1998, *Med Care* — RCT, 224 pacientů, kvalita života. [Consensus](https://consensus.app/papers/details/29e095b728a756f88e07eebd015a311c/?utm_source=claude_desktop)
- Maindet C et al. 2021, *J Pain* — RCT fibromyalgie, 220 pacientů. [Consensus](https://consensus.app/papers/details/8656cfd107435ed584bee6e41dcceb8b/?utm_source=claude_desktop)
- Kundakci B et al. 2022, *Pain* — metaanalýza nefarmakologických intervencí u fibromyalgie, balneoterapie zlepšuje FIQ. [DOI 10.1097/j.pain.0000000000002500](https://doi.org/10.1097/j.pain.0000000000002500)
- Zwolińska J et al. 2022, *Sci Rep* — lázně vs. ambulantní léčba u artrózy páteře, efekt 6 měsíců. [Consensus](https://consensus.app/papers/details/1c6d434bfbb75ea188230cef75f69ac8/?utm_source=claude_desktop)

### 4.3 Ledviny a močové cesty (pitná kúra, urolitiáza)

**Síla důkazů:** slabá pro specifický účinek minerální vody; silná pro obecný pitný režim.

**Lze tvrdit:** dostatečný příjem tekutin (diuréza > 2–2,5 l/den) je základem prevence recidivy močových kamenů podle evropských urologických doporučení; pitná kúra je způsob, jak si tento režim pod dohledem lékaře nacvičit; volba vody má odpovídat typu kamenů a metabolické poruše (rozhoduje urolog/nefrolog); malé studie s minerálními vodami popisují vyšší diurézu a nižší vylučování oxalátů a kyseliny močové.

**Nelze tvrdit:** „40–60 % snížení recidiv", „prokazatelně snižuje frekvenci recidiv", „plný efekt ve třetím týdnu", „minerály posilují obranyschopnost sliznic", „pobyt posiluje imunitu".

**Zdroje:**
- Skolarikos A et al. 2024, *Eur Urol* — EAU guidelines, metabolické vyšetření a prevence recidiv. [Consensus](https://consensus.app/papers/details/e104f08c54a75b18b24c5090e527a34a/?utm_source=claude_desktop)
- Siener R 2021, *Nutrients* — výživa a močové kameny; přínos různých nápojů „diskutován". [DOI 10.3390/nu13061917](https://doi.org/10.3390/nu13061917)
- Ticinesi A et al. 2017, *Crit Rev Food Sci Nutr* — doporučení pitného režimu stojí na jediné RCT. [Consensus](https://consensus.app/papers/details/4d13560aba405759b457cc51e9e50484/?utm_source=claude_desktop)
- Mennuni G et al. 2015, *Clin Ter* — přehled role lázeňské léčby u nefrolitiázy. [Consensus](https://consensus.app/papers/details/3d02fb18ab44591e89ef2e5a3b728141/?utm_source=claude_desktop)
- Nejmark AI et al. 2018 (36 pacientů) a Radchenko OR et al. 2022 (33 pacientů) — malé ruské studie s hydrogenuhličitanovými vodami. [Consensus 1](https://consensus.app/papers/details/b6a0161800585c2383cb4cedfa4cdb22/?utm_source=claude_desktop), [Consensus 2](https://consensus.app/papers/details/d060be4f541056c98bc04cd6ac3b4a82/?utm_source=claude_desktop)

### 4.4 CO₂ koupele a plynové injekce

**Síla důkazů:** koupele — slabá až střední pro krátkodobé zlepšení prokrvení a mírné snížení tlaku u osob s vyšším výchozím tlakem; plynové injekce (karboxyterapie) — přehledy a preklinika, RCT chybí.

**Lze tvrdit:** CO₂ pronikající kůží rozšiřuje kožní cévy a zvyšuje prokrvení (dobře popsaný mechanismus); indikace v literatuře: periferní tepenné onemocnění, poruchy mikrocirkulace, mírná hypertenze, chronické rány; v malých studiích klesl tlak u pacientů s vyššími výchozími hodnotami po třítýdenní kúře (35 pacientů, bez kontrolní skupiny) a v RCT suchých CO₂ koupelí u žen v menopauze (70 žen) klesl průměrný systolický tlak o 13,7 %.

**Nelze tvrdit:** „nejdůkladněji prozkoumaná forma balneoterapie"; „bez jakýchkoliv vedlejších účinků"; „trvale rozšiřují cévy"; u injekcí žádná z citovaných „studií" (Balneologický ústav, UK, bioklimatologie 2020). Dvě německé randomizované studie podkožních CO₂ insuflací u bolestí krku a zad navíc **nenašly přínos** oproti standardní léčbě ani oproti placebu (Brockow 2001, 2008); v textech o plynových injekcích to musí zaznít.

**Zdroje:**
- Pagourelias ED et al. 2011, *Int J Biometeorol* — přehled CO₂ balneoterapie u kardiovaskulárních nemocí. [Consensus](https://consensus.app/papers/details/cffd890e39e252b5bf9e66f5a36c8ff6/?utm_source=claude_desktop)
- Resch KL et al. 1994, *Wien Med Wochenschr* — možnosti a limity CO₂ balneoterapie. [Consensus](https://consensus.app/papers/details/624f01a417885d7f9c0caf162686c4cc/?utm_source=claude_desktop)
- Ekmekcioglu C et al. 2000, *Altern Ther Health Med* — 24h tlak po 3 týdnech, 35 pacientů. [Consensus](https://consensus.app/papers/details/39ccd0edaff45a03b6103309fbe833bc/?utm_source=claude_desktop)
- Chekhoeva AN et al. 2024, *Bull Rehabil Med* — RCT suché CO₂ koupele, 70 žen. [Consensus](https://consensus.app/papers/details/e4851982210856378938913590dccac8/?utm_source=claude_desktop)
- Zbroja H et al. 2021, *IJERPH* — suché CO₂ koupele, termografie, 46 pacientů. [Consensus](https://consensus.app/papers/details/55f7781cf9f7502ea76768a853ffc7da/?utm_source=claude_desktop)
- Prazeres J et al. 2025, *Biomedicines* — scoping review CO₂ a hojení ran. [DOI 10.3390/biomedicines13010228](https://doi.org/10.3390/biomedicines13010228)
- Brockow T et al. 2001, *Complement Ther Med* — RCT, CO₂ insuflace + rehabilitace vs. rehabilitace: bez významného rozdílu. [DOI 10.1054/ctim.2001.0434](https://doi.org/10.1054/ctim.2001.0434)
- Brockow T et al. 2008, *Eur J Pain* — RCT s placebem, 126 pacientů, akutní bolest krku: CO₂ injekce = falešný ultrazvuk. [DOI 10.1016/j.ejpain.2007.01.002](https://doi.org/10.1016/j.ejpain.2007.01.002)
- Bunyatyan N et al. 2018 a Bofanova N et al. 2023, *Vopr Kurortol* — karboxyterapie: přehled, „off‑label", nedostatek dat. [Consensus 1](https://consensus.app/papers/details/f5f852c28bed5790b90e2dad7c5e411e/?utm_source=claude_desktop), [Consensus 2](https://consensus.app/papers/details/80ccd991d11758ef84275f79988a35d2/?utm_source=claude_desktop)

### 4.5 Peloidy (rašelina)

**Síla důkazů:** střední u artrózy (jako součást lázeňské léčby, viz 4.1); mechanismus huminových kyselin doložen hlavně in vitro.

**Lze tvrdit:** peloidní zábaly/koupele v kombinaci s koupelemi zmírňují bolest a ztuhlost u artrózy kolene a ruky, s efektem přetrvávajícím měsíce (Fioravanti 2010, 2013; Varzaityte 2019); Cochrane 2022 hodnotí doplňkové terapie k cvičení a nachází jen nízkou jistotu důkazů.

**Nelze tvrdit:** „umělá horečka stimuluje imunitní systém"; „snížení CRP a IL‑6" bez citace (Maccarone 2021 to popisuje jen u některých muskuloskeletálních studií); „huminové kyseliny pronikají do hlubších tkání".

**Zdroje:** Varzaityte L et al. 2019, *Int J Biometeorol* (RCT, 92 pacientů) [Consensus](https://consensus.app/papers/details/89db581ad83b5bfa9bec05f9ec5c9626/?utm_source=claude_desktop); French SD et al. 2022, Cochrane [DOI 10.1002/14651858.CD011915.pub2](https://doi.org/10.1002/14651858.CD011915.pub2); metaanalýza bahenních koupelí 2021, *Clin Ter* [DOI 10.7417/CT.2021.2343](https://doi.org/10.7417/CT.2021.2343); Cheleschi S et al. 2020, *Int J Biometeorol* (in vitro) [Consensus](https://consensus.app/papers/details/1107321860f7578199dd63acedec167e/?utm_source=claude_desktop).

### 4.6 Imunita

**Síla důkazů:** slabá; převážně mechanistické hypotézy a biomarkery, žádné klinické výstupy (méně infekcí).

**Lze tvrdit:** lázeňská léčba je v literatuře popisována jako mírný „hormetický" stresor, po kterém byly u pacientů s muskuloskeletálními chorobami pozorovány nižší hladiny některých zánětlivých markerů; klinický dopad na „imunitu" není doložen.

**Nelze tvrdit:** cokoliv ve smyslu „posílení imunity", „výcvikový tábor", „obnova imunitních zásob", zimní „posílení imunity chladem", sauna „posiluje imunitu". Článek `cs-imunita-prevence-lazne` doporučuji buď zásadně přepsat na „prevence a regenerace", nebo stáhnout.

**Zdroje:** Gálvez I et al. 2018, *Int J Mol Sci* [Consensus](https://consensus.app/papers/details/301fd171b035572385399c822e83c3f7/?utm_source=claude_desktop); Maccarone MC et al. 2021, *Sport Sci Health* [Consensus](https://consensus.app/papers/details/7d5dc407c12055bebb5274387bca5e86/?utm_source=claude_desktop); Antonelli M et al. 2024, *Int J Biometeorol* — metaanalýza kortizolu, rozdíl mezi skupinami nevýznamný [Consensus](https://consensus.app/papers/details/b207a63a0d4850fd9314b16f22fc3dc3/?utm_source=claude_desktop).

### 4.7 Lesní koupel (šinrin‑joku) a stres

**Síla důkazů:** střední pro krátkodobé snížení stresu a úzkosti; slabá pro imunitu; žádná pro „dávku" (2 hodiny) ani sezónu.

**Lze tvrdit:** metaanalýza 8 studií ukázala nižší slinný kortizol po pobytu v lese oproti městu (krátkodobě; autoři upozorňují na roli očekávání); metaanalýza 20 studií: krátkodobé zmírnění úzkosti; malé japonské studie (cca 12 osob) popsaly vyšší aktivitu NK buněk po třídenním pobytu v lese.

**Nelze tvrdit:** „les léčí", „přírodní medicína založená na důkazech", „minimálně dvě hodiny pro znatelný účinek", „v létě je účinek nejsilnější", „posílení imunity".

**Zdroje:** Antonelli M et al. 2019, *Int J Biometeorol* [Consensus](https://consensus.app/papers/details/9e2f3fee63dc533fa75d4391954c57d4/?utm_source=claude_desktop); Kotera Y et al. 2020, *Int J Ment Health Addict* [Consensus](https://consensus.app/papers/details/04a95ffe5fbf5763964d7a07a31a85f8/?utm_source=claude_desktop); Wen Y et al. 2019, *Environ Health Prev Med* [Consensus](https://consensus.app/papers/details/918f75c9e5035dc3820cdbbae0312e21/?utm_source=claude_desktop); Li Q 2009, *Environ Health Prev Med* [Consensus](https://consensus.app/papers/details/39f6562ff976547e85c2f88319e92083/?utm_source=claude_desktop); Hansen MM et al. 2017, *IJERPH* [Consensus](https://consensus.app/papers/details/806c9de709465ee783edda6a01499171/?utm_source=claude_desktop).

### 4.8 Vyhoření, psychika, spánek

**Síla důkazů:** slabá až střední pro subjektivní stres, spánek a únavu u „subzdravých" osob; **žádná** pro diagnózu syndromu vyhoření.

**Lze tvrdit:** u lidí s vysokou mírou stresu lázeňské programy (6–11 dní) zlepšily únavu, spánek a kvalitu života s efektem až 6 měsíců (373 osob, Litva); pětiměsíční pravidelné koupele zmírnily poruchy spánku a stres (362 osob, Čína); lázeňský pobyt nenahrazuje psychoterapii, psychiatrickou péči ani změnu pracovních podmínek.

**Zdroje:** Rapolienė L et al. 2025, *Int J Biometeorol* [Consensus](https://consensus.app/papers/details/9b8af91815645dce946c8b1e5c4f8834/?utm_source=claude_desktop); Yang B et al. 2018, *Int J Biometeorol* [Consensus](https://consensus.app/papers/details/5da141d1b4205f63a3d401732e517a95/?utm_source=claude_desktop); Antonelli M et al. 2018, *Int J Biometeorol* [Consensus](https://consensus.app/papers/details/23c4a1e793d1564986583a499a8ef7da/?utm_source=claude_desktop).

### 4.9 Postcovidový syndrom

**Síla důkazů:** rostoucí, střední; jedna RCT, jeden systematický přehled, několik observačních studií.

**Lze tvrdit:** v RCT (98 dospělých, Barcelona) balneoterapie s cvičením ve vodě zmírnila únavu, bolest, úzkost a zlepšila spánek; udržení efektu po měsíci nejisté; 17 pacientů uvedlo přechodné zhoršení únavy na začátku; systematický přehled 6 studií (617 osob) popisuje zmírnění únavy a svalové bolesti; evropské lázeňské společnosti doporučují lázeňský pobyt jako doplněk rehabilitace.

**Nelze tvrdit:** „prokazatelně pomáhá s brain fogem"; citace SZÚ, Balneologického ústavu a *J Rehabil Med* 2023.

**Zdroje:** Ovejero D et al. 2025, *BMC Complement Med Ther* [Consensus](https://consensus.app/papers/details/ad0678b6f1a55a9fa2aaae54305c8aef/?utm_source=claude_desktop); Ferrara E et al. 2025, *Healthcare* [Consensus](https://consensus.app/papers/details/a8882a6577d958aeb36b08eacbc180c5/?utm_source=claude_desktop); Costantino M et al. 2024, *J Clin Med* [Consensus](https://consensus.app/papers/details/d62a0ad3a7f358bbb20eb27c989128e3/?utm_source=claude_desktop); Onik G et al. 2024, *Healthcare* [Consensus](https://consensus.app/papers/details/287c05dcf601513a961553078d82bc3e/?utm_source=claude_desktop); Maccarone MC et al. 2021, *Environ Sci Pollut Res* [Consensus](https://consensus.app/papers/details/f64276dcf71d52c99455895311202994/?utm_source=claude_desktop).

### 4.10 Rehabilitace po onkologické léčbě

**Síla důkazů:** střední u karcinomu prsu v remisi (francouzský program PACThe).

**Lze tvrdit:** ve francouzské RCT (181 žen v remisi karcinomu prsu) zvýšil lázeňský program návrat k pracovním i rodinným aktivitám po 12 měsících a byl nákladově efektivní; metaanalýza cvičení ve vodě u žen po karcinomu prsu ukazuje snížení únavy a lepší kvalitu života. Interní studie OnkoFit‑Spa (cca 40 žen) uvádět jako interní sledování Ensana, ne jako důkaz účinnosti.

**Nelze tvrdit:** „posílit imunitní systém" po onkologické léčbě.

**Zdroje:** Mourgues C et al. 2014, *Eur J Oncol Nurs* [Consensus](https://consensus.app/papers/details/198633cfa0215c57ae77164ff322c1c7/?utm_source=claude_desktop); Godiveau M et al. 2025, *BMC Cancer* (protokol PACThe Real‑Life, shrnuje RCT i 5leté výsledky) [Consensus](https://consensus.app/papers/details/c58784a5fda05c46b3260630e61d0f0e/?utm_source=claude_desktop); Strauss‑Blasche G et al. 2005, *Cancer Nurs* [Consensus](https://consensus.app/papers/details/a05ea52de8d85748bc6c07d9c5ae805a/?utm_source=claude_desktop); Wang J et al. 2022, *PLoS ONE* [Consensus](https://consensus.app/papers/details/fd7851ada1675ae3894bc22fdf8153d8/?utm_source=claude_desktop).

### 4.11 Pitná kúra: trávení a metabolismus

**Síla důkazů:** slabá až střední pro funkční zácpu a dyspepsii; slabá pro metabolismus; žádná pro „pankreas" nebo „detoxikaci".

**Lze tvrdit:** u funkční zácpy existuje dvojitě zaslepená RCT se síranovo‑hořečnatou vodou (už citováno); britská dietologická doporučení 2025 zahrnují vodu s vyšším obsahem minerálů mezi možnosti u chronické zácpy; síranovo‑hydrogenuhličitanové vody v malých studiích zlepšily vyprazdňování žlučníku a dyspeptické potíže; hydrogenuhličitanové vody jsou v přehledech spojovány s možným vlivem na inzulinovou citlivost — jde o hypotézu, ne o doložený účinek.

**Zdroje:** Dupont C et al. 2019, *Nutrition* [DOI 10.1016/j.nut.2019.02.018](https://doi.org/10.1016/j.nut.2019.02.018); Dimidi E et al. 2025, *J Hum Nutr Diet* [DOI 10.1111/jhn.70133](https://doi.org/10.1111/jhn.70133); Corradini SG et al. 2012, *World J Gastroenterol* [Consensus](https://consensus.app/papers/details/11a1a41b579854e591a67d137a568bda/?utm_source=claude_desktop); Bertoni M et al. 2002, *Pharmacol Res* [Consensus](https://consensus.app/papers/details/b0ad533e86105fdc9c5c3c3a4cf9ac4d/?utm_source=claude_desktop); Mansouri K et al. 2025, *Food Sci Nutr* (narativní přehled) [Consensus](https://consensus.app/papers/details/b65264d44d0054c19b40114c9a9bb5d5/?utm_source=claude_desktop); Fioravanti A et al. 2024, *Int J Biometeorol* — přehled nových indikací (obezita, metabolismus, spánek, long COVID, onkologie) s výhradou „nutné další RCT" [Consensus](https://consensus.app/papers/details/f085934149265a7eaf6b6964fc2a2bb6/?utm_source=claude_desktop).

### 4.12 Dýchací cesty a klimatoterapie

**Síla důkazů:** slabá až střední pro inhalace minerálních vod; klimatoterapie v 630 m n. m. nemá specifickou literaturu.

**Lze tvrdit:** systematický přehled 27 studií popisuje zlepšení nosní průchodnosti, mukociliárního transportu a některých plicních parametrů po inhalacích termálních vod, s upozorněním na nízkou kvalitu studií; u astmatu a CHOPN je důkazů málo.

**Nelze tvrdit:** „zvýšení erytropoézy" v 630 m; sezónní rozdíly ve fytoncidech jako léčebný argument; „imunostimulační" účinek.

**Zdroje:** Fontana M et al. 2025, *Int J Biometeorol* [Consensus](https://consensus.app/papers/details/e377f688a5f85f3c9e6c9373d675eb8e/?utm_source=claude_desktop); Calzetta L et al. 2024, *J Clin Med* [Consensus](https://consensus.app/papers/details/a501a68157c55ab987f90c1b05309fbe/?utm_source=claude_desktop); Khaltaev N et al. 2020, *J Thorac Dis* [Consensus](https://consensus.app/papers/details/ef1fb47a66af5341be76a01e6fde2ba4/?utm_source=claude_desktop).

### 4.13 Délka pobytu (7 / 14 / 21 dní)

**Síla důkazů:** žádná přímá studie 14 vs. 21 dní. Účinek je doložen pro dvoutýdenní (Fioravanti 2010, Karagülle 2018, Takinaci 2019) i třítýdenní programy (Guillemin 1994, Forestier 2025). Odborná korespondence uvádí jako normu 2–3 týdny s 10–21 procedurami.

**Doporučená jednotná formulace pro celý web:**
> Délku léčebného pobytu určuje indikační seznam a návrh ošetřujícího lékaře, ne obecné pravidlo. U komplexní lázeňské péče hrazené pojišťovnou je to podle indikace 21 nebo 28 dní, u příspěvkové péče 14 nebo 21 dní. Samoplátci volí nejčastěji 1–3 týdny po dohodě s lázeňským lékařem. Kratší pobyty mají spíše regenerační než léčebný charakter.

V článcích o konkrétní indikační skupině vždy uvést délku platnou pro danou položku seznamu (jak to už dělá `cs-lazenska-lecba-traviciho-ustroji` ř. 44 pomocí `indication-picker`), ne souhrnnou větu. Pozor: `cs-lazensky-poukaz-pruvodce` ř. 42 uvádí u příspěvkové péče „obvykle 21 dní" — opravit na „14 nebo 21 dní podle indikace".

Zdroj pro hrazené délky: indikační seznam (vyhláška č. 2/2015 Sb.) — před publikací ověřit aktuální znění. Zdroj pro „normu 2–3 týdny": Karagülle MZ et al. 2021, *Int J Biometeorol* [Consensus](https://consensus.app/papers/details/14ac08e16e2d5bbb804b6330ab17303b/?utm_source=claude_desktop).

Věty „přesně 21 dní", „plný efekt ve třetím týdnu", „10–14 dní pro měřitelné posílení imunity" a „minimálně 7 nocí pro účinnou kúru" nahradit touto formulací, případně tradicí („historicky se kúra předepisovala na tři týdny").

---

## 5. Mapa: kam které studie použít

| Článek / stránka | Původní tvrzení | Nová formulace (návrh) | Opora |
|---|---|---|---|
| `cs-lecba-pohyboveho-aparatu` ř. 37 | „prokazatelně zpomaluje postup nemoci" | „Lázeňská léčba chrupavku neobnoví ani průběh nemoci nezastaví, ale podle systematických přehledů zmírňuje bolest a ztuhlost a zlepšuje funkci, obvykle na 3–6 měsíců." | Forestier 2016, Protano 2023 |
| tamtéž ř. 68 a 129 | 4–6 vs. 6–9 měsíců | sjednotit na „3–6 měsíců, v některých studiích až 9" | Forestier 2016, Fioravanti 2010 |
| tamtéž ř. 131 | „nižší spotřebu analgetik a méně pracovních neschopností" | „Ve studiích u artrózy a bolestí zad pacienti po kúře užívali méně léků proti bolesti. Vliv na pracovní neschopnost doložen není." + odstranit srovnání „pravidelně vs. jednorázově" | Constant 1995, Fioravanti 2010/2013, Nguyen 2017 |
| tamtéž ř. 72 | „Výzkum Revmatologického ústavu" | nahradit RCT ANGELLO (3 týdny, 6 měsíců) | Forestier 2025 |
| `cs-lecba-ledvin-mocovych-cest` ř. 48, 103–105, 119 | „prokazatelně snižují recidivy", „40–60 %", „třetí týden" | „Základem prevence recidiv je podle evropských urologických doporučení dostatečný příjem tekutin. Pitná kúra je způsob, jak si takový režim pod lékařským dohledem osvojit. Vhodnost i četnost pobytů konzultujte s urologem nebo nefrologem." | Skolarikos 2024, Siener 2021, Mennuni 2015 |
| `cs-imunita-prevence-lazne` (celý) | posílení imunity | přejmenovat na „Prevence a regenerace v lázních"; imunitu zmínit jen v jedné větě jako oblast výzkumu | Gálvez 2018, Maccarone 2021 |
| `cs-lesni-koupel…` ř. 20, 96, 114, 118, 122 | „les léčí", „2 hodiny", „léto" | „Pobyt v lese je v metaanalýzách spojen s krátkodobým snížením kortizolu a úzkosti. Doporučenou minimální dobu výzkum nestanovil; jděte tak dlouho, jak vám je příjemné." | Antonelli 2019, Kotera 2020 |
| `cs-burnout-prevence-lazne` ř. 11, 81, 107, 109 | „prokazatelně obnovuje odolnost", UK/Maslach, „žádná chemie", „reset" | „U lidí s vysokou mírou stresu zlepšily lázeňské programy únavu, spánek a kvalitu života. Lázeňský pobyt nenahrazuje psychoterapii, psychiatrickou péči ani změnu pracovních podmínek." | Rapolienė 2025, Yang 2018 |
| `cs-rehabilitace-po-covidu` ř. 11, 78–82 | „prokazatelně", SZÚ, Balneologický ústav, JRM 2023 | nahradit RCT z Barcelony a systematickým přehledem; uvést i přechodné zhoršení únavy na začátku | Ovejero 2025, Ferrara 2025 |
| `cs-plynove-injekce-co2` ř. 93–99 | tři neověřitelné studie | „Plynové injekce vycházejí z dlouholeté praxe evropských lázní; publikované důkazy tvoří přehledy a kazuistiky, kontrolované studie chybějí." | Bunyatyan 2018, Bofanova 2023 |
| `cs-co2-koupele-veda` ř. 36–40, 66; `pages/cs-co2-terapie` ř. 78–84; `cs-lazne-civilizacni-choroby` ř. 47–51 | „−10–15 mmHg", „bez vedlejších účinků", UK, Balneologický ústav | „V malých studiích klesl u pacientů s vyšším výchozím tlakem po třítýdenní kúře 24hodinový tlak; u suchých CO₂ koupelí to potvrdila i menší RCT. Vhodnost posuzuje lékař (kontraindikace: …)." | Ekmekcioglu 2000, Chekhoeva 2024, Pagourelias 2011 |
| `cs-lazne-civilizacni-choroby` ř. 38 | „prokazatelně ovlivňuje metabolismus glukózy", „funkci pankreatu" | „Vliv hydrogenuhličitanových vod na metabolismus je předmětem výzkumu; doložené nejsou." Diabetes uvést jako oficiální indikaci. | Mansouri 2025, indikační seznam |
| `cs-prevence-novy-luxus-v-laznich` ř. 101–105 | „Studie ČIL: 34 / 28 / 41 %" | odstranit; případně nahradit větou o nižší spotřebě analgetik u artrózy | Fioravanti 2010 |
| `cs-pohyb-v-laznich-prodluzuje-zivot` ř. 75–80 | EJPC čísla | odstranit; nahradit obecným tvrzením o pohybu a zdraví s citací guidelines, nebo forest‑bathing přehledem | Li 2025 (přehled), Wen 2019 |
| `cs-den-mozku-nervovy-system` ř. 12, 73 | „prokazatelně regenerují nervový systém", PNAS ticho | odstranit; ticho nechat jako zážitek, ne jako neurogenezi | Kirste 2015 (myši) |
| `cs-postonkologicky…`, `cs-onkofit-spa-studie` | „posílení imunity"; OnkoFit jako studie | zaměnit za „návrat kondice a aktivit"; OnkoFit označit jako interní sledování; doplnit PACThe | Mourgues 2014, Wang 2022 |
| `cs-lazenska-lecba-traviciho-ustroji` | (už v pořádku) | doplnit Dimidi 2025 a Corradini 2012 jako další opory | — |
| `pages/cs-klimatoterapie` ř. 35–39, 99 | erytropoéza, fytoncidy podle sezóny, 14–21 dnů | přepsat podle osnovy v §6 (co je / jak probíhá / kdy ne / kdo rozhoduje / co čekat) | Fontana 2025 |
| `pages/cs-peloidni-terapie` ř. 73–78 | CRP, IL‑6, „až 6 měsíců" | „bolest a ztuhlost, efekt měsíce" s citací | Fioravanti 2010, French 2022 |
| `pages/cs-ubytovani` ř. 168, 178–180 | 7 / 14–21 nocí | přesunout do zdravotní sekce, nahradit jednotnou větou z 4.13 | — |
| všechny „21 dní" pasáže | „přesně 21", „klinické důkazy" | věta z 4.13 + délka podle konkrétní položky indikačního seznamu | Karagülle 2021, vyhláška 2/2015 |

---

## 6. Osnova pro léčebné pilířové stránky

Pro `cs-co2-terapie`, `cs-klimatoterapie`, `cs-peloidni-terapie`, `cs-mineralni-prameny` (část o pitné kúře) a `cs-prehled-pramenu`:

1. Co je procedura (2–3 věty, bez superlativů).
2. Jak probíhá (délka, teplota, frekvence, co má pacient s sebou).
3. Jak dlouho obvykle trvá série (počet procedur, ne „trvalý účinek").
4. Při jakých obtížích se používá (kategorie A — indikace).
5. Kdy vhodná není (kontraindikace z `ensana_knowledge_base.json`).
6. Kdo rozhoduje o zařazení (lázeňský lékař po vstupním vyšetření).
7. Co může pacient realisticky očekávat (kategorie B/C s citací).
8. Zdroje.

Rozdělení pramenů: **Minerální prameny** = proč se vody liší, jak funguje pitná kúra, proč ji určuje lékař. **Přehled pramenů** = karty (poloha, přístupnost, otevírací doba, chuť, teplota, mapa). **Indikace** = jen ve zdravotní sekci; z karet pramenů odstranit řádky „Indikace:". Tvrzení o stáří vody (14 000 let) buď doložit hydrogeologickým zdrojem, nebo vypustit.

---

## 7. Pořadí prací (balíčky pro samostatné PR)

| PR | Obsah | Soubory | Odhad |
|---|---|---|---|
| **0** | Redakční standard (tento dokument → zkrácená verze do CLAUDE.md nebo `docs/editorial-standards.md`), pole `sources` + `medicalReviewDate` v Keystatic, sekce „Zdroje" v šabloně článku | `keystatic.config.tsx`, šablona článku, `CLAUDE.md` | malý |
| **1** | 10 nejrizikovějších článků (pořadí): ledviny · pohybový aparát · imunita · prevence‑luxus · pohyb‑prodlužuje‑život · rehabilitace‑po‑covidu · plynové injekce + CO₂ věda · burnout · lesní koupel · civilizační choroby | `src/content/articles/cs-*` | velký; rozdělit na 2–3 PR po 3–4 článcích |
| **2** | Druhá vlna: den mozku · třítýdenní kúra · průvodce léčbou · rašelina · kožní · postonkologický + OnkoFit · 14denní kúra · útěk před vedrem · zima · Therme | tamtéž | střední |
| **3** | Léčebné pilířové stránky podle osnovy §6 (CO₂, klimatoterapie, peloidy) | `src/content/pages/cs-*` | střední |
| **4** | Rozdělení pramenů (Minerální prameny vs. Přehled pramenů), přesun indikací | `cs-mineralni-prameny`, `cs-prehled-pramenu`, `cs-pruvodce-mineralni-prameny`, `cs-pitna-kura-pruvodce` | střední |
| **5** | FAQ: odstranit ceny a jazykovou vybavenost, časy „orientačně", „Chopinský festival" → oficiální název, „Ano!" → „Ano", odpovědi zkrátit na 1 větu + odkaz | `cs-faq` | malý |
| **6** | Ubytování: odstranit délku léčby a doporučení procedur, `upgrade pokoje` → „vyšší kategorie pokoje" | `cs-ubytovani` | malý |
| **7** | Fact sheet historie/UNESCO (`data/facts_history_unesco.json`) + přepis UNESCO průvodce na praktickou trasu | `data/`, `cs-pruvodce-unesco-mesto`, `cs-proc-marianske-lazne-unesco`, `cs-unesco` | střední |
| **8** | Propsání změn do DE/EN/RU verzí stejných článků (medicínská tvrzení tam jsou stejná) | `articles/{de,en,ru}-*` | velký; až po schválení CS verzí |

Po PR 1 doporučuji **odbornou revizi lázeňským lékařem Ensana** (jedno odpoledne nad 10 články), aby se doplnily kontraindikace a interní praxe, kterou literatura nepokrývá.

---

## 8. Kontrolní seznam pro každý článek

- [ ] Každé zdravotní tvrzení zařazeno do kategorie A / B / C.
- [ ] Kategorie C má citaci s DOI, počet účastníků a jednu větu o omezení.
- [ ] Žádné „prokazatelně", „posiluje imunitu", „detox", „reset", „les léčí", „bez vedlejších účinků".
- [ ] Žádná instituce citována bez konkrétní publikace.
- [ ] Délka pobytu podle §4.13 a podle konkrétní položky indikačního seznamu (K: 21/28 dní, P: 14/21 dní), ne paušálně.
- [ ] Trvání efektu uvedeno jen tam, kde ho dokládá studie pro danou diagnózu a proceduru (pohybový aparát a bolesti zad: §4.1–4.2; ostatní témata jen s konkrétním zdrojem z §4). Kde zdroj chybí, dobu trvání vynechat.
- [ ] Věta „o zařazení do léčebného plánu rozhoduje lázeňský lékař" + odkaz na kontraindikace.
- [ ] U psychiky/vyhoření věta, že pobyt nenahrazuje psychoterapii ani psychiatrickou péči.
- [ ] Interní data Ensana označena jako interní.
- [ ] Sekce „Zdroje" na konci; `medicalReviewDate` vyplněno.
- [ ] Duplicita s pilířovou stránkou odstraněna (odkaz místo opakování).
- [ ] Jedna vyhledávací otázka, jedna CTA.

---

## 9. Otevřené otázky pro majitele obsahu

1. Existují **interní data Ensana**, ze kterých vznikla čísla v §2.1 (ČIL, „Balneologický ústav", UK)? Pokud ano, lze je publikovat jako „interní sledování Ensana, rok, N"? Pokud ne, pasáže odstranit.
2. Byla studie **OnkoFit‑Spa** publikována (kde, DOI)? Bez toho ji uvádět jen jako interní program.
3. Kdo bude **odborný garant** (lázeňský lékař) a v jakém rytmu (roční revize `medicalReviewDate`)?
4. Má se článek o imunitě **přejmenovat**, nebo stáhnout?
5. Ověřit aktuální **indikační seznam** (vyhláška č. 2/2015 Sb. ve znění pozdějších předpisů) pro délky hrazených pobytů a seznam indikací před tím, než se stane referencí pro kategorii A.
6. Chceme na webu **sekci „Zdroje"** viditelnou čtenáři, nebo jen ve frontmatteru pro redakci? (Doporučuji viditelnou — zvyšuje důvěryhodnost u cílové skupiny 50+.)
