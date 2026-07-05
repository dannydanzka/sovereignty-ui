/**
 * Playwright E2E Test Configuration
 *
 * - Auth setup project runs first, saves storageState
 * - Chromium-only for now (add Firefox/WebKit later)
 * - webServer starts Next.js dev automatically
 * - Credentials from env vars (never hardcoded)
 */

import path from 'path';

import dotenv from 'dotenv';

import { defineConfig, devices } from '@playwright/test';

dotenv.config({ path: path.resolve(import.meta.dirname, '.env.local') });

const PORT = process.env['PORT'] || 3000;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  expect: { timeout: 5_000 },

  forbidOnly: Boolean(process.env['CI']),
  fullyParallel: true,
  projects: [
    {
      name: 'auth-setup',
      testDir: './e2e/setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      dependencies: ['auth-setup'],
      name: 'participant',
      testIgnore: [/.*\.unauth\.spec\.ts/, /\/admin\//],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/playwright/.auth/participant.json',
      },
    },
    {
      dependencies: ['auth-setup'],
      name: 'admin',
      testIgnore: [/.*\.unauth\.spec\.ts/, /\/auth\/logout\.spec\.ts$/],
      testMatch: /\/(auth|admin)\/.+\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/playwright/.auth/admin.json',
      },
    },
    {
      name: 'unauthenticated',
      testMatch: /.*\.unauth\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  reporter: [['html', { open: 'never' }], ['list']],

  retries: process.env['CI'] ? 2 : 0,

  testDir: './e2e/specs',
  timeout: 30_000,

  use: {
    baseURL: BASE_URL,
    launchOptions: {
      slowMo: process.env['PLAYWRIGHT_SLOW_MO']
        ? Number(process.env['PLAYWRIGHT_SLOW_MO'])
        : 0,
    },
    locale: 'es-MX',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },

  webServer: {
    // Production server by default (no Turbopack cold compile) — assumes `yarn build` ran first.
    // Set E2E_DEV_SERVER=1 to run against `yarn dev` for local iteration with HMR.
    // The `test:e2e` script runs `yarn build && playwright test` so the server just starts.
    command: process.env['E2E_DEV_SERVER']
      ? `PORT=${PORT} yarn dev`
      : `PORT=${PORT} yarn start`,
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
    url: BASE_URL,
  },

  workers: process.env['CI'] ? 1 : undefined,
});
