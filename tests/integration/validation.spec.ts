/**
 * Validation Integration Test Suite
 * 
 * Tests for form validation and UI component validation
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { logger } from '../../utils/logger';

test.describe('Form Validation Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('@integration Should validate required fields on login form', async ({ page }) => {
    await test.step('Check username field is required', async () => {
      const usernameInput = page.locator('input[name="username"]');
      const isRequired = await usernameInput.evaluate((el: HTMLInputElement) => el.required);
      expect(isRequired).toBe(true);
      logger.step('Username field verified as required');
    });

    await test.step('Check password field is required', async () => {
      const passwordInput = page.locator('input[name="password"]');
      const isRequired = await passwordInput.evaluate((el: HTMLInputElement) => el.required);
      expect(isRequired).toBe(true);
      logger.step('Password field verified as required');
    });
  });

  test('@integration Should validate input types', async ({ page }) => {
    await test.step('Check password field type', async () => {
      const passwordInput = page.locator('input[name="password"]');
      const inputType = await passwordInput.evaluate((el: HTMLInputElement) => el.type);
      expect(inputType).toBe('password');
      logger.step('Password field type verified');
    });

    await test.step('Check username field type', async () => {
      const usernameInput = page.locator('input[name="username"]');
      const inputType = await usernameInput.evaluate((el: HTMLInputElement) => el.type);
      expect(['text', 'email']).toContain(inputType);
      logger.step('Username field type verified');
    });
  });

  test('@integration Should validate form submission button', async ({ page }) => {
    await test.step('Check submit button exists', async () => {
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toBeVisible();
      logger.step('Submit button verified');
    });

    await test.step('Check submit button is enabled', async () => {
      const submitButton = page.locator('button[type="submit"]');
      const isDisabled = await submitButton.isDisabled();
      expect(isDisabled).toBe(false);
      logger.step('Submit button verified as enabled');
    });
  });
});

