# Marienbad.com — Vercel + Supabase Setup Guide

## Prerequisites
- Vercel account with the project deployed
- Supabase account (free tier is sufficient to start)

---

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. **Region**: Choose `eu-central-1` (Frankfurt) — closest to Czech Republic
3. **Database password**: Save this securely — you'll need it for the connection string
4. Wait for the project to finish provisioning (~2 minutes)

## Step 2: Get the Database Connection String

1. In Supabase dashboard: **Settings** → **Database**
2. Scroll to **Connection string** section
3. Select **URI** tab
4. Copy the connection string. It looks like:
   ```
   postgresql://postgres.[your-ref]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
   ```
5. **IMPORTANT**: Replace `[YOUR-PASSWORD]` with your actual database password

### Connection Mode
- Use **port 6543** (Transaction pooler) for serverless/Vercel
- Do NOT use port 5432 (Direct connection) — it won't work well with serverless

## Step 3: Run Pre-deployment SQL

1. In Supabase dashboard: **SQL Editor**
2. Open `/apps/web/supabase-setup.sql`
3. Run only **STEP 1** (the pre-deployment section with extensions and grants)

## Step 4: Set Vercel Environment Variables

Go to your Vercel project → **Settings** → **Environment Variables** and add:

| Variable | Value | Environment |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres.[ref]:[pass]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres` | Production, Preview |
| `PAYLOAD_SECRET` | Any random 32+ character string (use `openssl rand -hex 32`) | Production, Preview |
| `PAYLOAD_CONFIG_PATH` | `src/payload.config.ts` | Production, Preview |
| `NEXT_PUBLIC_SITE_URL` | `https://marienbad.vercel.app` | Production |
| `NEXT_PUBLIC_SITE_URL` | `https://marienbad.vercel.app` | Preview |

### How to generate PAYLOAD_SECRET:
```bash
openssl rand -hex 32
```

## Step 5: Redeploy

1. After setting all env variables, trigger a new deployment:
   - Either push a new commit, or
   - In Vercel dashboard: **Deployments** → click "..." on latest → **Redeploy**
2. Wait for the build to complete

## Step 6: Initialize Payload CMS

1. Go to `https://marienbad.vercel.app/admin`
2. Payload will automatically create all database tables on first load
3. You'll see the **Create First User** screen
4. Create an admin account:
   - Email: your email
   - Password: strong password
   - Name: your name
   - Role: Admin

## Step 7: Seed Content

After the admin user is created, populate content in this order:

1. **Site Settings** (Globals → Site Settings)
2. **Navigation** (Globals → Navigation)
3. **Footer** (Globals → Footer)
4. **Categories** — create all 8 categories
5. **Authors** — create editorial team + experts
6. **Media** — upload hero images, portraits
7. **Pages** — create 6 pillar pages
8. **Articles** — create cluster articles under pillars
9. **Events** — add upcoming events
10. **People Stories** — add visitor stories

See `supabase-setup.sql` for the complete content plan with all translations.

---

## Troubleshooting

### "Application error: a server-side exception has occurred"
- **Most common cause**: Missing or incorrect `DATABASE_URL`
- Check that the password in the connection string is correct
- Make sure you're using port **6543** (pooler), not 5432
- Verify `PAYLOAD_SECRET` is set

### "/admin shows blank page"
- Check `PAYLOAD_CONFIG_PATH` is set to `src/payload.config.ts`

### "relation does not exist" errors
- Payload creates tables on first request. Visit `/admin` once to trigger schema creation
- If tables aren't created, check DATABASE_URL is correct

### SSL connection errors
- Already handled in `payload.config.ts` with `ssl: { rejectUnauthorized: false }`
- If you still see SSL errors, add `?sslmode=require` to the end of your DATABASE_URL

### Connection timeout
- Use the **Transaction pooler** connection (port 6543), not direct (5432)
- Supabase free tier has connection limits — this is fine for a content site

---

## Architecture Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Vercel CDN    │     │  Vercel Serverless│     │    Supabase     │
│   (Static +     │────▶│  (Next.js +      │────▶│   PostgreSQL    │
│    ISR cache)   │     │   Payload CMS)   │     │  (eu-central-1) │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                        │
   Public site              /admin CMS
   marienbad.vercel.app     marienbad.vercel.app/admin
```

- **Payload CMS** runs as part of the Next.js app (no separate server)
- **Admin panel** at `/admin` — manages all content
- **Frontend** reads from Payload's local API (no network hop)
- **Database** on Supabase — stores all content, users, media references
- **Media files** stored locally in `.next` during build, served by Vercel
