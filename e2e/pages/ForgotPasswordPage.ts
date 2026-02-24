import type { Page } from '@playwright/test';
import { authLocators } from '../locators/auth.locators';

/**
 * Page Object for Forget Password page
 */
export class ForgotPasswordPage {
  constructor(private readonly page: Page) { }

  /** Navigate to forget password page (app uses HashRouter) */
  async goto() {
    await this.page.goto('/#/forget-password');
  }

  /** Fill email for reset */
  async fillEmail(email: string) {
    await authLocators.emailForgetInput(this.page).fill(email);
  }

  /** Click Send Reset Email */
  async clickSendResetEmail() {
    await authLocators.sendResetEmailButton(this.page).click();
  }

  /** Submit forget password form */
  async submitEmail(email: string) {
    await this.fillEmail(email);
    await this.clickSendResetEmail();
  }

  /** Check if success message is shown */
  async hasSuccessMessage(): Promise<boolean> {
    return authLocators.successAlert(this.page).isVisible();
  }

  /** Click Back to Login */
  async clickBackToLogin() {
    await authLocators.backToLoginButton(this.page).click();
  }

  /** Expect redirect to login */
  async expectRedirectToLogin() {
    await this.page.waitForURL(/\/login/, { timeout: 5000 });
  }
}
