# Troubleshooting Guide

## Root Cause Analysis: Why Tests Were Failing

### Primary Issues Identified

#### 1. **Network Idle Timeout (MAJOR ISSUE - FIXED)**
**Problem**: The original code used `waitForNetworkIdle()` which waits for network activity to completely stop. Modern web applications (like OrangeHRM) have continuous background activity:
- Analytics tracking
- Polling requests
- WebSocket connections
- Background API calls

**Impact**: Tests were timing out after 30 seconds waiting for network to be "idle", which never happened.

**Solution Applied**:
- Replaced `waitForNetworkIdle()` with `waitForLoadState('domcontentloaded')`
- Added fallback mechanism in `waitForNetworkIdle()` helper
- Used shorter, more reliable timeouts (5-10 seconds instead of 30)

**Files Fixed**:
- `utils/helpers.ts` - Updated `waitForNetworkIdle()` with fallback
- `pages/BasePage.ts` - Changed navigation to use `domcontentloaded`
- All page objects - Replaced network idle waits with element-based waits

#### 2. **Selector Issues (CURRENT ISSUE)**
**Problem**: Some selectors are too specific or don't match the actual DOM structure:
- `button[type="submit"]:has-text("Search")` - May not match if button text is different
- Error message selectors may vary

**Impact**: Elements not found within timeout period (30 seconds)

**Current Status**: 
- Login tests: ✅ All passing (selectors work correctly)
- Admin/PIM tests: ⚠️ Some failing due to selector mismatches

**Recommended Solutions**:
1. Use more flexible selectors
2. Add multiple selector fallbacks
3. Increase timeout for slow internet connections
4. Use data-testid attributes (if available)

#### 3. **Timeout Configuration**

**Current Settings**:
```typescript
actionTimeout: 30000,      // 30 seconds for actions
navigationTimeout: 30000,  // 30 seconds for navigation
```

**For Slow Internet**:
- These timeouts may be insufficient
- Consider increasing to 45-60 seconds
- Or make them configurable via environment variables

### Is It a Slow Internet Problem?

**Partially Yes, But Not Entirely**:

1. **Slow Internet Can Cause**:
   - Page loads taking longer than 30 seconds
   - Elements appearing slowly
   - Network requests timing out

2. **However, Main Issues Are**:
   - ❌ **Selector problems** (elements not found)
   - ❌ **Network idle waits** (fixed)
   - ❌ **Incorrect wait strategies** (fixed)

### Solutions for Slow Internet

#### Option 1: Increase Timeouts Globally

Update `playwright.config.ts`:
```typescript
use: {
  actionTimeout: 60000,      // 60 seconds
  navigationTimeout: 60000, // 60 seconds
}
```

#### Option 2: Increase Timeouts Per Action

In page objects, specify longer timeouts:
```typescript
await this.clickWithWait(this.searchButton, { timeout: 60000 });
```

#### Option 3: Make Timeouts Configurable

Add to `.env`:
```env
ACTION_TIMEOUT=60000
NAVIGATION_TIMEOUT=60000
```

Update `playwright.config.ts`:
```typescript
use: {
  actionTimeout: parseInt(process.env.ACTION_TIMEOUT || '30000'),
  navigationTimeout: parseInt(process.env.NAVIGATION_TIMEOUT || '30000'),
}
```

### Current Test Status

#### ✅ Passing Tests
- All login tests (7/7)
- Dashboard tests
- Logout tests
- Integration validation tests

#### ⚠️ Failing Tests (13)
- Admin user management tests (selector issues)
- PIM employee tests (selector issues)
- Some integration tests

### How to Debug Failing Tests

#### 1. Run Test in Debug Mode
```bash
npx playwright test tests/e2e/admin-user-management.spec.ts:39 --debug
```

#### 2. Check Screenshots
Screenshots are saved in `test-results/` on failure

#### 3. View Trace
```bash
npx playwright show-trace test-results/.../trace.zip
```

#### 4. Run in UI Mode
```bash
npx playwright test --ui
```

### Quick Fixes Applied

1. ✅ Replaced all `waitForNetworkIdle()` calls
2. ✅ Updated navigation to use `domcontentloaded`
3. ✅ Added fallback error message selectors
4. ✅ Improved login method to handle both success/failure
5. ✅ Made error detection more flexible

### Remaining Work

1. **Fix Selectors**:
   - Update Admin page selectors
   - Update PIM page selectors
   - Add selector fallbacks

2. **Optimize for Slow Internet**:
   - Make timeouts configurable
   - Add retry logic for network issues
   - Use more reliable wait strategies

3. **Improve Error Handling**:
   - Better error messages
   - More descriptive failures
   - Automatic retry for transient failures

### Recommendations

1. **For Slow Internet**:
   - Increase timeouts to 60 seconds
   - Use `--headed` mode to see what's happening
   - Run tests one at a time to reduce load

2. **For Selector Issues**:
   - Inspect actual DOM structure
   - Use Playwright Inspector to find correct selectors
   - Add multiple selector fallbacks

3. **For CI/CD**:
   - Use retries (already configured: 2 retries in CI)
   - Increase timeouts in CI environment
   - Use parallel execution carefully

### Environment-Specific Settings

#### Local Development (Fast Internet)
```env
ACTION_TIMEOUT=30000
NAVIGATION_TIMEOUT=30000
```

#### CI/CD or Slow Internet
```env
ACTION_TIMEOUT=60000
NAVIGATION_TIMEOUT=60000
```

### Test Execution Tips

1. **Run Single Test**:
   ```bash
   npx playwright test tests/e2e/login.spec.ts:24
   ```

2. **Run with More Time**:
   ```bash
   npx playwright test --timeout=60000
   ```

3. **Run in Headed Mode** (see what's happening):
   ```bash
   npx playwright test --headed
   ```

4. **Run with UI** (interactive debugging):
   ```bash
   npx playwright test --ui
   ```

## Summary

**Main Issues**:
1. ✅ **Network idle timeouts** - FIXED
2. ⚠️ **Selector mismatches** - IN PROGRESS
3. ⚠️ **Timeout configuration** - CAN BE IMPROVED

**Is it slow internet?** Partially, but mainly selector and wait strategy issues.

**Next Steps**:
1. Fix remaining selector issues
2. Make timeouts configurable
3. Add retry logic for transient failures

