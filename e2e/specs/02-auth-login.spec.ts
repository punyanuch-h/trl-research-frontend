import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { getResearcherCredentials, getAdminCredentials, invalidCredentials } from '../test-data/auth.data';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display login form', async ({ page }) => {
    // Assert: App title and login form visible
    await expect(page.getByRole('heading', { name: /Technology Readiness Level/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /log in/i })).toBeVisible();
    await expect(page.getByTestId(/email/i)).toBeVisible();
    await expect(page.getByTestId(/password/i)).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    // Act: Submit with wrong email/password
    await loginPage.login(invalidCredentials.email, invalidCredentials.password);
    // Assert: Error message displayed
    await expect(page.locator('.text-destructive')).toBeVisible();

    // Assert: Stay on login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('should login and store both token and refresh_token in localStorage (Remember Me)', async ({ page }) => {
    const credentials = getResearcherCredentials();
    await loginPage.toggleRememberMe(true); // Default is true
    await loginPage.login(credentials.email, credentials.password);

    await expect(page).toHaveURL(/\/researcher\/homepage/);

    // Check localStorage has BOTH tokens
    const hasLocalToken = await page.evaluate(() => !!localStorage.getItem('token'));
    const hasLocalRefreshToken = await page.evaluate(() => !!localStorage.getItem('refreshToken'));

    // Check sessionStorage is EMPTY (tokens must not be in both storages)
    const hasSessionToken = await page.evaluate(() => !!sessionStorage.getItem('token'));
    const hasSessionRefreshToken = await page.evaluate(() => !!sessionStorage.getItem('refreshToken'));

    expect(hasLocalToken).toBe(true);
    expect(hasLocalRefreshToken).toBe(true);
    expect(hasSessionToken).toBe(false);
    expect(hasSessionRefreshToken).toBe(false);
  });

  test('should use sessionStorage when Remember Me is unchecked', async ({ page }) => {
    const credentials = getResearcherCredentials();
    await loginPage.toggleRememberMe(false);
    await loginPage.login(credentials.email, credentials.password);

    await expect(page).toHaveURL(/\/researcher\/homepage/);

    // Check sessionStorage has BOTH tokens
    const hasSessionToken = await page.evaluate(() => !!sessionStorage.getItem('token'));
    const hasSessionRefreshToken = await page.evaluate(() => !!sessionStorage.getItem('refreshToken'));

    // Check localStorage is EMPTY (tokens must not be in both storages)
    const hasLocalToken = await page.evaluate(() => !!localStorage.getItem('token'));
    const hasLocalRefreshToken = await page.evaluate(() => !!localStorage.getItem('refreshToken'));

    expect(hasSessionToken).toBe(true);
    expect(hasSessionRefreshToken).toBe(true);
    expect(hasLocalToken).toBe(false);
    expect(hasLocalRefreshToken).toBe(false);
  });

  test('should show session expired alert when redirected with query param', async ({ page }) => {
    await page.goto('/#/login?session_expired=true');
    await expect(page.locator('text=Your session has expired')).toBeVisible();
  });

  test('should navigate to signup when clicking sign up link', async ({ page }) => {
    await page.getByText(/sign up/i).last().click();
    await expect(page).toHaveURL(/\/signup/);
  });

  test('should navigate to forget password when clicking forgot password', async ({ page }) => {
    await page.getByText(/forgot password/i).click();
    await expect(page).toHaveURL(/\/forget-password/);
  });
});
