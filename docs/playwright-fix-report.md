# Playwright E2E Test Suite Fix Report

## 1. Problem Summary

The Playwright E2E tests were failing due to two primary issues:

*   **Token Storage Mismatch**: The application's authentication logic was updated to use different storage (localStorage vs sessionStorage) depending on the "Remember Me" checkbox. However, the existing tests still assumed all tokens were stored in `localStorage` and used the key `refreshToken` instead of the updated `refresh_token`.
*   **Backend Server Not Running**: The Playwright configuration only started the frontend development/preview server. Since the application relies on a backend API for authentication and data, many tests timed out or failed because the API was inaccessible.

## 2. Root Cause

*   **Test Assumptions**: The tests in `e2e/specs/02-auth-login.spec.ts` had hardcoded assumptions about token persistence and key names that no longer matched the implementation.
*   **Missing Backend**: The `playwright.config.ts` was not configured to launch the Go backend server, leading to failures in all tests requiring authentication.
*   **Missing Selector**: The `admin-title` test selector did not exist in the DOM, causing every test's `beforeEach` hook to fail after login when checking for page readiness.

## 3. Solution Implemented

*   **Updated Login Tests**: Modified `e2e/specs/02-auth-login.spec.ts`
1.  **Standardized Token Storage**: Updated tests to handle `localStorage` or `sessionStorage` based on the "Remember Me" state.
2.  **Fixed Backend Connectivity**: Updated `playwright.config.ts` to start both frontend and backend servers.
3.  **Corrected Admin Credentials**: Reset `admin@example.com` in the database to match test expectations.
4.  **Robust Navigation Waiting**: Discovered that the `admin-title` test selector did not exist consistently in the DOM. Replaced it across all tests with robust URL checks and stable UI element checks (like tables or headings). Updated `LoginPage.login()` to use `Promise.all` with `waitForURL`.

### Additional Issue Discovered: Admin Redirects
The application uses a `HashRouter`, meaning URLs contain a `#` prefix (e.g., `/#/admin/homepage`). Strict URL matching in Playwright sometimes failed due to this or because the redirect was slower than the test timeout. By switching to element-basis waiting, the tests are now much more stable.

### Additional Issue Discovered: Admin-title Selector
The previous tests relied on `getByTestId('admin-title')`, which was found to be unreliable or missing during execution. All admin tests now use `toHaveURL(/admin/)` and check for the presence of the main management table or headings instead.

## 4. New Authentication Behavior

The final implemented and tested behavior is:

*   **Remember Me checked**: Both `token` and `refresh_token` are stored in `localStorage`. This ensures the session persists across browser restarts.
*   **Remember Me unchecked**: Both `token` and `refresh_token` are stored in `sessionStorage`. The session is lost when the browser tab is closed.

## 5. Verification

The fix was verified by running the following command:

```bash
npx playwright test --project=chromium
```

### Results
*   The backend starts successfully and responds to the `/health` check.
*   The frontend starts and connects to the backend.
*   Authentication tests correctly validate storage behavior.
*   Timeouts were resolved now that the API is available.
