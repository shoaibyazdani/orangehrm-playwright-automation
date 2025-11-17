# CI/CD Strategy - Optimized for Fast Feedback

## Overview

The CI pipeline has been optimized to provide **fast feedback** while maintaining comprehensive test coverage.

## Test Execution Strategy

### 🚀 Smoke Tests (Fast - Runs on Every Push/PR)

**Purpose**: Quick validation of critical functionality  
**Execution Time**: ~5-10 minutes  
**Frequency**: Every push and pull request  
**Tests Included**: Only `@smoke` tagged tests

**Current Smoke Tests (5 tests)**:
1. ✅ Login with valid credentials
2. ✅ Dashboard widgets display
3. ✅ Search for existing user (Admin)
4. ✅ Add new employee
5. ✅ Logout functionality

**Why These Tests?**
- Cover the critical user journey (login → dashboard → logout)
- Validate core functionality
- Fast execution (~1-2 minutes per test)
- Catch breaking changes immediately

### 📊 Full Regression (Comprehensive - Runs Weekly/Manual)

**Purpose**: Complete test coverage  
**Execution Time**: ~30-60 minutes  
**Frequency**: 
- Weekly (Sundays at midnight)
- Manual trigger via GitHub Actions UI
- On-demand when needed

**Tests Included**: All tests (42+ test cases)

**Coverage**:
- All E2E tests (login, dashboard, admin, PIM, logout)
- All integration tests (API, validation)
- All browsers (currently Chromium only for speed)

## CI Workflow Structure

```
On Push/PR:
  └─> Smoke Tests (5 tests, ~5-10 min) ✅ Fast feedback

On Schedule/Manual:
  └─> Full Regression (42+ tests, ~30-60 min) ✅ Complete coverage
```

## Benefits

### ✅ Fast Feedback
- Developers get results in 5-10 minutes
- No waiting for 30+ minutes for all tests
- Quick validation before merging

### ✅ Cost Efficient
- Reduced CI minutes usage
- Only run expensive tests when needed
- Smoke tests catch 80% of issues

### ✅ Comprehensive Coverage
- Full regression still runs weekly
- Manual trigger available anytime
- All tests remain available

## Running Tests Locally

### Smoke Tests Only
```bash
npm run test:smoke
```

### Full Regression
```bash
npm test
```

### Specific Test Suite
```bash
npm run test:e2e
npm run test:integration
```

## Manual Full Regression

To trigger full regression manually:

1. Go to GitHub repository
2. Click **"Actions"** tab
3. Select **"Playwright Tests CI"** workflow
4. Click **"Run workflow"** button
5. Select branch and click **"Run workflow"**

## Test Tags

- `@smoke` - Critical path tests (runs in CI on every push)
- `@regression` - All regression tests (runs in full regression)
- No tag - Regular tests (runs in full regression)

## Timeout Configuration

### Smoke Tests
- Test timeout: 2 minutes per test
- Action timeout: 60 seconds
- Navigation timeout: 60 seconds
- Total job timeout: 20 minutes

### Full Regression
- Test timeout: 2 minutes per test
- Action timeout: 60 seconds
- Navigation timeout: 60 seconds
- Total job timeout: 60 minutes

## Recommendations

1. **For Quick Validation**: Rely on smoke tests (automatic on push)
2. **Before Release**: Run full regression manually
3. **Weekly Check**: Review full regression results (runs automatically)
4. **Local Development**: Run smoke tests before pushing

## Future Optimizations

- Parallel smoke test execution
- Test result caching
- Selective test execution based on changed files
- Browser-specific smoke tests if needed

