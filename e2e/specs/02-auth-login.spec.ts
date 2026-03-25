import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { getResearcherCredentials, getAdminCredentials, invalidCredentials, buildResearcherSignupData } from '../test-data/auth.data';
import { SignupPage } from '../pages/SignupPage';

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

  test('should login and store both token and refresh_token in localStorage (Remember Me checked)', async ({ page }) => {
    // 1. Create a fresh user first to ensure login will succeed
    const signupData = buildResearcherSignupData();
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillForm(signupData);
    await signupPage.clickSignUp();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    // 2. Perform login with Remember Me
    await loginPage.toggleRememberMe(true);
    await loginPage.login(signupData.email, signupData.password);
    await expect(page.getByRole('heading', { name: /my research/i })).toBeVisible({ timeout: 15000 });

    // 3. Assert: Check localStorage has BOTH tokens
    const hasLocalToken = await page.evaluate(() => !!localStorage.getItem('token'));
    const hasLocalRefreshToken = await page.evaluate(() => !!localStorage.getItem('refresh_token'));

    // Assert: Check sessionStorage is EMPTY (tokens must not be in both storages)
    const hasSessionToken = await page.evaluate(() => !!sessionStorage.getItem('token'));
    const hasSessionRefreshToken = await page.evaluate(() => !!sessionStorage.getItem('refresh_token'));

    expect(hasLocalToken).toBe(true);
    expect(hasLocalRefreshToken).toBe(true);
    expect(hasSessionToken).toBe(false);
    expect(hasSessionRefreshToken).toBe(false);
  });

  test('should login and store both token and refresh_token in sessionStorage (Remember Me unchecked)', async ({ page }) => {
    // 1. Create a fresh user first
    const signupData = buildResearcherSignupData();
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillForm(signupData);
    await signupPage.clickSignUp();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    // 2. Perform login without Remember Me
    await loginPage.toggleRememberMe(false);
    await loginPage.login(signupData.email, signupData.password);
    await expect(page.getByRole('heading', { name: /my research/i })).toBeVisible({ timeout: 15000 });

    // 3. Assert: Check sessionStorage has BOTH tokens
    const hasSessionToken = await page.evaluate(() => !!sessionStorage.getItem('token'));
    const hasSessionRefreshToken = await page.evaluate(() => !!sessionStorage.getItem('refresh_token'));

    // Assert: Check localStorage is EMPTY (tokens must not be in both storages)
    const hasLocalToken = await page.evaluate(() => !!localStorage.getItem('token'));
    const hasLocalRefreshToken = await page.evaluate(() => !!localStorage.getItem('refresh_token'));

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
