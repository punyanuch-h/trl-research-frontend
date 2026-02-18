import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { getResearcherCredentials } from '../test-data/auth.data';

test.describe('View research detail - Researcher', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const credentials = getResearcherCredentials();

    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);
    await page.waitForURL(/researcher\/homepage/);

    const viewBtn = page.getByRole('button', { name: /view details|ดูรายละเอียด/i }).first();
    await viewBtn.click();

    await expect(page).toHaveURL(/case-detail/);
    await page.waitForLoadState('networkidle');
  });

  test('case basic info should display correctly', async ({ page }) => {
    await expect(page.getByTestId('case-title')).toBeVisible();
    await expect(page.getByTestId('case-id')).toBeVisible();
    await expect(page.getByTestId('research-title')).toBeVisible();
    await expect(page.getByTestId('research-description')).toBeVisible();
    await expect(page.getByTestId('research-keywords')).toBeVisible();
  });

  test('researcher info should display', async ({ page }) => {
    await expect(page.getByTestId('researcher-section')).toBeVisible();
    await expect(page.getByTestId('researcher-name')).not.toBeEmpty();
    await expect(page.getByTestId('researcher-email')).toContainText('@');
    await expect(page.getByTestId('researcher-phone_number')).not.toBeEmpty();
  });

  test('coordinator info should display', async ({ page }) => {
    await expect(page.getByTestId('coordinator-section')).toBeVisible();
    await expect(page.getByTestId('coordinator-name')).not.toBeEmpty();
    await expect(page.getByTestId('coordinator-email')).toContainText('@');
    await expect(page.getByTestId('coordinator-phone_number')).not.toBeEmpty();
  });

  test('appointment info should display', async ({ page }) => {
    await expect(page.getByTestId('appointment-card')).toBeVisible();
    await expect(page.getByTestId('appointment-title')).toBeVisible();
  });

  test('ip section validation', async ({ page }) => {
    const ipCard = page.getByTestId('ip-card');
    await expect(ipCard).toBeVisible();

    const ipItems = page.locator('[data-testid^="ip-item-"]');
    const count = await ipItems.count();

    if (count === 0) test.skip();

    for (let i = 0; i < count; i++) {
      const type = page.getByTestId(`ip-type-${i}`);
      const status = page.getByTestId(`ip-status-${i}`);
      const number = page.getByTestId(`ip-number-${i}`);

      await expect(type).toBeVisible();
      await expect(status).toBeVisible();
      await expect(number).toBeVisible();

      const statusText = await status.textContent();

      if (statusText?.includes("ได้เลข")) {
        await expect(status).toHaveClass(/bg-green-500/);
      }
    }
  });

  test('support info should display', async ({ page }) => {
    await expect(page.getByTestId('support-card')).toBeVisible();
    await expect(page.getByTestId('support-title')).toBeVisible();
  });
});
