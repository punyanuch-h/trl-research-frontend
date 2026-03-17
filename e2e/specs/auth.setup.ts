/**
 * Auth setup - stores auth state for researcher and admin
 * Run: npx playwright test auth.setup.ts
 */
import { test as setup } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { LoginPage } from '../pages/LoginPage';
import { buildResearcherSignupData } from '../test-data/auth.data';
import { SignupPage } from '../pages/SignupPage';
import { ensureAdminLogin } from '../helpers/auth.helpers';

const researcherAuthFile = 'e2e/.auth/researcher.json';
const adminAuthFile = 'e2e/.auth/admin.json';

// Ensure .auth directory exists
const authDir = path.dirname(researcherAuthFile);
if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}

setup('authenticate as researcher', async ({ page }) => {
  const credentials = {
    email: 'researcher@example.com',
    password: 'Researcher123'
  };
  const signupData = buildResearcherSignupData(credentials);
  
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.toggleRememberMe(true);
  await loginPage.login(credentials.email, credentials.password);
  
  try {
    // If we can login, great!
    await page.waitForURL(/\/researcher\/homepage/, { timeout: 5000 });
  } catch (e) {
    // If login fails, user might not exist. Try signup.
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillForm(signupData);
    await signupPage.clickSignUp();
    
    // Login again
    await loginPage.goto();
    await loginPage.toggleRememberMe(true);
    await loginPage.login(credentials.email, credentials.password);
    await page.waitForURL(/\/researcher\/homepage/, { timeout: 15000 });
  }
  
  await page.context().storageState({ path: researcherAuthFile });
});

setup('authenticate as admin', async ({ page }) => {
  const isLoggedIn = await ensureAdminLogin(page);
  if (!isLoggedIn) {
    return;
  }

  await page.context().storageState({ path: adminAuthFile });
});
