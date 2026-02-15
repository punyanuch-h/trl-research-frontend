import { test, expect } from '@playwright/test';
import { ResearcherHomePage } from '../pages/ResearcherHomePage';
import { getResearcherCredentials } from '../test-data/auth.data';
import { LoginPage } from '../pages/LoginPage';

test.describe('Researcher Home page', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const credentials = getResearcherCredentials();
    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);
    await page.waitForURL(/\/researcher\/homepage/, { timeout: 15000 });
  });

  test('should load page successfully', async ({ page }) => {
    const homePage = new ResearcherHomePage(page);
    await expect(
      page.getByRole('heading', { name: /my research/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test('should show user info in header', async ({ page }) => {
    // Assert: Header with account/user menu is visible
    const header = page.locator('header').or(page.locator('[class*="header"]'));
    await expect(header).toBeVisible();
  });

  test('should have working navigation - Add Research button', async ({ page }) => {
    const homePage = new ResearcherHomePage(page);
    await homePage.clickAddResearch();
    // Assert: Navigate to researcher form
    await expect(page).toHaveURL(/\/researcher-form/);
  });

  test('should display research table or empty state', async ({ page }) => {
    const table = page.locator('table');
    const empty = page.getByText(/no research data/i);
    await Promise.any([
      table.waitFor({ state: 'visible', timeout: 10000 }),
      empty.waitFor({ state: 'visible', timeout: 10000 }),
    ]);
    const tableVisible = await table.isVisible().catch(() => false);
    const emptyVisible = await empty.isVisible().catch(() => false);
    expect(tableVisible || emptyVisible).toBeTruthy();
  });
});
