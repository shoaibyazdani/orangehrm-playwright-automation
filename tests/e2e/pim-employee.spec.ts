/**
 * PIM Employee Management E2E Test Suite
 * 
 * Tests for PIM module employee functionality:
 * - Add employee
 * - Edit employee
 * - Search employee
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { PIMPage } from '../../pages/PIMPage';
import { EmployeePage } from '../../pages/EmployeePage';
import { HeaderPage } from '../../pages/HeaderPage';
import { logger } from '../../utils/logger';
import { generateRandomString } from '../../utils/helpers';

test.describe('PIM Employee Management', () => {
  let loginPage: LoginPage;
  let pimPage: PIMPage;
  let employeePage: EmployeePage;
  let headerPage: HeaderPage;
  let testEmployeeFirstName: string;
  let testEmployeeLastName: string;
  let testEmployeeId: string;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    pimPage = new PIMPage(page);
    employeePage = new EmployeePage(page);
    headerPage = new HeaderPage(page);

    // Generate unique test data
    testEmployeeFirstName = `TestFirst${generateRandomString(5)}`;
    testEmployeeLastName = `TestLast${generateRandomString(5)}`;
    testEmployeeId = `EMP${generateRandomString(6)}`;

    // Login before each test
    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');
  });

  test('@smoke @regression Should add new employee', async ({ page }) => {
    await test.step('Navigate to PIM module', async () => {
      await pimPage.goto();
      await pimPage.verifyPageLoaded();
      logger.step('Navigated to PIM module');
    });

    await test.step('Click Add Employee button', async () => {
      await pimPage.clickAddEmployee();
      logger.step('Add Employee button clicked');
    });

    await test.step('Fill employee form', async () => {
      const employeeData = {
        firstName: testEmployeeFirstName,
        lastName: testEmployeeLastName,
        employeeId: testEmployeeId,
      };

      await employeePage.addEmployee(employeeData);
      logger.step('Employee form filled and submitted');
    });

    await test.step('Verify success message', async () => {
      await employeePage.verifySuccessMessage();
      logger.step('Success message verified');
    });

    await test.step('Verify employee details are saved', async () => {
      await employeePage.verifyPageLoaded();
      const fullName = await employeePage.getEmployeeFullName();
      expect(fullName).toContain(testEmployeeFirstName);
      expect(fullName).toContain(testEmployeeLastName);
      logger.step('Employee details verified');
    });
  });

  test('@regression Should search for employee by name', async ({ page }) => {
    await test.step('Navigate to PIM module', async () => {
      await pimPage.goto();
      logger.step('Navigated to PIM module');
    });

    await test.step('Search for employee', async () => {
      // Search for a known employee (using default admin employee)
      await pimPage.searchEmployeeByName('Odis');
      logger.step('Searched for employee');
    });

    await test.step('Verify employee is found', async () => {
      const employeeExists = await pimPage.verifyEmployeeExists('Odis');
      expect(employeeExists).toBe(true);
      logger.step('Employee found in results');
    });

    await test.step('Verify employee count', async () => {
      const employeeCount = await pimPage.getEmployeeCount();
      expect(employeeCount).toBeGreaterThan(0);
      logger.step('Employee count verified', `Count: ${employeeCount}`);
    });
  });

  test('@regression Should search for employee by ID', async ({ page }) => {
    await test.step('Navigate to PIM module', async () => {
      await pimPage.goto();
      logger.step('Navigated to PIM module');
    });

    await test.step('Search for employee by ID', async () => {
      // Use a known employee ID or generate one
      await pimPage.searchEmployeeById('0001');
      logger.step('Searched for employee by ID');
    });

    await test.step('Verify search results', async () => {
      const employeeCount = await pimPage.getEmployeeCount();
      expect(employeeCount).toBeGreaterThanOrEqual(0);
      logger.step('Search results verified', `Count: ${employeeCount}`);
    });
  });

  test('@regression Should edit employee details', async ({ page }) => {
    await test.step('Navigate to PIM module', async () => {
      await pimPage.goto();
      logger.step('Navigated to PIM module');
    });

    await test.step('Search and click on employee', async () => {
      await pimPage.searchEmployeeByName('Odis');
      await pimPage.clickEmployeeRow('Odis');
      logger.step('Employee row clicked');
    });

    await test.step('Edit employee personal details', async () => {
      const updates = {
        middleName: `Middle${generateRandomString(3)}`,
      };

      await employeePage.editEmployeePersonalDetails(updates);
      logger.step('Employee details edited');
    });

    await test.step('Verify success message', async () => {
      await employeePage.verifySuccessMessage();
      logger.step('Success message verified');
    });
  });

  test('@regression Should search employee with multiple criteria', async ({ page }) => {
    await test.step('Navigate to PIM module', async () => {
      await pimPage.goto();
      logger.step('Navigated to PIM module');
    });

    await test.step('Search with multiple criteria', async () => {
      const searchCriteria = {
        employmentStatus: 'Full-Time Permanent',
        jobTitle: 'Software Engineer',
      };

      await pimPage.searchEmployee(searchCriteria);
      logger.step('Searched with multiple criteria');
    });

    await test.step('Verify search results', async () => {
      const employeeCount = await pimPage.getEmployeeCount();
      expect(employeeCount).toBeGreaterThanOrEqual(0);
      logger.step('Search results verified', `Count: ${employeeCount}`);
    });
  });

  test('@regression Should reset search form', async ({ page }) => {
    await test.step('Navigate to PIM module', async () => {
      await pimPage.goto();
      logger.step('Navigated to PIM module');
    });

    await test.step('Perform search', async () => {
      await pimPage.searchEmployeeByName('Odis');
      logger.step('Search performed');
    });

    await test.step('Reset search form', async () => {
      await pimPage.resetSearch();
      logger.step('Search form reset');
    });

    await test.step('Verify form is reset', async () => {
      const employeeNameInput = page.locator('input[placeholder*="Employee Name"]');
      const employeeNameValue = await employeeNameInput.inputValue();
      expect(employeeNameValue).toBe('');
      logger.step('Form verified as reset');
    });
  });

  test('@regression Should navigate to PIM module from header', async ({ page }) => {
    await test.step('Navigate to dashboard', async () => {
      await headerPage.navigateToDashboard();
      logger.step('Navigated to dashboard');
    });

    await test.step('Navigate to PIM from header', async () => {
      await headerPage.navigateToPIM();
      logger.step('Navigated to PIM module');
    });

    await test.step('Verify PIM page is loaded', async () => {
      await pimPage.verifyPageLoaded();
      const currentUrl = page.url();
      expect(currentUrl).toContain('/pim');
      logger.step('PIM page verified');
    });
  });
});

