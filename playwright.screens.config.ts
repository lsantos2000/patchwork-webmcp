import { defineConfig, devices } from '@playwright/test';

// Screenshot capture harness. Deliberately a separate config from playwright.config.ts
// so these captures never join the 64-check application suite that CI and the
// submission materials count.
const useLocalServer = process.env.PLAYWRIGHT_USE_LOCAL === '1';

export default defineConfig({
  testDir: './scripts/screens',
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  webServer: useLocalServer ? {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000,
  } : undefined,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? (useLocalServer ? 'http://localhost:3000' : 'https://patchwork-webmcp.pages.dev'),
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
