# sovereignty-ui Publish SOP

> **Frequency**: Every time changes are ready to release
> **Repository**: https://github.com/dannydanzka/sovereignty-ui
> **Package**: `@dannydanzka/sovereignty-ui` (GitHub Packages)
> **Version**: 1.1 | **Updated**: 2026-03-30

---

## Quick Reference

| Step | Command | Where |
|------|---------|-------|
| 1. Validate | `npm run lint && npm run type-check && npm run build` | sovereignty-ui |
| 2. Changeset | `npx changeset` | sovereignty-ui |
| 3. Version | `npx changeset version` | sovereignty-ui |
| 4. Commit | `git add -A && git commit -m "chore: version packages"` | sovereignty-ui |
| 5. Push | `git push` | sovereignty-ui |
| 6. CI publishes | Automatic (release.yml) | GitHub Actions |

---

## Detailed Steps

### 1. Validate Build

Before creating a changeset, verify everything compiles:

```bash
cd ~/Documents/proyectos/sovereignty/sovereignty-ui

npm run lint          # 0 warnings required
npm run type-check    # 0 errors required
npm run build         # Must succeed (ESM + CJS + DTS)
```

### 2. Create Changeset

```bash
npx changeset
```

Interactive prompts:
1. **Which packages?** → `@dannydanzka/sovereignty-ui` (only one)
2. **Semver bump?** → `patch` (bug fix), `minor` (new feature), `major` (breaking change)
3. **Summary** → Describe what changed (this becomes the CHANGELOG entry)

### 3. Version Bump

```bash
npx changeset version
```

This:
- Reads pending changesets from `.changeset/`
- Bumps `version` in `package.json`
- Generates/updates `CHANGELOG.md`
- Deletes consumed changeset files

### 4. Commit and Push

```bash
git add -A
git commit -m "chore: release @dannydanzka/sovereignty-ui vX.Y.Z"
git push
```

### 5. CI Publishes Automatically

The `release.yml` workflow:
1. Detects push to `main`
2. Builds the library
3. Publishes to GitHub Packages
4. Creates a GitHub Release

---

## Version Guidelines

| Change Type | Bump | Example |
|-------------|------|---------|
| Bug fix in existing component | `patch` | Fix Tooltip position |
| New component/hook/util | `minor` | Add Accordion component |
| New prop on existing component | `minor` | Add `size` prop to Avatar |
| Rename/remove exported API | `major` | Rename `useModal` return type |
| Token structure change | `major` | Change `color` key names |
| Breaking prop change | `major` | Change `onChange` signature |

---

## Consumer Update

After publish, consumers update with:

```bash
# In consumer project
npm update @dannydanzka/sovereignty-ui

# Or specific version
npm install @dannydanzka/sovereignty-ui@1.2.0
```

---

## First-Time Publish Setup

Only needed once per machine:

### GitHub Authentication for Packages (Publisher)

```bash
# Login to GitHub Packages (needed to publish)
npm login --registry=https://npm.pkg.github.com
# Username: dannydanzka
# Password: <GitHub Personal Access Token with write:packages scope>
# Email: your@email.com
```

### Consumer Project Setup

**IMPORTANT**: GitHub Packages ALWAYS requires authentication to install, even from public repositories. This is a GitHub Packages limitation.

#### 1. Create GitHub PAT (Classic)

GitHub → Avatar → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token (classic)**

| Field | Value |
|-------|-------|
| **Note** | `vercel-sovereignty-ui` (or descriptive name) |
| **Expiration** | No expiration (recommended — token is read-only) |
| **Scope** | `read:packages` only |

**IMPORTANT**: Must be a **classic** token, NOT fine-grained. Fine-grained tokens don't support `read:packages`.

#### 2. Configure `.npmrc` in Consumer Project

```
@dannydanzka:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

The `${NPM_TOKEN}` syntax reads from environment variable — works in both local and CI/CD.

#### 3. Local Development

```bash
# Option A: Export in shell (temporary, per session)
export NPM_TOKEN=ghp_xxxxxxxxxxxxx

# Option B: Add to ~/.zshrc or ~/.bashrc (permanent)
echo 'export NPM_TOKEN=ghp_xxxxxxxxxxxxx' >> ~/.zshrc
source ~/.zshrc

# Then install normally
yarn install
```

#### 4. Vercel (Production Deployment)

```bash
# Add NPM_TOKEN as environment variable in Vercel
echo -n "ghp_xxxxxxxxxxxxx" | vercel env add NPM_TOKEN production
```

Vercel reads `NPM_TOKEN` from env → `.npmrc` uses `${NPM_TOKEN}` → `yarn install` authenticates automatically.

---

## Token Renewal / Rotation

When a token expires or is compromised:

### 1. Generate New PAT

Same process as above: GitHub → Settings → Developer settings → Tokens (classic) → Generate new token (classic) with `read:packages` scope.

### 2. Update All Locations

| Location | How to Update |
|----------|---------------|
| **Local machine** | Update `~/.zshrc` or re-export `NPM_TOKEN=ghp_newtoken` |
| **Vercel** | `echo -n "ghp_newtoken" \| vercel env rm NPM_TOKEN production && echo -n "ghp_newtoken" \| vercel env add NPM_TOKEN production` |
| **Other CI/CD** | Update the `NPM_TOKEN` secret in the platform's settings |

### 3. Verify

```bash
# Local: test install
yarn install

# Vercel: trigger redeploy
vercel --prod
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `401 Unauthorized` on publish | Re-run `npm login --registry=https://npm.pkg.github.com` |
| `403 Forbidden` on publish | PAT needs `write:packages` scope |
| `401` on install (consumer) | PAT missing or expired — regenerate with `read:packages` |
| `Host key verification failed` (Vercel) | `.npmrc` missing `//npm.pkg.github.com/:_authToken=${NPM_TOKEN}` line |
| `Exit code: 128` on Vercel build | `NPM_TOKEN` env var not set in Vercel — add it with `vercel env add` |
| Consumer can't find package | Check `.npmrc` has `@dannydanzka:registry=https://npm.pkg.github.com` |
| Version already exists | Run `npx changeset version` to bump, don't manually edit |
| CI publish fails | Check `GITHUB_TOKEN` permissions in workflow |
| Fine-grained token doesn't work | Use classic token — fine-grained doesn't support `read:packages` scope |

---

## See Also

- Pattern: `.claude/patterns/frontend/presentation/sovereignty-ui-integration.md`
- Library README: `sovereignty-ui/README.md`
- Changeset docs: https://github.com/changesets/changesets
