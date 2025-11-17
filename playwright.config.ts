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
  // Reduce workers in CI to avoid overwhelming slow OrangeHRM site
  workers: process.env.CI ? 1 : undefined,
  // Increase test timeout for slow site (2 minutes per test)
  timeout: parseInt(process.env.PLAYWRIGHT_TEST_TIMEOUT || '120000'),
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
    // Timeouts: Increased for slow OrangeHRM site (60s for actions/navigation)
    actionTimeout: parseInt(process.env.ACTION_TIMEOUT || (process.env.CI ? '60000' : '30000')),
    navigationTimeout: parseInt(process.env.NAVIGATION_TIMEOUT || (process.env.CI ? '60000' : '30000')),
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

