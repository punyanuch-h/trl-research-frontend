import type { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { buildResearcherSignupData, getResearcherCredentials } from '../test-data/auth.data';

export async function ensureResearcherLogin(page: Page) {
  const credentials = getResearcherCredentials();
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(credentials.email, credentials.password);

  if (page.url().includes('/researcher/homepage')) {
    return;
  }

  const signupPage = new SignupPage(page);
  await signupPage.goto();
  await signupPage.fillForm(buildResearcherSignupData({
    ...credentials,
    confirmPassword: credentials.password,
  }));
  await signupPage.clickSignUp();
  await page.waitForURL(/\/login/, { timeout: 10000 });

  await loginPage.login(credentials.email, credentials.password);
}
