/**
 * Auth setup - stores auth state for researcher and admin
 * Run: npx playwright test auth.setup.ts
 */
import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { getResearcherCredentials, getAdminCredentials } from '../test-data/auth.data';

const researcherAuthFile = 'e2e/.auth/researcher.json';
const adminAuthFile = 'e2e/.auth/admin.json';

setup('authenticate as researcher', async ({ page }) => {
  const credentials = getResearcherCredentials();
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(credentials.email, credentials.password);
  await page.waitForURL(/\/researcher\/homepage/, { timeout: 15000 });
  await page.context().storageState({ path: researcherAuthFile });
});

setup('authenticate as admin', async ({ page }) => {
  const credentials = getAdminCredentials();
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(credentials.email, credentials.password);
  await page.waitForURL(/\/admin\/homepage/, { timeout: 15000 });
  await page.context().storageState({ path: adminAuthFile });
});
