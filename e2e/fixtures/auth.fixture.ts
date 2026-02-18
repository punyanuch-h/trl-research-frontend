/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ResearcherHomePage } from '../pages/ResearcherHomePage';
import { AdminHomePage } from '../pages/AdminHomePage';
import { getResearcherCredentials, getAdminCredentials } from '../test-data/auth.data';

/**
 * Extended test fixture with authenticated sessions
 */
type AuthFixtures = {
  loginPage: LoginPage;
  researcherHomePage: ResearcherHomePage;
  adminHomePage: AdminHomePage;
  researcherPage: ResearcherHomePage; // logged in as researcher
  adminPage: AdminHomePage; // logged in as admin
};

export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  researcherHomePage: async ({ page }, use) => {
    await use(new ResearcherHomePage(page));
  },
  adminHomePage: async ({ page }, use) => {
    await use(new AdminHomePage(page));
  },
  researcherPage: async ({ page, baseURL }, use) => {
    const credentials = getResearcherCredentials();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);
    await page.waitForURL(/\/researcher\/homepage/, { timeout: 15000 });
    await use(new ResearcherHomePage(page));
  },
  adminPage: async ({ page, baseURL }, use) => {
    const credentials = getAdminCredentials();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);
    await page.waitForURL(/\/admin\/homepage/, { timeout: 15000 });
    await use(new AdminHomePage(page));
  },
});

export { expect } from '@playwright/test';
