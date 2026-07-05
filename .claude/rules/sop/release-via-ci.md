# SOP — Release via CI (never local)

> **APPLIES TO**: Publishing any version of `@dannydanzka/sovereignty-ui`
> **VERSION**: 1.0 | **UPDATED**: 2026-07-05

---

## Hard constraints

- **NEVER `npm publish` locally** — local tokens are `read:packages` only (403 / ENEEDAUTH guaranteed).
- **NEVER push directly to `main`** — branch is protected; hooks block `push` + `main` combinations.
- Publishing happens exclusively in `release.yml` (GitHub Actions `GITHUB_TOKEN` has `packages:write`).

## Procedure

```bash
# 1. Quality gates — all green, 0 warnings
npm run lint && npm run type-check && npm run test && npm run build

# 2. Describe the change
npx changeset            # pick bump type, write consumer-facing summary

# 3. Branch → PR → squash merge (separate steps; never combine main+push)
git checkout -b feat/<name>
git add -A && git commit -m "feat: <description>"
git push -u origin feat/<name>
gh pr create --title "..." --body "..."
gh pr merge --squash --admin

# 4. CI publishes (changesets version + publish on main push)
gh run list --workflow release.yml --limit 1   # verify success

# 5. Verify the version exists
npm view @dannydanzka/sovereignty-ui versions
```

## Consumer follow-up

In each consumer: `npm install @dannydanzka/sovereignty-ui@^X.Y.Z` and confirm the lockfile shows `resolved: https://npm.pkg.github.com/...` (never `file:`). Vercel/CI need `GITHUB_PKG_TOKEN`/`NPM_TOKEN` env to install.

## See also

- User-level SOP: `~/.claude/sops/publish-sovereignty-ui.md`
- Sovereignty canon: `core/sops/sovereignty-ui-publish.md`
