import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

/**
 * Playwright E2E configuration for TRL Research Frontend
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e/specs',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  globalSetup: './e2e/global-setup.ts',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  outputDir: 'e2e/test-results',
  snapshotPathTemplate: '{testDir}/__snapshots__/{arg}-{projectName}{ext}',
  webServer: isCI
    ? {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        timeout: 120000,
        reuseExistingServer: false,
      }
    : [
        {
          command: 'npm run start:backend',
          url: 'http://localhost:8080/health',
          timeout: 120000,
          reuseExistingServer: true,
        },
        {
          command: 'npm run dev',
          url: 'http://localhost:3000',
          timeout: 120000,
          reuseExistingServer: true,
        },
      ],
});
