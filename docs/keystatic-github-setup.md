# Keystatic — GitHub mode setup

Produkční Keystatic (`/keystatic` na marienbad.com) běží v **GitHub mode** —
přihlášení jde přes GitHub App a změny se ukládají commitem do
`veritasderman-rgb/marienbad`. Lokálně (`pnpm dev`) běží Keystatic v **local mode**
a zapisuje rovnou na disk, žádné přihlášení není potřeba.

Přepínač je v `keystatic.config.tsx`:

```ts
const isProd = import.meta.env.PROD

storage: isProd
  ? { kind: 'github', repo: 'veritasderman-rgb/marienbad' }
  : { kind: 'local' }
```

## GitHub App

| Položka | Hodnota |
|---------|---------|
| Název aplikace | `marienbad-keystatic-cms` |
| Nastavení | https://github.com/settings/apps/marienbad-keystatic-cms |
| Client ID | `Iv23liaM8hmPIkscdGGK` (veřejná hodnota, není to secret) |

### Callback URLs

V nastavení aplikace → **General → Identifying and authorizing users → Callback URL**
musí být zapsané **všechny** URL, ze kterých se kdo bude přihlašovat. GitHub
porovnává `redirect_uri` znak po znaku — stačí chybějící `www`, jiný port nebo
`http` místo `https` a přihlášení skončí chybou:

> The redirect_uri is not associated with this application.

Minimálně tyto:

```
https://marienbad.com/api/keystatic/github/oauth/callback
http://localhost:4321/api/keystatic/github/oauth/callback
```

Pokud se CMS používá i z Vercel preview nasazení, přidej i tamní doménu ve
stejném tvaru (`https://<deployment>.vercel.app/api/keystatic/github/oauth/callback`).
Preview buildy pro `claude/**` větve jsou ale ve `vercel.json` vypnuté, takže
běžně to potřeba není.

Cesta `/api/keystatic/github/oauth/callback` je pevně daná integrací
`@keystatic/astro`, nedá se v repu změnit.

### Oprávnění

- **Repository permissions → Contents:** Read and write
- **Repository permissions → Pull requests:** Read and write
- **Repository permissions → Metadata:** Read-only (nastaví se automaticky)

Aplikace musí být nainstalovaná na repozitáři `veritasderman-rgb/marienbad`
(Install App). Každý, kdo se chce do CMS přihlásit, potřebuje na repozitáři
write přístup.

## Environment variables (Vercel → Project → Settings → Environment Variables)

| Proměnná | Kde se použije | Poznámka |
|----------|----------------|----------|
| `KEYSTATIC_GITHUB_CLIENT_ID` | server | Client ID GitHub App |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | server | Client secret GitHub App — **secret** |
| `KEYSTATIC_SECRET` | server | Náhodný string, podepisuje session cookie — **secret** |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | klient | `marienbad-keystatic-cms` |

`KEYSTATIC_SECRET` vygeneruješ třeba přes `openssl rand -hex 32`.
Prefix `PUBLIC_` znamená, že se hodnota zabuduje do klientského bundlu — proto
tam patří jen slug, nikdy secret.

## Diagnostika

Jestli produkce posílá správné `redirect_uri`, se dá ověřit bez přihlašování:

```bash
curl -sI https://marienbad.com/api/keystatic/github/login | grep -i location
```

Hlavička `location` musí obsahovat `client_id` z GitHub App a
`redirect_uri=https%3A%2F%2Fmarienbad.com%2Fapi%2Fkeystatic%2Fgithub%2Foauth%2Fcallback`.
Když sedí a GitHub přesto hlásí chybu, problém je na straně GitHub App
(chybějící callback URL), ne v repu.

| Příznak | Nejčastější příčina |
|---------|---------------------|
| `The redirect_uri is not associated with this application` | Callback URL není v nastavení GitHub App |
| Přesměrování na GitHub bez `client_id` | Chybí `KEYSTATIC_GITHUB_CLIENT_ID` na Vercelu |
| `Authorization failed` (401) po návratu z GitHubu | Vypršel nebo nesedí state cookie — zkus přihlášení znovu z `/keystatic` |
| Přihlášení projde, ale ukládání hlásí 404/403 | App není nainstalovaná na repu nebo nemá Contents: write |
