# SOP: Merge Verification & Automation

> **PURPOSE**: Automated verification scripts to prevent broken merges and broken imports
> **SCOPE**: All projects using git merge workflows
> **UPDATED**: 2026-04-09

---

## 1. Scripts Overview

| Script | Purpose | Hook | Blocks on failure |
|--------|---------|------|-------------------|
| `verify-merge.sh` | Detect conflict markers, duplicate exports/imports | **pre-commit** | Yes |
| `verify-ts-migration.sh` | Detect broken imports after file renames | **pre-push** | Yes |

---

## 2. verify-merge.sh

### What it detects

1. **Conflict markers** (`<<<<<<<`, `=======`, `>>>>>>>`) left in source files
2. **Duplicate export declarations** (same function/const exported twice)
3. **Duplicate import paths** (same module imported twice)

### Usage

```bash
# Manual run (checks staged + unstaged)
./scripts/verify-merge.sh

# As pre-commit hook (checks staged only)
./scripts/verify-merge.sh --staged-only
```

### Integration with husky

```bash
# In project root, add to .husky/pre-commit:
if git diff --cached --name-only | grep -qE '\.(ts|tsx|js|jsx)$'; then
  ./scripts/verify-merge.sh --staged-only
fi
```

### When it runs

- **Always** during merge commits (pre-commit hook catches it)
- **Always** after conflict resolution before committing
- Does NOT run on regular commits with no source changes (fast exit)

---

## 3. verify-ts-migration.sh

### What it detects

When files are renamed (e.g., `user.js` → `user.actions.ts`), finds consumers still importing the old path.

### Usage

```bash
# Detect only
./scripts/verify-ts-migration.sh

# Auto-fix broken imports
./scripts/verify-ts-migration.sh --fix
```

### Integration with husky

```bash
# In project root, add to .husky/pre-push:
if git diff --name-status --diff-filter=R origin/main...HEAD -- '*.ts' '*.tsx' | grep -q .; then
  ./scripts/verify-ts-migration.sh
fi
```

### Smart detection

- Only checks files where the **base name changed** (e.g., `user` → `user.actions`)
- Skips pure extension changes (e.g., `file.js` → `file.ts`) since bundlers resolve both
- Searches both `@/` alias imports and relative imports

---

## 4. Project Integration

### File locations

```
project-root/
├── scripts/
│   ├── verify-merge.sh
│   └── verify-ts-migration.sh
├── .husky/
│   ├── pre-commit                   # Calls verify-merge.sh
│   └── pre-push                     # Calls verify-ts-migration.sh
```

### Setup in a new project

```bash
# 1. Copy scripts from sovereignty
cp sovereignty/core/sops/scripts/*.sh ./scripts/
chmod +x ./scripts/*.sh

# 2. Add to husky pre-commit
cat >> .husky/pre-commit << 'EOF'

# Merge verification — conflict markers + duplicate exports
if git diff --cached --name-only | grep -qE '\.(ts|tsx|js|jsx)$'; then
  ./scripts/verify-merge.sh --staged-only
fi
EOF

# 3. Add to husky pre-push
cat >> .husky/pre-push << 'EOF'

# TS migration verification — broken imports from renames
if git diff --name-status --diff-filter=R origin/main...HEAD -- '*.ts' '*.tsx' 2>/dev/null | grep -q .; then
  ./scripts/verify-ts-migration.sh
fi
EOF
```

---

## 5. Error Examples

### verify-merge.sh catches

```
# Conflict markers left in file
FAIL: Conflict markers found in:
  src/state/reducers/cart/cart.reducers.test.js

# Duplicate export (merge added same function twice)
FAIL: Duplicate export declarations:
  src/state/selectors/cart/cart.selectors.ts: getPromotionalGifts
```

### verify-ts-migration.sh catches

```
# Import still using old filename after rename
src/store/action/user/user.js → src/store/action/user/user.actions.ts
  BROKEN IMPORTS:
    src/sagas/user/user.js:7:import * as actionCreators from '@/store/action/user/user';
```

---

## See Also

- `pr-documentation.md` — PR creation template and workflow
- `feature-delivery-workflow.md` — End-to-end delivery process
