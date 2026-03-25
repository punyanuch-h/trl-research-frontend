import type { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { buildResearcherSignupData, getAdminCredentials, getResearcherCredentials } from '../test-data/auth.data';

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

export async function ensureAdminLogin(page: Page): Promise<boolean> {
  const credentials = getAdminCredentials();
  const loginPage = new LoginPage(page);
  const candidatePasswords = Array.from(
    new Set([credentials.password, 'NewPass123A', 'Admin123', 'AdminPass123'])
  );

  for (const password of candidatePasswords) {
    await loginPage.goto();
    await loginPage.login(credentials.email, password);

    if (page.url().includes('/admin/homepage')) {
      return true;
    }

    const hasInvalidCredentials = await page
      .getByText(/invalid email or password/i)
      .isVisible()
      .catch(() => false);

    if (!hasInvalidCredentials) {
      break;
    }
  }

  return false;
}
