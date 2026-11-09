#!/usr/bin/env bash
# The only entry point for the library's Maestro runs, over the example app on a booted iOS
# simulator. No account and no API: the flows exercise components, not a product.
#
#   FLOW=components/button e2e/scripts/run.sh
#   TAGS=component e2e/scripts/run.sh
#   e2e/scripts/run.sh                      every flow
set -euo pipefail

E2E_DIR="$(cd "$(dirname "$0")/.." && pwd)"
APP_ID="com.example"

fail() { echo "run.sh: $*" >&2; exit 2; }

command -v maestro >/dev/null || fail "maestro not installed (https://maestro.mobile.dev)"
xcrun simctl list devices booted | grep -q "(Booted)" || fail "no booted simulator"
xcrun simctl get_app_container booted "$APP_ID" >/dev/null 2>&1 || fail "$APP_ID not installed (npm run ios in example/)"

if [ -n "${FLOW:-}" ]; then
  TARGET="$E2E_DIR/flows/$FLOW.yaml"
  [ -f "$TARGET" ] || fail "no flow $TARGET"
  SLUG="${FLOW//\//-}"
  SELECT=("$TARGET")
else
  SLUG="${TAGS:+tags-${TAGS//,/-}}"
  SLUG="${SLUG:-all}"
  SELECT=("$E2E_DIR/flows" --config "$E2E_DIR/config.yaml")
  [ -n "${TAGS:-}" ] && SELECT+=(--include-tags "$TAGS")
fi

OUT="$E2E_DIR/runs/maestro-$SLUG-$(date +%Y%m%d-%H%M)"
mkdir -p "$OUT"

export MAESTRO_OPTS="${MAESTRO_OPTS:--Xmx256m -XX:+UseSerialGC}"
set +e
maestro test "${SELECT[@]}" \
  --format junit --output "$OUT/result.xml" \
  --test-output-dir "$OUT/artifacts" \
  --debug-output "$OUT/debug" --flatten-debug-output 2>&1 | tee "$OUT/maestro.log"
STATUS=${PIPESTATUS[0]}
set -e

if [ "$STATUS" -eq 0 ] && [ "${KEEP:-0}" != "1" ]; then
  for entry in "$OUT"/*; do
    case "$(basename "$entry")" in result.xml | maestro.log) ;; *) rm -rf "$entry" ;; esac
  done
fi
echo "run.sh: $([ "$STATUS" -eq 0 ] && echo PASS || echo FAIL) → $OUT"
exit "$STATUS"
