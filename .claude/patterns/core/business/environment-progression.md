# Environment Progression

> **Status**: 🚧 Stub
> **Layer**: WHAT (business architecture)

---

## Context

Two-environment (DEV/QA + PROD) hygiene is good practice — but it costs developer velocity early. For an MVP racing to first customer, single-env with discipline beats dual-env with friction. The pattern documents when each makes sense and how to migrate without re-platforming.

## Stages

### Stage 0 — Single environment (pre-MVP)

- One Vercel project, one Supabase, deploy from `main`.
- Discipline: feature flags for everything user-facing, branch protection, mandatory PR reviews, automated tests as the primary safety net.
- Tradeoff: a bug ships to "prod" because there is no other place. Mitigate with flags and small commits.
- **Exit signal**: first paying customer + second customer onboarding starts.

### Stage 1 — DEV/QA + PROD (MVP launched)

- Two Vercel projects, two Supabase instances.
- `dev` branch auto-deploys to QA. `main` requires manual promotion.
- Migrations: applied to QA first, validated, then promoted.
- Seed data in QA mirrors prod schema with sanitized fixtures.

### Stage 2 — DEV + STAGING + PROD (post-product-fit)

- Adds a near-prod staging that holds release candidates.
- Used for performance testing, third-party integration smoke tests, customer demos.

### Stage 3 — Multi-region (post-multi-tenant)

- Region-pinned PROD instances for data residency requirements.
- Per-region migrations orchestrated centrally.

---

## Anti-patterns

- Adding DEV/QA before there's anyone qualified to run QA. Empty QA env is theater.
- Skipping straight to STAGING without DEV/QA. STAGING with developer churn becomes ad-hoc DEV.
- Coupling environments (shared DB, shared secrets). Defeats the isolation purpose.
