# OrangeHRM Playwright Automation Framework

A production-grade automation framework for OrangeHRM Demo Web Application using **Playwright + TypeScript + Page Object Model**.

## 🎯 Target Application

**OrangeHRM Demo**: https://opensource-demo.orangehrmlive.com/

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd OrangeHRM

# Install dependencies
npm install

# Install Playwright browsers
npm run install:browsers
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Run specific test suite
npm run test:e2e
npm run test:integration

# Run by tag
npm run test:smoke
npm run test:regression

# Run in specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### View Reports

```bash
npm run report
```

## 📁 Project Structure

```
OrangeHRM/
├── tests/
│   ├── e2e/              # End-to-end test suites
│   └── integration/      # Integration tests
├── pages/                # Page Object Models
├── utils/                # Utility modules
├── fixtures/             # Test fixtures and data
├── workflows/            # CI/CD workflows
├── docs/                 # Documentation
├── playwright.config.ts  # Playwright configuration
├── package.json
└── tsconfig.json
```

## 🧪 Test Coverage

### E2E Tests (`/tests/e2e`)

- ✅ **Login** - Valid/invalid login scenarios
- ✅ **Dashboard** - Widget verification
- ✅ **Admin User Management** - Search, Add, Delete users
- ✅ **PIM Employee Management** - Add, Edit, Search employees
- ✅ **Logout** - Logout functionality

### Integration Tests (`/tests/integration`)

- ✅ **API Tests** - API endpoint validation
- ✅ **Validation Tests** - Form validation and UI components

## 🏗️ Framework Features

### Page Object Model (POM)
- Strongly typed locators
- Reusable wrapper methods
- Fully isolated page objects
- DRY design principles

### Utilities
- **Logger** - Timestamped logging
- **API Client** - API testing wrapper
- **Helpers** - Random data, dates, waits
- **Env Manager** - Environment configuration

### Test Features
- ✅ Fully isolated tests
- ✅ Retry mechanism for flaky tests
- ✅ Screenshots on failure
- ✅ Videos on failure
- ✅ Traces on failure
- ✅ HTML reports
- ✅ Parallel execution

## 📚 Documentation

- [Architecture Documentation](./docs/Architecture.md) - Framework structure and design
- [Setup Guide](./docs/Setup.md) - Installation and setup instructions
- [Test Strategy](./docs/TestStrategy.md) - Testing approach and coverage

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:headed` | Run tests with visible browser |
| `npm run test:ui` | Run tests in UI mode |
| `npm run test:debug` | Run tests in debug mode |
| `npm run test:e2e` | Run E2E tests only |
| `npm run test:integration` | Run integration tests only |
| `npm run test:smoke` | Run smoke tests |
| `npm run test:regression` | Run regression tests |
| `npm run test:chromium` | Run tests in Chromium |
| `npm run test:firefox` | Run tests in Firefox |
| `npm run test:webkit` | Run tests in WebKit |
| `npm run report` | View HTML report |
| `npm run codegen` | Generate test code |
| `npm run install:browsers` | Install Playwright browsers |

## 🔧 Configuration

### Playwright Config

The framework supports:
- Multiple browsers (Chromium, Firefox, WebKit)
- Headed/Headless mode
- Screenshots on failure
- Videos on failure
- Traces on failure
- Parallel execution
- Retry mechanism

### Environment Variables

Create a `.env` file (optional):

```env
BASE_URL=https://opensource-demo.orangehrmlive.com/
DEFAULT_USERNAME=Admin
DEFAULT_PASSWORD=admin123
HEADLESS=true
CI=false

# Timeout settings (for slow internet connections)
ACTION_TIMEOUT=60000      # 60 seconds for actions (default: 30000)
NAVIGATION_TIMEOUT=60000  # 60 seconds for navigation (default: 30000)
```

**Note**: If you experience timeout issues due to slow internet, increase the timeout values above.

## 🎨 Page Objects

### Available Page Objects

- **LoginPage** - Login functionality
- **DashboardPage** - Dashboard interactions
- **AdminPage** - Admin user management
- **PIMPage** - PIM employee list
- **EmployeePage** - Employee details
- **HeaderPage** - Navigation and logout

### Base Page Methods

All page objects extend `BasePage` with common methods:
- `clickWithWait()` - Click with wait and retry
- `typeWithValidation()` - Type with validation
- `waitForVisible()` - Wait for element visibility
- `safeSelect()` - Safe dropdown selection

## 🧩 Test Examples

### Example: Login Test

```typescript
test('Should successfully login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('Admin', 'admin123');
  
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.verifyPageLoaded();
});
```

### Example: Using Fixtures

```typescript
import { test } from '../fixtures/auth';

test('Should access dashboard', async ({ authenticatedPage }) => {
  const { dashboardPage } = authenticatedPage;
  await dashboardPage.verifyAllWidgets();
});
```

## 🚦 CI/CD

### GitHub Actions

The framework includes a CI workflow (`.github/workflows/ci.yml`) that:
- Runs tests on push/PR
- Tests on multiple browsers
- Uploads artifacts (reports, screenshots, videos)
- Runs smoke tests separately

## 📊 Reporting

After test execution, view reports:

```bash
npm run report
```

Reports include:
- Test results with pass/fail status
- Screenshots on failure
- Videos on failure
- Execution traces
- Timeline view

## 🐛 Debugging

### Debug Mode

```bash
npm run test:debug
```

Opens Playwright Inspector for step-by-step debugging.

### UI Mode

```bash
npm run test:ui
```

Interactive UI mode with time-travel debugging.

### Code Generation

```bash
npm run codegen
```

Record interactions and generate test code automatically.

## 📝 Best Practices

1. **Use Page Objects** - All interactions through page objects
2. **Isolated Tests** - Each test is independent
3. **Meaningful Names** - Clear test and method names
4. **Proper Waits** - Use built-in waits, avoid hard-coded delays
5. **Error Handling** - Comprehensive error handling in page objects
6. **Logging** - Use logger utility for debugging
7. **Test Data** - Use fixtures for reusable test data

## 🤝 Contributing

1. Follow the existing code structure
2. Use Page Object Model pattern
3. Add tests for new features
4. Update documentation
5. Ensure all tests pass

## 📄 License

MIT License

## 🔗 Resources

- [Playwright Documentation](https://playwright.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [OrangeHRM Demo](https://opensource-demo.orangehrmlive.com/)

## 🐛 Troubleshooting

### Test Failures

If tests are failing, check:

1. **Timeout Issues**: Increase timeouts in `.env` file (see Environment Variables above)
2. **Slow Internet**: Use `ACTION_TIMEOUT=60000` and `NAVIGATION_TIMEOUT=60000`
3. **Selector Issues**: Run tests in `--headed` mode to see what's happening
4. **Network Issues**: The framework now uses `domcontentloaded` instead of `networkidle` to avoid timeout issues

### Common Issues

- **"Element not found"**: Selector may be incorrect or element loading slowly
- **"Test timeout"**: Increase timeout values or check internet connection
- **"Navigation timeout"**: Site may be slow, increase `NAVIGATION_TIMEOUT`

See [Troubleshooting Guide](./docs/Troubleshooting.md) for detailed solutions.

## 📧 Support

For issues or questions:
1. Check the [documentation](./docs/)
2. Review [Troubleshooting Guide](./docs/Troubleshooting.md)
3. Review test examples
4. Check Playwright documentation
5. Use debug mode to troubleshoot

---

**Built with ❤️ using Playwright + TypeScript**

