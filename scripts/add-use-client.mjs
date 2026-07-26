/**
 * Prepends `'use client';` to the built COMPONENT and HOOK entries.
 *
 * Why a post-build step instead of tsup's `banner`: tsup does emit the banner, but its `dts` pass
 * re-reads the bundles and strips module-level directives ("Module level directives cause errors
 * when bundled, "use client" ... was ignored"). So the directive has to be re-applied after every
 * other step has finished.
 *
 * Why it matters: every component here uses state, effects or styled-components. Without the
 * directive, importing one from a React Server Component fails at runtime — and the consumer
 * putting `'use client'` on its own file does NOT fix it, because the boundary has to be declared
 * by the module that owns the hook.
 *
 * `utils` and `tokens` are deliberately absent: they are pure functions and plain objects, and a
 * server component must stay free to call them on the server.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const DIRECTIVE = "'use client';";
const ENTRIES = ['dist/index.js', 'dist/index.cjs', 'dist/hooks/index.js', 'dist/hooks/index.cjs'];

let marked = 0;

for (const file of ENTRIES) {
  let source;
  try {
    source = readFileSync(file, 'utf8');
  } catch {
    /* A missing entry means the build shape changed and this script has gone stale. Failing loudly
       beats silently shipping components that crash in a server component. */
    console.error(`add-use-client: expected build output not found: ${file}`);
    process.exit(1);
  }

  if (source.startsWith(DIRECTIVE) || source.startsWith('"use client"')) continue;

  /* CJS output starts with its own 'use strict'; the client directive has to come before it. */
  writeFileSync(file, `${DIRECTIVE}\n${source}`);
  marked += 1;
}

console.log(`add-use-client: marked ${marked}/${ENTRIES.length} entries as client modules`);
