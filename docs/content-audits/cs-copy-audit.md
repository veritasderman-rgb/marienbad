# Audit českých textů: další kroky

**Rozsah:** 24 hlavních českých obsahových stránek v `src/content/pages/cs-*` a související texty českých rout.  
**Stav:** schváleno a realizováno v navazující obsahové revizi.
**Mimo rozsah:** články magazínu, právní správnost zdravotních tvrzení a úplná faktická rešerše. Tyto oblasti doporučuji projít samostatně.

## Stav realizace

- Přepracovány byly prioritní stránky Architektura, Historie, Co dělat a Výlety.
- Výraznou revizí prošly také rozcestníky Magazín, Lidé z kolonády, Slavní návštěvníci a Praktické informace.
- U léčebných, ubytovacích a sezonních stránek byly odstraněny nejvýraznější překladové konstrukce, nejasné superlativy a zbytečné cizojazyčné výrazy.
- Napříč českou mutací se sjednotil název památky UNESCO a české názvy příjezdu, odjezdu a hotelových služeb.
- Právní stránky zůstaly beze změny, protože jejich význam má před jazykovým přepisem potvrdit právník. Samostatný medicínský a faktografický audit zůstává doporučeným následným krokem.

## Co se v textech opakuje

Texty nejčastěji nepůsobí nečesky kvůli jednotlivým chybám, ale kvůli kombinaci několika návyků:

1. **Překladová větná stavba.** Často se objevují konstrukce „X činí z Y…“, „budova disponuje…“, „byl odpovědný za…“ nebo „je pečována jako dědictví“. V češtině obvykle stačí přímé sloveso: „díky X je Y…“, „budova má…“, „navrhl…“, „o tradici se pečuje“.
2. **Nadměrné množství superlativů.** Slova jako „jedinečný“, „úchvatný“, „velkolepý“, „dechberoucí“, „fascinující“ a „nezapomenutelný“ se opakují tak často, že text ztrácí důvěryhodnost. Silnější je popsat konkrétní výhled, cestu nebo atmosféru a hodnocení nechat na čtenáři.
3. **Heslovité odstavce místo souvislého vyprávění.** Některé stránky skládají fakta za sebe, ale nevysvětlují, proč jsou pro návštěvníka důležitá nebo co má udělat dál.
4. **Anglicismy a německé názvy bez důvodu.** Na českých stránkách zůstávají výrazy `resort`, `family-friendly`, `all-inclusive`, `check-in`, `check-out`, `concierge`, `Carlsbad` a `Kaiserwald`. Ne vždy jsou chybné, ale ve většině vět mají přirozený český ekvivalent.
5. **Nestálé oslovování.** Text přechází mezi „host“, „pacient“, „návštěvník“ a přímým „vy“. Volbu je vhodné řídit účelem stránky: u inspirace používat „vy“, u léčby neutrální odborné formulace a označení „pacient“ jen v klinickém kontextu.
6. **Tvrzení bez opory nebo v rozporu s jinou stránkou.** Při jazykové úpravě je potřeba současně zkontrolovat názvy budov, otevírací doby, vzdálenosti, léčebné účinky a kapacity. Plynulá věta nesmí zakrýt věcnou chybu.

## Doporučené pořadí úprav

### 1. vlna — nejvyšší priorita

Tyto stránky kombinují nepřirozenou češtinu s logickými rozpory nebo tvrzeními, která je nutné ověřit před přepisem.

#### Architektura

**Soubor:** `src/content/pages/cs-architektura/index.mdoc`

- Opravit shodu ve větě „Inspirován italskou renesancí se tyto stavby vyznačují…“.
- Nahradit doslovné překlady „atmosféra grandezy“, „dekorativní slovník“, „byl odpovědný za rozšíření“ a „nastavilo nové standardy“.
- Prověřit část **Casino (Městské divadlo)**. Text zachází s Casinem a Městským divadlem jako s jednou budovou, zatímco jinde na webu jsou uvedeny samostatně.
- U Hlavní kolonády prověřit tvrzení, že „chrání Křížový pramen“; pavilon Křížového pramene a Hlavní kolonáda se nemají v textu slévat v jeden objekt.

**Návrh nového úvodu:**

> Mariánské Lázně získaly svou dnešní podobu během několika desetiletí 19. století. Lázeňské domy, hotely, vily, kolonády a parky proto působí jako promyšlený celek, přestože na nich pracovala řada architektů.

#### Historie

**Soubor:** `src/content/pages/cs-historie/index.mdoc`

- Prověřit větu, podle níž je Casino „dnes městské muzeum“. Jde zřejmě o záměnu několika různých budov.
- Zkrátit encyklopedické pasáže a dát stránce jasnou časovou osu: vznik lázní → rozkvět → války a poválečné období → současnost.
- Odstranit obecné závěry typu „město, které léčí tělo i duši“ a nahradit je konkrétním shrnutím významu pramenů, architektury a lázeňské tradice.
- Sjednotit názvy Casino / Společenský dům a ověřit velká písmena u názvů institucí.

**Návrh principu:** Každý historický oddíl by měl odpovědět na tři otázky: co se stalo, proč to změnilo město a co z toho návštěvník uvidí dnes.

#### Co dělat

**Soubor:** `src/content/pages/cs-co-delat/index.mdoc`

- Stránka se obsahově překrývá s přírodou, kulturou, golfem, výlety i gastronomií. Měla by fungovat jako stručný rozcestník, ne jako druhá verze všech podstránek.
- Nahradit formulace „spektakulární osvětlení“, „vodní paprsky tančí synchronně s díly“, „dechberoucí výhledy“, „vyšší gastronomie“ a „excelentní kuchyně“.
- Opravit nepřirozený slovosled „Anglický král Edward VII. osobně byl patronem klubu“.
- Sjednotit údaj o podílu zeleně s ostatními stránkami. Zde se uvádí více než 70 procent města, stránka Příroda pracuje s údajem o téměř polovině území pokrytém lesem; oba údaje mohou znamenat něco jiného, ale text to musí vysvětlit.
- Zkrátit stránku přibližně o třetinu a každou tematickou kartu zakončit odkazem na podrobnější stránku.

**Návrh nového úvodu:**

> Mezi procedurami se můžete projít kolonádou, poslechnout si Zpívající fontánu, vyrazit do Slavkovského lesa nebo strávit odpoledne na golfu. Vyberte si podle času, počasí a toho, zda chcete odpočívat, nebo poznávat okolí.

#### Výlety

**Soubor:** `src/content/pages/cs-vylety/index.mdoc`

- Odstranit německé či anglické varianty názvů v nadpisech, například „Karlovy Vary (Carlsbad)“, pokud pro českého čtenáře nemají praktický význam.
- Nahradit opakované „fascinující“, „velkolepý“, „dechberoucí“, „malebný“ a „nedotčený“ konkrétním popisem.
- Prověřit tvrzení o Muzeu Becherovky v Lokti; stránka je uvádí jako loketskou atrakci a zároveň tvrdí, že likér vznikl v Lokti.
- Prověřit existenci „vyhlídkové věže“ na Kladské a přesný status území. Kladská není vhodné zjednodušovat na jednu „přírodní rezervaci“.
- „Řízené výlety“ nahradit „výlety s průvodcem“, `concierge` pak podle skutečné služby například „hotelová recepce“ nebo „tým péče o hosty“.
- U dopravních časů uvést, že jsou orientační, a neslibovat aktuální četnost autobusů bez datového zdroje.

**Návrh struktury každého tipu:** proč jet → co stihnout → doba cesty → pro koho se výlet hodí → odkaz na detail.

#### Přehled pramenů a minerální prameny

**Soubory:**

- `src/content/pages/cs-prehled-pramenu/index.mdoc`
- `src/content/pages/cs-mineralni-prameny/index.mdoc`

- Sloučit nebo jasně odlišit účel obou stránek. Nyní opakují historii, složení i účinky pramenů a návštěvník nepozná, proč existují dvě.
- Jednu stránku pojmout jako úvod do místních léčivých vod, druhou jako praktický katalog: kde pramen najít, kdy je přístupný a jak chutná.
- Léčebná doporučení a formulace typu „pozitivní vliv na hormonální rovnováhu“ nepřepisovat pouze stylisticky; nejprve je porovnat se znalostní bází a nechat schválit medicínským garantem.
- Omezit „disponuje“, „činí výjimečnou“, „udivující rozmanitost“ a opakování slova „jedinečný“.
- Opravit zeměpisný kontext „uprostřed šumavských lesů“ — Mariánské Lázně leží ve Slavkovském lese, nikoli na Šumavě.

**Návrh rozdělení:**

- **Minerální prameny:** proč se vody liší, jak funguje pitná kúra, proč je nutná konzultace s lékařem.
- **Přehled pramenů:** karta každého pramene, poloha, přístupnost, základní chuťový profil a odkaz do mapy.

### 2. vlna — výrazný jazykový přepis

#### Ubytování

**Soubor:** `src/content/pages/cs-ubytovani/index.mdoc`

- Jde o nejdelší z auditovaných hlavních stránek a mnoho hotelů popisuje stejnými slovy: „jedinečný charakter“, „ideální volba“, „komplexní program“, „disponuje“.
- Každý hotel potřebuje jednu srozumitelnou odlišnost a potom jen praktická fakta. Opakované marketingové výplně lze odstranit.
- Přeložit nebo vysvětlit `family-friendly`, `check-in`, `check-out`, `upgrade` a `all-inclusive` tam, kde nejde o oficiální název produktu.
- Nepoužívat „3★ ceny s přístupem ke 4★ službám“, pokud tvrzení není jasně doložené a srozumitelné.
- Prověřit absolutní doporučení délky léčebného pobytu; vhodná délka závisí na diagnóze a doporučení lékaře.

**Návrh karty hotelu:** „Pro koho se hodí“ + poloha + léčebné zázemí + bazén/wellness + bezbariérovost + odkaz na cenu a dostupnost.

#### CO₂ terapie, peloidní terapie a klimatoterapie

**Soubory:**

- `src/content/pages/cs-co2-terapie/index.mdoc`
- `src/content/pages/cs-peloidni-terapie/index.mdoc`
- `src/content/pages/cs-klimatoterapie/index.mdoc`

- Nahradit pasivní konstrukce („pacient je uložen“, „plyn je vstřebáván“, „je usnadněno uvolňování“) přímým a klidným vysvětlením průběhu procedury.
- Omezit klinicky znějící superlativy „vysoce účinný“, „celosvětově jedinečný“ a číselné sliby bez citovaného zdroje.
- U medicínských účinků důsledně rozlišit „používá se“, „může pomoci“ a „prokazatelně léčí“.
- Vysvětlit odborné pojmy při prvním použití: vazodilatace, insuflace, peloid a fytoncidy.
- Odstranit německý název `Kaiserwald`, pokud není součástí historické poznámky.
- Klimatoterapii nepopsat jako univerzálně vhodnou; přidat jasnou informaci, že konkrétní režim určuje lékař.

**Návrh tónu:** věcný, uklidňující a konkrétní. Čtenář má po první obrazovce vědět, co jej při proceduře čeká, jak dlouho trvá a komu ji doporučuje lékař.

#### Nejlepší čas návštěvy

**Soubor:** `src/content/pages/cs-nejlepsi-cas-navstevy/index.mdoc`

- Omezit opakování přídavných jmen a sezonních klišé typu „velkolepé květy“, „magická atmosféra“ nebo „okouzlující podzim“.
- Přesunout praktické rozhodování před poetické popisy: počasí, množství lidí, otevřené atrakce, ceny a vhodné aktivity.
- Vysvětlit rozdíl mezi lázeňskou sezonou a celoročním provozem hotelů a procedur.
- Doplnit stručné doporučení „jeďte v… pokud chcete…“ a tabulku s výhodami a omezeními každého období.

#### Jak se dostat

**Soubor:** `src/content/pages/cs-jak-se-dostat/index.mdoc`

- Vynechat vysvětlení českého názvu pomocí `Marienbad` a Slavkovského lesa pomocí `Kaiserwald`; na české praktické stránce ruší.
- „Na západním cípu České republiky“ nahradit přesnější polohou v západních Čechách.
- Zkrátit obecné věty typu „výhodná poloha činí město snadno dostupným“ a přejít rovnou k variantám dopravy.
- U jízdních dob, spojů a cen přidat datum aktualizace nebo je čerpat z udržovaného datového zdroje.
- Seřadit dopravu podle pravděpodobného použití českým návštěvníkem: auto, vlak, autobus; letiště až poté.

#### Golf

**Soubor:** `src/content/pages/cs-golf/index.mdoc`

- Opravit zápis „18jamkové“ na „osmnáctijamkové“ nebo „18jamkové“ podle zvolené redakční normy.
- `Kaiserwald`, „dokonalý mix“, „green fee“ a „transfery“ nahradit nebo při prvním výskytu vysvětlit.
- Oddělit text pro zkušené hráče od praktických informací pro začátečníky.
- U nadmořské výšky, prvenství hřiště a titulů klubu ověřit přesnou formulaci proti oficiálním podkladům.

#### UNESCO

**Soubor:** `src/content/pages/cs-unesco/index.mdoc`

- Sjednotit český oficiální název statku napříč webem. Nyní se střídají varianty „Velká“, „Významná“ a „Slavná lázeňská města Evropy“.
- Převést institucionální jazyk do češtiny pro návštěvníky. „Výjimečná univerzální hodnota“ může zůstat jako oficiální termín, ale je potřeba jej vysvětlit.
- Nahradit pasivní větu „živá lázeňská kultura je pečována jako nehmotné dědictví“.
- Omezit neurčitá prvenství a výlučnost, například „žádné jiné lázeňské město…“, pokud nejsou přímo součástí odůvodnění UNESCO.
- Vysvětlit prakticky, co lze v jádrové zóně projít a kde získat mapu nebo prohlídku.

### 3. vlna — lehčí redakční zásah

#### Kolonáda

**Soubor:** `src/content/pages/cs-kolonada/index.mdoc`

- Zkrátit technický popis trysek a „choreografovaných obrazců“.
- Jasně oddělit Hlavní kolonádu, pavilon Křížového pramene a Zpívající fontánu.
- Zkontrolovat sezonní časy fontány proti aktuálnímu zdroji; na různých stránkách se liší rozsah hodin.
- Nahradit „vrchol každé návštěvy“ konkrétním doporučením, kdy přijít.

#### Lidé a slavní návštěvníci

**Soubory:**

- `src/content/pages/cs-lide/index.mdoc`
- `src/content/pages/cs-slavni-navstevnici/index.mdoc`

- Omezit literární, přeloženě působící zkratky typu „Goethe zde psal. Kafka zde přemítal.“
- Nevytvářet domnělé motivace historických osobností bez zdroje.
- Sloučit opakované medailony nebo obě stránky jasně rozdělit: současné příběhy lidí vs. doložení historičtí hosté.

#### FAQ a praktické informace

**Soubory:**

- `src/content/pages/cs-faq/index.mdoc`
- `src/content/pages/cs-prakticke-informace/index.mdoc`

- FAQ má být krátké a odpovídat první větou; podrobnosti mají vést odkazem na příslušnou stránku.
- Odstranit vykřičníky v odpovědích typu „Ano!“ a propagační přívlastky v praktických informacích.
- Sloučit duplicitní odpovědi o dopravě, pramenech, počasí a UNESCO.
- U proměnlivých údajů uvádět zdroj a datum aktualizace.

#### Magazín

**Soubor:** `src/content/pages/cs-magazin/index.mdoc`

- Přepsat anotace tak, aby každá sdělila konkrétní přínos článku, nikoli obecný příslib „objevit tajemství“.
- Sjednotit tykání/vykání a interpunkci v kartách.
- Samostatně auditovat 107 českých obsahových souborů článků; hlavní stránky nejsou dostatečný vzorek pro posouzení celého magazínu.

#### Právní stránky

**Soubory:**

- `src/content/pages/cs-impressum/index.mdoc`
- `src/content/pages/cs-ochrana-soukromi/index.mdoc`

Tyto texty jazykově neupravovat stejným postupem jako marketingové stránky. Nejprve je má zkontrolovat právník; redakční zásah smí zlepšit orientaci a srozumitelnost, nikoli změnit právní význam.

## Doporučená redakční pravidla

1. **Jedna věta, jedna hlavní informace.** Dlouhé souvětí rozdělit, pokud obsahuje místo, historii, hodnocení i doporučení současně.
2. **Nejprve konkrétní fakt, potom atmosféra.** Místo „úchvatný výhled“ napsat, co je z místa vidět.
3. **Neopakovat hodnocení, které ukazuje fotografie.** Text má doplnit obraz o praktickou informaci.
4. **Ne více než jeden výrazný přívlastek v odstavci.** Slova „jedinečný“ či „výjimečný“ ponechat jen tam, kde text ihned vysvětlí proč.
5. **Používat česká slovesa:** „má“ místo „disponuje“, „navrhl“ místo „byl odpovědný za návrh“, „nabízí“ pouze tam, kde skutečně jde o nabídku.
6. **Anglický termín ponechat jen jako oficiální název služby.** Jinak použít „příjezd/odjezd“, „plná penze se službami“, „výlety s průvodcem“ či „přeprava“.
7. **Názvy ověřit a sjednotit.** Zejména Casino / Společenský dům, Městské divadlo, pavilon Křížového pramene, Hlavní kolonáda a oficiální český název statku UNESCO.
8. **Medicínská tvrzení nezesilovat.** Každé konkrétní procento, indikaci a příčinné tvrzení porovnat s `data/ensana_knowledge_base.json` a schválit odborným garantem.
9. **Proměnlivá data označit.** Otevírací doby, jízdní řády, ceny a sezonní program potřebují zdroj nebo datum poslední aktualizace.
10. **CTA má popsat další krok.** Upřednostnit „Zjistit otevírací dobu“, „Prohlédnout trasu“ nebo „Porovnat hotely“ před neurčitým „Zjistit více“.

## Navržený pracovní postup

1. **Faktická inventura:** sepsat rozpory v názvech, lokalitách, časech a zdravotních tvrzeních; potvrdit správnou variantu.
2. **Šablona tónu:** schválit jednu ukázkovou stránku z inspirativního obsahu (`Co dělat`) a jednu odbornou (`CO₂ terapie`).
3. **Přepis po tematických celcích:** historie a architektura; aktivity a výlety; prameny a léčba; ubytování a praktické informace.
4. **Kontrola napříč webem:** názvy, čísla a CTA vyhledat v celé české mutaci, ne pouze v právě upraveném souboru.
5. **Rodilý korektor a odborný garant:** korektor schválí rytmus a terminologii, odborník medicínská a historická tvrzení.
6. **Až poté SEO úprava:** titulek a meta popis psát z hotového textu, nikoli obráceně.

## Doporučený první balíček k realizaci

Jako další samostatný pull request doporučuji přepsat následující čtyři stránky:

1. `cs-architektura` — odstranit záměnu budov a doslovné překlady;
2. `cs-historie` — opravit časovou a věcnou logiku;
3. `cs-co-delat` — zkrátit na skutečný rozcestník;
4. `cs-vylety` — odstranit neověřená tvrzení a zpřehlednit praktické informace.

Tento balíček bude mít největší dopad na důvěryhodnost české mutace. Teprve po potvrzení tónu doporučuji stejným způsobem upravit léčebné a ubytovací stránky.
