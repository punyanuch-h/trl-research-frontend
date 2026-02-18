import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { getAdminCredentials } from '../test-data/auth.data';

test.describe('Edit appointment', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const credentials = getAdminCredentials();
    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);
    await page.waitForURL(/\/admin\/homepage/, { timeout: 15000 });
  });

  test('should open edit modal and update appointment', async ({ page }) => {
    const viewBtn = page.getByRole('button', { name: /view details|ดูรายละเอียด/i }).first();
    await viewBtn.click();
    await expect(page).toHaveURL(/case-detail/);
    await page.waitForLoadState('networkidle');

    const row = page.getByTestId('appointment-row');
    const rowCount = await row.count();
    expect(rowCount, '❌ No appointment to edit').toBeGreaterThan(0);
    const editBtn = page.getByTestId('appointment-edit-btn').first();
    await editBtn.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    const location = page.getByTestId('appointment-location-input');
    await expect(location).toBeVisible();

    await location.fill('QA Updated Location');

    const date = page.getByTestId('appointment-date-input');
    if (await date.isVisible()) {
      await date.fill('2026-12-20T15:30');
    }

    await page.getByTestId('appointment-save-btn').click();
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 });
    await expect(page.getByText('QA Updated Location')).toBeVisible();
  });
});
