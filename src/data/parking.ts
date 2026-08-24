import type { Locale } from '@/i18n/config'
import { routes, locales } from '@/i18n/config'

/**
 * Parkování u hotelů Ensana + městská parkoviště — sdílená data pro stránky
 * /cs/parkovani, /de/parken, /en/parking, /ru/parkovka.
 *
 * Cenové údaje, e-maily a obrázky jsou společné; překládají se jen popisky.
 */

export interface ParkingOption {
  name: string
  price?: string
  note?: string
  /** Odkaz na oficiální stránku městského parkoviště (proklik pro klienta). */
  href?: string
}
export interface ParkingHotel {
  name: string
  image: string
  location?: string
  contact: string
  options: ParkingOption[]
}
export interface TableRow {
  option: string
  price: string
  note: string
  href?: string
}
export interface TableGroup {
  hotel: string
  contact: string
  rows: TableRow[]
}
export interface CityLink {
  label: string
  desc: string
  href: string
}
export interface CityPlace {
  name: string
  text: string
}
export interface ParkingUI {
  metaTitle: string
  metaDescription: string
  eyebrow: string
  h1: string
  heroLeadHtml: string
  tableHeading: string
  colOption: string
  colPrice: string
  colNote: string
  reservationLabel: string
  hotelsHeading: string
  hotelsSubtitle: string
  cityHeading: string
  cityIntroHtml: string
  garagesHeading: string
  publicLotsHeading: string
  centreZoneHeading: string
  centreZonePara1Html: string
  centreZonePara2Html: string
  usefulLinksHeading: string
  usefulLinksSubtitle: string
}

const IMG = '/images/content/hotels/hotels/items'

// Oficiální stránka města pro „Parkovací dům u Městského divadla" (Parking Centrum, Pramenská).
const CITY_GARAGE = 'https://www.muml.cz/mesto/doprava-a-parkovani/parkoviste/hlidane-parkoviste/'

// Neměnné údaje sdílené napříč jazyky (obrázek, e-mail, pořadí hotelů).
const HOTEL_META = [
  { name: 'Ensana Nové Lázně', image: `${IMG}/0/image.jpg`, contact: 'res.nl@ensanahotels.com' },
  { name: 'Ensana Centrální Lázně', image: `${IMG}/1/image.jpg`, contact: 'res.cl@ensanahotels.com' },
  { name: 'Ensana Hvězda', image: `${IMG}/2/image.jpg`, contact: 'res.hv@ensanahotels.com' },
  { name: 'Ensana Pacifik', image: `${IMG}/3/image.jpg`, contact: 'res.pa@ensanahotels.com' },
  { name: 'Ensana Butterfly', image: `${IMG}/4/image.jpg`, contact: 'res.bu@ensanahotels.com' },
  { name: 'Ensana Vltava', image: `${IMG}/5/image.jpg`, contact: 'res.vl@ensanahotels.com' },
  { name: 'Ensana Svoboda', image: `${IMG}/6/image.jpg`, contact: 'res.sv@ensanahotels.com' },
] as const

// ---------------------------------------------------------------------------
// Route slugs per locale (used for alternateUrls / hreflang).
// ---------------------------------------------------------------------------
export const parkingUrls = Object.fromEntries(
  locales.map((l) => [l, `/${l}/${routes.parking[l]}`]),
) as Record<Locale, string>

// ---------------------------------------------------------------------------
// UI strings
// ---------------------------------------------------------------------------
export const ui: Record<Locale, ParkingUI> = {
  cs: {
    metaTitle: 'Parkování u hotelů Ensana v Mariánských Lázních',
    metaDescription:
      'Přehled možností parkování u jednotlivých hotelů Ensana v Mariánských Lázních — ceny, kapacity a rezervace — a doplňující informace o parkování ve městě.',
    eyebrow: 'Praktické informace',
    h1: 'Parkování u hotelů Ensana v Mariánských Lázních',
    heroLeadHtml:
      'Přehled možností parkování u jednotlivých hotelů Ensana a doplňující informace o parkování ve městě. U všech hotelových parkovišť a garáží platí, že je <strong class="text-white">nutná rezervace předem</strong> — doporučujeme si místo zajistit již při rezervaci pobytu.',
    tableHeading: 'Přehledová tabulka',
    colOption: 'Možnost parkování',
    colPrice: 'Cena',
    colNote: 'Kapacita / poznámka',
    reservationLabel: 'Rezervace:',
    hotelsHeading: 'Parkování u jednotlivých hotelů',
    hotelsSubtitle: 'Fotografie hotelů, ke kterým se informace vztahují.',
    cityHeading: 'Další možnosti parkování v Mariánských Lázních',
    cityIntroHtml:
      'Pokud jsou hotelová místa obsazená nebo hosté přijíždějí elektromobilem či hybridem (kam u některých hotelů platí zákaz vjezdu do garáží), lze využít městská a komerční parkoviště.',
    garagesHeading: 'Parkovací domy a hlídaná parkoviště',
    publicLotsHeading: 'Veřejná parkoviště s automatem',
    centreZoneHeading: 'Parkování v centru a lázeňské zóně',
    centreZonePara1Html:
      'Ve městě je rozmístěno přes 30 parkovacích automatů. Hodinové sazby se v centru pohybují zhruba od 30 do 50 Kč podle zóny (nejvyšší tarif v lázeňském centru). Pro vjezd do <strong>Lázeňské zóny</strong> je potřeba povolení — hosté ubytovaní v zóně mají výjimku v den příjezdu a odjezdu; jednodenní povolení do lázeňské zóny lze zakoupit z automatu za 20 Kč.',
    centreZonePara2Html:
      '<strong>Způsoby platby:</strong> automaty přijímají platební karty a mobilní aplikaci <strong>ClickPark</strong>, která hlídá konec doby parkování. Platba hotovostí (Kč i €) je možná pouze u některých automatů nového typu, které jsou ve městě postupně rozmisťovány. Ve městě jsou také interaktivní tabule zobrazující počet volných míst v jednotlivých lokalitách.',
    usefulLinksHeading: 'Užitečné odkazy — parkování ve městě',
    usefulLinksSubtitle:
      'Podrobné a vždy aktuální informace najdete na oficiálních stránkách města a turistickém portálu.',
  },
  de: {
    metaTitle: 'Parken an den Ensana Hotels in Marienbad',
    metaDescription:
      'Überblick über die Parkmöglichkeiten an den einzelnen Ensana Hotels in Marienbad — Preise, Kapazitäten und Reservierung — sowie Hinweise zum Parken in der Stadt.',
    eyebrow: 'Praktische Informationen',
    h1: 'Parken an den Ensana Hotels in Marienbad',
    heroLeadHtml:
      'Überblick über die Parkmöglichkeiten an den einzelnen Ensana Hotels sowie Hinweise zum Parken in der Stadt. Für alle Hotelparkplätze und Garagen gilt: <strong class="text-white">Reservierung im Voraus erforderlich</strong> — wir empfehlen, den Stellplatz bereits bei der Buchung des Aufenthalts zu sichern.',
    tableHeading: 'Übersichtstabelle',
    colOption: 'Parkmöglichkeit',
    colPrice: 'Preis',
    colNote: 'Kapazität / Hinweis',
    reservationLabel: 'Reservierung:',
    hotelsHeading: 'Parken an den einzelnen Hotels',
    hotelsSubtitle: 'Fotos der Hotels, auf die sich die Angaben beziehen.',
    cityHeading: 'Weitere Parkmöglichkeiten in Marienbad',
    cityIntroHtml:
      'Wenn die Hotelstellplätze belegt sind oder Gäste mit Elektro- bzw. Hybridfahrzeug anreisen (bei einigen Hotels ist die Einfahrt in die Garage untersagt), lassen sich die städtischen und kommerziellen Parkplätze nutzen.',
    garagesHeading: 'Parkhäuser und bewachte Parkplätze',
    publicLotsHeading: 'Öffentliche Parkplätze mit Automat',
    centreZoneHeading: 'Parken im Zentrum und in der Kurzone',
    centreZonePara1Html:
      'In der Stadt sind über 30 Parkautomaten verteilt. Die Stundentarife im Zentrum liegen je nach Zone bei etwa 30 bis 50 CZK (höchster Tarif im Kurzentrum). Für die Einfahrt in die <strong>Kurzone</strong> ist eine Genehmigung nötig — in der Zone übernachtende Gäste sind am An- und Abreisetag ausgenommen; eine Tagesgenehmigung für die Kurzone ist am Automaten für 20 CZK erhältlich.',
    centreZonePara2Html:
      '<strong>Zahlungsarten:</strong> Die Automaten akzeptieren Kreditkarten und die mobile App <strong>ClickPark</strong>, die das Ende der Parkzeit überwacht. Barzahlung (CZK und €) ist nur an einigen Automaten neuen Typs möglich, die nach und nach in der Stadt aufgestellt werden. In der Stadt gibt es außerdem interaktive Anzeigetafeln mit der Anzahl freier Plätze an den einzelnen Standorten.',
    usefulLinksHeading: 'Nützliche Links — Parken in der Stadt',
    usefulLinksSubtitle:
      'Ausführliche und stets aktuelle Informationen finden Sie auf den offiziellen Seiten der Stadt und dem Tourismusportal.',
  },
  en: {
    metaTitle: 'Parking at the Ensana Hotels in Marienbad',
    metaDescription:
      'An overview of parking at each Ensana hotel in Marienbad — prices, capacity and reservations — plus information on parking around town.',
    eyebrow: 'Practical information',
    h1: 'Parking at the Ensana Hotels in Marienbad',
    heroLeadHtml:
      'An overview of parking at each Ensana hotel, plus information on parking around town. For all hotel car parks and garages, <strong class="text-white">advance reservation is required</strong> — we recommend securing your space when you book your stay.',
    tableHeading: 'Overview table',
    colOption: 'Parking option',
    colPrice: 'Price',
    colNote: 'Capacity / notes',
    reservationLabel: 'Reservations:',
    hotelsHeading: 'Parking at each hotel',
    hotelsSubtitle: 'Photos of the hotels the information refers to.',
    cityHeading: 'Other parking options in Marienbad',
    cityIntroHtml:
      'If hotel spaces are full, or guests arrive in an electric or hybrid car (for which entry to some hotel garages is not permitted), the town’s public and commercial car parks are available.',
    garagesHeading: 'Parking houses and guarded car parks',
    publicLotsHeading: 'Public car parks with a ticket machine',
    centreZoneHeading: 'Parking in the centre and the spa zone',
    centreZonePara1Html:
      'There are more than 30 parking meters around town. Hourly rates in the centre range from roughly 30 to 50 CZK depending on the zone (the highest tariff applies in the spa centre). Entry to the <strong>Spa Zone</strong> requires a permit — guests staying within the zone are exempt on their arrival and departure days; a one-day spa-zone permit can be bought from a machine for 20 CZK.',
    centreZonePara2Html:
      '<strong>Payment methods:</strong> the machines accept payment cards and the <strong>ClickPark</strong> mobile app, which tracks the end of your parking time. Cash payment (CZK and €) is only possible at certain new-type machines that are being rolled out across town. The town also has interactive boards showing the number of free spaces at each location.',
    usefulLinksHeading: 'Useful links — parking in town',
    usefulLinksSubtitle:
      'Detailed, always up-to-date information is available on the official city pages and the tourism portal.',
  },
  ru: {
    metaTitle: 'Парковка у отелей Ensana в Марианских Лазнях',
    metaDescription:
      'Обзор возможностей парковки у каждого отеля Ensana в Марианских Лазнях — цены, вместимость и бронирование — а также информация о парковке в городе.',
    eyebrow: 'Практическая информация',
    h1: 'Парковка у отелей Ensana в Марианских Лазнях',
    heroLeadHtml:
      'Обзор возможностей парковки у отдельных отелей Ensana и дополнительная информация о парковке в городе. Для всех гостиничных парковок и гаражей действует правило: <strong class="text-white">необходимо бронирование заранее</strong> — рекомендуем закрепить за собой место уже при бронировании проживания.',
    tableHeading: 'Сводная таблица',
    colOption: 'Вариант парковки',
    colPrice: 'Цена',
    colNote: 'Вместимость / примечание',
    reservationLabel: 'Бронирование:',
    hotelsHeading: 'Парковка у отдельных отелей',
    hotelsSubtitle: 'Фотографии отелей, к которым относится информация.',
    cityHeading: 'Другие возможности парковки в Марианских Лазнях',
    cityIntroHtml:
      'Если гостиничные места заняты или гости приезжают на электромобиле либо гибриде (для которых въезд в некоторые гаражи запрещён), можно воспользоваться городскими и коммерческими парковками.',
    garagesHeading: 'Паркинги и охраняемые парковки',
    publicLotsHeading: 'Общественные парковки с автоматом',
    centreZoneHeading: 'Парковка в центре и курортной зоне',
    centreZonePara1Html:
      'В городе установлено более 30 парковочных автоматов. Почасовые тарифы в центре составляют примерно от 30 до 50 Kč в зависимости от зоны (самый высокий тариф — в курортном центре). Для въезда в <strong>Курортную зону</strong> требуется разрешение — гости, проживающие в зоне, освобождены от него в дни приезда и отъезда; однодневное разрешение на въезд в курортную зону можно купить в автомате за 20 Kč.',
    centreZonePara2Html:
      '<strong>Способы оплаты:</strong> автоматы принимают банковские карты и мобильное приложение <strong>ClickPark</strong>, которое следит за окончанием времени парковки. Оплата наличными (Kč и €) возможна только у некоторых автоматов нового типа, которые постепенно устанавливаются по городу. В городе также есть интерактивные табло с количеством свободных мест в отдельных локациях.',
    usefulLinksHeading: 'Полезные ссылки — парковка в городе',
    usefulLinksSubtitle:
      'Подробную и всегда актуальную информацию вы найдёте на официальном сайте города и на туристическом портале.',
  },
}

// ---------------------------------------------------------------------------
// Per-hotel parking options (cards) — per locale
// ---------------------------------------------------------------------------
type HotelOptions = { location?: string; options: ParkingOption[] }[]

const hotelOptionsByLocale: Record<Locale, HotelOptions> = {
  cs: [
    { options: [
      { name: 'Nehlídané parkoviště před hotelem', price: 'Zdarma', note: 'Omezený počet míst' },
      { name: 'Hlídané parkoviště ve dvoře', price: '380 Kč/den · od 5 nocí 250 Kč/den', note: 'Nutná rezervace předem' },
      { name: 'Podzemní garáže v resortu', price: '380 Kč/den · od 5 nocí 250 Kč/den', note: '38 míst, nutná rezervace předem. Sdílené garáže komplexu Nové Lázně / Centrální Lázně / Hvězda, fyzicky u hotelu Hvězda. Zákaz vjezdu elektromobilů, hybridních vozidel a vozidel na LPG.' },
    ] },
    { options: [
      { name: 'Nehlídané parkoviště před hotelem', price: 'Zdarma', note: 'Omezený počet míst (4 místa + 1 pro osoby se zdravotním postižením)' },
      { name: 'Hlídané parkoviště za hotelem', price: '380 Kč/den', note: '30 míst, nutná rezervace předem' },
      { name: 'Podzemní garáže v resortu', price: '380 Kč/den · od 5 nocí 250 Kč/den', note: '38 míst, nutná rezervace předem. Sdílené garáže komplexu Nové Lázně / Centrální Lázně / Hvězda, fyzicky u hotelu Hvězda. Zákaz vjezdu elektromobilů, hybridních vozidel a vozidel na LPG.' },
    ] },
    { options: [
      { name: 'Podzemní garáže v resortu', price: '380 Kč/den · od 5 nocí 250 Kč/den', note: '38 míst, nutná rezervace předem. Sdílené garáže komplexu Nové Lázně / Centrální Lázně / Hvězda, fyzicky u hotelu Hvězda. Zákaz vjezdu elektromobilů, hybridních vozidel a vozidel na LPG.' },
    ] },
    { location: 'Poloha u parku a kolonády.', options: [
      { name: '4 místa před hotelem', note: 'Pouze pro check-in a check-out' },
      { name: 'Parkovací dům u Městského divadla', note: 'cca 5 minut chůze od hotelu', href: CITY_GARAGE },
    ] },
    { location: 'Poloha v centru města přímo u lázeňského parku.', options: [
      { name: 'Podzemní garáž', price: '380 Kč/den · od 5 nocí 250 Kč/den', note: 'Nutná rezervace předem. Vjezd pro elektromobily, hybridní vozidla a vozidla na LPG je zakázán.' },
      { name: '4 místa před hotelem', note: 'Pouze pro check-in a check-out' },
      { name: 'Parkovací dům u Městského divadla', note: 'Alternativně', href: CITY_GARAGE },
    ] },
    { location: 'Poloha u lesoparku.', options: [
      { name: 'Parkoviště před hotelem', price: '250 Kč/den', note: '5 míst, platba na recepci, nutná rezervace předem' },
      { name: 'Místa pro osoby se zdravotním postižením', note: '3 parkovací místa' },
    ] },
    { location: 'Poloha v klidné části lesoparku nedaleko kolonády.', options: [
      { name: 'Parkoviště ve dvoře hotelu', price: 'do 4 nocí 250 Kč/noc · od 5 nocí 200 Kč/noc', note: 'Omezená dostupnost — 12 míst. Rezervace nutná předem na recepci hotelu, kde parkování také zaplatíte.' },
      { name: 'Před hotelem v Chopinově ulici', note: 'Veřejné placené stání s parkovacím automatem' },
      { name: 'Parkovací dům u Městského divadla', note: 'ul. Pramenská, cca 200 m od hotelu', href: CITY_GARAGE },
    ] },
  ],
  de: [
    { options: [
      { name: 'Unbewachter Parkplatz vor dem Hotel', price: 'Kostenlos', note: 'Begrenzte Anzahl an Plätzen' },
      { name: 'Bewachter Parkplatz im Innenhof', price: '380 CZK/Tag · ab 5 Nächten 250 CZK/Tag', note: 'Reservierung im Voraus erforderlich' },
      { name: 'Tiefgarage im Resort', price: '380 CZK/Tag · ab 5 Nächten 250 CZK/Tag', note: '38 Plätze, Reservierung im Voraus erforderlich. Gemeinschaftsgarage des Komplexes Nové Lázně / Centrální Lázně / Hvězda, physisch beim Hotel Hvězda. Einfahrt von Elektro-, Hybrid- und LPG-Fahrzeugen untersagt.' },
    ] },
    { options: [
      { name: 'Unbewachter Parkplatz vor dem Hotel', price: 'Kostenlos', note: 'Begrenzte Anzahl an Plätzen (4 Plätze + 1 für Menschen mit Behinderung)' },
      { name: 'Bewachter Parkplatz hinter dem Hotel', price: '380 CZK/Tag', note: '30 Plätze, Reservierung im Voraus erforderlich' },
      { name: 'Tiefgarage im Resort', price: '380 CZK/Tag · ab 5 Nächten 250 CZK/Tag', note: '38 Plätze, Reservierung im Voraus erforderlich. Gemeinschaftsgarage des Komplexes Nové Lázně / Centrální Lázně / Hvězda, physisch beim Hotel Hvězda. Einfahrt von Elektro-, Hybrid- und LPG-Fahrzeugen untersagt.' },
    ] },
    { options: [
      { name: 'Tiefgarage im Resort', price: '380 CZK/Tag · ab 5 Nächten 250 CZK/Tag', note: '38 Plätze, Reservierung im Voraus erforderlich. Gemeinschaftsgarage des Komplexes Nové Lázně / Centrální Lázně / Hvězda, physisch beim Hotel Hvězda. Einfahrt von Elektro-, Hybrid- und LPG-Fahrzeugen untersagt.' },
    ] },
    { location: 'Lage am Park und an der Kolonnade.', options: [
      { name: '4 Plätze vor dem Hotel', note: 'Nur für Check-in und Check-out' },
      { name: 'Parkhaus am Stadttheater', note: 'ca. 5 Gehminuten vom Hotel', href: CITY_GARAGE },
    ] },
    { location: 'Lage im Stadtzentrum direkt am Kurpark.', options: [
      { name: 'Tiefgarage', price: '380 CZK/Tag · ab 5 Nächten 250 CZK/Tag', note: 'Reservierung im Voraus erforderlich. Einfahrt von Elektro-, Hybrid- und LPG-Fahrzeugen untersagt.' },
      { name: '4 Plätze vor dem Hotel', note: 'Nur für Check-in und Check-out' },
      { name: 'Parkhaus am Stadttheater', note: 'Alternativ', href: CITY_GARAGE },
    ] },
    { location: 'Lage am Waldpark.', options: [
      { name: 'Parkplatz vor dem Hotel', price: '250 CZK/Tag', note: '5 Plätze, Zahlung an der Rezeption, Reservierung im Voraus erforderlich' },
      { name: 'Plätze für Menschen mit Behinderung', note: '3 Parkplätze' },
    ] },
    { location: 'Lage in einem ruhigen Teil des Waldparks nahe der Kolonnade.', options: [
      { name: 'Parkplatz im Innenhof des Hotels', price: 'bis 4 Nächte 250 CZK/Nacht · ab 5 Nächten 200 CZK/Nacht', note: 'Begrenzte Verfügbarkeit — 12 Plätze. Reservierung im Voraus an der Hotelrezeption erforderlich, dort erfolgt auch die Zahlung.' },
      { name: 'Vor dem Hotel in der Chopin-Straße', note: 'Öffentliches gebührenpflichtiges Parken mit Parkautomat' },
      { name: 'Parkhaus am Stadttheater', note: 'Pramenská-Straße, ca. 200 m vom Hotel', href: CITY_GARAGE },
    ] },
  ],
  en: [
    { options: [
      { name: 'Unguarded car park in front of the hotel', price: 'Free', note: 'Limited number of spaces' },
      { name: 'Guarded car park in the courtyard', price: '380 CZK/day · 250 CZK/day from 5 nights', note: 'Advance reservation required' },
      { name: 'Underground garages in the resort', price: '380 CZK/day · 250 CZK/day from 5 nights', note: '38 spaces, advance reservation required. Shared garage for the Nové Lázně / Centrální Lázně / Hvězda complex, physically at the Hvězda hotel. Electric, hybrid and LPG vehicles are not permitted.' },
    ] },
    { options: [
      { name: 'Unguarded car park in front of the hotel', price: 'Free', note: 'Limited number of spaces (4 spaces + 1 for people with disabilities)' },
      { name: 'Guarded car park behind the hotel', price: '380 CZK/day', note: '30 spaces, advance reservation required' },
      { name: 'Underground garages in the resort', price: '380 CZK/day · 250 CZK/day from 5 nights', note: '38 spaces, advance reservation required. Shared garage for the Nové Lázně / Centrální Lázně / Hvězda complex, physically at the Hvězda hotel. Electric, hybrid and LPG vehicles are not permitted.' },
    ] },
    { options: [
      { name: 'Underground garages in the resort', price: '380 CZK/day · 250 CZK/day from 5 nights', note: '38 spaces, advance reservation required. Shared garage for the Nové Lázně / Centrální Lázně / Hvězda complex, physically at the Hvězda hotel. Electric, hybrid and LPG vehicles are not permitted.' },
    ] },
    { location: 'Located by the park and the colonnade.', options: [
      { name: '4 spaces in front of the hotel', note: 'For check-in and check-out only' },
      { name: 'Parking house by the Municipal Theatre', note: 'about 5 minutes’ walk from the hotel', href: CITY_GARAGE },
    ] },
    { location: 'Located in the town centre right by the spa park.', options: [
      { name: 'Underground garage', price: '380 CZK/day · 250 CZK/day from 5 nights', note: 'Advance reservation required. Electric, hybrid and LPG vehicles are not permitted.' },
      { name: '4 spaces in front of the hotel', note: 'For check-in and check-out only' },
      { name: 'Parking house by the Municipal Theatre', note: 'Alternatively', href: CITY_GARAGE },
    ] },
    { location: 'Located by the forest park.', options: [
      { name: 'Car park in front of the hotel', price: '250 CZK/day', note: '5 spaces, payment at reception, advance reservation required' },
      { name: 'Spaces for people with disabilities', note: '3 parking spaces' },
    ] },
    { location: 'Located in a quiet part of the forest park near the colonnade.', options: [
      { name: 'Car park in the hotel courtyard', price: '250 CZK/night up to 4 nights · 200 CZK/night from 5 nights', note: 'Limited availability — 12 spaces. Advance reservation required at the hotel reception, where you also pay.' },
      { name: 'In front of the hotel on Chopin Street', note: 'Public paid parking with a ticket machine' },
      { name: 'Parking house by the Municipal Theatre', note: 'Pramenská Street, about 200 m from the hotel', href: CITY_GARAGE },
    ] },
  ],
  ru: [
    { options: [
      { name: 'Неохраняемая парковка перед отелем', price: 'Бесплатно', note: 'Ограниченное количество мест' },
      { name: 'Охраняемая парковка во дворе', price: '380 Kč/день · от 5 ночей 250 Kč/день', note: 'Необходимо бронирование заранее' },
      { name: 'Подземный гараж в резорте', price: '380 Kč/день · от 5 ночей 250 Kč/день', note: '38 мест, необходимо бронирование заранее. Общий гараж комплекса Nové Lázně / Centrální Lázně / Hvězda, физически у отеля Hvězda. Въезд электромобилей, гибридов и автомобилей на LPG запрещён.' },
    ] },
    { options: [
      { name: 'Неохраняемая парковка перед отелем', price: 'Бесплатно', note: 'Ограниченное количество мест (4 места + 1 для людей с инвалидностью)' },
      { name: 'Охраняемая парковка за отелем', price: '380 Kč/день', note: '30 мест, необходимо бронирование заранее' },
      { name: 'Подземный гараж в резорте', price: '380 Kč/день · от 5 ночей 250 Kč/день', note: '38 мест, необходимо бронирование заранее. Общий гараж комплекса Nové Lázně / Centrální Lázně / Hvězda, физически у отеля Hvězda. Въезд электромобилей, гибридов и автомобилей на LPG запрещён.' },
    ] },
    { options: [
      { name: 'Подземный гараж в резорте', price: '380 Kč/день · от 5 ночей 250 Kč/день', note: '38 мест, необходимо бронирование заранее. Общий гараж комплекса Nové Lázně / Centrální Lázně / Hvězda, физически у отеля Hvězda. Въезд электромобилей, гибридов и автомобилей на LPG запрещён.' },
    ] },
    { location: 'Расположение у парка и колоннады.', options: [
      { name: '4 места перед отелем', note: 'Только для заезда и выезда' },
      { name: 'Паркинг у Городского театра', note: 'около 5 минут пешком от отеля', href: CITY_GARAGE },
    ] },
    { location: 'Расположение в центре города прямо у курортного парка.', options: [
      { name: 'Подземный гараж', price: '380 Kč/день · от 5 ночей 250 Kč/день', note: 'Необходимо бронирование заранее. Въезд электромобилей, гибридов и автомобилей на LPG запрещён.' },
      { name: '4 места перед отелем', note: 'Только для заезда и выезда' },
      { name: 'Паркинг у Городского театра', note: 'Как альтернатива', href: CITY_GARAGE },
    ] },
    { location: 'Расположение у лесопарка.', options: [
      { name: 'Парковка перед отелем', price: '250 Kč/день', note: '5 мест, оплата на ресепшене, необходимо бронирование заранее' },
      { name: 'Места для людей с инвалидностью', note: '3 парковочных места' },
    ] },
    { location: 'Расположение в тихой части лесопарка недалеко от колоннады.', options: [
      { name: 'Парковка во дворе отеля', price: 'до 4 ночей 250 Kč/ночь · от 5 ночей 200 Kč/ночь', note: 'Ограниченная доступность — 12 мест. Бронирование обязательно заранее на ресепшене отеля, там же производится оплата.' },
      { name: 'Перед отелем на улице Шопена', note: 'Общественная платная стоянка с паркоматом' },
      { name: 'Паркинг у Городского театра', note: 'ул. Pramenská, около 200 м от отеля', href: CITY_GARAGE },
    ] },
  ],
}

export function getHotels(locale: Locale): ParkingHotel[] {
  return HOTEL_META.map((meta, i) => ({
    name: meta.name,
    image: meta.image,
    contact: meta.contact,
    location: hotelOptionsByLocale[locale][i].location,
    options: hotelOptionsByLocale[locale][i].options,
  }))
}

// ---------------------------------------------------------------------------
// Overview table (condensed) — per locale
// ---------------------------------------------------------------------------
type TableRowsByHotel = TableRow[][]

const tableRowsByLocale: Record<Locale, TableRowsByHotel> = {
  cs: [
    [
      { option: 'Nehlídané parkoviště před hotelem', price: 'Zdarma', note: 'Omezený počet míst' },
      { option: 'Hlídané parkoviště ve dvoře', price: '380 Kč/den, od 5 nocí 250 Kč/den', note: 'Nutná rezervace' },
      { option: 'Podzemní garáže v resortu', price: '380 Kč/den, od 5 nocí 250 Kč/den', note: '38 míst, sdílené garáže u hotelu Hvězda; nutná rezervace; zákaz vjezdu elektro, hybridů a LPG' },
    ],
    [
      { option: 'Nehlídané parkoviště před hotelem', price: 'Zdarma', note: 'Omezený počet míst (4 + 1 pro invalidy)' },
      { option: 'Hlídané parkoviště za hotelem', price: '380 Kč/den', note: '30 míst, nutná rezervace' },
      { option: 'Podzemní garáže v resortu', price: '380 Kč/den, od 5 nocí 250 Kč/den', note: '38 míst, sdílené garáže u hotelu Hvězda; nutná rezervace; zákaz vjezdu elektro, hybridů a LPG' },
    ],
    [
      { option: 'Podzemní garáže v resortu', price: '380 Kč/den, od 5 nocí 250 Kč/den', note: '38 míst, sdílené garáže u hotelu Hvězda; nutná rezervace; zákaz vjezdu elektro, hybridů a LPG' },
    ],
    [
      { option: '4 místa před hotelem', price: '–', note: 'Pouze pro check-in a check-out' },
      { option: 'Parkovací dům u Městského divadla', price: 'dle ceníku města', note: 'cca 5 min chůze od hotelu', href: CITY_GARAGE },
    ],
    [
      { option: 'Podzemní garáž', price: '380 Kč/den, od 5 nocí 250 Kč/den', note: 'Nutná rezervace; zákaz vjezdu elektro, hybridů a LPG' },
      { option: '4 místa před hotelem', price: '–', note: 'Pouze pro check-in a check-out' },
      { option: 'Parkovací dům u Městského divadla', price: 'dle ceníku města', note: 'Alternativně', href: CITY_GARAGE },
    ],
    [
      { option: 'Parkoviště před hotelem', price: '250 Kč/den', note: '5 míst, platba na recepci, nutná rezervace' },
      { option: 'Místa pro osoby se zdravotním postižením', price: '–', note: '3 místa' },
    ],
    [
      { option: 'Parkoviště ve dvoře hotelu', price: 'do 4 nocí 250 Kč/noc, od 5 nocí 200 Kč/noc', note: '12 míst, omezená dostupnost; rezervace předem na recepci' },
      { option: 'Před hotelem v Chopinově ulici', price: 'dle parkovacího automatu', note: 'Veřejné, parkovací automat' },
      { option: 'Parkovací dům u Městského divadla', price: 'dle ceníku města', note: 'ul. Pramenská, cca 200 m od hotelu', href: CITY_GARAGE },
    ],
  ],
  de: [
    [
      { option: 'Unbewachter Parkplatz vor dem Hotel', price: 'Kostenlos', note: 'Begrenzte Platzzahl' },
      { option: 'Bewachter Parkplatz im Innenhof', price: '380 CZK/Tag, ab 5 Nächten 250 CZK/Tag', note: 'Reservierung erforderlich' },
      { option: 'Tiefgarage im Resort', price: '380 CZK/Tag, ab 5 Nächten 250 CZK/Tag', note: '38 Plätze, gemeinsame Garage beim Hotel Hvězda; Reservierung erforderlich; keine Elektro-, Hybrid- und LPG-Fahrzeuge' },
    ],
    [
      { option: 'Unbewachter Parkplatz vor dem Hotel', price: 'Kostenlos', note: 'Begrenzte Platzzahl (4 + 1 für Behinderte)' },
      { option: 'Bewachter Parkplatz hinter dem Hotel', price: '380 CZK/Tag', note: '30 Plätze, Reservierung erforderlich' },
      { option: 'Tiefgarage im Resort', price: '380 CZK/Tag, ab 5 Nächten 250 CZK/Tag', note: '38 Plätze, gemeinsame Garage beim Hotel Hvězda; Reservierung erforderlich; keine Elektro-, Hybrid- und LPG-Fahrzeuge' },
    ],
    [
      { option: 'Tiefgarage im Resort', price: '380 CZK/Tag, ab 5 Nächten 250 CZK/Tag', note: '38 Plätze, gemeinsame Garage beim Hotel Hvězda; Reservierung erforderlich; keine Elektro-, Hybrid- und LPG-Fahrzeuge' },
    ],
    [
      { option: '4 Plätze vor dem Hotel', price: '–', note: 'Nur für Check-in und Check-out' },
      { option: 'Parkhaus am Stadttheater', price: 'nach städtischem Tarif', note: 'ca. 5 Gehminuten vom Hotel', href: CITY_GARAGE },
    ],
    [
      { option: 'Tiefgarage', price: '380 CZK/Tag, ab 5 Nächten 250 CZK/Tag', note: 'Reservierung erforderlich; keine Elektro-, Hybrid- und LPG-Fahrzeuge' },
      { option: '4 Plätze vor dem Hotel', price: '–', note: 'Nur für Check-in und Check-out' },
      { option: 'Parkhaus am Stadttheater', price: 'nach städtischem Tarif', note: 'Alternativ', href: CITY_GARAGE },
    ],
    [
      { option: 'Parkplatz vor dem Hotel', price: '250 CZK/Tag', note: '5 Plätze, Zahlung an der Rezeption, Reservierung erforderlich' },
      { option: 'Plätze für Menschen mit Behinderung', price: '–', note: '3 Plätze' },
    ],
    [
      { option: 'Parkplatz im Innenhof des Hotels', price: 'bis 4 Nächte 250 CZK/Nacht, ab 5 Nächten 200 CZK/Nacht', note: '12 Plätze, begrenzte Verfügbarkeit; Reservierung im Voraus an der Rezeption' },
      { option: 'Vor dem Hotel in der Chopin-Straße', price: 'laut Parkautomat', note: 'Öffentlich, Parkautomat' },
      { option: 'Parkhaus am Stadttheater', price: 'nach städtischem Tarif', note: 'Pramenská-Straße, ca. 200 m vom Hotel', href: CITY_GARAGE },
    ],
  ],
  en: [
    [
      { option: 'Unguarded car park in front of the hotel', price: 'Free', note: 'Limited number of spaces' },
      { option: 'Guarded car park in the courtyard', price: '380 CZK/day, 250 CZK/day from 5 nights', note: 'Reservation required' },
      { option: 'Underground garages in the resort', price: '380 CZK/day, 250 CZK/day from 5 nights', note: '38 spaces, shared garage at the Hvězda hotel; reservation required; no electric, hybrid or LPG vehicles' },
    ],
    [
      { option: 'Unguarded car park in front of the hotel', price: 'Free', note: 'Limited number of spaces (4 + 1 accessible)' },
      { option: 'Guarded car park behind the hotel', price: '380 CZK/day', note: '30 spaces, reservation required' },
      { option: 'Underground garages in the resort', price: '380 CZK/day, 250 CZK/day from 5 nights', note: '38 spaces, shared garage at the Hvězda hotel; reservation required; no electric, hybrid or LPG vehicles' },
    ],
    [
      { option: 'Underground garages in the resort', price: '380 CZK/day, 250 CZK/day from 5 nights', note: '38 spaces, shared garage at the Hvězda hotel; reservation required; no electric, hybrid or LPG vehicles' },
    ],
    [
      { option: '4 spaces in front of the hotel', price: '–', note: 'For check-in and check-out only' },
      { option: 'Parking house by the Municipal Theatre', price: 'per city tariff', note: 'about 5 minutes’ walk from the hotel', href: CITY_GARAGE },
    ],
    [
      { option: 'Underground garage', price: '380 CZK/day, 250 CZK/day from 5 nights', note: 'Reservation required; no electric, hybrid or LPG vehicles' },
      { option: '4 spaces in front of the hotel', price: '–', note: 'For check-in and check-out only' },
      { option: 'Parking house by the Municipal Theatre', price: 'per city tariff', note: 'Alternatively', href: CITY_GARAGE },
    ],
    [
      { option: 'Car park in front of the hotel', price: '250 CZK/day', note: '5 spaces, payment at reception, reservation required' },
      { option: 'Spaces for people with disabilities', price: '–', note: '3 spaces' },
    ],
    [
      { option: 'Car park in the hotel courtyard', price: '250 CZK/night up to 4 nights, 200 CZK/night from 5 nights', note: '12 spaces, limited availability; advance reservation at reception' },
      { option: 'In front of the hotel on Chopin Street', price: 'per parking meter', note: 'Public, parking meter' },
      { option: 'Parking house by the Municipal Theatre', price: 'per city tariff', note: 'Pramenská Street, about 200 m from the hotel', href: CITY_GARAGE },
    ],
  ],
  ru: [
    [
      { option: 'Неохраняемая парковка перед отелем', price: 'Бесплатно', note: 'Ограниченное число мест' },
      { option: 'Охраняемая парковка во дворе', price: '380 Kč/день, от 5 ночей 250 Kč/день', note: 'Необходимо бронирование' },
      { option: 'Подземный гараж в резорте', price: '380 Kč/день, от 5 ночей 250 Kč/день', note: '38 мест, общий гараж у отеля Hvězda; бронирование; без электро, гибридов и LPG' },
    ],
    [
      { option: 'Неохраняемая парковка перед отелем', price: 'Бесплатно', note: 'Ограниченное число мест (4 + 1 для инвалидов)' },
      { option: 'Охраняемая парковка за отелем', price: '380 Kč/день', note: '30 мест, необходимо бронирование' },
      { option: 'Подземный гараж в резорте', price: '380 Kč/день, от 5 ночей 250 Kč/день', note: '38 мест, общий гараж у отеля Hvězda; бронирование; без электро, гибридов и LPG' },
    ],
    [
      { option: 'Подземный гараж в резорте', price: '380 Kč/день, от 5 ночей 250 Kč/день', note: '38 мест, общий гараж у отеля Hvězda; бронирование; без электро, гибридов и LPG' },
    ],
    [
      { option: '4 места перед отелем', price: '–', note: 'Только для заезда и выезда' },
      { option: 'Паркинг у Городского театра', price: 'по городскому тарифу', note: 'около 5 мин пешком от отеля', href: CITY_GARAGE },
    ],
    [
      { option: 'Подземный гараж', price: '380 Kč/день, от 5 ночей 250 Kč/день', note: 'Бронирование; без электро, гибридов и LPG' },
      { option: '4 места перед отелем', price: '–', note: 'Только для заезда и выезда' },
      { option: 'Паркинг у Городского театра', price: 'по городскому тарифу', note: 'Как альтернатива', href: CITY_GARAGE },
    ],
    [
      { option: 'Парковка перед отелем', price: '250 Kč/день', note: '5 мест, оплата на ресепшене, необходимо бронирование' },
      { option: 'Места для людей с инвалидностью', price: '–', note: '3 места' },
    ],
    [
      { option: 'Парковка во дворе отеля', price: 'до 4 ночей 250 Kč/ночь, от 5 ночей 200 Kč/ночь', note: '12 мест, ограниченная доступность; бронирование заранее на ресепшене' },
      { option: 'Перед отелем на улице Шопена', price: 'по паркомату', note: 'Общественная, паркомат' },
      { option: 'Паркинг у Городского театра', price: 'по городскому тарифу', note: 'ул. Pramenská, около 200 м от отеля', href: CITY_GARAGE },
    ],
  ],
}

export function getTableGroups(locale: Locale): TableGroup[] {
  return HOTEL_META.map((meta, i) => ({
    hotel: meta.name,
    contact: meta.contact,
    rows: tableRowsByLocale[locale][i],
  }))
}

// ---------------------------------------------------------------------------
// City parking blocks (garages + public lots) — per locale
// ---------------------------------------------------------------------------
export const garages: Record<Locale, CityPlace[]> = {
  cs: [
    { name: 'Parking Centrum — parkovací dům', text: 'Pramenská 653/2 (severní část města za Městským divadlem). Kryté hlídané parkoviště s kamerovým dohledem, non-stop provoz (obsluha 7–16 h), kapacita 290 míst. Cena: prvních 20 minut zdarma, 20 Kč/hod, 240 Kč/den. Jízdní kolo 20 Kč/den. Toto je „Parkovací dům u Městského divadla" zmiňovaný u hotelů Pacifik, Butterfly a Svoboda.' },
    { name: 'Parking Centrum — Centrální parkoviště', text: 'Kollárova 94/26. Hlídané, nekryté, s parkovacím automatem, non-stop, kapacita 400 míst. Cena: 10 Kč/hod (0,50 €), 50 Kč/den (2 €).' },
  ],
  de: [
    { name: 'Parking Centrum — Parkhaus', text: 'Pramenská 653/2 (nördlicher Stadtteil hinter dem Stadttheater). Überdachtes, bewachtes Parkhaus mit Videoüberwachung, rund um die Uhr geöffnet (Personal 7–16 Uhr), Kapazität 290 Plätze. Preis: die ersten 20 Minuten kostenlos, 20 CZK/Std., 240 CZK/Tag. Fahrrad 20 CZK/Tag. Dies ist das bei den Hotels Pacifik, Butterfly und Svoboda genannte „Parkhaus am Stadttheater".' },
    { name: 'Parking Centrum — Zentralparkplatz', text: 'Kollárova 94/26. Bewacht, unüberdacht, mit Parkautomat, rund um die Uhr, Kapazität 400 Plätze. Preis: 10 CZK/Std. (0,50 €), 50 CZK/Tag (2 €).' },
  ],
  en: [
    { name: 'Parking Centrum — parking house', text: 'Pramenská 653/2 (northern part of town behind the Municipal Theatre). Covered, guarded car park with CCTV, open around the clock (staffed 7 am–4 pm), capacity 290 spaces. Price: first 20 minutes free, 20 CZK/hour, 240 CZK/day. Bicycle 20 CZK/day. This is the “parking house by the Municipal Theatre” mentioned for the Pacifik, Butterfly and Svoboda hotels.' },
    { name: 'Parking Centrum — Central car park', text: 'Kollárova 94/26. Guarded, uncovered, with a ticket machine, open around the clock, capacity 400 spaces. Price: 10 CZK/hour (€0.50), 50 CZK/day (€2).' },
  ],
  ru: [
    { name: 'Parking Centrum — паркинг', text: 'Pramenská 653/2 (северная часть города за Городским театром). Крытая охраняемая парковка с видеонаблюдением, круглосуточно (персонал 7–16 ч), вместимость 290 мест. Цена: первые 20 минут бесплатно, 20 Kč/час, 240 Kč/день. Велосипед 20 Kč/день. Это тот самый «Паркинг у Городского театра», упоминаемый у отелей Pacifik, Butterfly и Svoboda.' },
    { name: 'Parking Centrum — Центральная парковка', text: 'Kollárova 94/26. Охраняемая, открытая, с паркоматом, круглосуточно, вместимость 400 мест. Цена: 10 Kč/час (0,50 €), 50 Kč/день (2 €).' },
  ],
}

export const publicLots: Record<Locale, CityPlace[]> = {
  cs: [
    { name: 'Parkoviště u hotelu Koliba', text: 'Dusíkova ulice, 30 míst, nehlídané, 9:00–22:00. Cena cca 10 Kč/hod, 40 Kč/celý den.' },
    { name: 'Parkoviště u hotelu Krakonoš', text: 'Mariánské Lázně 660, 50 míst, nehlídané, 9:00–22:00. Cena od 10 Kč/hod, 50 Kč za delší stání.' },
    { name: 'Parkoviště u Oděvy', text: 'ul. Boženy Němcové, nehlídané, non-stop. Cena 10 Kč/30 min, 30 Kč/hod.' },
  ],
  de: [
    { name: 'Parkplatz am Hotel Koliba', text: 'Dusíkova-Straße, 30 Plätze, unbewacht, 9:00–22:00 Uhr. Preis ca. 10 CZK/Std., 40 CZK/ganzer Tag.' },
    { name: 'Parkplatz am Hotel Krakonoš', text: 'Mariánské Lázně 660, 50 Plätze, unbewacht, 9:00–22:00 Uhr. Preis ab 10 CZK/Std., 50 CZK für längeres Parken.' },
    { name: 'Parkplatz bei Oděvy', text: 'Boženy-Němcové-Straße, unbewacht, rund um die Uhr. Preis 10 CZK/30 Min., 30 CZK/Std.' },
  ],
  en: [
    { name: 'Car park by the Koliba hotel', text: 'Dusíkova Street, 30 spaces, unguarded, 9 am–10 pm. Price about 10 CZK/hour, 40 CZK for the whole day.' },
    { name: 'Car park by the Krakonoš hotel', text: 'Mariánské Lázně 660, 50 spaces, unguarded, 9 am–10 pm. Price from 10 CZK/hour, 50 CZK for longer stays.' },
    { name: 'Car park by Oděvy', text: 'Boženy Němcové Street, unguarded, around the clock. Price 10 CZK/30 min, 30 CZK/hour.' },
  ],
  ru: [
    { name: 'Парковка у отеля Koliba', text: 'улица Dusíkova, 30 мест, неохраняемая, 9:00–22:00. Цена около 10 Kč/час, 40 Kč за целый день.' },
    { name: 'Парковка у отеля Krakonoš', text: 'Mariánské Lázně 660, 50 мест, неохраняемая, 9:00–22:00. Цена от 10 Kč/час, 50 Kč за длительную стоянку.' },
    { name: 'Парковка у Oděvy', text: 'улица Boženy Němcové, неохраняемая, круглосуточно. Цена 10 Kč/30 мин, 30 Kč/час.' },
  ],
}

// ---------------------------------------------------------------------------
// Useful official links — per locale
// ---------------------------------------------------------------------------
export const cityLinks: Record<Locale, CityLink[]> = {
  cs: [
    { label: 'Doprava a parkování — přehled parkovišť', desc: 'Oficiální stránky města: hlídaná, nehlídaná a autobusová parkoviště.', href: 'https://www.muml.cz/mesto/doprava-a-parkovani/parkoviste/' },
    { label: 'Parkování v centru', desc: 'Ceník, doba zpoplatnění a parkovací automaty v centru města.', href: 'https://www.muml.cz/mesto/doprava-a-parkovani/parkovani-v-centru/' },
    { label: 'Vjezd do lázeňské zóny', desc: 'Podmínky vjezdu a jednodenní / týdenní povolení do lázeňské zóny.', href: 'https://www.muml.cz/mesto/doprava-a-parkovani/vjezd-do-lazenske-zony/' },
    { label: 'Parkování — turistický portál Mariánské Lázně', desc: 'Souhrn možností parkování pro návštěvníky města.', href: 'https://www.marianskelazne.cz/kudy-k-nam/parkovani/' },
  ],
  de: [
    { label: 'Verkehr und Parken — Übersicht der Parkplätze', desc: 'Offizielle Seite der Stadt: bewachte, unbewachte und Busparkplätze.', href: 'https://www.muml.cz/mesto/doprava-a-parkovani/parkoviste/' },
    { label: 'Parken im Zentrum', desc: 'Tarife, Gebührenzeiten und Parkautomaten im Stadtzentrum.', href: 'https://www.muml.cz/mesto/doprava-a-parkovani/parkovani-v-centru/' },
    { label: 'Einfahrt in die Kurzone', desc: 'Einfahrtsbedingungen und Tages- / Wochengenehmigung für die Kurzone.', href: 'https://www.muml.cz/mesto/doprava-a-parkovani/vjezd-do-lazenske-zony/' },
    { label: 'Parken — Tourismusportal Marienbad', desc: 'Zusammenfassung der Parkmöglichkeiten für Besucher der Stadt.', href: 'https://www.marianskelazne.cz/kudy-k-nam/parkovani/' },
  ],
  en: [
    { label: 'Transport and parking — overview of car parks', desc: 'Official city page: guarded, unguarded and coach parking.', href: 'https://www.muml.cz/mesto/doprava-a-parkovani/parkoviste/' },
    { label: 'Parking in the centre', desc: 'Tariffs, charging hours and parking meters in the town centre.', href: 'https://www.muml.cz/mesto/doprava-a-parkovani/parkovani-v-centru/' },
    { label: 'Entry to the spa zone', desc: 'Entry conditions and one-day / weekly permits for the spa zone.', href: 'https://www.muml.cz/mesto/doprava-a-parkovani/vjezd-do-lazenske-zony/' },
    { label: 'Parking — Mariánské Lázně tourism portal', desc: 'A summary of parking options for visitors to the town.', href: 'https://www.marianskelazne.cz/kudy-k-nam/parkovani/' },
  ],
  ru: [
    { label: 'Транспорт и парковка — обзор парковок', desc: 'Официальный сайт города: охраняемые, неохраняемые и автобусные парковки.', href: 'https://www.muml.cz/mesto/doprava-a-parkovani/parkoviste/' },
    { label: 'Парковка в центре', desc: 'Тарифы, время платности и паркоматы в центре города.', href: 'https://www.muml.cz/mesto/doprava-a-parkovani/parkovani-v-centru/' },
    { label: 'Въезд в курортную зону', desc: 'Условия въезда и однодневное / недельное разрешение в курортную зону.', href: 'https://www.muml.cz/mesto/doprava-a-parkovani/vjezd-do-lazenske-zony/' },
    { label: 'Парковка — туристический портал Марианске Лазне', desc: 'Сводка возможностей парковки для гостей города.', href: 'https://www.marianskelazne.cz/kudy-k-nam/parkovani/' },
  ],
}
