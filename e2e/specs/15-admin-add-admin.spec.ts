import { test, expect } from '@playwright/test';
import { buildAdminData } from '../test-data/auth.data';
import { CreateAccountPage } from '../pages/createAccountPage';
import { ensureAdminLogin } from '../helpers/auth.helpers';

test.describe('Add admin', () => {
  let createAccountPage: CreateAccountPage;
  test.beforeEach(async ({ page }) => {
    createAccountPage = new CreateAccountPage(page);
    const isLoggedIn = await ensureAdminLogin(page);
    test.skip(!isLoggedIn, 'Admin E2E tests require a valid seeded admin account. Set ADMIN_EMAIL and ADMIN_PASSWORD in e2e/.env.');
    await expect(page).toHaveURL(/admin/, { timeout: 15000 });
  });

  test('should navigate to create admin page', async ({ page }) => {
    await page.goto('/#/admin/create-admin');
    await expect(page).toHaveURL(/\/admin\/create-admin/);
  });

  test('should display create admin form', async ({ page }) => {
    await page.goto('/#/admin/create-admin');
    await expect(page.getByRole('heading', { name: /create account|add admin/i })).toBeVisible();
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

  test('should validate required fields on admin form', async ({ page }) => {
    await page.goto('/#/admin/create-admin');
    await page.getByRole('button', { name: /create|submit|save/i }).click();
    await expect(page.getByTestId('form-error')).toHaveCount(7);
  });

  test('should create new admin successfully', async ({ page }) => {
    await page.goto('/#/admin/create-admin');
    await expect(page.getByRole('heading', { name: /create account|add admin/i })).toBeVisible();
    const data = buildAdminData();
    await createAccountPage.fillForm(data);
    await page.getByRole('button', { name: /create|submit|save/i }).click();
    await expect(page).toHaveURL(/admin/, { timeout: 15000 });
  });
});
