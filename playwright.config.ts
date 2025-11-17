import { defineConfig, devices } from '@playwright/test';
import type { PlaywrightTestConfig } from '@playwright/test';

/**
 * Playwright Configuration for OrangeHRM Automation Framework
 * 
 * This configuration supports:
 * - Multiple browsers (Chromium, Firefox, WebKit)
 * - Parallel execution
 * - Retry mechanism
 * - Comprehensive reporting
 * - Artifact collection on failure
 */
const config: PlaywrightTestConfig = defineConfig({
  // Base URL for all tests
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  
  // Shared settings for all projects
  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Timeouts: Can be increased for slow internet (default 30s, can go up to 60s)
    actionTimeout: parseInt(process.env.ACTION_TIMEOUT || '30000'),
    navigationTimeout: parseInt(process.env.NAVIGATION_TIMEOUT || '30000'),
    headless: process.env.HEADLESS !== 'false',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Smoke test suite
    {
      name: 'smoke-chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: '**/*.spec.ts',
      grep: /@smoke/,
    },

    // Regression test suite
    {
      name: 'regression-chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: '**/*.spec.ts',
      grep: /@regression/,
    },
  ],

  // Web server configuration (if needed for local testing)
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

export default config;

