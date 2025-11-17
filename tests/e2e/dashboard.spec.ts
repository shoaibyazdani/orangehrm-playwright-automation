/**
 * Dashboard E2E Test Suite
 * 
 * Tests for dashboard functionality:
 * - Verify widgets are visible
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { logger } from '../../utils/logger';

test.describe('Dashboard Functionality', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    // Login before each test
    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');
  });

  test('@smoke @regression Should display all main widgets', async ({ page }) => {
    await test.step('Navigate to dashboard', async () => {
      await dashboardPage.goto();
      await dashboardPage.verifyPageLoaded();
      logger.step('Navigated to dashboard');
    });

    await test.step('Verify Time at Work widget', async () => {
      await dashboardPage.verifyTimeAtWorkWidget();
      logger.step('Time at Work widget verified');
    });

    await test.step('Verify My Actions widget', async () => {
      await dashboardPage.verifyMyActionsWidget();
      logger.step('My Actions widget verified');
    });

    await test.step('Verify Quick Launch widget', async () => {
      await dashboardPage.verifyQuickLaunchWidget();
      logger.step('Quick Launch widget verified');
    });
  });

  test('@regression Should verify widget count', async ({ page }) => {
    await test.step('Navigate to dashboard', async () => {
      await dashboardPage.goto();
      logger.step('Navigated to dashboard');
    });

    await test.step('Get widget count', async () => {
      const widgetCount = await dashboardPage.getWidgetCount();
      expect(widgetCount).toBeGreaterThan(0);
      logger.step('Widget count verified', `Count: ${widgetCount}`);
    });
  });

  test('@regression Should verify specific widgets are visible', async ({ page }) => {
    await test.step('Navigate to dashboard', async () => {
      await dashboardPage.goto();
      logger.step('Navigated to dashboard');
    });

    await test.step('Verify all widgets', async () => {
      await dashboardPage.verifyAllWidgets();
      logger.step('All widgets verified');
    });
  });
});

