/**
 * PIM Page Object
 * 
 * Handles all interactions with the PIM (Personnel Information Management) module
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';

export class PIMPage extends BasePage {
  // Locators
  private readonly employeeListHeader: Locator;
  private readonly addButton: Locator;
  private readonly searchButton: Locator;
  private readonly resetButton: Locator;
  private readonly employeeNameSearchInput: Locator;
  private readonly employeeIdSearchInput: Locator;
  private readonly employmentStatusDropdown: Locator;
  private readonly includeDropdown: Locator;
  private readonly supervisorNameInput: Locator;
  private readonly jobTitleDropdown: Locator;
  private readonly subUnitDropdown: Locator;
  private readonly employeeTable: Locator;
  private readonly noRecordsFound: Locator;

  constructor(page: Page) {
    super(page);
    this.employeeListHeader = page.locator('h6:has-text("Employee Information")');
    this.addButton = page.locator('button:has-text("Add")');
    this.searchButton = page.locator('button[type="submit"]:has-text("Search")');
    this.resetButton = page.locator('button[type="button"]:has-text("Reset")');
    this.employeeNameSearchInput = page.locator('input[placeholder*="Employee Name"]');
    this.employeeIdSearchInput = page.locator('input[placeholder*="Employee Id"]');
    this.employmentStatusDropdown = page.locator('.oxd-select-text-input').first();
    this.includeDropdown = page.locator('.oxd-select-text-input').nth(1);
    this.supervisorNameInput = page.locator('input[placeholder*="Supervisor Name"]');
    this.jobTitleDropdown = page.locator('.oxd-select-text-input').nth(2);
    this.subUnitDropdown = page.locator('.oxd-select-text-input').nth(3);
    this.employeeTable = page.locator('.oxd-table');
    this.noRecordsFound = page.locator('.oxd-text--span:has-text("No Records Found")');
  }

  /**
   * Navigate to PIM > Employee List
   */
  async goto(): Promise<void> {
    await this.navigateTo('/web/index.php/pim/viewEmployeeList');
    // Wait for header to appear instead of network idle
    await this.waitForVisible(this.employeeListHeader);
    logger.step('Navigated to PIM > Employee List');
  }

  /**
   * Click Add Employee button
   */
  async clickAddEmployee(): Promise<void> {
    await this.clickWithWait(this.addButton);
    // Wait for page to load instead of network idle
    await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
    logger.step('Clicked Add Employee button');
  }

  /**
   * Search for employee by name
   */
  async searchEmployeeByName(employeeName: string): Promise<void> {
    try {
      logger.step('Searching for employee', `Name: ${employeeName}`);
      await this.typeWithValidation(this.employeeNameSearchInput, employeeName);
      
      // Wait for autocomplete and select first option
      await this.page.waitForTimeout(1000);
      const firstOption = this.page.locator('.oxd-autocomplete-option').first();
      if (await this.isVisible(firstOption)) {
        await this.clickWithWait(firstOption);
      }
      
      await this.clickWithWait(this.searchButton);
      await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
      logger.step('Employee search completed');
    } catch (error) {
      logger.error('Employee search failed', error);
      throw error;
    }
  }

  /**
   * Search for employee by ID
   */
  async searchEmployeeById(employeeId: string): Promise<void> {
    try {
      logger.step('Searching for employee', `ID: ${employeeId}`);
      await this.typeWithValidation(this.employeeIdSearchInput, employeeId);
      await this.clickWithWait(this.searchButton);
      await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
      logger.step('Employee search completed');
    } catch (error) {
      logger.error('Employee search failed', error);
      throw error;
    }
  }

  /**
   * Search for employee with multiple criteria
   */
  async searchEmployee(criteria: {
    employeeName?: string;
    employeeId?: string;
    employmentStatus?: string;
    include?: string;
    supervisorName?: string;
    jobTitle?: string;
    subUnit?: string;
  }): Promise<void> {
    try {
      logger.step('Searching for employee with criteria', JSON.stringify(criteria));
      
      if (criteria.employeeName) {
        await this.typeWithValidation(this.employeeNameSearchInput, criteria.employeeName);
        await this.page.waitForTimeout(1000);
        const firstOption = this.page.locator('.oxd-autocomplete-option').first();
        if (await this.isVisible(firstOption)) {
          await this.clickWithWait(firstOption);
        }
      }
      
      if (criteria.employeeId) {
        await this.typeWithValidation(this.employeeIdSearchInput, criteria.employeeId);
      }
      
      if (criteria.employmentStatus) {
        await this.safeSelect(this.employmentStatusDropdown, { label: criteria.employmentStatus });
      }
      
      if (criteria.include) {
        await this.safeSelect(this.includeDropdown, { label: criteria.include });
      }
      
      if (criteria.supervisorName) {
        await this.typeWithValidation(this.supervisorNameInput, criteria.supervisorName);
        await this.page.waitForTimeout(1000);
        const firstOption = this.page.locator('.oxd-autocomplete-option').first();
        if (await this.isVisible(firstOption)) {
          await this.clickWithWait(firstOption);
        }
      }
      
      if (criteria.jobTitle) {
        await this.safeSelect(this.jobTitleDropdown, { label: criteria.jobTitle });
      }
      
      if (criteria.subUnit) {
        await this.safeSelect(this.subUnitDropdown, { label: criteria.subUnit });
      }
      
      await this.clickWithWait(this.searchButton);
      await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
      logger.step('Employee search completed');
    } catch (error) {
      logger.error('Employee search failed', error);
      throw error;
    }
  }

  /**
   * Verify employee exists in table
   */
  async verifyEmployeeExists(employeeName: string): Promise<boolean> {
    await this.searchEmployeeByName(employeeName);
    return !(await this.isVisible(this.noRecordsFound));
  }

  /**
   * Get employee count from table
   */
  async getEmployeeCount(): Promise<number> {
    const rows = this.page.locator('.oxd-table-row');
    return await rows.count();
  }

  /**
   * Click on employee row to view/edit
   */
  async clickEmployeeRow(employeeName: string): Promise<void> {
    try {
      await this.searchEmployeeByName(employeeName);
      const row = this.page.locator(`.oxd-table-row:has-text("${employeeName}")`).first();
      await this.clickWithWait(row);
      await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
      logger.step('Clicked employee row', `Name: ${employeeName}`);
    } catch (error) {
      logger.error('Failed to click employee row', error);
      throw error;
    }
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
   * Verify page is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await this.waitForVisible(this.employeeListHeader);
    logger.step('PIM page verified as loaded');
  }
}

