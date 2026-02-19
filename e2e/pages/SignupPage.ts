import type { Page } from '@playwright/test';
import { authLocators } from '../locators/auth.locators';
import type { SignupFormData } from '../test-data/auth.data';

/**
 * Page Object for Signup page (Researcher registration)
 */
export class SignupPage {
  constructor(private readonly page: Page) { }

  /** Navigate to signup page (app uses HashRouter) */
  async goto() {
    await this.page.goto('/#/signup');
  }

  /** Select prefix (Mr, Mrs, Ms, etc.) */
  async selectPrefix(value: string) {
    await authLocators.prefixSelect(this.page).click();
    await this.page.getByRole('option', { name: value }).click();
  }

  /** Fill first name */
  async fillFirstName(firstName: string) {
    await authLocators.firstNameInput(this.page).fill(firstName);
  }

  /** Fill last name */
  async fillLastName(lastName: string) {
    await authLocators.lastNameInput(this.page).fill(lastName);
  }

  /** Fill department */
  async fillDepartment(department: string) {
    await authLocators.departmentInput(this.page).fill(department);
  }

  /** Fill phone (10 digits, Thai format 0XXXXXXXXX) */
  async fillPhone(phone: string) {
    const input = authLocators.phoneInput(this.page);
    await input.fill(phone);
  }

  /** Fill email */
  async fillEmail(email: string) {
    await authLocators.emailSignupInput(this.page).fill(email);
  }

  /** Fill password */
  async fillPassword(password: string) {
    const input = this.page.locator('input[type="password"]').first();
    await input.fill(password);
  }

  /** Fill confirm password */
  async fillConfirmPassword(password: string) {
    const inputs = this.page.locator('input[type="password"]');
    const count = await inputs.count();
    if (count >= 2) {
      await inputs.nth(1).fill(password);
    } else {
      await authLocators.confirmPasswordInput(this.page).fill(password);
    }
  }

  /** Fill complete signup form */
  async fillForm(data: SignupFormData) {
    await this.selectPrefix(data.prefix);
    await this.fillFirstName(data.firstName);
    await this.fillLastName(data.lastName);
    await this.fillDepartment(data.department);
    await this.fillPhone(data.phone);
    await this.fillEmail(data.email);
    await this.fillPassword(data.password);
    await this.fillConfirmPassword(data.confirmPassword);
  }

  /** Click Sign Up submit button */
  async clickSignUp() {
    await authLocators.signupButton(this.page).click();
  }

  /** Perform full signup */
  async signup(data: SignupFormData) {
    await this.fillForm(data);
    await this.clickSignUp();
  }

  /** Check if validation error is shown */
  async hasValidationError(): Promise<boolean> {
    const error = authLocators.errorMessage(this.page);
    return error.isVisible();
  }

  /** Expect redirect to login after signup */
  async expectRedirectToLogin() {
    await this.page.waitForURL(/\/login/, { timeout: 10000 });
  }
}
