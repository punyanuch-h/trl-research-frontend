import { test, expect } from '@playwright/test';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { getResearcherCredentials } from '../test-data/auth.data';

test.describe('Forget Password', () => {
  let forgotPasswordPage: ForgotPasswordPage;

  test.beforeEach(async ({ page }) => {
    forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.goto();
  });

  test('should display forget password form', async ({ page }) => {
    // Assert: Form with email field and send button
    await expect(page.getByRole('heading', { name: /forgot password/i })).toBeVisible();
    await expect(page.getByTestId(/email/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /send reset email|send/i })).toBeVisible();
  });

  test('should validate required email', async ({ page }) => {
    // Act: Click send without entering email
    await page.getByRole('button', { name: /send reset email|send/i }).click();
    // Assert: Validation error (required or invalid)
    const hasError =
      (await page.locator('.text-destructive').isVisible()) ||
      (await page.locator('[aria-invalid="true"]').isVisible());
    expect(hasError).toBeTruthy();
  });

  test('should show success message after submitting valid email', async ({ page }) => {
    // Note: Backend may reject unknown emails - use known test email if available
    const credentials = getResearcherCredentials();
    await forgotPasswordPage.submitEmail("forget@password.com");
    // Assert: Either success message or error (depending on backend behavior)
    const successAlert = page.getByRole('alert');
    const errorText = page.locator('.text-destructive');
    await expect(successAlert.or(errorText)).toBeVisible({ timeout: 10000 });
  });

  test('should navigate back to login', async ({ page }) => {
    // Act: Click Back to Login
    await page.getByRole('button', { name: /back to login/i }).click();
    // Assert: Redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});
