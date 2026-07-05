# SOP: Test Credentials Management

> **PURPOSE**: Single source of truth for handling test/dev credentials across web & mobile projects
> **SCOPE**: All projects under `your-org/projects/*` and `your-org/mobile/*`
> **SECURITY**: Zero plaintext passwords in code, docs, or git history
> **UPDATED**: 2026-04-21

---

## Core Principle

> **Credentials live ONLY in gitignored `.env` files. Everything else references them by variable name.**

No passwords in:
- Source code (`.ts`, `.tsx`, `.js`, `.jsx`)
- Documentation (`.md`, `.mdx`)
- Configuration committed to git (`playwright.config.ts`, `package.json`)
- Test fixtures, snapshots, or mocks
- Jira/Confluence pages
- PR descriptions or commit messages

---

## Two Conventions (don't mix)

your-project uses **two separate prefix conventions** for test credentials. Each serves a different purpose and lives in a different file.

### `AUTH_*` — Dev CLI & API Testing

- **Who uses it**: `yarn start` dev CLI auto-login, curl-based API testing, manual QA flows
- **Where it lives**: `your-project/.env` (shared across all web worktrees)
- **When to use**: Developer running the app locally, curl scripts, manual QA

```bash
# your-project/.env (gitignored)
AUTH_AD_USER=sistemasbplus        # Admin
AUTH_AD_PASS=<redacted>
AUTH_DS_USER=G000249              # Distributor
AUTH_DS_PASS=<redacted>
AUTH_AS_USER=1689743              # Associate
AUTH_AS_PASS=<redacted>
AUTH_DN_USER=ME02                 # National Director
AUTH_DN_PASS=<redacted>
AUTH_DC_USER=acampos              # Corporate Director
AUTH_DC_PASS=<redacted>
AUTH_DR_USER=ME08                 # Regional Director
AUTH_DR_PASS=<redacted>
AUTH_PR_USER=PR14                 # Promoter
AUTH_PR_PASS=<redacted>
AUTH_AV_USER=XR01                 # Advisor
AUTH_AV_PASS=<redacted>
```

### `E2E_*` — Playwright Automated Tests

- **Who uses it**: Playwright E2E suite (`yarn test:e2e`)
- **Where it lives**: `your-project/TASK-IDXXXX/.env.local` (per-worktree, gitignored)
- **When to use**: Automated E2E tests that log in via UI and cache storageState per role

```bash
# your-project/TASK-IDXXXX/.env.local (gitignored)
E2E_DISTRIBUTOR_USERNAME=G000249
E2E_DISTRIBUTOR_PASSWORD=<redacted>
E2E_CORPORATE_USERNAME=acampos
E2E_CORPORATE_PASSWORD=<redacted>
E2E_NATIONAL_USERNAME=ME02
E2E_NATIONAL_PASSWORD=<redacted>
E2E_REGIONAL_USERNAME=ME08
E2E_REGIONAL_PASSWORD=<redacted>
E2E_PROMOTER_USERNAME=PR14
E2E_PROMOTER_PASSWORD=<redacted>
E2E_ADVISOR_USERNAME=XR01
E2E_ADVISOR_PASSWORD=<redacted>
```

### Why two prefixes?

| Aspect | `AUTH_*` | `E2E_*` |
|--------|----------|---------|
| Scope | Shared across worktrees | Per-worktree (isolation) |
| Rotation | Rare (only when QA rotates) | Can vary per feature branch |
| Readers | Dev server, curl, devs | Playwright test runner |
| Format | 2-letter role codes (`DS`, `DC`) | Full role names (`DISTRIBUTOR`) |
| Format history | Legacy — matches CLI expectations | Explicit — matches Playwright projects |

Don't consolidate into one. They serve different workflows with different lifecycles.

---

## Canonical Implementation

### Reading credentials in E2E code

Source: `web/TASK-ID/e2e/support/roles.ts`

```typescript
export type Role =
  | 'advisor'
  | 'corporate'
  | 'distributor'
  | 'national'
  | 'promoter'
  | 'regional';

export interface Credentials {
  password: string;
  username: string;
}

const envKey = (role: Role, field: 'USERNAME' | 'PASSWORD') =>
  `E2E_${role.toUpperCase()}_${field}`;

export const getCredentials = (role: Role): Credentials => {
  const username = process.env[envKey(role, 'USERNAME')];
  const password = process.env[envKey(role, 'PASSWORD')];

  if (!username || !password) {
    throw new Error(
      `Missing credentials for role "${role}". Define ${envKey(role, 'USERNAME')} and ${envKey(role, 'PASSWORD')} in .env.local`
    );
  }

  return { password, username };
};
```

**Key properties**:
1. Fail-fast: throws if env vars missing (not silent failure in browser)
2. Typed: `Role` union prevents typos
3. Never logs secrets: error message names the key, never the value
4. Zero hardcoded values

### Loading .env files in Playwright

`playwright.config.ts`:

```typescript
import dotenv from 'dotenv';
import path from 'path';

// Load shared web/.env first (AUTH_*), then feature-local .env.local (E2E_*, overrides)
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env.local'), override: true });
```

---

## Security Checklist

Per repo / per worktree, these MUST be true:

### Git protection
```bash
# .gitignore must include:
.env
.env.local
.env.*.local
e2e/playwright/.auth/
```

### Docker protection
```bash
# .dockerignore must include:
**/.env
**/.env.local
/e2e/playwright/.auth/
```

### Code scan (no hardcoded passwords)
```bash
# Should return 0 matches:
grep -rE "(password|passwd)\s*[:=]\s*['\"][A-Za-z0-9]" \
  --include="*.{ts,tsx,js,jsx,md}" \
  -l . 2>/dev/null
```

### Session token hygiene (E2E only)
```bash
# CI: regenerate tokens on every run
rm -rf e2e/playwright/.auth/
yarn test:e2e:auth
```

---

## Rotation Policy

### When to rotate

| Event | Rotate |
|-------|--------|
| Dev leaves the team | Yes — all accounts they had access to |
| Credentials leaked (PR, Slack, log) | Immediately, all affected accounts |
| Scheduled | Every 6 months (QA accounts) |
| QA env reset | As needed per backend policy |

### How to rotate

1. **Backend admin** resets password in QA auth system
2. **Tech lead** updates `your-project/.env` (shared) with new password
3. **Each dev** updates their own worktree `.env.local` on next pull
4. **CI** picks up new values on next run (env vars injected by CI platform)
5. **Git**: NEVER commit the rotated password — `.env` is gitignored

### If a password was committed (incident)

1. **Rotate immediately** — assume leaked
2. **Remove from git history**: `git filter-repo` or BFG (destructive, coordinate with team)
3. **Force-push** (requires admin + team freeze)
4. **Invalidate all tokens** that could have been issued with the leaked password
5. **Post-mortem**: how did it get committed? Add a pre-commit hook to prevent recurrence

---

## Templates

### `web/.env.example` (committed — template, no secrets)

```bash
# Dev CLI auto-login credentials
# Real values live in web/.env (gitignored). Request from tech lead.

AUTH_AD_USER=
AUTH_AD_PASS=
AUTH_DS_USER=
AUTH_DS_PASS=
AUTH_AS_USER=
AUTH_AS_PASS=
AUTH_DN_USER=
AUTH_DN_PASS=
AUTH_DC_USER=
AUTH_DC_PASS=
AUTH_DR_USER=
AUTH_DR_PASS=
AUTH_PR_USER=
AUTH_PR_PASS=
AUTH_AV_USER=
AUTH_AV_PASS=
```

### `web/TASK-IDXXXX/.env.local.example` (committed — template)

```bash
# Playwright E2E credentials per role
# Copy to .env.local and fill in. Real values in team vault / web/.env.

E2E_DISTRIBUTOR_USERNAME=
E2E_DISTRIBUTOR_PASSWORD=
E2E_CORPORATE_USERNAME=
E2E_CORPORATE_PASSWORD=
E2E_NATIONAL_USERNAME=
E2E_NATIONAL_PASSWORD=
E2E_REGIONAL_USERNAME=
E2E_REGIONAL_PASSWORD=
E2E_PROMOTER_USERNAME=
E2E_PROMOTER_PASSWORD=
E2E_ADVISOR_USERNAME=
E2E_ADVISOR_PASSWORD=
```

---

## Onboarding a New Developer

1. Clone the repo
2. Request `your-project/.env` from tech lead (Slack DM, not committed anywhere)
3. Place at `your-project/.env`
4. For each active feature worktree:
   - `cp .env.local.example .env.local`
   - Fill in `E2E_*` values (same passwords as `AUTH_*` unless roles differ)
5. Run `yarn test:e2e:auth` to verify credentials work
6. Confirm `.env` and `.env.local` are NOT in `git status` (gitignored)

---

## Anti-Patterns (NEVER DO)

| Anti-pattern | Why it's wrong | What to do instead |
|--------------|---------------|--------------------|
| `const password = "Password01"` | Hardcoded secret in code | `process.env.E2E_*_PASSWORD` |
| `\| username \| password \|` table in `.md` | Plaintext in docs | Reference env var name: `$AUTH_DS_PASS` |
| `docker build --build-arg PASSWORD=...` | Password in image history | Mount `.env` at runtime |
| Committing `.env` to fix CI | Permanent leak in git history | Use CI secrets UI (GitHub, GitLab, Bitbucket) |
| Sharing password in Slack public channel | Persists in search indices | 1Password / DM / team vault |
| Using production credentials in tests | Data corruption risk + leak blast radius | QA-only test accounts |
| Same password across all test roles | One leak = full compromise | Distinct passwords per role |

---

## See Also

- `core/sops/playwright-bdd.md` — Playwright BDD setup (uses these credentials)
- `projects/your-project/patterns/business/reference/api-testing-config.md` — Test user table (env var references)
- `projects/your-project/patterns/business/sops/manual-testing-monitoring.md` — Manual QA with curl
- `projects/your-project/patterns/business/sops/manual-testing-flows.md` — Module-specific manual flows
