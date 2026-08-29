/**
 * Faktická data hotelů Ensana Mariánské Lázně pro hotelové podstránky.
 *
 * Zdroj: EN pasporty 2026 (`MARIENBAD_MARKETING/passport`), stav srpen 2026.
 * Data jsou schválně jazykově neutrální — čísla, vlastní jména a enum klíče;
 * překlady jsou v `hotelUi.ts`. Kategorie pokojů se nechávají v podobě, v jaké
 * je používá rezervační systém (DBL Superior de luxe apod.).
 */

export type Amenity =
  | 'bath'
  | 'shower'
  | 'bidet'
  | 'tv'
  | 'phone'
  | 'usb'
  | 'fridge'
  | 'minibar'
  | 'coffee'
  | 'safe'
  | 'hairdryer'
  | 'bathrobe'
  | 'slippers'
  | 'umbrella'
  | 'aircon'
  | 'ironing'
  | 'balcony'
  | 'terrace'
  | 'kitchenette'
  | 'livingroom'
  | 'seating'
  | 'jacuzzi'
  | 'vinyl'
  | 'view'

export type FacilityKind =
  | 'pool'
  | 'whirlpool'
  | 'sauna'
  | 'steam'
  | 'tepidarium'
  | 'plunge'
  | 'salt-cave'
  | 'fitness'
  | 'gym'
  | 'roman-bath'
  | 'beauty'
  | 'hairdresser'
  | 'aesthetic'

export type DiningKind = 'restaurant' | 'cafe' | 'bar' | 'lounge'

export type Indication =
  | 'locomotor'
  | 'kidney'
  | 'respiratory'
  | 'circulatory'
  | 'digestive'
  | 'metabolic'
  | 'oncological'
  | 'neurological'
  | 'thyroid'
  | 'dermatological'
  | 'gynaecological'

export type SpringKey = 'forest' | 'ambrose' | 'maria' | 'balbin' | 'josef' | 'ferdinand'

export type ParkingKind = 'free-street' | 'secured' | 'garage' | 'parking-house' | 'courtyard'

export interface RoomType {
  /** Název kategorie tak, jak ji zná rezervační systém. */
  name: string
  /** Počet pokojů v kategorii. */
  count?: number
  /** Výměra, např. „18 m²" nebo „32–40 m²". */
  size?: string
  amenities: Amenity[]
}

export interface Facility {
  kind: FacilityKind
  /** Rozměry, teploty, počty — jazykově neutrální doplněk. */
  detail?: string
  hours?: string
  /** Zařízení je v jiném hotelu komplexu, přístupné spojovací chodbou. */
  inHotel?: string
}

export interface Dining {
  kind: DiningKind
  name: string
  seats?: number
  hours?: string
}

export interface MeetingRoom {
  name: string
  area?: string
  capacity?: number
}

export interface Parking {
  kind: ParkingKind
  spaces?: number
  priceCzk?: number
  /** Cena za den při pobytu od 5 nocí. */
  priceCzkLongStay?: number
}

export interface HotelDetails {
  rooms: number
  beds: number
  /** Budovy resortu, pokud se hotel skládá z více objektů. */
  buildings?: { name: string; rooms: number; beds?: number }[]
  roomTypes: RoomType[]
  wellness: Facility[]
  spring?: SpringKey
  /** Počet kabin pro minerální koupele. */
  mineralBaths?: number
  /** Kabiny s původní výzdobou z roku 1896. */
  historicCabins?: boolean
  indications: Indication[]
  dining: Dining[]
  meetings?: MeetingRoom[]
  parking: Parking[]
  petsAllowed: boolean
  petFeeCzk?: number
  checkIn: string
  checkOut: string
  email?: string
  phone?: string
  reservationPhone?: string
}

const STANDARD: Amenity[] = ['tv', 'phone', 'fridge', 'safe', 'hairdryer', 'bathrobe', 'slippers']

export const hotelDetails: Record<string, HotelDetails> = {
  'nove-lazne': {
    rooms: 97,
    beds: 191,
    roomTypes: [
      {
        name: 'Apartment Royal',
        count: 1,
        size: '80 m²',
        amenities: ['jacuzzi', 'shower', 'bidet', 'livingroom', 'kitchenette', 'balcony', 'aircon', 'view', 'minibar', 'coffee', ...STANDARD],
      },
      {
        name: 'Suite',
        count: 9,
        size: '32–40 m²',
        amenities: ['bath', 'shower', 'bidet', 'livingroom', 'aircon', 'minibar', 'coffee', 'umbrella', ...STANDARD],
      },
      {
        name: 'Junior Suite de luxe with park view',
        count: 13,
        size: '22–25 m²',
        amenities: ['bath', 'shower', 'bidet', 'view', 'aircon', 'minibar', 'coffee', 'umbrella', ...STANDARD],
      },
      {
        name: 'Junior Suite de luxe',
        count: 26,
        size: '22 m²',
        amenities: ['bath', 'shower', 'bidet', 'aircon', 'minibar', 'coffee', 'umbrella', ...STANDARD],
      },
      {
        name: 'DBL Superior de luxe',
        count: 45,
        size: '18 m²',
        amenities: ['shower', 'bidet', 'aircon', 'minibar', 'coffee', 'umbrella', ...STANDARD],
      },
      {
        name: 'SGL Superior de luxe',
        count: 3,
        size: '10–15 m²',
        amenities: ['shower', 'bidet', 'aircon', 'minibar', 'coffee', 'umbrella', ...STANDARD],
      },
    ],
    wellness: [
      // Bez podstatných jmen — `detail` se vypisuje syrově ve všech čtyřech
      // jazycích, název „Římské lázně / Roman Baths / …" dodává `kind`.
      { kind: 'roman-bath', detail: '7×4 m, 4×4 m, 6×4 m · 29–30 °C', hours: '7:00–21:00' },
      { kind: 'whirlpool' },
      { kind: 'sauna', detail: '2×' },
      { kind: 'steam' },
      { kind: 'plunge' },
      { kind: 'fitness', inHotel: 'Centrální Lázně', hours: '7:00–21:00' },
      { kind: 'beauty' },
    ],
    spring: 'forest',
    mineralBaths: 12,
    historicCabins: true,
    indications: ['locomotor', 'kidney', 'respiratory', 'circulatory', 'digestive', 'metabolic', 'oncological', 'neurological', 'thyroid', 'dermatological'],
    dining: [
      { kind: 'restaurant', name: 'Royal', hours: '7:00–10:30 · 12:00–14:00 · 17:30–20:30' },
      { kind: 'cafe', name: 'Viennese Café', hours: '10:00–18:00' },
      { kind: 'bar', name: 'Lobby bar', hours: '11:00–22:00' },
    ],
    meetings: [
      { name: 'Edward Library', area: '89 m²', capacity: 50 },
      { name: 'Conference Centre Casino', area: 'Marble · Mirror · Red' },
    ],
    parking: [
      { kind: 'free-street' },
      { kind: 'secured', priceCzk: 380, priceCzkLongStay: 250 },
      { kind: 'garage', spaces: 38, priceCzk: 380, priceCzkLongStay: 250 },
    ],
    petsAllowed: false,
    checkIn: '14:00',
    checkOut: '11:00',
    email: 'novelazne@ensanahotels.com',
    phone: '+420 354 644 111',
    reservationPhone: '+420 354 644 301',
  },

  'centralni-lazne': {
    rooms: 144,
    beds: 278,
    buildings: [
      { name: 'Centrální Lázně', rooms: 108, beds: 206 },
      { name: 'Maria Spa', rooms: 36, beds: 72 },
    ],
    roomTypes: [
      { name: 'DBL Superior', count: 39, size: '17 m²', amenities: ['shower', 'bath', ...STANDARD] },
      { name: 'DBL Superior Plus', count: 47, size: '17 m²', amenities: ['shower', 'bath', 'view', 'umbrella', ...STANDARD] },
      { name: 'SGL Superior', count: 5, size: '17 m²', amenities: ['shower', 'bath', ...STANDARD] },
      { name: 'SGL Superior Plus', count: 5, size: '17 m²', amenities: ['shower', 'bath', 'view', 'umbrella', ...STANDARD] },
      { name: 'DBL Junior Suite', count: 3, size: '30 m²', amenities: ['shower', 'bath', 'seating', 'coffee', 'view', 'umbrella', ...STANDARD] },
      { name: 'Apartment', count: 9, size: '34 m²', amenities: ['bath', 'bidet', 'livingroom', 'kitchenette', 'aircon', 'coffee', 'ironing', 'view', 'umbrella', ...STANDARD] },
      { name: 'DBL Maria Superior', count: 20, size: '33 m²', amenities: ['bath', 'shower', 'bidet', 'coffee', 'ironing', 'balcony', 'view', 'umbrella', ...STANDARD] },
      { name: 'DBL Maria Superior de luxe', count: 14, size: '35 m²', amenities: ['bath', 'shower', 'bidet', 'coffee', 'ironing', 'terrace', 'aircon', 'view', 'umbrella', ...STANDARD] },
      { name: 'DBL Maria Junior Suite de luxe', count: 2, size: '56 m²', amenities: ['bath', 'shower', 'bidet', 'seating', 'coffee', 'ironing', 'aircon', 'view', 'umbrella', ...STANDARD] },
    ],
    wellness: [
      { kind: 'fitness', detail: 'Premier Fitness Centre', hours: '7:00–21:00' },
      { kind: 'pool', detail: '18×8 m', inHotel: 'Hvězda', hours: '7:00–21:00' },
      { kind: 'sauna', inHotel: 'Hvězda' },
      { kind: 'salt-cave', inHotel: 'Hvězda' },
      { kind: 'roman-bath', inHotel: 'Nové Lázně', hours: '7:00–18:00' },
      { kind: 'beauty' },
    ],
    spring: 'ambrose',
    mineralBaths: 24,
    historicCabins: true,
    indications: ['locomotor', 'kidney', 'respiratory', 'circulatory', 'digestive', 'metabolic', 'oncological', 'neurological', 'thyroid', 'dermatological'],
    dining: [
      { kind: 'restaurant', name: 'Goethe', hours: '7:00–10:00 · 11:30–13:30 · 17:30–20:00' },
      { kind: 'bar', name: 'Lobby bar', hours: '11:00/12:00–22:00' },
    ],
    parking: [
      { kind: 'free-street', spaces: 5 },
      { kind: 'secured', spaces: 30, priceCzk: 380, priceCzkLongStay: 250 },
      { kind: 'garage', priceCzk: 380, priceCzkLongStay: 250 },
    ],
    petsAllowed: true,
    petFeeCzk: 450,
    checkIn: '14:00',
    checkOut: '11:00',
    email: 'centralnilazne@ensanahotels.com',
    phone: '+420 354 634 111',
    reservationPhone: '+420 354 635 300',
  },

  hvezda: {
    rooms: 238,
    beds: 413,
    buildings: [
      { name: 'Hvězda', rooms: 105, beds: 195 },
      { name: 'Imperial', rooms: 36, beds: 68 },
      { name: 'Imperial (Skalník)', rooms: 50, beds: 84 },
      { name: 'Neapol', rooms: 47, beds: 66 },
    ],
    roomTypes: [
      { name: 'Apartment Imperial', count: 1, size: '354 m²', amenities: ['bath', 'shower', 'bidet', 'livingroom', 'kitchenette', 'aircon', 'view', 'ironing', 'umbrella', ...STANDARD] },
      { name: 'DBL Suite de luxe', count: 1, size: '52 m²', amenities: ['bath', 'livingroom', 'coffee', 'ironing', 'umbrella', ...STANDARD] },
      { name: 'DBL Suite Plus', count: 3, size: '50 m²', amenities: ['bath', 'shower', 'livingroom', 'coffee', 'aircon', 'ironing', 'umbrella', ...STANDARD] },
      { name: 'DBL Suite', count: 4, size: '34–36 m²', amenities: ['bath', 'shower', 'coffee', 'aircon', 'ironing', 'umbrella', ...STANDARD] },
      { name: 'DBL Junior Suite', count: 14, size: '32 m²', amenities: ['bath', 'coffee', 'ironing', 'umbrella', ...STANDARD] },
      { name: 'DBL Premium', count: 64, size: '20 m²', amenities: ['shower', 'bidet', 'usb', 'coffee', 'ironing', 'vinyl', ...STANDARD] },
      { name: 'DBL Premium with view', count: 10, size: '15 m²', amenities: ['bath', 'coffee', 'ironing', 'view', 'umbrella', ...STANDARD] },
      { name: 'SGL Premium', count: 15, size: '15 m²', amenities: ['shower', 'bidet', 'usb', 'coffee', 'ironing', 'vinyl', ...STANDARD] },
      { name: 'DBL Superior Plus with view', count: 31, size: '30 m²', amenities: ['shower', 'bidet', 'ironing', 'view', ...STANDARD] },
      { name: 'DBL Superior Plus', count: 28, size: '22 m²', amenities: ['shower', 'bidet', 'ironing', ...STANDARD] },
      { name: 'SGL Superior Plus', count: 17, size: '17–24 m²', amenities: ['shower', 'bidet', 'ironing', ...STANDARD] },
      { name: 'DBL Superior (Neapol)', count: 19, size: '20 m²', amenities: ['shower', ...STANDARD] },
      { name: 'SGL Superior (Neapol)', count: 28, size: '15 m²', amenities: ['shower', ...STANDARD] },
    ],
    wellness: [
      { kind: 'pool', detail: '18×8 m · 150 m²', hours: '7:00–21:00' },
      { kind: 'whirlpool' },
      { kind: 'sauna', detail: '2×', hours: '14:00/9:00–21:00' },
      { kind: 'steam' },
      { kind: 'tepidarium' },
      { kind: 'salt-cave', hours: '12:00/9:00–20:00' },
      { kind: 'gym', detail: '59 m²' },
      { kind: 'fitness', inHotel: 'Centrální Lázně', hours: '7:00–21:00' },
      { kind: 'roman-bath', inHotel: 'Nové Lázně' },
    ],
    spring: 'balbin',
    mineralBaths: 5,
    indications: ['locomotor', 'kidney', 'respiratory', 'circulatory', 'digestive', 'metabolic', 'oncological', 'neurological', 'thyroid', 'dermatological'],
    dining: [
      { kind: 'restaurant', name: 'Franz Josef & Sissi', hours: '7:00–10:00 · 11:30–13:30 · 17:30–20:00' },
      { kind: 'cafe', name: 'Café Imperial', hours: '11:00/13:00–22:00' },
    ],
    parking: [{ kind: 'garage', spaces: 38, priceCzk: 380, priceCzkLongStay: 250 }],
    petsAllowed: true,
    petFeeCzk: 450,
    checkIn: '14:00',
    checkOut: '11:00',
    email: 'hvezda@ensanahotels.com',
    phone: '+420 354 631 111',
    reservationPhone: '+420 354 631 114',
  },

  butterfly: {
    rooms: 96,
    beds: 192,
    roomTypes: [
      { name: 'DBL Junior Suite', count: 9, size: '36,7 m²', amenities: ['bath', 'coffee', 'view', ...STANDARD] },
      { name: 'DBL Superior', count: 87, size: '19,5 m²', amenities: ['bath', ...STANDARD] },
    ],
    wellness: [
      { kind: 'pool', detail: '12×6 m', hours: '9:00/10:00–20:00/21:00' },
      { kind: 'whirlpool' },
      { kind: 'sauna' },
      { kind: 'fitness', hours: '7:00–21:00' },
    ],
    spring: 'ferdinand',
    mineralBaths: 4,
    indications: ['kidney', 'locomotor', 'respiratory', 'circulatory', 'digestive', 'metabolic', 'oncological', 'neurological', 'thyroid', 'dermatological'],
    dining: [
      { kind: 'restaurant', name: 'La Fontaine', seats: 110, hours: '18:00–20:00' },
      { kind: 'cafe', name: 'Café de Paris', seats: 96, hours: '7:00–10:30' },
      { kind: 'bar', name: 'Lobby bar', hours: '12:00–22:00' },
    ],
    meetings: [
      { name: 'Lounge Bellevue', area: '120 m²', capacity: 100 },
      { name: 'Café de Paris', area: '120 m²', capacity: 100 },
    ],
    parking: [
      { kind: 'free-street', spaces: 4 },
      { kind: 'garage', priceCzk: 380, priceCzkLongStay: 250 },
      { kind: 'parking-house' },
    ],
    petsAllowed: true,
    petFeeCzk: 450,
    checkIn: '14:00',
    checkOut: '11:00',
    email: 'butterfly@ensanahotels.com',
    phone: '+420 354 654 111',
    reservationPhone: '+420 354 654 300',
  },

  pacifik: {
    rooms: 96,
    beds: 181,
    roomTypes: [
      { name: 'Apartment', count: 2, size: '62 m²', amenities: ['bath', 'livingroom', 'kitchenette', 'balcony', 'coffee', 'view', ...STANDARD] },
      { name: 'DBL Suite', count: 7, size: '29 m²', amenities: ['bath', 'livingroom', 'coffee', ...STANDARD] },
      { name: 'DBL Superior Plus', count: 40, size: '23 m²', amenities: ['shower', 'bath', 'view', ...STANDARD] },
      { name: 'DBL Superior', count: 36, size: '25 m²', amenities: ['shower', 'bath', ...STANDARD] },
      { name: 'SGL Superior Plus', count: 4, size: '18 m²', amenities: ['shower', 'bath', 'view', ...STANDARD] },
      { name: 'SGL Superior', count: 7, size: '17 m²', amenities: ['shower', 'bath', ...STANDARD] },
    ],
    wellness: [
      { kind: 'pool', detail: '13×7 m', hours: '7:00/8:00–21:00' },
      { kind: 'sauna', detail: '2×' },
      { kind: 'fitness' },
      { kind: 'hairdresser' },
      { kind: 'aesthetic', detail: 'Asklepion' },
    ],
    spring: 'forest',
    mineralBaths: 6,
    indications: ['kidney', 'locomotor', 'respiratory', 'circulatory', 'digestive', 'metabolic', 'oncological', 'neurological', 'thyroid', 'dermatological'],
    dining: [
      { kind: 'restaurant', name: 'Primavera', hours: '7:00–10:00 · 11:30–13:30 · 17:30–20:00' },
      { kind: 'bar', name: 'Lobby bar', hours: '12:00–22:00' },
    ],
    meetings: [{ name: "Captain James Cook's Lounge", area: '70 m²', capacity: 50 }],
    parking: [
      { kind: 'free-street', spaces: 4 },
      { kind: 'parking-house' },
    ],
    petsAllowed: true,
    petFeeCzk: 450,
    checkIn: '14:00',
    checkOut: '11:00',
    email: 'pacifik@ensanahotels.com',
    phone: '+420 354 651 111',
    reservationPhone: '+420 354 652 300',
  },

  vltava: {
    rooms: 112,
    beds: 194,
    buildings: [
      { name: 'Vltava', rooms: 62 },
      { name: 'Berounka', rooms: 22 },
      { name: 'Dependance Vítkov', rooms: 28 },
    ],
    roomTypes: [
      { name: 'DBL Suite', count: 4, size: '15 m²', amenities: ['shower', 'bath', 'livingroom', 'view', ...STANDARD] },
      { name: 'DBL Comfort Plus', count: 35, size: '14 m²', amenities: ['shower', 'bath', 'balcony', 'view', ...STANDARD] },
      { name: 'DBL Comfort', count: 24, size: '14 m²', amenities: ['shower', 'view', ...STANDARD] },
      { name: 'SGL Comfort Plus', count: 10, size: '6–10 m²', amenities: ['shower', 'bath', 'view', ...STANDARD] },
      { name: 'SGL Comfort', count: 11, size: '6–10 m²', amenities: ['shower', ...STANDARD] },
      { name: 'DBL Standard (Vítkov)', count: 19, amenities: ['shower', 'tv', 'phone', 'hairdryer', 'balcony'] },
      { name: 'SGL Standard (Vítkov)', count: 9, amenities: ['shower', 'tv', 'phone', 'hairdryer'] },
    ],
    wellness: [
      { kind: 'pool', detail: '11×6 m', hours: '13:00/9:00–20:00' },
      { kind: 'whirlpool' },
      { kind: 'sauna' },
      { kind: 'fitness' },
    ],
    spring: 'balbin',
    mineralBaths: 6,
    indications: ['locomotor', 'kidney', 'respiratory', 'circulatory', 'digestive', 'metabolic', 'oncological', 'neurological'],
    dining: [
      { kind: 'restaurant', name: 'Regina', seats: 160, hours: '7:00–9:30 · 11:30–13:30 · 17:30–19:30' },
      { kind: 'bar', name: 'Lobby bar', hours: '10:00–22:00' },
    ],
    parking: [{ kind: 'courtyard', spaces: 5, priceCzk: 150 }],
    petsAllowed: true,
    petFeeCzk: 450,
    checkIn: '14:00',
    checkOut: '11:00',
  },

  svoboda: {
    rooms: 132,
    beds: 254,
    buildings: [
      { name: 'Svoboda', rooms: 52 },
      { name: 'Margareta', rooms: 30 },
      { name: 'Palladio', rooms: 13 },
      { name: 'Dependance Labe', rooms: 37 },
    ],
    roomTypes: [
      { name: 'DBL Suite', count: 6, size: '22 m²', amenities: ['shower', 'bath', 'livingroom', 'view', ...STANDARD] },
      { name: 'DBL Comfort Plus', count: 46, size: '21 m²', amenities: ['shower', 'bath', 'view', 'tv', 'phone', 'fridge', 'safe', 'hairdryer', 'bathrobe'] },
      { name: 'DBL Comfort', count: 38, size: '21 m²', amenities: ['shower', 'bath', 'tv', 'phone', 'fridge', 'safe', 'hairdryer', 'bathrobe'] },
      { name: 'SGL Comfort', count: 5, size: '19 m²', amenities: ['shower', 'tv', 'phone', 'fridge', 'safe', 'hairdryer', 'bathrobe'] },
      { name: 'DBL Standard (Labe)', count: 30, size: '16 m²', amenities: ['shower', 'bath', 'tv', 'phone', 'safe', 'hairdryer'] },
      { name: 'SGL Standard (Labe)', count: 7, size: '12 m²', amenities: ['shower', 'tv', 'phone', 'safe', 'hairdryer'] },
    ],
    wellness: [
      { kind: 'pool', detail: '12×6 m', hours: '12:00/9:00–21:00' },
      { kind: 'whirlpool' },
      { kind: 'sauna', hours: '12:00–21:00' },
      { kind: 'steam' },
    ],
    spring: 'josef',
    mineralBaths: 6,
    indications: ['locomotor', 'kidney', 'respiratory', 'metabolic', 'digestive', 'circulatory', 'gynaecological', 'oncological', 'neurological', 'thyroid', 'dermatological'],
    dining: [
      { kind: 'restaurant', name: 'Carlton', hours: '7:00–10:00 · 11:30–13:30 · 17:30–19:30' },
      { kind: 'bar', name: 'Lobby bar', hours: '10:00–22:00' },
    ],
    parking: [
      { kind: 'courtyard', spaces: 12, priceCzk: 250, priceCzkLongStay: 200 },
      { kind: 'parking-house' },
    ],
    petsAllowed: true,
    petFeeCzk: 450,
    checkIn: '14:00',
    checkOut: '11:00',
    email: 'svoboda@ensanahotels.com',
    phone: '+420 354 662 111',
    reservationPhone: '+420 354 662 300',
  },
}

export function detailsOf(slug: string): HotelDetails | undefined {
  return hotelDetails[slug]
}
