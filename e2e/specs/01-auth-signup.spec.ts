import { test, expect } from '@playwright/test';
import { SignupPage } from '../pages/SignupPage';
import { LoginPage } from '../pages/LoginPage';
import { buildResearcherSignupData } from '../test-data/auth.data';

test.describe('Signup - Researcher role', () => {
  let signupPage: SignupPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    signupPage = new SignupPage(page);
    loginPage = new LoginPage(page);
    await signupPage.goto();
  });

  test('should display signup form with required fields', async ({ page }) => {
    // Assert: Sign up form is visible with main heading
    await expect(page.getByRole('heading', { name: /Sign Up/i })).toBeVisible();
    // Assert: Required inputs are present
    await expect(page.getByTestId(/prefix/i)).toBeVisible();
    await expect(page.getByTestId(/academic_position/i)).toBeVisible();
    await expect(page.getByTestId(/first_name/i)).toBeVisible();
    await expect(page.getByTestId(/last_name/i)).toBeVisible();
    await expect(page.getByTestId(/department/i)).toBeVisible();
    await expect(page.getByTestId(/phone_number/i)).toBeVisible();
    await expect(page.getByTestId(/email/i).first()).toBeVisible();
    await expect(page.getByTestId(/password/i).first()).toBeVisible();
    await expect(page.getByTestId(/confirmPassword/i)).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.getByRole('button', { name: /sign up/i }).click();

    const errors = page.locator('.text-destructive');

    // wait until validation render
    await expect(errors.first()).toBeVisible();

    // must have validation errors
    await expect(errors).not.toHaveCount(0);
  });

  test('should complete signup successfully and redirect to login', async ({ page }) => {
    // Arrange: Valid signup data with unique email
    const data = buildResearcherSignupData();
    // Act: Fill and submit form
    await signupPage.fillForm(data);
    await signupPage.clickSignUp();
    // Assert: Redirect to login (success flow)
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
    // Assert: Toast or success indication (optional - app may show toast)
  });

  test('should navigate to login when clicking login link', async ({ page }) => {
    // Act: Click "Already have an account? Log in" (span or link)
    await page.getByText(/log in/i).first().click();
    // Assert: Redirect to login page
    await expect(page).toHaveURL(/\/login/);
  });
});
