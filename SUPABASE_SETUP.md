# Supabase Setup Guide for Marienbad.com

## 1. Create New Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Settings:
   - **Name**: `marienbad-cms`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: `eu-central-1` (Frankfurt) — closest to Czech Republic
   - **Plan**: Free tier is sufficient for development

## 2. Get Connection Details

After project creation, go to **Settings → Database**:

```
Host: db.[PROJECT-REF].supabase.co
Port: 5432
Database: postgres
User: postgres
Password: [your-password]
```

Connection string for `.env`:
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

## 3. Setup Storage Bucket (for Media)

1. Go to **Storage** in Supabase dashboard
2. Click "New Bucket"
3. Name: `media`
4. Set to **Public** (images need to be publicly accessible)

## 4. Get API Keys

Go to **Settings → API**:
- `SUPABASE_URL` = Project URL
- `SUPABASE_ANON_KEY` = anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` = service_role key (keep secret!)

## 5. Configure Environment

Copy `.env.example` to `.env.local` and fill in all Supabase values.

## 6. Run Payload CMS Migrations

```bash
cd apps/cms
pnpm dev
```

Payload will automatically create all required tables on first run.

## 7. Create Admin User

On first CMS visit (http://localhost:3001/admin), you'll be prompted to create the first admin user.
