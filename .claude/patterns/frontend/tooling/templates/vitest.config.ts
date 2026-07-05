/// <reference types="vitest" />
import path from 'path';

import { defineConfig } from 'vitest/config';

// eslint-disable-next-line no-restricted-syntax -- Vitest requires default export
export default defineConfig({
  resolve: {
    alias: {
      /* eslint-disable sort-keys-fix/sort-keys-fix -- Order matters for Vite alias resolution: longer paths must precede shorter ones */
      '@api': path.resolve(__dirname, 'src/app/api'),
      '@apps/admin/components': path.resolve(__dirname, 'src/apps/admin/presentation/components'),
      '@apps/admin/constants': path.resolve(__dirname, 'src/apps/admin/constants'),
      '@apps/admin/domain': path.resolve(__dirname, 'src/apps/admin/domain'),
      '@apps/admin/hooks': path.resolve(__dirname, 'src/apps/admin/presentation/hooks'),
      '@apps/admin/layouts': path.resolve(__dirname, 'src/apps/admin/presentation/layouts'),
      '@apps/admin/screens': path.resolve(__dirname, 'src/apps/admin/presentation/screens'),
      '@apps/auth/domain': path.resolve(__dirname, 'src/apps/auth/domain'),
      '@apps/public/components': path.resolve(__dirname, 'src/apps/public/presentation/components'),
      '@apps/public/constants': path.resolve(__dirname, 'src/apps/public/constants'),
      '@apps/public/domain': path.resolve(__dirname, 'src/apps/public/domain'),
      '@apps/public/hooks': path.resolve(__dirname, 'src/apps/public/presentation/hooks'),
      '@apps/public/layouts': path.resolve(__dirname, 'src/apps/public/presentation/layouts'),
      '@apps/public/screens': path.resolve(__dirname, 'src/apps/public/presentation/screens'),
      '@apps/shared/screens': path.resolve(__dirname, 'src/apps/shared/presentation/screens'),
      '@apps': path.resolve(__dirname, 'src/apps'),
      '@api-error': path.resolve(
        __dirname,
        'src/libs/shared/helpers/error-handling/api-error-handler'
      ),
      '@app-error': path.resolve(__dirname, 'src/libs/shared/helpers/error-handling/app-error'),
      '@assets': path.resolve(__dirname, 'src/libs/presentation/assets'),
      '@components': path.resolve(__dirname, 'src/libs/presentation/components'),
      '@config': path.resolve(__dirname, 'src/libs/infrastructure/config'),
      '@constants': path.resolve(__dirname, 'src/libs/shared/constants'),
      '@database': path.resolve(__dirname, 'src/libs/infrastructure/database'),
      '@domain': path.resolve(__dirname, 'src/libs/domain'),
      '@domain-types': path.resolve(__dirname, 'src/libs/domain/types'),
      '@email': path.resolve(__dirname, 'src/libs/infrastructure/email'),
      '@entities': path.resolve(__dirname, 'src/libs/domain/entities'),
      '@error-provider': path.resolve(
        __dirname,
        'src/libs/shared/helpers/error-handling/error-provider'
      ),
      '@helpers': path.resolve(__dirname, 'src/libs/shared/helpers'),
      '@hooks': path.resolve(__dirname, 'src/libs/presentation/hooks'),
      '@i18n': path.resolve(__dirname, 'src/libs/shared/i18n'),
      '@interfaces': path.resolve(__dirname, 'src/libs/domain/interfaces'),
      '@layouts': path.resolve(__dirname, 'src/libs/presentation/layouts'),
      '@logger': path.resolve(__dirname, 'src/libs/shared/helpers/error-handling/logger'),
      '@middleware': path.resolve(__dirname, 'src/libs/infrastructure/middleware'),
      '@mocks': path.resolve(__dirname, 'src/libs/shared/testing/mocks'),
      '@pages': path.resolve(__dirname, 'src/libs/presentation/pages'),
      '@providers': path.resolve(__dirname, 'src/libs/presentation/providers'),
      '@redux': path.resolve(__dirname, 'src/libs/infrastructure/state'),
      '@repositories': path.resolve(__dirname, 'src/libs/infrastructure/repositories'),
      '@services': path.resolve(__dirname, 'src/libs/infrastructure/services'),
      '@store': path.resolve(__dirname, 'src/libs/infrastructure/state/store'),
      '@styles': path.resolve(__dirname, 'src/libs/presentation/styles'),
      '@testing': path.resolve(__dirname, 'src/libs/shared/testing'),
      '@thunks': path.resolve(__dirname, 'src/libs/shared/helpers/thunk'),
      '@use-case-error': path.resolve(
        __dirname,
        'src/libs/shared/helpers/error-handling/use-case-error-handler'
      ),
      '@utils': path.resolve(__dirname, 'src/libs/shared/utils'),
      '@validation': path.resolve(__dirname, 'src/libs/domain/validation'),
      /* eslint-enable sort-keys-fix/sort-keys-fix */
    },
  },
  test: {
    clearMocks: true,
    coverage: {
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.stories.{js,jsx,ts,tsx}',
        'src/**/*.config.{js,ts}',
        'src/**/index.{js,ts,tsx}',
        'src/app/**/*.{js,jsx,ts,tsx}',
        'src/**/__tests__/**/*',
        'src/**/__mocks__/**/*',
        'src/**/*.styled.{ts,tsx}',
        'src/**/testing/mocks/**/*',
        'src/**/database/**/*',
        'src/**/*.interfaces.{ts,tsx}',
        'src/**/*.constants.{ts,tsx}',
      ],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      provider: 'v8',
      reporter: ['text', 'lcov', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      thresholds: {
        branches: 70,
        functions: 75,
        lines: 80,
        statements: 80,
      },
    },
    css: false,
    environment: 'jsdom',
    // @ts-expect-error - environmentMatchGlobs is valid in Vitest v4 but missing from types
    environmentMatchGlobs: [
      ['src/**/domain/**/*.test.ts', 'node'],
      ['src/**/infrastructure/repositories/**/*.test.ts', 'node'],
      ['src/app/api/**/*.test.ts', 'node'],
    ],
    exclude: ['node_modules', '.next', 'coverage', 'dist', 'build'],
    globals: true,
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}', 'src/**/__tests__/**/*.{js,jsx,ts,tsx}'],
    maxWorkers: '50%',
    restoreMocks: true,
    setupFiles: ['./vitest.setup.ts'],
    testTimeout: 3000,
  },
});
