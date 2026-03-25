import type { Page } from '@playwright/test';
import { authLocators } from '../locators/auth.locators';

/**
 * Page Object for Login page
 */
export class LoginPage {
  constructor(private readonly page: Page) { }

  /** Navigate to login page (app uses HashRouter) */
  async goto() {
    await this.page.goto('/#/login');
  }

  /** Fill email field */
  async fillEmail(email: string) {
    await authLocators.emailInput(this.page).fill(email);
  }

  /** Fill password field */
  async fillPassword(password: string) {
    await authLocators.passwordInput(this.page).fill(password);
  }

  /** Click Login button */
  async clickLogin() {
    await authLocators.loginButton(this.page).click();
  }

  /** Toggle Remember Me checkbox */
  async toggleRememberMe(checked: boolean) {
    const checkbox = authLocators.rememberMeCheckbox(this.page);
    const isChecked = await checkbox.isChecked();
    if (isChecked !== checked) {
      await checkbox.click();
    }
  }

  /** Perform full login and wait for dashboard */
  async login(email: string, password: string) {
    // Ensure the login page is fully mounted before interacting
    await authLocators.loginButton(this.page).waitFor({ state: 'visible' });
    
    // Add a short delay to ensure React Router transitions and state updates are complete
    await this.page.waitForTimeout(500);

    await this.fillEmail(email);
    await this.fillPassword(password);
    
    // We wait for either a successful redirect or an error message to appear
    const loginAttempt = Promise.all([
      // Use Promise.race for the outcome of the click
      Promise.race([
        this.page.waitForURL(/\/researcher\/homepage|\/admin\/homepage/, { timeout: 15000 }),
        this.page.locator('.text-destructive').waitFor({ state: 'visible', timeout: 15000 })
      ]),
      this.clickLogin()
    ]);

    await loginAttempt.catch(() => {
      console.log('Login attempt timed out or failed to redirect/show error');
    });

    const isDashboard = this.page.url().includes('homepage');
    if (isDashboard) {
      // Ensure dashboard UI is ready by waiting for stable elements (Table or Heading)
      await Promise.race([
        this.page.locator('table').waitFor({ state: 'visible', timeout: 7000 }),
        this.page.getByRole('heading').first().waitFor({ state: 'visible', timeout: 7000 })
      ]).catch(() => {});
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }
  }

  /** Click Forgot Password link */
  async clickForgotPassword() {
    await authLocators.forgotPasswordLink(this.page).click();
  }

  /** Click Sign Up link */
  async clickSignUp() {
    await authLocators.signupLink(this.page).click();
  }

  /** Check if login error is displayed */
  async hasLoginError(): Promise<boolean> {
    return authLocators.errorMessage(this.page).isVisible();
  }

  /** Check if app title is visible */
  async isAppTitleVisible(): Promise<boolean> {
    return authLocators.appTitle(this.page).isVisible();
  }

  /** Wait for redirect to dashboard (researcher or admin) */
  async expectRedirectToDashboard() {
    // Wait for the URL
    await this.page.waitForURL(/\/researcher\/homepage|\/admin\/homepage/, { timeout: 15000 });
    
    // UI-based waiting – use heading or table as they are more stable
    const heading = this.page.getByRole('heading').first();
    const table = this.page.locator('table');
    
    await Promise.race([
      heading.waitFor({ state: 'visible', timeout: 5000 }),
      table.waitFor({ state: 'visible', timeout: 5000 })
    ]).catch(() => {
      console.log('Timeout waiting for dashboard UI elements (heading/table)');
    });
  }
}
