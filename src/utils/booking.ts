import { EXELY_CHAIN_ID, EXELY_LOCALE_MAP } from '@/data/hotels'
import { withUtm } from './utm'

type Locale = keyof typeof EXELY_LOCALE_MAP

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

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
  const today = new Date()
  const defaultArrive = new Date(today)
  defaultArrive.setDate(today.getDate() + 30)
  const defaultDepart = new Date(today)
  defaultDepart.setDate(today.getDate() + 37)

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
    arrive: opts.arrive ?? formatDate(defaultArrive),
    depart: opts.depart ?? formatDate(defaultDepart),
  })

  const url = `https://bookings.ensanahotels.com/?${params.toString()}`
  return opts.utmMedium
    ? withUtm(url, 'marienbad', opts.utmMedium, opts.utmCampaign ?? 'direct-booking')
    : url
}
