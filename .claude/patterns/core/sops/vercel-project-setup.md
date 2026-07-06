# SOP: Vercel Project Setup

> **PURPOSE**: Configure a new Vercel project for Next.js deployment
> **SCOPE**: Any sovereignty project using Next.js + Vercel
> **PREREQUISITES**: Vercel account, GitHub repo, Vercel CLI installed
> **UPDATED**: 2026-03-26

---

## 1. Prerequisites

- [ ] Vercel account at [vercel.com](https://vercel.com)
- [ ] GitHub repository with Next.js project
- [ ] Vercel CLI installed: `npm i -g vercel`
- [ ] Authenticated: `vercel login`
- [ ] Environment variables ready (from Supabase SOP or equivalent)

---

## 2. Procedure

### Step 1: Install Vercel CLI

```bash
# Install globally
npm i -g vercel

# Verify installation
vercel --version

# Login
vercel login
```

**Validation**: `vercel whoami` shows your username.

### Step 2: Link Project

From the project root directory:

```bash
# Link to Vercel (creates .vercel/ directory)
vercel link
```

Options when prompted:
- **Set up and deploy?**: Yes
- **Which scope?**: Your team/personal account
- **Link to existing project?**: No (first time) / Yes (if already created in dashboard)
- **Project name**: e.g., `my-project`
- **Framework**: Next.js (auto-detected)
- **Build settings**: Use defaults (Next.js auto-config)

**Validation**: `.vercel/` directory created with `project.json`.

### Step 3: Configure Environment Variables

#### Option A: Via CLI (recommended for bulk setup)

```bash
# Add each variable (interactive — prompts for value)
vercel env add DATABASE_URL production
vercel env add DIRECT_URL production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add JWT_SECRET production
vercel env add JWT_EXPIRES_IN production
vercel env add NEXT_PUBLIC_APP_URL production
```

#### Option B: Via Dashboard

1. Go to **Vercel Dashboard → Project → Settings → Environment Variables**
2. Add each variable with scope: **Production** (and Preview if needed)

#### Common Variables Per Project Type

| Variable | Scope | Notes |
|----------|-------|-------|
| `DATABASE_URL` | Production | Supabase pooled connection |
| `DIRECT_URL` | Production | Supabase direct connection |
| `NEXT_PUBLIC_SUPABASE_URL` | All | Public — safe for client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | Public — safe for client |
| `SUPABASE_SERVICE_ROLE_KEY` | Production | **SECRET** — server only |
| `JWT_SECRET` | Production | **SECRET** — server only |
| `JWT_EXPIRES_IN` | Production | e.g., `24h` |
| `NEXT_PUBLIC_APP_URL` | Production | Production URL (e.g., `https://app.vercel.app`) |
| `CRON_SECRET` | Production | For cron job endpoints |
| `RESEND_API_KEY` | Production | Email service (when needed) |
| `STRIPE_SECRET_KEY` | Production | Payments (when needed) |
| `STRIPE_WEBHOOK_SECRET` | Production | Stripe webhooks (when needed) |
| `NEXT_PUBLIC_FEATURE_*` | All | Feature flags (opt-in, default false) |

**Validation**: `vercel env ls` shows all configured variables.

### Step 4: Configure Build Settings

Default Next.js settings work for most projects. Verify in dashboard:

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Build Command | `next build` (or `yarn build`) |
| Output Directory | `.next` |
| Install Command | `yarn install` (auto-detected) |
| Node.js Version | 20.x (match local version) |

Override only if needed via `vercel.json`:

```json
{
  "buildCommand": "yarn build",
  "installCommand": "yarn install",
  "framework": "nextjs"
}
```

### Step 5: First Deployment

```bash
# Deploy to preview (test)
vercel

# Deploy to production
vercel --prod
```

**Validation**: Deployment URL is accessible and app loads without errors.

### Step 6: Configure Domain (optional)

```bash
# Add custom domain
vercel domains add yourdomain.com

# Verify DNS
vercel domains inspect yourdomain.com
```

Or via dashboard: **Settings → Domains → Add**.

### Step 7: Disable Auto-Deploy (recommended)

For manual deployment control:

1. **Dashboard → Project → Settings → Git**
2. Set **Production Branch** to `main`
3. **Disable** automatic deployments if you want manual control

Manual deploy workflow:
```bash
# Merge PR to main
git checkout main && git pull

# Sync dev branch
git checkout dev && git pull origin main && git push origin dev

# Deploy manually
vercel --prod
```

---

## 3. Cron Jobs (if needed)

Configure in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/your-job",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

Protect cron endpoints with `CRON_SECRET`:

```typescript
// In API route
const authHeader = request.headers.get('authorization');
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
```

**Note**: Cron jobs require Vercel Pro plan or higher.

---

## 4. Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| `Build failed: module not found` | Missing dependency | Check `package.json`, run `yarn install` |
| `Environment variable not found` | Wrong scope or typo | Verify with `vercel env ls`, check scope matches |
| `500 error on API routes` | Missing env vars in Vercel | Add all required vars, redeploy |
| `Prisma: Can't reach database` | `DATABASE_URL` not set or wrong | Verify env var in Vercel dashboard |
| `FUNCTION_INVOCATION_TIMEOUT` | API route exceeds 10s (Hobby) | Optimize query, or upgrade to Pro (60s limit) |
| `Build cache issues` | Stale cache causing failures | Redeploy with `vercel --force` |
| `Edge runtime errors` | Using Node.js APIs in Edge | Use `runtime: 'nodejs'` in route config |
| `Auto-deploy not wanted` | Vercel deploys on every push | Disable in Settings → Git |

---

## 5. Checklist

- [ ] Vercel CLI installed and authenticated
- [ ] Project linked (`vercel link`)
- [ ] Environment variables configured for production
- [ ] First preview deployment succeeds (`vercel`)
- [ ] First production deployment succeeds (`vercel --prod`)
- [ ] App loads without errors at deployment URL
- [ ] Custom domain configured (if applicable)
- [ ] Auto-deploy settings configured (enabled/disabled as needed)
- [ ] Cron jobs configured (if needed)

---

## 6. Security Reminders

- **NEVER** commit `.vercel/` directory to git (should be in `.gitignore`)
- **NEVER** log or expose server-side env vars in client code
- `NEXT_PUBLIC_*` variables are bundled into client JavaScript — only use for truly public values
- Rotate secrets immediately if exposed in build logs
- Use **Preview** scope for non-production branches to avoid data contamination
- Vercel build logs may show env var names (not values) — this is normal

---

## 7. Related SOPs

- [supabase-project-setup.md](supabase-project-setup.md) — Database and storage credentials
- [sovereignty-replication.md](sovereignty-replication.md) — Project structure setup
