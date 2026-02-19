import type { Page } from '@playwright/test';
import { researcherLocators } from '../locators/researcher.locators';

/**
 * Page Object for Researcher Home page
 */
export class ResearcherHomePage {
  constructor(private readonly page: Page) { }

  /** Navigate to researcher homepage (app uses HashRouter) */
  async goto() {
    await this.page.goto('/#/researcher/homepage');
  }

  /** Check if page loaded - My Research heading visible */
  async isPageLoaded(): Promise<boolean> {
    return researcherLocators.myResearchHeading(this.page).isVisible();
  }

  /** Click Add Research button */
  async clickAddResearch() {
    await researcherLocators.addResearchButton(this.page).click();
  }

  /** Click first View Details button in table */
  async clickFirstViewDetails() {
    await researcherLocators.viewDetailsButton(this.page).first().click();
  }

  /** Click Download/Assessment Result for first approved item */
  async clickFirstDownload() {
    await researcherLocators.downloadButton(this.page).first().click();
  }

  /** Check if table has data */
  async hasResearchTable(): Promise<boolean> {
    return researcherLocators.submittedResearchTable(this.page).isVisible();
  }

  /** Check if no research data message is shown */
  async hasNoResearchData(): Promise<boolean> {
    return researcherLocators.noResearchData(this.page).isVisible();
  }

  /** Expect URL to be researcher homepage */
  async expectOnHomepage() {
    await this.page.waitForURL(/\/researcher\/homepage/, { timeout: 5000 });
  }
}
