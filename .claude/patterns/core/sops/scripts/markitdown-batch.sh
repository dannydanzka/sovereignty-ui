#!/usr/bin/env bash
# markitdown-batch.sh — Batch-convert a directory tree to Markdown with MarkItDown.
#
# Mirrors source structure by creating an `_md/` subfolder inside EACH folder that
# contains convertible files. Originals are never touched. Idempotent: skips files
# whose `.md` already exists, and never re-processes anything already under an `_md/`.
#
# PART OF: core/sops/document-ingestion.md (the "Batch conversion" procedure)
# REQUIRES: pip install 'markitdown[all]'   (CLI, not the MCP server)
#
# USAGE:
#   markitdown-batch.sh <SOURCE_DIR> [OUTPUT_MODE]
#
#   SOURCE_DIR    Root directory to convert (required).
#   OUTPUT_MODE   per-folder  (default) → SOURCE/<each folder>/_md/<name>.md
#                 mirror               → SOURCE/_extraccion/<relative path>/<name>.md
#
# EXIT: writes a progress log + a failed log next to the script's run; prints a
#       final "ok / fail / skip / total" summary line.
set -uo pipefail

SRC="${1:-}"
MODE="${2:-per-folder}"

if [ -z "$SRC" ] || [ ! -d "$SRC" ]; then
  echo "ERROR: pass a valid SOURCE_DIR. Usage: markitdown-batch.sh <dir> [per-folder|mirror]" >&2
  exit 1
fi

if ! command -v markitdown >/dev/null 2>&1; then
  echo "ERROR: 'markitdown' not found. Install with: pip install 'markitdown[all]'" >&2
  exit 1
fi

SRC="$(cd "$SRC" && pwd)"  # absolute
LOG="${SRC}/_markitdown-progress.log"
FAILED="${SRC}/_markitdown-failed.log"
: > "$LOG"; : > "$FAILED"

# Convertible everything except: already-markdown, .DS_Store, and anything already
# inside an _md/ or _extraccion/ output tree.
mapfile_args=(-type f -not -name '.DS_Store' -not -iname '*.md'
  -not -path '*/_md/*' -not -path '*/_extraccion/*')

total=0
while IFS= read -r -d '' _; do total=$((total+1)); done \
  < <(find "$SRC" "${mapfile_args[@]}" -print0)

echo "TOTAL: $total | MODE: $MODE | SRC: $SRC" | tee -a "$LOG"
echo "Start: $(date '+%H:%M:%S')" | tee -a "$LOG"; echo "---" | tee -a "$LOG"

ok=0; fail=0; skip=0; n=0
while IFS= read -r -d '' f; do
  n=$((n+1))
  dir="$(dirname "$f")"; base="$(basename "$f")"; name="${base%.*}"

  if [ "$MODE" = "mirror" ]; then
    rel="${dir#"$SRC"}"; rel="${rel#/}"
    outdir="${SRC}/_extraccion/${rel}"
  else
    outdir="${dir}/_md"
  fi
  out="${outdir}/${name}.md"

  if [ -f "$out" ]; then skip=$((skip+1)); continue; fi
  mkdir -p "$outdir"

  if markitdown "$f" -o "$out" 2>>"$FAILED" && [ -s "$out" ]; then
    ok=$((ok+1))
  else
    fail=$((fail+1)); echo "FAIL: $f" >> "$FAILED"; rm -f "$out"
  fi

  if [ $((n % 25)) -eq 0 ]; then
    echo "[$n/$total] ok=$ok fail=$fail skip=$skip ($(date '+%H:%M:%S'))" | tee -a "$LOG"
  fi
done < <(find "$SRC" "${mapfile_args[@]}" -print0)

echo "---" | tee -a "$LOG"
echo "DONE $(date '+%H:%M:%S') | ok=$ok fail=$fail skip=$skip total=$total" | tee -a "$LOG"
