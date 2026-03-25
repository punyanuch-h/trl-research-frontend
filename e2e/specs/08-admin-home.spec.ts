import { test, expect } from '@playwright/test';
import { AdminHomePage } from '../pages/AdminHomePage';
import { ensureAdminLogin } from '../helpers/auth.helpers';

test.describe('Admin Home page', () => {
  test.beforeEach(async ({ page }) => {
    const isLoggedIn = await ensureAdminLogin(page);
    test.skip(!isLoggedIn, 'Admin E2E tests require a valid seeded admin account. Set ADMIN_EMAIL and ADMIN_PASSWORD in e2e/.env.');
    await expect(page.locator('table')).toBeVisible({ timeout: 15000 });
  });

  test('should load admin page', async ({ page }) => {
    // Replaced unreliable 'admin-title' selector with robust URL and UI element checks
    await expect(page).toHaveURL(/admin/);
    await expect(page.locator('table')).toBeVisible();
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

    const detailButtons = page.getByRole('button', { name: /view details|ดูรายละเอียด/i });
    if (await detailButtons.count() === 0) {
      test.skip(true, 'no view detail actions');
    }

    await detailButtons.first().click();
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
