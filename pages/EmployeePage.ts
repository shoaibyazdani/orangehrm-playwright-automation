/**
 * Employee Page Object
 * 
 * Handles interactions with individual employee details page
 * for adding and editing employee information
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';

export class EmployeePage extends BasePage {
  // Locators - Personal Details Section
  private readonly personalDetailsHeader: Locator;
  private readonly firstNameInput: Locator;
  private readonly middleNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly employeeIdInput: Locator;
  private readonly saveButton: Locator;
  private readonly cancelButton: Locator;
  private readonly editButton: Locator;
  private readonly successMessage: Locator;

  // Additional Details Locators
  private readonly otherIdInput: Locator;
  private readonly driverLicenseInput: Locator;
  private readonly licenseExpiryDateInput: Locator;
  private readonly ssnNumberInput: Locator;
  private readonly sinNumberInput: Locator;
  private readonly nationalityDropdown: Locator;
  private readonly maritalStatusDropdown: Locator;
  private readonly dateOfBirthInput: Locator;
  private readonly genderRadio: Locator;
  private readonly militaryServiceInput: Locator;
  private readonly smokerCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    this.personalDetailsHeader = page.locator('h6:has-text("Personal Details")');
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.middleNameInput = page.locator('input[name="middleName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeIdInput = page.locator('input[class*="oxd-input"]').filter({ hasText: /Employee Id/i }).first();
    this.saveButton = page.locator('button[type="submit"]:has-text("Save")');
    this.cancelButton = page.locator('button[type="button"]:has-text("Cancel")');
    this.editButton = page.locator('button:has-text("Edit")');
    this.successMessage = page.locator('.oxd-text--toast-message');

    // Additional details
    this.otherIdInput = page.locator('input[placeholder*="Other Id"]');
    this.driverLicenseInput = page.locator('input[placeholder*="Driver\'s License Number"]');
    this.licenseExpiryDateInput = page.locator('input[placeholder*="License Expiry Date"]');
    this.ssnNumberInput = page.locator('input[placeholder*="SSN Number"]');
    this.sinNumberInput = page.locator('input[placeholder*="SIN Number"]');
    this.nationalityDropdown = page.locator('.oxd-select-text-input').first();
    this.maritalStatusDropdown = page.locator('.oxd-select-text-input').nth(1);
    this.dateOfBirthInput = page.locator('input[placeholder*="Date of Birth"]');
    this.genderRadio = page.locator('input[type="radio"]');
    this.militaryServiceInput = page.locator('input[placeholder*="Military Service"]');
    this.smokerCheckbox = page.locator('input[type="checkbox"]');
  }

  /**
   * Navigate to Add Employee page
   */
  async gotoAddEmployee(): Promise<void> {
    await this.navigateTo('/web/index.php/pim/addEmployee');
    await this.page.waitForLoadState('domcontentloaded');
    logger.step('Navigated to Add Employee page');
  }

  /**
   * Add new employee with basic information
   */
  async addEmployee(employeeData: {
    firstName: string;
    middleName?: string;
    lastName: string;
    employeeId?: string;
  }): Promise<void> {
    try {
      logger.step('Adding new employee', `Name: ${employeeData.firstName} ${employeeData.lastName}`);
      
      await this.typeWithValidation(this.firstNameInput, employeeData.firstName);
      
      if (employeeData.middleName) {
        await this.typeWithValidation(this.middleNameInput, employeeData.middleName);
      }
      
      await this.typeWithValidation(this.lastNameInput, employeeData.lastName);
      
      if (employeeData.employeeId) {
        // Clear existing ID if any
        await this.employeeIdInput.clear();
        await this.typeWithValidation(this.employeeIdInput, employeeData.employeeId);
      }
      
      await this.clickWithWait(this.saveButton);
      await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
      
      logger.step('Employee added successfully');
    } catch (error) {
      logger.error('Add employee failed', error);
      throw error;
    }
  }

  /**
   * Edit employee personal details
   */
  async editEmployeePersonalDetails(updates: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
  }): Promise<void> {
    try {
      logger.step('Editing employee personal details');
      
      // Click edit button if not already in edit mode
      if (await this.isVisible(this.editButton)) {
        await this.clickWithWait(this.editButton);
        await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
      }
      
      if (updates.firstName) {
        await this.typeWithValidation(this.firstNameInput, updates.firstName);
      }
      
      if (updates.middleName) {
        await this.typeWithValidation(this.middleNameInput, updates.middleName);
      }
      
      if (updates.lastName) {
        await this.typeWithValidation(this.lastNameInput, updates.lastName);
      }
      
      await this.clickWithWait(this.saveButton);
      await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
      
      logger.step('Employee details updated successfully');
    } catch (error) {
      logger.error('Edit employee failed', error);
      throw error;
    }
  }

  /**
   * Get employee full name
   */
  async getEmployeeFullName(): Promise<string> {
    const firstName = await this.firstNameInput.inputValue();
    const lastName = await this.lastNameInput.inputValue();
    return `${firstName} ${lastName}`.trim();
  }

  /**
   * Get employee ID
   */
  async getEmployeeId(): Promise<string> {
    return await this.employeeIdInput.inputValue();
  }

  /**
   * Verify success message
   */
  async verifySuccessMessage(): Promise<void> {
    await this.waitForVisible(this.successMessage);
    logger.step('Success message verified');
  }

  /**
   * Verify page is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await this.waitForVisible(this.personalDetailsHeader);
    logger.step('Employee page verified as loaded');
  }

  /**
   * Fill additional personal details
   */
  async fillAdditionalDetails(details: {
    otherId?: string;
    driverLicense?: string;
    licenseExpiryDate?: string;
    ssnNumber?: string;
    sinNumber?: string;
    nationality?: string;
    maritalStatus?: string;
    dateOfBirth?: string;
    gender?: 'Male' | 'Female';
    militaryService?: string;
    smoker?: boolean;
  }): Promise<void> {
    try {
      logger.step('Filling additional employee details');
      
      // Click edit if needed
      if (await this.isVisible(this.editButton)) {
        await this.clickWithWait(this.editButton);
        await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
      }
      
      if (details.otherId) {
        await this.typeWithValidation(this.otherIdInput, details.otherId);
      }
      
      if (details.driverLicense) {
        await this.typeWithValidation(this.driverLicenseInput, details.driverLicense);
      }
      
      if (details.licenseExpiryDate) {
        await this.typeWithValidation(this.licenseExpiryDateInput, details.licenseExpiryDate);
      }
      
      if (details.ssnNumber) {
        await this.typeWithValidation(this.ssnNumberInput, details.ssnNumber);
      }
      
      if (details.sinNumber) {
        await this.typeWithValidation(this.sinNumberInput, details.sinNumber);
      }
      
      if (details.nationality) {
        await this.safeSelect(this.nationalityDropdown, { label: details.nationality });
      }
      
      if (details.maritalStatus) {
        await this.safeSelect(this.maritalStatusDropdown, { label: details.maritalStatus });
      }
      
      if (details.dateOfBirth) {
        await this.typeWithValidation(this.dateOfBirthInput, details.dateOfBirth);
      }
      
      if (details.gender) {
        const genderOption = this.page.locator(`input[type="radio"][value="${details.gender === 'Male' ? '1' : '2'}"]`);
        await this.clickWithWait(genderOption);
      }
      
      if (details.militaryService) {
        await this.typeWithValidation(this.militaryServiceInput, details.militaryService);
      }
      
      if (details.smoker !== undefined) {
        const checkbox = this.smokerCheckbox.first();
        const isChecked = await checkbox.isChecked();
        if (details.smoker !== isChecked) {
          await this.clickWithWait(checkbox);
        }
      }
      
      await this.clickWithWait(this.saveButton);
      await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
      
      logger.step('Additional details saved successfully');
    } catch (error) {
      logger.error('Failed to fill additional details', error);
      throw error;
    }
  }
}

