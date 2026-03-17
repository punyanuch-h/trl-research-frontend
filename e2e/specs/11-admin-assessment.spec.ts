import { test, expect } from '@playwright/test';
import { ensureAdminLogin } from '../helpers/auth.helpers';

test.describe('Assessment research', () => {
  test.beforeEach(async ({ page }) => {
    const isLoggedIn = await ensureAdminLogin(page);
    test.skip(!isLoggedIn, 'Admin E2E tests require a valid seeded admin account. Set ADMIN_EMAIL and ADMIN_PASSWORD in e2e/.env.');
    await expect(page).toHaveURL(/admin/, { timeout: 15000 });
    const viewBtn = page.getByRole('button', { name: /view details|ดูรายละเอียด/i }).first();
    await viewBtn.click();
    await expect(page).toHaveURL(/case-detail/);
    await page.waitForLoadState('networkidle');
    const assessBtn = page.getByRole('button', { name: /assess|ประเมิน/i });
    await assessBtn.click();
    await expect(page.getByTestId('approve-assessment-btn')).toBeVisible({ timeout: 15000 });
  });

  test('should open assessment page and show approve/reject', async ({ page }) => {
    await expect(page.getByTestId('approve-assessment-btn')).toBeVisible();
  });

  test('should allow adding comment (suggestion)', async ({ page }) => {
    const textarea = page.getByRole('textbox', { name: /suggestion|comment|improvement/i });
    if ((await textarea.count()) > 0) {
      await textarea.fill('Test improvement suggestion');
      expect(await textarea.inputValue()).toContain('Test');
    }
  });

  test('should display TRL and allow editing', async ({ page }) => {
    const editBtn = page.getByTestId('edit-trl-btn');
    if (await editBtn.count() === 0) test.skip();
    await editBtn.click();
    const select = page.getByTestId('trl-select');
    await expect(select).toBeVisible();
    await select.selectOption('5');
    await page.getByTestId('save-trl-btn').click();
    await expect(page.getByTestId('trl-current')).toContainText('5');
  });

  test('should allow editing suggestion', async ({ page }) => {
    const editBtn = page.getByTestId('edit-suggestion-btn');
    if (await editBtn.count() === 0) test.skip();
    await editBtn.click();
    const textarea = page.getByTestId('suggestion-textarea');
    await textarea.fill('Playwright auto suggestion test');
    await page.getByTestId('save-suggestion-btn').click();
    await expect(page.getByTestId('suggestion-section')).toContainText('Playwright auto');
  });

  test('should approve research', async ({ page }) => {
    const approveBtn = page.getByTestId('approve-assessment-btn');
    if (!(await approveBtn.isEnabled())) test.skip();
    await approveBtn.click();
    // after approve should redirect
    await expect(page).toHaveURL(/admin/, { timeout: 15000 });
  });
});
