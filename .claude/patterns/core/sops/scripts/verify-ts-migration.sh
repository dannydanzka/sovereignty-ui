#!/bin/bash
# verify-ts-migration.sh — Detect broken imports after file renames
#
# PURPOSE: When a .js file is renamed to .ts (or .js → .actions.ts, etc.),
#          find all consumers that still import the old path
# USAGE:   ./verify-ts-migration.sh [--fix]
# CONTEXT: Run after renaming files during JS→TS migration
# HOOK:    pre-push (warns about broken imports before pushing)
#
# How it works:
#   1. Detects renamed files in the current branch (vs origin/qa or origin/master)
#   2. For each rename, searches for imports using the old path
#   3. Reports (or optionally fixes) broken imports
#
# Exit codes:
#   0 = no broken imports
#   1 = broken imports found

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

FIX_MODE=false
if [[ "${1:-}" == "--fix" ]]; then
  FIX_MODE=true
fi

# Determine base branch
BASE_BRANCH=""
for candidate in origin/qa origin/master origin/main; do
  if git rev-parse --verify "$candidate" &>/dev/null; then
    BASE_BRANCH="$candidate"
    break
  fi
done

if [[ -z "$BASE_BRANCH" ]]; then
  echo -e "${RED}ERROR: Could not find base branch (origin/qa, origin/master, origin/main)${NC}"
  exit 1
fi

echo "=========================================="
echo " verify-ts-migration.sh"
echo " Base: $BASE_BRANCH"
echo "=========================================="
echo ""

# Find renamed files (R = rename)
RENAMES=$(git diff --name-status --diff-filter=R "$BASE_BRANCH"...HEAD -- '*.ts' '*.tsx' '*.js' '*.jsx' 2>/dev/null || true)

if [[ -z "$RENAMES" ]]; then
  echo -e "${GREEN}No file renames detected. Nothing to verify.${NC}"
  exit 0
fi

ERRORS=0
FIXED=0

echo -e "${YELLOW}Renamed files detected:${NC}"
echo ""

while IFS=$'\t' read -r status old_path new_path; do
  [[ -z "$old_path" ]] && continue

  # Extract the import path (without extension)
  OLD_IMPORT=$(echo "$old_path" | sed 's|^src/|@/|' | sed 's/\.\(ts\|tsx\|js\|jsx\)$//')
  NEW_IMPORT=$(echo "$new_path" | sed 's|^src/|@/|' | sed 's/\.\(ts\|tsx\|js\|jsx\)$//')

  # Also check relative imports — extract just the filename without extension
  OLD_FILENAME=$(basename "$old_path" | sed 's/\.\(ts\|tsx\|js\|jsx\)$//')
  NEW_FILENAME=$(basename "$new_path" | sed 's/\.\(ts\|tsx\|js\|jsx\)$//')

  echo -e "  ${CYAN}$old_path${NC} → ${CYAN}$new_path${NC}"

  # Skip if names are identical (just extension change like .js → .ts)
  if [[ "$OLD_FILENAME" == "$NEW_FILENAME" ]]; then
    echo -e "    ${GREEN}Same base name — imports resolve via Metro/webpack${NC}"
    continue
  fi

  # Search for imports still using the old filename
  BROKEN=$(grep -rn "from.*['\"/]${OLD_FILENAME}['\"]" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null \
    | grep -v "node_modules" \
    | grep -v "$new_path" || true)

  if [[ -n "$BROKEN" ]]; then
    echo -e "    ${RED}BROKEN IMPORTS:${NC}"
    while IFS= read -r line; do
      echo -e "      $line"
      ERRORS=$((ERRORS + 1))

      if [[ "$FIX_MODE" == true ]]; then
        BROKEN_FILE=$(echo "$line" | cut -d: -f1)
        sed -i '' "s|/${OLD_FILENAME}'|/${NEW_FILENAME}'|g; s|/${OLD_FILENAME}\"|/${NEW_FILENAME}\"|g" "$BROKEN_FILE" 2>/dev/null || true
        FIXED=$((FIXED + 1))
      fi
    done <<< "$BROKEN"
  else
    echo -e "    ${GREEN}No broken imports${NC}"
  fi

  echo ""
done <<< "$RENAMES"

# --- RESULT ---
echo ""
if [[ $ERRORS -gt 0 ]]; then
  if [[ "$FIX_MODE" == true ]]; then
    echo -e "${YELLOW}=========================================="
    echo -e " FIXED: $FIXED import(s) updated"
    echo -e " Review changes before committing."
    echo -e "==========================================${NC}"
    exit 0
  else
    echo -e "${RED}=========================================="
    echo -e " BLOCKED: $ERRORS broken import(s) found"
    echo -e " Run with --fix to auto-repair, or fix manually."
    echo -e "==========================================${NC}"
    exit 1
  fi
else
  echo -e "${GREEN}=========================================="
  echo -e " PASSED: No broken imports from renames"
  echo -e "==========================================${NC}"
  exit 0
fi
