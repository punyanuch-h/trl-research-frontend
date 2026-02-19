/**
 * Test data for authentication flows
 */

export interface SignupFormData {
  prefix: string;
  firstName: string;
  lastName: string;
  department: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/** Build researcher signup data with optional overrides */
export function buildResearcherSignupData(overrides?: Partial<SignupFormData>): SignupFormData {
  const timestamp = Date.now();
  return {
    prefix: 'Mr.',
    firstName: 'Test',
    lastName: 'Researcher',
    department: 'Computer Engineering',
    phone: '0812345678',
    email: `test.researcher.${timestamp}@example.com`,
    password: 'TestPass123',
    confirmPassword: 'TestPass123',
    ...overrides,
  };
}

/** Build researcher signup data with optional overrides */
export function buildAdminData(overrides?: Partial<SignupFormData>): SignupFormData {
  const timestamp = Date.now();
  return {
    prefix: 'Mr.',
    firstName: 'Test',
    lastName: 'Admin',
    department: 'Computer Engineering',
    phone: '0812345678',
    email: `test.admin.${timestamp}@example.com`,
    password: 'TestPass123',
    confirmPassword: 'TestPass123',
    ...overrides,
  };
}

/** Valid researcher credentials (pre-seeded or from env) */
export function getResearcherCredentials() {
  return {
    email: process.env.RESEARCHER_EMAIL || 'researcher@example.com',
    password: process.env.RESEARCHER_PASSWORD || 'Researcher123',
  };
}

/** Valid admin credentials */
export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'Admin123',
  };
}

/** Invalid credentials for error tests */
export const invalidCredentials = {
  email: 'invalid@example.com',
  password: 'wrongpassword',
};
