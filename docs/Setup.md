# Setup Guide

## Prerequisites

Before setting up the automation framework, ensure you have the following installed:

- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher (comes with Node.js)
- **Git**: For version control

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd OrangeHRM
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- `@playwright/test` - Playwright testing framework
- `typescript` - TypeScript compiler
- `@types/node` - Node.js type definitions
- `dotenv` - Environment variable management

### 3. Install Playwright Browsers

```bash
npm run install:browsers
```

Or using Playwright directly:

```bash
npx playwright install
```

This installs Chromium, Firefox, and WebKit browsers required for testing.

### 4. Verify Installation

Run a simple test to verify everything is set up correctly:

```bash
npm test
```

## Environment Configuration

### Environment Variables

Create a `.env` file in the root directory (optional):

```env
BASE_URL=https://opensource-demo.orangehrmlive.com/
DEFAULT_USERNAME=Admin
DEFAULT_PASSWORD=admin123
HEADLESS=true
CI=false
```

The framework will use defaults if these are not set.

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Headed Mode (See Browser)

```bash
npm run test:headed
```

### Run Specific Test Suite

**E2E Tests:**
```bash
npm run test:e2e
```

**Integration Tests:**
```bash
npm run test:integration
```

### Run Tests by Tag

**Smoke Tests:**
```bash
npm run test:smoke
```

**Regression Tests:**
```bash
npm run test:regression
```

### Run Tests in Specific Browser

**Chromium:**
```bash
npm run test:chromium
```

**Firefox:**
```bash
npm run test:firefox
```

**WebKit:**
```bash
npm run test:webkit
```

### Run Individual Test File

```bash
npx playwright test tests/e2e/login.spec.ts
```

### Run Tests with UI Mode (Interactive)

```bash
npm run test:ui
```

This opens Playwright's UI mode where you can:
- See tests running in real-time
- Debug tests step-by-step
- Time travel through test execution
- View network requests and console logs

### Run Tests in Debug Mode

```bash
npm run test:debug
```

This opens Playwright Inspector for step-by-step debugging.

### Run Tests with Code Generation

To generate test code by recording interactions:

```bash
npm run codegen
```

This opens Playwright Codegen where you can:
- Interact with the application
- Generate test code automatically
- Copy generated code to your test files

## Viewing Test Reports

### HTML Report

After running tests, view the HTML report:

```bash
npm run report
```

This opens the HTML report in your browser showing:
- Test results
- Screenshots
- Videos
- Traces
- Execution timeline

### Report Location

Reports are generated in:
- `playwright-report/` - HTML reports
- `test-results/` - Screenshots, videos, traces

## Project Structure Overview

```
OrangeHRM/
├── tests/              # Test files
├── pages/              # Page Object Models
├── utils/              # Utility functions
├── fixtures/           # Test fixtures
├── workflows/          # CI/CD workflows
└── docs/               # Documentation
```

## Common Commands Reference

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
| `npm run report` | View HTML report |
| `npm run codegen` | Generate test code |
| `npm run install:browsers` | Install Playwright browsers |

## Troubleshooting

### Issue: Tests fail with "Browser not found"

**Solution:**
```bash
npx playwright install
```

### Issue: TypeScript compilation errors

**Solution:**
```bash
npm install
```

Ensure all dependencies are installed.

### Issue: Tests timeout

**Solution:**
- Check network connectivity
- Verify the target URL is accessible
- Increase timeout in `playwright.config.ts`

### Issue: Element not found errors

**Solution:**
- Verify selectors are correct
- Check if the application UI has changed
- Use Playwright Inspector to debug: `npm run test:debug`

### Issue: Permission errors on Linux/Mac

**Solution:**
```bash
npx playwright install-deps
```

This installs system dependencies required by Playwright.

## IDE Setup

### VS Code

Recommended extensions:
- **Playwright Test for VSCode** - Official Playwright extension
- **TypeScript and JavaScript Language Features** - Built-in

### IntelliSense

TypeScript IntelliSense should work automatically. If not:
1. Ensure `tsconfig.json` is in the root
2. Restart VS Code
3. Run `npm install` to ensure types are available

## Next Steps

1. Review the [Architecture Documentation](./Architecture.md) to understand the framework structure
2. Read the [Test Strategy](./TestStrategy.md) to understand testing approach
3. Explore the test files in `/tests/e2e` and `/tests/integration`
4. Review Page Objects in `/pages` to understand how interactions are organized

## Getting Help

- Check Playwright documentation: https://playwright.dev
- Review test examples in `/tests` directory
- Check error messages in test reports
- Use `npm run test:debug` for interactive debugging

