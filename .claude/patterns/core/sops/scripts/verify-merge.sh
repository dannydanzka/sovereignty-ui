#!/bin/bash
# verify-merge.sh — Post-resolution, pre-commit verification
#
# PURPOSE: Prevent broken merges from being committed
# USAGE:   ./verify-merge.sh [--staged-only]
# CONTEXT: Run after resolving conflicts, BEFORE git commit
# HOOK:    pre-commit (blocks commit if issues found)
#
# Detects:
#   1. Leftover conflict markers (<<<<<<, ======, >>>>>>)
#   2. Duplicate export declarations (same name exported twice)
#   3. Duplicate import declarations
#
# Exit codes:
#   0 = clean, safe to commit
#   1 = issues found, DO NOT commit

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
STAGED_ONLY=false

if [[ "${1:-}" == "--staged-only" ]]; then
  STAGED_ONLY=true
fi

# Determine which files to check
if [[ "$STAGED_ONLY" == true ]]; then
  FILES=$(git diff --cached --name-only --diff-filter=ACMR 2>/dev/null | grep -E '\.(ts|tsx|js|jsx)$' || true)
else
  FILES=$(git diff --name-only --diff-filter=ACMR 2>/dev/null | grep -E '\.(ts|tsx|js|jsx)$' || true)
  STAGED=$(git diff --cached --name-only --diff-filter=ACMR 2>/dev/null | grep -E '\.(ts|tsx|js|jsx)$' || true)
  FILES=$(echo -e "${FILES}\n${STAGED}" | sort -u | grep -v '^$' || true)
fi

if [[ -z "$FILES" ]]; then
  echo -e "${GREEN}No source files to verify.${NC}"
  exit 0
fi

echo "=========================================="
echo " verify-merge.sh — Post-resolution check"
echo "=========================================="
echo ""

# --- CHECK 1: Conflict markers ---
echo -e "${YELLOW}[1/3] Checking for conflict markers...${NC}"

CONFLICT_FILES=""
while IFS= read -r file; do
  [[ -z "$file" ]] && continue
  [[ ! -f "$file" ]] && continue
  if grep -qE '^(<<<<<<<|=======|>>>>>>>)' "$file" 2>/dev/null; then
    CONFLICT_FILES="${CONFLICT_FILES}  ${file}\n"
    ERRORS=$((ERRORS + 1))
  fi
done <<< "$FILES"

if [[ -n "$CONFLICT_FILES" ]]; then
  echo -e "${RED}FAIL: Conflict markers found in:${NC}"
  echo -e "$CONFLICT_FILES"
else
  echo -e "${GREEN}  OK${NC}"
fi

# --- CHECK 2: Duplicate export declarations ---
echo -e "${YELLOW}[2/3] Checking for duplicate exports...${NC}"

DUPLICATE_EXPORTS=""
while IFS= read -r file; do
  [[ -z "$file" ]] && continue
  [[ ! -f "$file" ]] && continue
  DUPS=$(grep -E '^export (const|function|class|enum|type|interface) ' "$file" 2>/dev/null \
    | sed -E 's/^export (const|function|class|enum|type|interface) ([a-zA-Z0-9_]+).*/\2/' \
    | sort | uniq -d || true)
  if [[ -n "$DUPS" ]]; then
    DUPLICATE_EXPORTS="${DUPLICATE_EXPORTS}  ${file}: ${DUPS}\n"
    ERRORS=$((ERRORS + 1))
  fi
done <<< "$FILES"

if [[ -n "$DUPLICATE_EXPORTS" ]]; then
  echo -e "${RED}FAIL: Duplicate export declarations:${NC}"
  echo -e "$DUPLICATE_EXPORTS"
else
  echo -e "${GREEN}  OK${NC}"
fi

# --- CHECK 3: Duplicate import declarations ---
echo -e "${YELLOW}[3/3] Checking for duplicate imports...${NC}"

DUPLICATE_IMPORTS=""
while IFS= read -r file; do
  [[ -z "$file" ]] && continue
  [[ ! -f "$file" ]] && continue
  DUPS=$(grep -E "^import .+ from " "$file" 2>/dev/null \
    | sed -E "s/^import .+ from ['\"](.+)['\"].*/\1/" \
    | sort | uniq -d || true)
  if [[ -n "$DUPS" ]]; then
    DUPLICATE_IMPORTS="${DUPLICATE_IMPORTS}  ${file}: ${DUPS}\n"
    ERRORS=$((ERRORS + 1))
  fi
done <<< "$FILES"

if [[ -n "$DUPLICATE_IMPORTS" ]]; then
  echo -e "${RED}FAIL: Duplicate import paths:${NC}"
  echo -e "$DUPLICATE_IMPORTS"
else
  echo -e "${GREEN}  OK${NC}"
fi

# --- RESULT ---
echo ""
if [[ $ERRORS -gt 0 ]]; then
  echo -e "${RED}=========================================="
  echo -e " BLOCKED: $ERRORS issue(s) found"
  echo -e " Fix before committing."
  echo -e "==========================================${NC}"
  exit 1
else
  echo -e "${GREEN}=========================================="
  echo -e " PASSED: All checks clean"
  echo -e "==========================================${NC}"
  exit 0
fi
