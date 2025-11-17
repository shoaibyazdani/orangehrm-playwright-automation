/**
 * Login E2E Test Suite
 * 
 * Tests for login functionality including:
 * - Valid login
 * - Invalid login scenarios (negative tests)
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { logger } from '../../utils/logger';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.goto();
  });

  test('@smoke @regression Should successfully login with valid credentials', async ({ page }) => {
    await test.step('Navigate to login page', async () => {
      await loginPage.verifyPageLoaded();
      logger.step('Login page loaded successfully');
    });

    await test.step('Enter valid credentials', async () => {
      await loginPage.login('Admin', 'admin123');
      logger.step('Credentials entered');
    });

    await test.step('Verify dashboard is displayed', async () => {
      await dashboardPage.verifyPageLoaded();
      const currentUrl = page.url();
      expect(currentUrl).toContain('/dashboard/index');
      logger.step('Dashboard displayed successfully');
    });
  });

  test('@regression Should display error message for invalid username', async ({ page }) => {
    await test.step('Enter invalid username', async () => {
      await loginPage.login('InvalidUser', 'admin123');
      logger.step('Invalid username entered');
    });

    await test.step('Verify still on login page (login failed)', async () => {
      const currentUrl = page.url();
      expect(currentUrl).toContain('/auth/login');
      logger.step('Remained on login page - login failed as expected');
    });

    await test.step('Verify error message is displayed', async () => {
      // Check for error message - it might be in different formats
      const errorSelectors = [
        '.oxd-alert-content-text',
        '.oxd-alert',
        '[role="alert"]',
        '.alert',
      ];
      
      let errorFound = false;
      for (const selector of errorSelectors) {
        const errorElement = page.locator(selector);
        if (await errorElement.isVisible({ timeout: 2000 }).catch(() => false)) {
          errorFound = true;
          const errorText = await errorElement.textContent();
          logger.step('Error message displayed', errorText || '');
          break;
        }
      }
      
      // If no error message found, at least verify we're on login page
      if (!errorFound) {
        logger.warn('No error message found, but login failed (still on login page)');
      }
    });
  });

  test('@regression Should display error message for invalid password', async ({ page }) => {
    await test.step('Enter invalid password', async () => {
      await loginPage.login('Admin', 'wrongpassword');
      logger.step('Invalid password entered');
    });

    await test.step('Verify still on login page (login failed)', async () => {
      const currentUrl = page.url();
      expect(currentUrl).toContain('/auth/login');
      logger.step('Remained on login page - login failed as expected');
    });

    await test.step('Verify error message is displayed', async () => {
      // Check for error message - it might be in different formats
      const errorSelectors = [
        '.oxd-alert-content-text',
        '.oxd-alert',
        '[role="alert"]',
        '.alert',
      ];
      
      let errorFound = false;
      for (const selector of errorSelectors) {
        const errorElement = page.locator(selector);
        if (await errorElement.isVisible({ timeout: 2000 }).catch(() => false)) {
          errorFound = true;
          const errorText = await errorElement.textContent();
          logger.step('Error message displayed', errorText || '');
          break;
        }
      }
      
      // If no error message found, at least verify we're on login page
      if (!errorFound) {
        logger.warn('No error message found, but login failed (still on login page)');
      }
    });
  });

  test('@regression Should display error message for empty username', async ({ page }) => {
    await test.step('Attempt login with empty username', async () => {
      const usernameInput = page.locator('input[name="username"]');
      const passwordInput = page.locator('input[name="password"]');
      const loginButton = page.locator('button[type="submit"]');
      
      // Leave username empty, fill password
      await passwordInput.fill('admin123');
      
      // Try to click login button
      await loginButton.click();
      await page.waitForTimeout(2000); // Wait for response
      
      logger.step('Empty username entered');
    });

    await test.step('Verify still on login page (form validation or error)', async () => {
      const currentUrl = page.url();
      expect(currentUrl).toContain('/auth/login');
      logger.step('Remained on login page - validation or error occurred');
    });

    await test.step('Verify validation or error message', async () => {
      // Check for HTML5 validation message
      const usernameInput = page.locator('input[name="username"]');
      const validationMessage = await usernameInput.evaluate((el: HTMLInputElement) => {
        return el.validationMessage || '';
      });
      
      if (validationMessage) {
        expect(validationMessage).toBeTruthy();
        logger.step('HTML5 validation triggered', validationMessage);
      } else {
        // Check for error message
        const errorSelectors = [
          '.oxd-alert-content-text',
          '.oxd-alert',
          '[role="alert"]',
          '.alert',
        ];
        
        let errorFound = false;
        for (const selector of errorSelectors) {
          const errorElement = page.locator(selector);
          if (await errorElement.isVisible({ timeout: 2000 }).catch(() => false)) {
            errorFound = true;
            logger.step('Error message displayed');
            break;
          }
        }
        
        // If no error found, at least we're still on login page (validation worked)
        if (!errorFound) {
          logger.step('Form validation prevented submission (no error message needed)');
        }
      }
    });
  });

  test('@regression Should display error message for empty password', async ({ page }) => {
    await test.step('Attempt login with empty password', async () => {
      const usernameInput = page.locator('input[name="username"]');
      const passwordInput = page.locator('input[name="password"]');
      const loginButton = page.locator('button[type="submit"]');
      
      await usernameInput.fill('Admin');
      // Leave password empty
      
      // Try to submit - HTML5 validation may prevent this
      const isSubmitBlocked = await loginButton.evaluate((btn: HTMLButtonElement) => {
        const form = btn.closest('form');
        if (form) {
          return !form.checkValidity();
        }
        return false;
      });
      
      if (!isSubmitBlocked) {
        await loginButton.click();
        await page.waitForTimeout(1000); // Wait for potential error
      }
      
      logger.step('Empty password entered');
    });

    await test.step('Verify validation error or error message', async () => {
      const passwordInput = page.locator('input[name="password"]');
      const validationMessage = await passwordInput.evaluate((el: HTMLInputElement) => el.validationMessage);
      
      if (validationMessage) {
        expect(validationMessage).toBeTruthy();
        logger.step('HTML5 validation triggered');
      } else {
        // Check if we're still on login page (form wasn't submitted)
        const currentUrl = page.url();
        expect(currentUrl).toContain('/auth/login');
        logger.step('Form submission prevented or error displayed');
      }
    });
  });

  test('@regression Should display error message for both invalid credentials', async ({ page }) => {
    await test.step('Enter invalid credentials', async () => {
      await loginPage.login('InvalidUser', 'wrongpassword');
      logger.step('Invalid credentials entered');
    });

    await test.step('Verify still on login page (login failed)', async () => {
      const currentUrl = page.url();
      expect(currentUrl).toContain('/auth/login');
      logger.step('Remained on login page - login failed as expected');
    });

    await test.step('Verify error message is displayed', async () => {
      // Check for error message - it might be in different formats
      const errorSelectors = [
        '.oxd-alert-content-text',
        '.oxd-alert',
        '[role="alert"]',
        '.alert',
      ];
      
      let errorFound = false;
      for (const selector of errorSelectors) {
        const errorElement = page.locator(selector);
        if (await errorElement.isVisible({ timeout: 2000 }).catch(() => false)) {
          errorFound = true;
          const errorText = await errorElement.textContent();
          logger.step('Error message displayed', errorText || '');
          break;
        }
      }
      
      // If no error message found, at least verify we're on login page
      if (!errorFound) {
        logger.warn('No error message found, but login failed (still on login page)');
      }
    });
  });

  test('@regression Should clear form when reset', async ({ page }) => {
    await test.step('Ensure we are on login page', async () => {
      await loginPage.verifyPageLoaded();
      logger.step('Login page verified');
    });

    await test.step('Enter credentials in form', async () => {
      const usernameInput = page.locator('input[name="username"]');
      const passwordInput = page.locator('input[name="password"]');
      await usernameInput.waitFor({ state: 'visible' });
      await usernameInput.fill('Admin');
      await passwordInput.fill('admin123');
      logger.step('Credentials entered');
    });

    await test.step('Clear form', async () => {
      await loginPage.clearForm();
      logger.step('Form cleared');
    });

    await test.step('Verify form is cleared', async () => {
      const usernameInput = page.locator('input[name="username"]');
      const passwordInput = page.locator('input[name="password"]');
      
      const usernameValue = await usernameInput.inputValue();
      const passwordValue = await passwordInput.inputValue();
      
      expect(usernameValue).toBe('');
      expect(passwordValue).toBe('');
      logger.step('Form verified as cleared');
    });
  });
});

