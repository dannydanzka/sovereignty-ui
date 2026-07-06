# SOP: Supabase Project Setup

> **PURPOSE**: Configure a new Supabase project with database, storage, and auth credentials
> **SCOPE**: Any sovereignty project that uses PostgreSQL via Supabase
> **PREREQUISITES**: Supabase account, project repository initialized
> **UPDATED**: 2026-03-26

---

## 1. Prerequisites

- [ ] Supabase account at [supabase.com](https://supabase.com)
- [ ] Project repository with Prisma configured
- [ ] `.env.local` file in project root (gitignored)

---

## 2. Procedure

### Step 1: Create Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Configure:
   - **Name**: Project name (e.g., `my-project-dev`)
   - **Database Password**: Generate strong password (save it!)
   - **Region**: `South America (São Paulo)` for LATAM projects
   - **Plan**: Free tier is sufficient for development
4. Wait for project provisioning (~2 minutes)

**Validation**: Project appears in dashboard with green status.

### Step 2: Collect Database Credentials

Navigate to **Settings → Database** in the Supabase dashboard.

| Variable | Where to Find | Notes |
|----------|---------------|-------|
| `DATABASE_URL` | Connection string → Transaction pooler (port 6543) | For Prisma queries (pooled) |
| `DIRECT_URL` | Connection string → Direct (port 5432) | For Prisma migrations (non-pooled) |

**Format**:
```
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"
```

**Validation**: `npx prisma db pull` connects without errors.

### Step 3: Collect API Credentials

Navigate to **Settings → API** in the Supabase dashboard.

| Variable | Where to Find | Notes |
|----------|---------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | Public, safe for client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` `public` key | Public, safe for client |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key | **SECRET** — server-side only |

**Validation**: Keys start with `eyJ...` (JWT format).

### Step 4: Generate Application Secrets

```bash
# JWT Secret (min 32 chars)
openssl rand -base64 32

# Or use node
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

| Variable | Value | Notes |
|----------|-------|-------|
| `JWT_SECRET` | Generated 32+ char string | For signing auth tokens |
| `JWT_EXPIRES_IN` | `24h` | Token expiration |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | App base URL |

### Step 5: Configure `.env.local`

Create `.env.local` in project root:

```bash
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Supabase API
NEXT_PUBLIC_SUPABASE_URL="https://[project-ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# Auth
JWT_SECRET="[generated-secret]"
JWT_EXPIRES_IN="24h"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Validation**: `cat .env.local | wc -l` shows expected number of variables.

### Step 6: Verify Prisma Connection

```bash
# Generate Prisma client
npx prisma generate

# Test connection (pulls current schema)
npx prisma db pull

# Push schema to database
npx prisma db push

# Open Prisma Studio to verify
npx prisma studio
```

**Validation**: Prisma Studio opens at `localhost:5555` and shows tables.

### Step 7: Configure Storage (if needed)

For projects with file uploads (evidence, media, documents):

1. Navigate to **Storage** in Supabase dashboard
2. Create buckets as needed:
   - `evidence` — For evidence uploads
   - `documents` — For document uploads
   - `media` — For media files
3. Configure bucket policies:
   - **Public buckets**: Read access for all, write for authenticated
   - **Private buckets**: Read/write for authenticated only

**Validation**: Upload a test file via dashboard, verify access.

---

## 3. Production Setup

### Vercel Environment Variables

When deploying to Vercel, add all variables from `.env.local` to:
**Vercel Dashboard → Project → Settings → Environment Variables**

| Scope | Variables |
|-------|-----------|
| Production | All variables with production Supabase credentials |
| Preview | Same as production or separate preview project |
| Development | Not needed (uses `.env.local`) |

### Separate Supabase Projects

**Recommended**: Use separate Supabase projects per environment:
- `project-dev` — Local development
- `project-prod` — Production

This prevents dev data from contaminating production.

---

## 4. Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| `P1001: Can't reach database` | Wrong connection string or project paused | Verify `DATABASE_URL`, check project status in dashboard |
| `P1003: Database does not exist` | Using wrong database name | Connection string should end with `/postgres` |
| `password authentication failed` | Wrong password in connection string | Reset database password in Settings → Database |
| `prepared statement already exists` | Missing `pgbouncer=true` param | Add `?pgbouncer=true` to `DATABASE_URL` |
| `migration failed` | Using pooled URL for migrations | Use `DIRECT_URL` (port 5432) for migrations |
| `RLS policy violation` | Row Level Security blocking queries | Prisma bypasses RLS by default with `service_role` key |
| Project paused (free tier) | 7 days of inactivity | Restore from dashboard, takes ~1 minute |

---

## 5. Checklist

- [ ] Supabase project created
- [ ] Database credentials collected (`DATABASE_URL`, `DIRECT_URL`)
- [ ] API credentials collected (`SUPABASE_URL`, `ANON_KEY`, `SERVICE_ROLE_KEY`)
- [ ] JWT secret generated
- [ ] `.env.local` configured
- [ ] `npx prisma generate` succeeds
- [ ] `npx prisma db push` succeeds
- [ ] Prisma Studio connects
- [ ] Storage buckets created (if needed)
- [ ] Production env vars configured in Vercel (when ready)

---

## 6. Security Reminders

- **NEVER** commit `.env.local` to git (should be in `.gitignore`)
- **NEVER** expose `SUPABASE_SERVICE_ROLE_KEY` on client-side
- **NEVER** expose `JWT_SECRET` on client-side
- `NEXT_PUBLIC_*` variables are safe for client (public by design)
- Rotate `JWT_SECRET` if compromised (invalidates all active sessions)
- Database password can be reset in Supabase dashboard without data loss
