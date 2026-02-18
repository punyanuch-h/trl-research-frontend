import type { Page } from '@playwright/test';
import { adminLocators } from '../locators/admin.locators';

/**
 * Page Object for Admin Home page
 */
export class AdminHomePage {
  constructor(private readonly page: Page) {}

  /** Navigate to admin homepage (app uses HashRouter) */
  async goto() {
    await this.page.goto('/#/admin/homepage');
  }

  /** Check if dashboard loaded */
  async isPageLoaded(): Promise<boolean> {
    return adminLocators.researchManagementHeading(this.page).isVisible();
  }

  /** Click Dashboard tab */
  async clickDashboardTab() {
    await adminLocators.dashboardTab(this.page).click();
  }

  /** Click Management tab */
  async clickManagementTab() {
    await adminLocators.managementTab(this.page).click();
  }

  /** Click Appointments tab */
  async clickAppointmentsTab() {
    await adminLocators.appointmentsTab(this.page).click();
  }

  /** Check if navigation menu is visible */
  async isNavigationVisible(): Promise<boolean> {
    const heading = adminLocators.researchManagementHeading(this.page);
    return heading.isVisible();
  }

  /** Expect URL to be admin homepage */
  async expectOnHomepage() {
    await this.page.waitForURL(/\/admin\/homepage/, { timeout: 5000 });
  }
}
