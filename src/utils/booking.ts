import { EXELY_CHAIN_ID, EXELY_LOCALE_MAP } from '@/data/hotels'
import { withUtm } from './utm'

type Locale = keyof typeof EXELY_LOCALE_MAP

export function exelyBookingUrl(opts: {
  hotelId: number
  locale: Locale
  arrive?: string
  depart?: string
  adults?: number
  children?: number
  rooms?: number
  utmMedium?: string
  utmCampaign?: string
}): string {
  const params = new URLSearchParams({
    chain: String(EXELY_CHAIN_ID),
    hotel: String(opts.hotelId),
    level: 'hotel',
    locale: EXELY_LOCALE_MAP[opts.locale],
    currency: 'EUR',
    productcurrency: 'EUR',
    adult: String(opts.adults ?? 2),
    child: String(opts.children ?? 0),
    rooms: String(opts.rooms ?? 1),
  })

  // Termín se doplňuje jen tehdy, když ho volající opravdu zná. Dřív se sem
  // dosazovalo „dnes + 30 / + 37 dní", jenže drtivá většina stránek je
  // předgenerovaná — datum se zapeklo do HTML v okamžiku buildu a po pár
  // měsících posílalo návštěvníky na hledání v minulosti. Bez parametrů
  // otevře rezervační systém vlastní výběr termínu, což je vždy správně.
  if (opts.arrive) params.set('arrive', opts.arrive)
  if (opts.depart) params.set('depart', opts.depart)

  const url = `https://bookings.ensanahotels.com/?${params.toString()}`
  return opts.utmMedium
    ? withUtm(url, 'marienbad', opts.utmMedium, opts.utmCampaign ?? 'direct-booking')
    : url
}
