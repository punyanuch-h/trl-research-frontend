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

  /** Perform full login */
  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
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
    await this.page.waitForURL(/\/researcher\/homepage|\/admin\/homepage/, { timeout: 10000 });
  }
}
