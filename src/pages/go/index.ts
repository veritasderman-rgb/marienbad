import type { APIRoute } from 'astro'
import { goRedirect } from './[key]'

export const prerender = false

/** /go bez klíče vede na úvodní stránku ve správném jazyce (stejná pravidla pro ?lang a ?src). */
export const GET: APIRoute = ({ request, url }) => goRedirect('home', request, url)
