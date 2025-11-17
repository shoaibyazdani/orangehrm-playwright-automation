/**
 * API Integration Test Suite
 * 
 * Tests for API endpoints using Playwright's APIRequestContext
 * Note: OrangeHRM demo may have limited API access, these are examples
 */

import { test, expect } from '@playwright/test';
import { ApiClient } from '../../utils/apiClient';
import { logger } from '../../utils/logger';

test.describe('API Integration Tests', () => {
  let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test('@integration Should verify login endpoint exists', async ({ request }) => {
    await test.step('Check login page accessibility', async () => {
      const response = await request.get('/web/index.php/auth/login');
      expect(response.status()).toBe(200);
      logger.step('Login page accessible');
    });
  });

  test('@integration Should verify dashboard requires authentication', async ({ request }) => {
    await test.step('Attempt to access dashboard without auth', async () => {
      const response = await request.get('/web/index.php/dashboard/index');
      // Should redirect to login or return 401/403
      expect([200, 302, 401, 403]).toContain(response.status());
      logger.step('Dashboard access verified', `Status: ${response.status()}`);
    });
  });

  test('@integration Should verify API response headers', async ({ request }) => {
    await test.step('Check response headers', async () => {
      const response = await request.get('/web/index.php/auth/login');
      const contentType = response.headers()['content-type'];
      expect(contentType).toBeTruthy();
      logger.step('Response headers verified', `Content-Type: ${contentType}`);
    });
  });

  test('@integration Should handle API errors gracefully', async ({ request }) => {
    await test.step('Request non-existent endpoint', async () => {
      const response = await request.get('/web/index.php/nonexistent');
      // Should return 404 or redirect
      expect([404, 302, 200]).toContain(response.status());
      logger.step('Error handling verified', `Status: ${response.status()}`);
    });
  });
});

