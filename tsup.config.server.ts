import { defineConfig } from 'tsup';

/**
 * SERVER-SAFE bundle: pure utils and design tokens, deliberately WITHOUT the `'use client'` banner
 * that `tsup.config.ts` puts on the component bundle — a server component has to be able to call
 * `formatCurrency` or read a token on the server.
 *
 * `clean: false` because it runs after the client build and shares `dist/`.
 */
export default defineConfig({
  clean: false,
  dts: true,
  entry: {
    'tokens/index': 'src/tokens/index.ts',
    'utils/index': 'src/utils/index.ts',
  },
  external: ['react', 'react-dom', 'styled-components'],
  format: ['esm', 'cjs'],
  sourcemap: true,
  splitting: true,
  treeshake: true,
});
