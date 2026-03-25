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
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    prefix: 'Mr.',
    firstName: 'Test',
    lastName: 'Researcher',
    department: 'Computer Engineering',
    phone: '0812345678',
    email: `test.researcher.${uniqueSuffix}@example.com`,
    password: 'TestPass123',
    confirmPassword: 'TestPass123',
    ...overrides,
  };
}

/** Build researcher signup data with optional overrides */
export function buildAdminData(overrides?: Partial<SignupFormData>): SignupFormData {
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    prefix: 'Mr.',
    firstName: 'Test',
    lastName: 'Admin',
    department: 'Computer Engineering',
    phone: '0812345678',
    email: `test.admin.${uniqueSuffix}@example.com`,
    password: 'TestPass123',
    confirmPassword: 'TestPass123',
    ...overrides,
  };
}

/** Valid researcher credentials (pre-seeded or from env) */
export function getResearcherCredentials() {
  return {
    email: process.env.RESEARCHER_EMAIL || 'somchai.med@uni.ac.th',
    password: process.env.RESEARCHER_PASSWORD || 'password123',
  };
}

/** Valid admin credentials */
export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || 'admin.wichai@uni.ac.th',
    password: process.env.ADMIN_PASSWORD || 'password123',
  };
}

/** Invalid credentials for error tests */
export const invalidCredentials = {
  email: 'invalid@example.com',
  password: 'wrongpassword',
};
