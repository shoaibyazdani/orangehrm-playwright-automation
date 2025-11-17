/**
 * Admin Page Object
 * 
 * Handles all interactions with the Admin module, specifically User Management
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';

export class AdminPage extends BasePage {
  // Locators
  private readonly userManagementMenu: Locator;
  private readonly usersSubMenu: Locator;
  private readonly addButton: Locator;
  private readonly searchButton: Locator;
  private readonly resetButton: Locator;
  private readonly usernameSearchInput: Locator;
  private readonly userRoleDropdown: Locator;
  private readonly employeeNameInput: Locator;
  private readonly statusDropdown: Locator;
  private readonly userTable: Locator;
  private readonly deleteButton: Locator;
  private readonly confirmDeleteButton: Locator;
  private readonly noRecordsFound: Locator;

  // Add User Form Locators
  private readonly addUserRoleDropdown: Locator;
  private readonly addEmployeeNameInput: Locator;
  private readonly addStatusDropdown: Locator;
  private readonly addUsernameInput: Locator;
  private readonly addPasswordInput: Locator;
  private readonly addConfirmPasswordInput: Locator;
  private readonly saveButton: Locator;
  private readonly cancelButton: Locator;
  private readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    // Navigation
    this.userManagementMenu = page.locator('span:has-text("User Management")');
    this.usersSubMenu = page.locator('a:has-text("Users")');

    // Search Section
    this.usernameSearchInput = page.locator('input[placeholder*="Username"]').first();
    this.userRoleDropdown = page.locator('.oxd-select-text-input').first();
    this.employeeNameInput = page.locator('input[placeholder*="Employee Name"]');
    this.statusDropdown = page.locator('.oxd-select-text-input').nth(1);
    // Search button - try multiple selectors for reliability
    this.searchButton = page.locator('button[type="submit"]:has-text("Search")')
      .or(page.locator('button:has-text("Search")'))
      .first();
    this.resetButton = page.locator('button[type="button"]:has-text("Reset")')
      .or(page.locator('button:has-text("Reset")'))
      .first();

    // Table
    this.addButton = page.locator('button:has-text("Add")');
    this.userTable = page.locator('.oxd-table');
    this.deleteButton = page.locator('button.oxd-button--label-danger');
    this.confirmDeleteButton = page.locator('button.oxd-button--label-danger.orangehrm-button-margin');
    this.noRecordsFound = page.locator('.oxd-text--span:has-text("No Records Found")');

    // Add User Form
    this.addUserRoleDropdown = page.locator('.oxd-select-text-input').first();
    this.addEmployeeNameInput = page.locator('input[placeholder*="Employee Name"]');
    this.addStatusDropdown = page.locator('.oxd-select-text-input').nth(1);
    this.addUsernameInput = page.locator('input[autocomplete="off"]').first();
    this.addPasswordInput = page.locator('input[type="password"]').first();
    this.addConfirmPasswordInput = page.locator('input[type="password"]').nth(1);
    this.saveButton = page.locator('button[type="submit"]:has-text("Save")');
    this.cancelButton = page.locator('button[type="button"]:has-text("Cancel")');
    this.successMessage = page.locator('.oxd-text--toast-message');
  }

  /**
   * Navigate to Admin > User Management > Users
   */
  async goto(): Promise<void> {
    await this.navigateTo('/web/index.php/admin/viewSystemUsers');
    // Wait for page to load instead of network idle
    await this.page.waitForLoadState('domcontentloaded');
    logger.step('Navigated to Admin > User Management');
  }

  /**
   * Click Add User button
   */
  async clickAddUser(): Promise<void> {
    await this.clickWithWait(this.addButton);
    // Wait for form to appear instead of network idle
    await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
    logger.step('Clicked Add User button');
  }

  /**
   * Search for user by username
   */
  async searchUserByUsername(username: string): Promise<void> {
    try {
      logger.step('Searching for user', `Username: ${username}`);
      await this.typeWithValidation(this.usernameSearchInput, username);
      
      // Wait for search button to be available with longer timeout for slow internet
      await this.searchButton.waitFor({ state: 'visible', timeout: 60000 });
      await this.clickWithWait(this.searchButton, { timeout: 60000 });
      await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });
      logger.step('User search completed');
    } catch (error) {
      logger.error('User search failed', error);
      throw error;
    }
  }

  /**
   * Search for user with multiple criteria
   */
  async searchUser(criteria: {
    username?: string;
    userRole?: string;
    employeeName?: string;
    status?: string;
  }): Promise<void> {
    try {
      logger.step('Searching for user with criteria', JSON.stringify(criteria));
      
      if (criteria.username) {
        await this.typeWithValidation(this.usernameSearchInput, criteria.username);
      }
      
      if (criteria.userRole) {
        await this.safeSelect(this.userRoleDropdown, { label: criteria.userRole });
      }
      
      if (criteria.employeeName) {
        await this.typeWithValidation(this.employeeNameInput, criteria.employeeName);
        // Wait for autocomplete and select first option
        await this.page.waitForTimeout(1000);
        const firstOption = this.page.locator('.oxd-autocomplete-option').first();
        if (await this.isVisible(firstOption)) {
          await this.clickWithWait(firstOption);
        }
      }
      
      if (criteria.status) {
        await this.safeSelect(this.statusDropdown, { label: criteria.status });
      }
      
      await this.clickWithWait(this.searchButton);
      await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
      logger.step('User search completed');
    } catch (error) {
      logger.error('User search failed', error);
      throw error;
    }
  }

  /**
   * Add new user
   */
  async addUser(userData: {
    userRole: string;
    employeeName: string;
    status: string;
    username: string;
    password: string;
  }): Promise<void> {
    try {
      logger.step('Adding new user', `Username: ${userData.username}`);
      
      // Click Add button
      await this.clickWithWait(this.addButton);
      await this.waitForNetworkIdle();
      
      // Fill form
      await this.safeSelect(this.addUserRoleDropdown, { label: userData.userRole });
      await this.typeWithValidation(this.addEmployeeNameInput, userData.employeeName);
      
      // Wait for autocomplete and select
      await this.page.waitForTimeout(1000);
      const firstOption = this.page.locator('.oxd-autocomplete-option').first();
      if (await this.isVisible(firstOption)) {
        await this.clickWithWait(firstOption);
      }
      
      await this.safeSelect(this.addStatusDropdown, { label: userData.status });
      await this.typeWithValidation(this.addUsernameInput, userData.username);
      await this.typeWithValidation(this.addPasswordInput, userData.password);
      await this.typeWithValidation(this.addConfirmPasswordInput, userData.password);
      
      // Save
      await this.clickWithWait(this.saveButton);
      await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
      
      logger.step('User added successfully');
    } catch (error) {
      logger.error('Add user failed', error);
      throw error;
    }
  }

  /**
   * Delete user by username
   */
  async deleteUser(username: string): Promise<void> {
    try {
      logger.step('Deleting user', `Username: ${username}`);
      
      // First search for the user
      await this.searchUserByUsername(username);
      
      // Check if user exists
      if (await this.isVisible(this.noRecordsFound)) {
        throw new Error(`User ${username} not found`);
      }
      
      // Find and click delete button for the user
      const row = this.page.locator(`.oxd-table-row:has-text("${username}")`);
      if (await this.isVisible(row)) {
        const deleteBtn = row.locator('button.oxd-button--label-danger').first();
        await this.clickWithWait(deleteBtn);
        
        // Confirm deletion
        await this.clickWithWait(this.confirmDeleteButton);
        await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
        
        logger.step('User deleted successfully');
      } else {
        throw new Error(`User row not found for ${username}`);
      }
    } catch (error) {
      logger.error('Delete user failed', error);
      throw error;
    }
  }

  /**
   * Verify user exists in table
   */
  async verifyUserExists(username: string): Promise<boolean> {
    await this.searchUserByUsername(username);
    return !(await this.isVisible(this.noRecordsFound));
  }

  /**
   * Get user count from table
   */
  async getUserCount(): Promise<number> {
    const rows = this.page.locator('.oxd-table-row');
    return await rows.count();
  }

  /**
   * Reset search form
   */
  async resetSearch(): Promise<void> {
    await this.clickWithWait(this.resetButton);
    await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
    logger.step('Search form reset');
  }

  /**
   * Verify success message
   */
  async verifySuccessMessage(): Promise<void> {
    await this.waitForVisible(this.successMessage);
    logger.step('Success message verified');
  }
}

