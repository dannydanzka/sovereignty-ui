import { defineConfig } from 'tsup';

/**
 * CLIENT bundle: components and hooks.
 *
 * The `'use client'` banner is not cosmetic. These modules use state, effects and
 * styled-components, so importing any of them from a React Server Component fails at runtime
 * ("useState only works in Client Components"). The consumer putting `'use client'` on its own file
 * does not help: the boundary has to be declared by the module that owns the hook.
 *
 * `utils` and `tokens` are built WITHOUT the banner by `tsup.config.server.ts` — they are pure
 * functions and plain objects, and a server component must stay free to call them on the server.
 * That is also why this is two configs and not one array config: tsup's array form silently drops
 * a per-entry `banner`.
 */
export default defineConfig({
  banner: { js: "'use client';" },
  clean: true,
  dts: true,
  entry: {
    'hooks/index': 'src/hooks/index.ts',
    index: 'src/index.ts',
  },
  external: ['react', 'react-dom', 'styled-components'],
  format: ['esm', 'cjs'],
  sourcemap: true,
  splitting: true,
  treeshake: true,
});
