/**
 * Login Page Object
 * 
 * Handles all interactions with the OrangeHRM login page
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';

export class LoginPage extends BasePage {
  // Locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly errorMessage: Locator;
  private readonly loginForm: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.forgotPasswordLink = page.locator('.orangehrm-login-forgot');
    this.errorMessage = page.locator('.oxd-alert-content-text');
    this.loginForm = page.locator('.orangehrm-login-form');
  }

  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    await this.navigateTo('/web/index.php/auth/login');
    await this.waitForVisible(this.loginForm);
    logger.step('Navigated to login page');
  }

  /**
   * Perform login with credentials
   */
  async login(username: string, password: string): Promise<void> {
    try {
      logger.step('Performing login', `Username: ${username}`);
      await this.typeWithValidation(this.usernameInput, username);
      await this.typeWithValidation(this.passwordInput, password);
      await this.clickWithWait(this.loginButton);
      
      // Wait for the login action to complete
      // The page will either navigate (success) or show error (failure)
      // Give it time to respond
      await this.page.waitForTimeout(2000);
      
      logger.step('Login completed');
    } catch (error) {
      logger.error('Login failed', error);
      throw new Error(`Login failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Perform login with default credentials
   */
  async loginWithDefaults(): Promise<void> {
    await this.login('Admin', 'admin123');
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    // Wait a bit for error message to appear, then check
    await this.page.waitForTimeout(1000);
    const isVisible = await this.isVisible(this.errorMessage, 5000);
    if (isVisible) {
      return await this.getText(this.errorMessage);
    }
    return '';
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageVisible(): Promise<boolean> {
    // Wait a bit for error message to appear
    await this.page.waitForTimeout(1000);
    return await this.isVisible(this.errorMessage, 5000);
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.clickWithWait(this.forgotPasswordLink);
    logger.step('Clicked forgot password link');
  }

  /**
   * Verify login page is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await this.waitForVisible(this.loginForm);
    logger.step('Login page verified as loaded');
  }

  /**
   * Clear login form
   */
  async clearForm(): Promise<void> {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
    logger.debug('Login form cleared');
  }
}

