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

  test('should login as researcher and redirect to dashboard', async ({ page }) => {
    const credentials = getResearcherCredentials();
    // Act: Login with valid researcher credentials
    await loginPage.login(credentials.email, credentials.password);
    // Assert: Redirect to researcher homepage
    await expect(page).toHaveURL(/\/researcher\/homepage/, { timeout: 15000 });
  });

  test('should login as admin and redirect to dashboard', async ({ page }) => {
    const credentials = getAdminCredentials();
    // Act: Login with valid admin credentials
    await loginPage.login(credentials.email, credentials.password);
    // Assert: Redirect to admin homepage
    await expect(page).toHaveURL(/\/admin\/homepage/, { timeout: 15000 });
  });

  test('should navigate to signup when clicking sign up link', async ({ page }) => {
    // Act: Click "Don't have an account? Sign up"
    await page.getByText(/sign up/i).last().click();
    // Assert: Navigate to signup
    await expect(page).toHaveURL(/\/signup/);
  });

  test('should navigate to forget password when clicking forgot password', async ({ page }) => {
    // Act: Click Forgot password link
    await page.getByText(/forgot password/i).click();
    // Assert: Navigate to forget password page
    await expect(page).toHaveURL(/\/forget-password/);
  });
});
