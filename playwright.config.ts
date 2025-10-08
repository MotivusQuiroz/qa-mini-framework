import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load .env if present (safe defaults still apply below)
dotenv.config();

// --- Environment (with safe defaults matching .env.example) ---
const UI_BASE_URL    = process.env.UI_BASE_URL    ?? 'http://127.0.0.1:5173';
const REPORTS_DIR    = process.env.REPORTS_DIR    ?? 'playwright-report';
const TEST_RESULTS   = process.env.TEST_RESULTS_DIR ?? 'test-results';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },

  // HTML report in its own folder
  reporter: [['html', { outputFolder: REPORTS_DIR, open: 'never' }]],

  // Per-test artifacts in their own folder
  outputDir: TEST_RESULTS,

  retries: 1,

  use: {
    baseURL: UI_BASE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
});
