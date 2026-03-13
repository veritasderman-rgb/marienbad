import createMiddleware from 'next-intl/middleware'
import { routing } from './lib/i18n/navigation'

export default createMiddleware(routing)

export const config = {
  matcher: ['/', '/(de|en|ru|cs)/:path*'],
}
