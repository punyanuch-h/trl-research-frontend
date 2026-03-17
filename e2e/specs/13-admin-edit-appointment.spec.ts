import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { getAdminCredentials } from '../test-data/auth.data';

test.describe('Edit appointment', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const credentials = getAdminCredentials();
    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);
    await expect(page).toHaveURL(/admin/, { timeout: 15000 });
  });

  test('should open edit modal and update appointment', async ({ page }) => {
    const viewButtons = page.getByRole('button', { name: /view details|ดูรายละเอียด/i });
    if (await viewButtons.count() === 0) {
      test.skip(true, 'no case rows available');
    }

    await viewButtons.first().click();
    await expect(page.getByTestId('case-title')).toBeVisible({ timeout: 15000 });
    await page.waitForLoadState('networkidle');

    const appointments = page.getByTestId('appointment-row');
    if ((await appointments.count()) === 0) {
      test.skip(true, 'no appointment to edit');
    }

    await page.getByTestId('appointment-edit-btn').first().click();
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
    await expect(page.getByText('QA Updated Location').first()).toBeVisible();
  });
});
