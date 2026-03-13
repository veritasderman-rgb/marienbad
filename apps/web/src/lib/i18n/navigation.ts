import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'
import { locales, defaultLocale } from './config'

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/mineral-springs': {
      de: '/mineralquellen',
      en: '/mineral-springs',
      ru: '/mineralnye-istochniki',
      cs: '/mineralni-prameny',
    },
    '/mineral-springs/[slug]': {
      de: '/mineralquellen/[slug]',
      en: '/mineral-springs/[slug]',
      ru: '/mineralnye-istochniki/[slug]',
      cs: '/mineralni-prameny/[slug]',
    },
    '/things-to-do': {
      de: '/unternehmungen',
      en: '/things-to-do',
      ru: '/chem-zanyatsya',
      cs: '/co-delat',
    },
    '/things-to-do/[slug]': {
      de: '/unternehmungen/[slug]',
      en: '/things-to-do/[slug]',
      ru: '/chem-zanyatsya/[slug]',
      cs: '/co-delat/[slug]',
    },
    '/accommodation': {
      de: '/unterkunft',
      en: '/accommodation',
      ru: '/prozhivanie',
      cs: '/ubytovani',
    },
    '/accommodation/[slug]': {
      de: '/unterkunft/[slug]',
      en: '/accommodation/[slug]',
      ru: '/prozhivanie/[slug]',
      cs: '/ubytovani/[slug]',
    },
    '/history': {
      de: '/geschichte',
      en: '/history',
      ru: '/istoriya',
      cs: '/historie',
    },
    '/history/[slug]': {
      de: '/geschichte/[slug]',
      en: '/history/[slug]',
      ru: '/istoriya/[slug]',
      cs: '/historie/[slug]',
    },
    '/practical-info': {
      de: '/praktische-infos',
      en: '/practical-info',
      ru: '/prakticheskaya-informaciya',
      cs: '/prakticke-informace',
    },
    '/practical-info/[slug]': {
      de: '/praktische-infos/[slug]',
      en: '/practical-info/[slug]',
      ru: '/prakticheskaya-informaciya/[slug]',
      cs: '/prakticke-informace/[slug]',
    },
    '/people': {
      de: '/menschen',
      en: '/people',
      ru: '/lyudi',
      cs: '/lide',
    },
    '/people/[slug]': {
      de: '/menschen/[slug]',
      en: '/people/[slug]',
      ru: '/lyudi/[slug]',
      cs: '/lide/[slug]',
    },
    '/magazine': {
      de: '/magazin',
      en: '/magazine',
      ru: '/zhurnal',
      cs: '/magazin',
    },
    '/magazine/[slug]': {
      de: '/magazin/[slug]',
      en: '/magazine/[slug]',
      ru: '/zhurnal/[slug]',
      cs: '/magazin/[slug]',
    },
  },
})

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
