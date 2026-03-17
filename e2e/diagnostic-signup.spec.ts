import { test, expect } from '@playwright/test';
import { SignupPage } from './pages/SignupPage';
import { buildResearcherSignupData } from './test-data/auth.data';

test('diagnostic: researcher signup', async ({ page }) => {
  const signupPage = new SignupPage(page);
  const data = buildResearcherSignupData();
  await signupPage.goto();
  await signupPage.fillForm(data);
  await signupPage.clickSignUp();
  
  const errorVisible = await page.locator('.text-destructive').isVisible();
  if (errorVisible) {
    console.log('Signup error visible:', await page.locator('.text-destructive').textContent());
  }
  
  await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
});
