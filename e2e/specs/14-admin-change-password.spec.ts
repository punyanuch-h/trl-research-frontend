import { test, expect } from '@playwright/test';
import { getAdminCredentials } from '../test-data/auth.data';
import { ensureAdminLogin } from '../helpers/auth.helpers';

test.describe('Change password', () => {
  test.beforeEach(async ({ page }) => {
    const isLoggedIn = await ensureAdminLogin(page);
    test.skip(!isLoggedIn, 'Admin E2E tests require a valid seeded admin account. Set ADMIN_EMAIL and ADMIN_PASSWORD in e2e/.env.');
    await expect(page).toHaveURL(/admin/, { timeout: 15000 });
    await page.goto('/#/reset-password');
    await page.waitForLoadState('networkidle');
  });

  test('should validate required fields', async ({ page }) => {
    await page.getByTestId('reset-password-submit').click();
    await expect(page.getByTestId('oldPassword')).toBeVisible();
    await expect(page.getByTestId('form-error')).toHaveCount(3);
  });

  test('should show error when confirm password mismatch', async ({ page }) => {
    const creds = getAdminCredentials();
    await page.getByTestId('oldPassword').fill(creds.password);
    await page.getByTestId('newPassword').fill('NewPass123');
    await page.getByTestId('confirmNewPassword').fill('WrongPass123');
    await page.getByTestId('reset-password-submit').click();
    await expect(page.getByText(/not match|ไม่ตรง/i)).toBeVisible();
  });

  test('should show error if old password incorrect', async ({ page }) => {
    await page.getByTestId('oldPassword').fill('wrong-old-pass');
    await page.getByTestId('newPassword').fill('NewPass123');
    await page.getByTestId('confirmNewPassword').fill('NewPass123');
    await page.getByTestId('reset-password-submit').click();
    await expect(page.getByText(/incorrect|ไม่ถูกต้อง/i)).toBeVisible();
  });

  test('should reset password successfully and redirect login', async ({ page }) => {
    const creds = getAdminCredentials();
    const newPass = 'NewPass123A';
    await page.getByTestId('oldPassword').fill(creds.password);
    await page.getByTestId('newPassword').fill(newPass);
    await page.getByTestId('confirmNewPassword').fill(newPass);
    await page.getByTestId('reset-password-submit').click();
    await expect(page.getByText(/success|สำเร็จ/i)).toBeVisible({ timeout: 8000 });
    await expect(page).toHaveURL(/login/, { timeout: 8000 });
  });
});
test.describe('Reset password', () => {
  test.beforeEach(async ({ page }) => {
    const credentials = getAdminCredentials();
    await page.goto('/#/login');
    await page.getByTestId('email').fill(credentials.email);
    await page.getByTestId('password').fill('NewPass123A');
    await page.getByRole('button', { name: /log in/i }).click();
    const isLoggedIn = await page.waitForURL(/admin/, { timeout: 5000 }).then(() => true).catch(() => false);
    test.skip(!isLoggedIn, 'Reset-password follow-up requires the admin password change test to succeed first.');
    await expect(page).toHaveURL(/admin/, { timeout: 15000 });
    await page.goto('/#/reset-password');
    await page.waitForLoadState('networkidle');
  });
  test('should reset password successfully to old password', async ({ page }) => {
    const creds = getAdminCredentials();
    const newPass = 'Admin123';
    await page.getByTestId('oldPassword').fill('NewPass123A');
    await page.getByTestId('newPassword').fill(newPass);
    await page.getByTestId('confirmNewPassword').fill(newPass);
    await page.getByTestId('reset-password-submit').click();
    await expect(page.getByText(/success|สำเร็จ/i)).toBeVisible({ timeout: 8000 });
    await expect(page).toHaveURL(/login/, { timeout: 8000 });
  });
});
