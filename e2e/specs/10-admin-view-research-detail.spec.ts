import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { getAdminCredentials } from '../test-data/auth.data';

test.describe('View research detail - Admin', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const credentials = getAdminCredentials();
    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);
    await page.waitForURL(/\/admin\/homepage/, { timeout: 15000 });
    // Guard: skip entire suite if no case data is present
    await page.waitForSelector('[role="button"]', { timeout: 5000 }).catch(() => { });
    const viewBtn = page.getByRole('button', { name: /view details|ดูรายละเอียด/i });
    if (await viewBtn.count() === 0) {
      test.skip(true, 'No research cases available — skipping suite');
      return;
    }
    await viewBtn.first().click();
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

  test('admin should see assess research button', async ({ page }) => {
    const assessBtn = page.getByRole('button', { name: /assess|ประเมิน/i });
    await expect(assessBtn).toBeVisible();
  });

  test('admin should navigate to assessment page when click assess', async ({ page }) => {
    const assessBtn = page.getByRole('button', { name: /assess|ประเมิน/i });
    await assessBtn.click();

    await page.waitForURL(/\/assessment\//, { timeout: 10000 });
    await expect(page).toHaveURL(/assessment/);
  });

  test('admin should see add appointment button', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /add appointment/i });
    await expect(addBtn).toBeVisible();
  });

  test('admin should open add appointment modal', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /add appointment/i });
    await addBtn.click();
    await expect(page.getByTestId('add-appointment-modal')).toBeVisible();
  });

  test('admin should see edit appointment button if appointment exists', async ({ page }) => {
    const editBtn = page.getByRole('button', { name: /edit/i });

    if (await editBtn.count() === 0) test.skip();

    await expect(editBtn.first()).toBeVisible();
  });

  test('admin should open edit appointment modal', async ({ page }) => {
    const editBtn = page.getByRole('button', { name: /edit/i });

    if (await editBtn.count() === 0) test.skip();

    await editBtn.first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('admin should see TRL estimate and readiness level if assessment exists', async ({ page }) => {
    const estimated = page.getByText(/TRL/i);

    if (await estimated.count() === 0) test.skip();

    await expect(estimated.first()).toBeVisible();
  });

  test('admin back button should navigate to admin homepage', async ({ page }) => {
    const backBtn = page.getByRole('button', { name: /back/i });
    await backBtn.click();
    await page.waitForURL(/\/admin\/homepage/, { timeout: 15000 });
  });
});
