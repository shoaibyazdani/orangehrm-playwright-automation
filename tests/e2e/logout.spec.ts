/**
 * Logout E2E Test Suite
 * 
 * Tests for logout functionality
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { HeaderPage } from '../../pages/HeaderPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { logger } from '../../utils/logger';

test.describe('Logout Functionality', () => {
  let loginPage: LoginPage;
  let headerPage: HeaderPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    headerPage = new HeaderPage(page);
    dashboardPage = new DashboardPage(page);

    // Login before each test
    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');
    await dashboardPage.verifyPageLoaded();
  });

  test('@smoke @regression Should successfully logout', async ({ page }) => {
    await test.step('Verify user is logged in', async () => {
      const currentUrl = page.url();
      expect(currentUrl).toContain('/dashboard');
      logger.step('User verified as logged in');
    });

    await test.step('Perform logout', async () => {
      await headerPage.logout();
      logger.step('Logout performed');
    });

    await test.step('Verify redirected to login page', async () => {
      await loginPage.verifyPageLoaded();
      const currentUrl = page.url();
      expect(currentUrl).toContain('/auth/login');
      logger.step('Redirected to login page');
    });

    await test.step('Verify login form is visible', async () => {
      const loginForm = page.locator('.orangehrm-login-form');
      await expect(loginForm).toBeVisible();
      logger.step('Login form verified as visible');
    });
  });

  test('@regression Should not access dashboard after logout', async ({ page }) => {
    await test.step('Perform logout', async () => {
      await headerPage.logout();
      logger.step('Logout performed');
    });

    await test.step('Attempt to access dashboard directly', async () => {
      await page.goto('/web/index.php/dashboard/index');
      await page.waitForLoadState('networkidle');
      logger.step('Attempted to access dashboard');
    });

    await test.step('Verify redirected to login page', async () => {
      const currentUrl = page.url();
      expect(currentUrl).toContain('/auth/login');
      logger.step('Redirected to login page - access denied');
    });
  });

  test('@regression Should logout from user dropdown menu', async ({ page }) => {
    await test.step('Verify user dropdown is visible', async () => {
      await headerPage.verifyUserDropdownVisible();
      logger.step('User dropdown verified as visible');
    });

    await test.step('Click user dropdown', async () => {
      const userDropdown = page.locator('.oxd-userdropdown-tab');
      await userDropdown.click();
      logger.step('User dropdown clicked');
    });

    await test.step('Verify logout option is visible', async () => {
      const logoutLink = page.locator('a:has-text("Logout")');
      await expect(logoutLink).toBeVisible();
      logger.step('Logout option verified as visible');
    });

    await test.step('Click logout', async () => {
      await headerPage.logout();
      logger.step('Logout clicked');
    });

    await test.step('Verify logged out', async () => {
      await loginPage.verifyPageLoaded();
      const currentUrl = page.url();
      expect(currentUrl).toContain('/auth/login');
      logger.step('Logout verified');
    });
  });

  test('@regression Should maintain logout state on page refresh', async ({ page }) => {
    await test.step('Perform logout', async () => {
      await headerPage.logout();
      logger.step('Logout performed');
    });

    await test.step('Refresh page', async () => {
      await page.reload();
      await page.waitForLoadState('networkidle');
      logger.step('Page refreshed');
    });

    await test.step('Verify still on login page', async () => {
      const currentUrl = page.url();
      expect(currentUrl).toContain('/auth/login');
      logger.step('Still on login page after refresh');
    });
  });
});

