import type { Page } from '@playwright/test';

/**
 * Locators for admin features (Dashboard, Management, Assessment, Appointments)
 */
export const adminLocators = {
  /** Research Management heading */
  researchManagementHeading: (page: Page) =>
    page.getByRole('heading', { name: /research management/i }),
  /** Management / List tab */
  managementTab: (page: Page) =>
    page.getByRole('button', { name: /manage research|management|list/i }),
  /** Dashboard tab */
  dashboardTab: (page: Page) =>
    page.getByRole('button', { name: /research overview|dashboard/i }),
  /** Appointments tab */
  appointmentsTab: (page: Page) =>
    page.getByRole('button', { name: /appointment/i }),
  /** Assess Research button */
  assessResearchButton: (page: Page) =>
    page.getByRole('button', { name: /assess research/i }),
  /** Add Appointment button */
  addAppointmentButton: (page: Page) =>
    page.getByRole('button', { name: /add appointment/i }),
  /** Edit appointment button */
  editAppointmentButton: (page: Page) =>
    page.getByRole('button', { name: /edit/i }),
  /** Approve button on assessment */
  approveButton: (page: Page) =>
    page.getByRole('button', { name: /approve/i }),
  /** Reject button on assessment */
  rejectButton: (page: Page) =>
    page.getByRole('button', { name: /reject/i }),
  /** Add comment textarea */
  commentTextarea: (page: Page) =>
    page.getByRole('textbox', { name: /comment|suggestion/i }),
  /** Change Password menu/link */
  changePasswordLink: (page: Page) =>
    page.getByRole('menuitem', { name: /change password/i }).or(
      page.getByRole('link', { name: /change password/i })
    ),
  /** Add Admin Account link */
  addAdminLink: (page: Page) =>
    page.getByRole('menuitem', { name: /add admin|create admin/i }).or(
      page.getByRole('link', { name: /add admin/i })
    ),
  /** Old/Current password input */
  oldPasswordInput: (page: Page) =>
    page.getByLabel(/current password|old password/i),
  /** New password input */
  newPasswordInput: (page: Page) =>
    page.getByLabel(/new password/i),
  /** Confirm new password input */
  confirmNewPasswordInput: (page: Page) =>
    page.getByLabel(/confirm new password/i ),
  /** KPI/Stats widget */
  statsWidget: (page: Page) =>
    page.locator('[class*="metric"], [class*="kpi"], [class*="card"]').first(),
} as const;
