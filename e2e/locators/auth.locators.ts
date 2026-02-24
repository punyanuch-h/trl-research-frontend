import type { Page } from '@playwright/test';

/**
 * Locators for authentication pages (Login, Signup, Forget Password)
 * Retry-safe: Uses role, label, placeholder for stability
 */
export const authLocators = {
  /** App title heading on auth pages */
  appTitle: (page: Page) => page.getByRole('heading', { name: /Technology Readiness Level/i }),

  /** Login submit button */
  loginButton: (page: Page) => page.getByRole('button', { name: /log in/i }),
  /** Signup submit button */
  signupButton: (page: Page) => page.getByRole('button', { name: /sign up|register/i }),
  /** Link to navigate to signup */
  signupLink: (page: Page) => page.getByRole('button', { name: /sign up/i }),
  /** Link to navigate to login */
  loginLink: (page: Page) => page.getByRole('button', { name: /log in/i }),

  /** Email input on login */
  emailInput: (page: Page) => page.getByTestId(/email/i).first(),
  /** Password input on login */
  passwordInput: (page: Page) => page.getByTestId(/password/i).first(),
  /** Forgot password link */
  forgotPasswordLink: (page: Page) => page.getByRole('button', { name: /forgot password/i }),

  /** Prefix select on signup */
  prefixSelect: (page: Page) => page.getByTestId(/prefix/),
  /** Academic position select on signup */
  academicSelect: (page: Page) => page.getByTestId(/academic_position/),
  /** First name input */
  firstNameInput: (page: Page) => page.getByTestId(/first_name/i),
  /** Last name input */
  lastNameInput: (page: Page) => page.getByTestId(/last_name/i),
  /** Department input */
  departmentInput: (page: Page) => page.getByTestId(/department/i),
  /** Phone input (may be in phone format component) */
  phoneInput: (page: Page) => page.getByTestId(/phone/i).or(page.locator('input[name="phone_number"]')),
  /** Email input on signup */
  emailSignupInput: (page: Page) => page.getByTestId(/email/i).first(),
  /** Password input on signup */
  passwordSignupInput: (page: Page) => page.getByPlaceholder(/^\*+$/)
    .or(page.locator('input[type="password"]').first()),
  /** Confirm password input */
  confirmPasswordInput: (page: Page) => page.getByLabel(/confirm password/i),

  /** Email input on forget password page */
  emailForgetInput: (page: Page) => page.getByPlaceholder('example@email.com'),
  /** Send reset email button */
  sendResetEmailButton: (page: Page) => page.getByRole('button', { name: /send reset email|send/i }),
  /** Back to login button */
  backToLoginButton: (page: Page) => page.getByRole('button', { name: /back to login/i }),
  /** Success message alert */
  successAlert: (page: Page) => page.getByRole('alert'),
  /** Destructive/error message */
  errorMessage: (page: Page) => page.locator('.text-destructive'),
} as const;
