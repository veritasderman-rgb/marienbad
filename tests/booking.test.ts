import { describe, expect, it } from 'vitest'
import { exelyBookingUrl } from '../src/utils/booking'

const base = { hotelId: 50110, locale: 'cs' as const }

describe('rezervační odkaz do Exely', () => {
  it('bez zadaného termínu nevkládá arrive ani depart', () => {
    // Většina stránek je předgenerovaná. Kdyby se sem dosadilo „dnes + 30 dní",
    // zapeklo by se datum buildu do HTML a po pár měsících by odkaz posílal
    // návštěvníky na hledání v minulosti.
    const url = new URL(exelyBookingUrl(base))
    expect(url.searchParams.has('arrive')).toBe(false)
    expect(url.searchParams.has('depart')).toBe(false)
  })

  it('zadaný termín předá beze změny', () => {
    const url = new URL(exelyBookingUrl({ ...base, arrive: '2027-03-01', depart: '2027-03-08' }))
    expect(url.searchParams.get('arrive')).toBe('2027-03-01')
    expect(url.searchParams.get('depart')).toBe('2027-03-08')
  })

  it('míří na oficiální rezervační systém a nese hotel, jazyk i obsazenost', () => {
    const url = new URL(exelyBookingUrl({ ...base, adults: 2, children: 1, rooms: 1 }))
    expect(url.origin + url.pathname).toBe('https://bookings.ensanahotels.com/')
    expect(url.searchParams.get('hotel')).toBe('50110')
    expect(url.searchParams.get('locale')).toBe('cs-CZ')
    expect(url.searchParams.get('adult')).toBe('2')
    expect(url.searchParams.get('child')).toBe('1')
    expect(url.searchParams.get('rooms')).toBe('1')
  })

  it('doplní utm jen když je zadané médium', () => {
    expect(exelyBookingUrl(base)).not.toContain('utm_medium')
    const tagged = new URL(exelyBookingUrl({ ...base, utmMedium: 'hotel-detail', utmCampaign: 'nove-lazne' }))
    expect(tagged.searchParams.get('utm_medium')).toBe('hotel-detail')
    expect(tagged.searchParams.get('utm_campaign')).toBe('nove-lazne')
  })
})
