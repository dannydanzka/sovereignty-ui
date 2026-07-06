# SOP: Build & Deploy

> **PURPOSE**: Agnostic discipline for building and shipping a project — the universal phases, not project-specific commands.
> **SCOPE**: Local development → quality gates → QA → production.
> **NOTE**: This is the agnostic `core` SOP. Concrete commands, branch names, and hosting live in the project's `CLAUDE.md` (Essential Commands) and a project-local `.claude/rules/sop/deployment-flow.md`. If the two disagree, the project-local SOP wins.

---

## 1. Local Development

- Start the dev server with the project's documented command (see `CLAUDE.md`).
- Use the project's package manager and the framework's native dev mode (HMR/watch).
- Keep secrets in the gitignored env file the project uses; never hardcode them.

---

## 2. Quality Gates (before every PR)

Run, in this order, the project's equivalent of:

```
1. type-check     → 0 errors   (foundation first)
2. lint           → 0 errors
3. test           → all passing
4. build          → succeeds
```

Fail fast: stop at the first red gate and fix before moving on. Batch fixes, verify per-file, pay for the full suite once at the end (see `core/sops/code-audit.md` + the project's test-iteration SOP).

---

## 3. QA Environment

- Every change reaches a QA/staging environment **before** production.
- QA must use **isolated data** (separate database/storage) — never production data.
- For PR-based hosting (e.g. preview deployments), the QA env is the per-PR build with env vars scoped to the QA datastore.
- Run the QA process (test plan → manual → regression → sign-off) against the QA build, not local. See the project's QA SOP.

---

## 4. Promotion & Production Deploy

- Protected branches (e.g. `main`) are **PR-only** — no direct push/merge. Enforce with hooks where available.
- Nothing merges to the production branch that has not passed QA sign-off.
- Production deploy is an explicit, deliberate step (manual or gated CI) — never an accidental side effect of a push.
- Tag/record what shipped (version, commit, date) for traceability and rollback.

---

## 5. Environment Configuration

- One config/secret source per environment (local / QA / prod); document which variable points where.
- Build-time vs runtime variables: know which the framework inlines at build and which it reads at runtime.
- Never commit real secrets; commit only documented placeholders/examples.

---

## 6. Troubleshooting (generic)

| Symptom | First checks |
|---------|--------------|
| Build fails only in CI/host | Node version parity; clean install (`rm -rf node_modules && install`); clear framework cache |
| "Cannot find module" | Dependency installed? Path alias / tsconfig paths correct? Build artifact present? |
| Deploy succeeds but app 500s | Env vars set for the target environment? Datastore reachable from that env? |
| Silent/empty deploy | Install step failing on a bad token/registry auth (see project token SOPs) |

---

## 7. Checklist

### Before PR
- [ ] type-check passes
- [ ] lint passes
- [ ] tests pass
- [ ] build succeeds
- [ ] No stray `console.log` / debugger / commented-out blocks

### Before Production Deploy
- [ ] All gates green on the QA build
- [ ] QA sign-off recorded
- [ ] Env config verified for the production target
- [ ] Promotion via PR to the protected branch (not direct push)

---

## See Also

- `core/sops/code-audit.md` — code-correctness gate (precedes deploy)
- `core/sops/pr-documentation.md` — PR communication template
- Project-local: `CLAUDE.md` (Essential Commands) + `.claude/rules/sop/deployment-flow.md` (concrete flow + hooks)
