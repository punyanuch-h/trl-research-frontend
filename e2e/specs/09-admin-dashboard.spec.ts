import { test, expect } from '@playwright/test';
import { AdminHomePage } from '../pages/AdminHomePage';
import { LoginPage } from '../pages/LoginPage';
import { getAdminCredentials } from '../test-data/auth.data';

test.describe('Admin Dashboard page', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const credentials = getAdminCredentials();
    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);
    await page.waitForURL(/\/admin\/homepage/, { timeout: 15000 });
    const adminPage = new AdminHomePage(page);
    await adminPage.clickDashboardTab();
    await page.waitForLoadState('networkidle');
  });

  test('should display KPI cards', async ({ page }) => {
    await expect(page.getByTestId('kpi-total')).toBeVisible();
    await expect(page.getByTestId('kpi-pending')).toBeVisible();
    await expect(page.getByTestId('kpi-urgent')).toBeVisible();
    await expect(page.getByTestId('kpi-researcher')).toBeVisible();
  });

  test('should show KPI values (not empty)', async ({ page }) => {
    const total = page.getByTestId('kpi-total');
    await expect(total).toBeVisible();

    const text = await total.textContent();
    expect(text?.length).toBeGreaterThan(0);
  });

  test('should render main charts', async ({ page }) => {
    await expect(page.getByTestId('chart-trl-estimate')).toBeVisible();
    await expect(page.getByTestId('chart-trl-real')).toBeVisible();
    await expect(page.getByTestId('chart-case-type')).toBeVisible();
    await expect(page.getByTestId('chart-ip')).toBeVisible();
    await expect(page.getByTestId('chart-support')).toBeVisible();
  });

  test('should render sidebar cards', async ({ page }) => {
    await expect(page.getByTestId('avg-card')).toBeVisible();
    await expect(page.getByTestId('top-researcher-card')).toBeVisible();
    await expect(page.getByTestId('appointments-card')).toBeVisible();
  });

  test('should switch between admin tabs', async ({ page }) => {
    await page.getByTestId('tab-management').click();
    await expect(page).toHaveURL(/admin/);

    await page.getByTestId('tab-dashboard').click();
    await expect(page.getByTestId('admin-dashboard')).toBeVisible();

    await page.getByTestId('tab-appointments').click();
    await expect(page.getByTestId('tab-appointments')).toBeVisible();
  });
});
