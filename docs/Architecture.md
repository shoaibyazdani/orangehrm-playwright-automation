# Architecture Documentation

## Project Layout

```
OrangeHRM/
├── tests/
│   ├── e2e/                    # End-to-end test suites
│   │   ├── login.spec.ts
│   │   ├── dashboard.spec.ts
│   │   ├── admin-user-management.spec.ts
│   │   ├── pim-employee.spec.ts
│   │   └── logout.spec.ts
│   └── integration/            # Integration test suites
│       ├── api.spec.ts
│       └── validation.spec.ts
├── pages/                      # Page Object Models
│   ├── BasePage.ts            # Base class for all pages
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   ├── AdminPage.ts
│   ├── PIMPage.ts
│   ├── EmployeePage.ts
│   └── HeaderPage.ts
├── utils/                      # Utility modules
│   ├── logger.ts              # Logging utility
│   ├── apiClient.ts           # API client wrapper
│   ├── helpers.ts             # Helper functions
│   └── env.ts                 # Environment management
├── fixtures/                   # Test fixtures and data
│   ├── testData.ts            # Test data constants
│   └── auth.ts                # Authentication fixtures
├── config/                     # Configuration files (if needed)
├── workflows/                  # CI/CD workflows
│   └── ci.yml                 # GitHub Actions workflow
├── docs/                       # Documentation
│   ├── Architecture.md
│   ├── Setup.md
│   └── TestStrategy.md
├── playwright.config.ts        # Playwright configuration
├── package.json               # Project dependencies
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Project README
```

## Folder Responsibilities

### `/tests/e2e`
Contains end-to-end test suites that test complete user workflows from start to finish. These tests simulate real user interactions and verify end-to-end functionality.

**Test Files:**
- `login.spec.ts` - Login functionality tests (valid/invalid credentials)
- `dashboard.spec.ts` - Dashboard widget verification tests
- `admin-user-management.spec.ts` - Admin module user management tests
- `pim-employee.spec.ts` - PIM module employee management tests
- `logout.spec.ts` - Logout functionality tests

### `/tests/integration`
Contains integration tests that focus on specific components, API endpoints, and validation logic. These are smaller, more focused tests.

**Test Files:**
- `api.spec.ts` - API endpoint tests
- `validation.spec.ts` - Form validation and UI component tests

### `/pages`
Contains Page Object Model (POM) classes that encapsulate page-specific logic and interactions. Each page object provides a clean API for interacting with that page.

**Key Principles:**
- **BasePage**: Provides common functionality (clickWithWait, typeWithValidation, etc.)
- **Isolation**: Each page object is fully isolated with no cross-page dependencies
- **DRY**: No code duplication - common methods in BasePage
- **Type Safety**: Strongly typed locators and methods

### `/utils`
Contains reusable utility functions and classes used across the framework.

**Modules:**
- `logger.ts` - Timestamped logging with different log levels
- `apiClient.ts` - Wrapper around Playwright's APIRequestContext
- `helpers.ts` - Random data generation, date utilities, wait helpers
- `env.ts` - Environment variable management with type safety

### `/fixtures`
Contains test fixtures and test data that can be reused across tests.

**Files:**
- `testData.ts` - Centralized test data constants
- `auth.ts` - Authentication fixtures for authenticated test scenarios

### `/workflows`
Contains CI/CD workflow definitions for automated testing.

**Files:**
- `ci.yml` - GitHub Actions workflow for running tests on push/PR

### `/docs`
Contains project documentation including architecture, setup instructions, and test strategy.

## Technology Choices

### Playwright
- **Why**: Modern, fast, reliable browser automation
- **Features**: Multi-browser support, auto-waiting, network interception, API testing
- **Version**: Latest stable (1.40+)

### TypeScript
- **Why**: Type safety, better IDE support, easier refactoring
- **Configuration**: Strict mode enabled for maximum type safety
- **Version**: 5.3+

### Page Object Model (POM)
- **Why**: Maintainability, reusability, separation of concerns
- **Implementation**: Base class pattern with inheritance
- **Benefits**: Easy to maintain, test code is clean and readable

## Design Patterns

### 1. Page Object Model
All page interactions are encapsulated in page object classes, making tests readable and maintainable.

### 2. Base Class Pattern
Common functionality is centralized in `BasePage`, reducing code duplication.

### 3. Utility Functions
Reusable helper functions are organized in utility modules.

### 4. Fixtures
Test fixtures provide pre-configured test scenarios (e.g., authenticated pages).

### 5. Test Data Management
Centralized test data in fixtures for consistency and easy updates.

## Key Design Principles

### SOLID Principles
- **Single Responsibility**: Each page object handles one page
- **Open/Closed**: BasePage is open for extension, closed for modification
- **Liskov Substitution**: All page objects can be used interchangeably
- **Interface Segregation**: Focused, specific methods
- **Dependency Inversion**: Depend on abstractions (BasePage)

### DRY (Don't Repeat Yourself)
- Common methods in BasePage
- Reusable utilities in `/utils`
- Shared test data in fixtures

### Clean Code
- Meaningful names
- Small, focused methods
- Comprehensive error handling
- Detailed logging

## Error Handling Strategy

1. **Try/Catch Blocks**: All page object methods wrapped in try/catch
2. **Meaningful Errors**: Error messages include context
3. **Logging**: All errors logged with logger utility
4. **Retries**: Built-in retry logic for flaky elements
5. **Screenshots**: Automatic screenshots on failure

## Test Isolation

- Each test is completely independent
- `beforeEach` hooks set up fresh state
- No test dependencies
- Clean state for each test run

## Reporting

- HTML reports for detailed analysis
- List reporter for console output
- JSON reports for CI integration
- Screenshots on failure
- Videos on failure
- Traces on failure

