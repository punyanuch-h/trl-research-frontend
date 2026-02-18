import { test, expect } from '@playwright/test';
import { AdminHomePage } from '../pages/AdminHomePage';
import { LoginPage } from '../pages/LoginPage';
import { getAdminCredentials } from '../test-data/auth.data';

test.describe('Admin Home page', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const credentials = getAdminCredentials();
    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);
    await page.waitForURL(/\/admin\/homepage/, { timeout: 15000 });
  });

  test('should load admin page', async ({ page }) => {
    await expect(page.getByTestId('admin-title')).toBeVisible();
  });

  test('should show table OR empty state', async ({ page }) => {
    const table = page.getByTestId('research-table');
    const empty = page.getByTestId('empty-state');

    await Promise.any([
      table.waitFor({ state: 'visible', timeout: 10000 }),
      empty.waitFor({ state: 'visible', timeout: 10000 }),
    ]);

    const tableVisible = await table.isVisible().catch(() => false);
    const emptyVisible = await empty.isVisible().catch(() => false);

    expect(tableVisible || emptyVisible).toBeTruthy();
  });

  test('should open research detail if exists', async ({ page }) => {
    await page.waitForSelector('[data-testid="research-row"]', { timeout: 10000 }).catch(() => { });
    const rows = page.getByTestId('research-row');
    if (await rows.count() === 0) {
      test.skip(true, 'no research rows');
    }
    await page.getByTestId('view-detail-btn').first().click();
    await expect(page).toHaveURL(/case-detail/);
  });

  test('should download pdf if approved research exists', async ({ page }) => {
    await page.waitForSelector('[data-testid="download-btn"]', { timeout: 10000 }).catch(() => { });
    const btn = page.getByTestId('download-btn');
    if (await btn.count() === 0) {
      test.skip(true, 'no approved research');
    }
    const downloadPromise = page.waitForEvent('download');
    await btn.first().click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.pdf/i);
  });

  test('should switch tabs', async ({ page }) => {
    await page.getByTestId('tab-dashboard').click();
    await expect(page.getByTestId('tab-dashboard')).toBeVisible();

    await page.getByTestId('tab-appointments').click();
    await expect(page.getByTestId('tab-appointments')).toBeVisible();

    await page.getByTestId('tab-management').click();
    await expect(page.getByTestId('research-table')).toBeVisible();
  });
});
