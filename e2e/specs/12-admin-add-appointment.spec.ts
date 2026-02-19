import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { getAdminCredentials } from '../test-data/auth.data';

test.describe('ADMIN - Add Appointment FULL FLOW', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    const cred = getAdminCredentials();

    await login.goto();
    await login.login(cred.email, cred.password);
    await page.waitForURL(/\/admin\/homepage/, { timeout: 15000 });
    await page.waitForLoadState('networkidle');
  });

  async function openCaseAndModal(page: Page) {
    const viewBtn = page.getByRole('button', { name: /view details/i });

    if (await viewBtn.count() === 0) test.skip();

    await viewBtn.first().click();
    await page.waitForURL(/case-detail/);
    await page.waitForLoadState('networkidle');

    const addBtn = page.getByRole('button', { name: /add appointment/i });
    await addBtn.click();

    await expect(page.getByTestId('add-appointment-modal')).toBeVisible();
  }

  test('should open add appointment modal', async ({ page }) => {
    await openCaseAndModal(page);
  });

  test('should validate required fields', async ({ page }) => {
    await openCaseAndModal(page);

    await page.getByTestId('appointment-save-btn').click();

    // modal must still open (validation fail)
    await expect(page.getByTestId('add-appointment-modal')).toBeVisible();
  });

  test('should select research project', async ({ page }) => {
    await openCaseAndModal(page);

    await page.getByTestId('appointment-project-select').click();
    await page.getByRole('option').first().click();

    await expect(page.getByTestId('appointment-researcher')).not.toHaveValue('');
  });

  test('should fill form completely', async ({ page }) => {
    await openCaseAndModal(page);

    await page.getByTestId('appointment-project-select').click();
    await page.getByRole('option').first().click();

    await page.getByTestId('appointment-date').fill('2026-12-20');
    await page.getByTestId('appointment-time').fill('13:30');
    await page.getByTestId('appointment-location').fill('Meeting room A');
    await page.getByTestId('appointment-detail').fill('Playwright auto test meeting');

    await expect(page.getByTestId('appointment-date')).toHaveValue('2026-12-20');
  });

  test('should save appointment successfully', async ({ page }) => {
    await openCaseAndModal(page);

    await page.getByTestId('appointment-project-select').click();
    await page.getByRole('option').first().click();

    await page.getByTestId('appointment-date').fill('2026-12-20');
    await page.getByTestId('appointment-time').fill('13:30');
    await page.getByTestId('appointment-location').fill('Meeting room A');
    await page.getByTestId('appointment-detail').fill('E2E save test');

    await page.getByTestId('appointment-save-btn').click();

    // modal should close
    await expect(page.getByTestId('add-appointment-modal')).not.toBeVisible({ timeout: 7000 });
  });

  test('should cancel modal', async ({ page }) => {
    await openCaseAndModal(page);

    await page.getByTestId('appointment-cancel-btn').click();

    await expect(page.getByTestId('add-appointment-modal')).not.toBeVisible();
  });

});
