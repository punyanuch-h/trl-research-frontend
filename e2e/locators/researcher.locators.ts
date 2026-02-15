import type { Page } from '@playwright/test';

/**
 * Locators for researcher features (Home, Submit Research, View Detail, Download)
 */
export const researcherLocators = {
  /** Add Research button */
  addResearchButton: (page: Page) =>
    page.getByRole('button', { name: /add research|add new research/i }),
  /** My Research heading */
  myResearchHeading: (page: Page) =>
    page.getByRole('heading', { name: /my research/i }),
  /** Filter button */
  filterButton: (page: Page) =>
    page.getByRole('button', { name: /filter/i }),
  /** View Details button */
  viewDetailsButton: (page: Page) =>
    page.getByRole('button', { name: /view details|ดูรายละเอียด/i }),
  /** Assessment Result / Download button */
  downloadButton: (page: Page) =>
    page.getByRole('button', { name: /assessment result|download/i }),
  /** Submitted Research table */
  submittedResearchTable: (page: Page) =>
    page.getByRole('table'),
  /** Back button on form */
  formBackButton: (page: Page) =>
    page.getByRole('button', { name: /back/i }).first(),
  /** Next step button */
  nextStepButton: (page: Page) =>
    page.getByRole('button', { name: /next step|next/i }),
  /** Previous step button */
  prevStepButton: (page: Page) =>
    page.getByRole('button', { name: /prev|previous/i }),
  /** Save / Submit button */
  saveButton: (page: Page) =>
    page.getByRole('button', { name: /save|submit/i }),
  /** Confirm and Submit in dialog */
  confirmSubmitButton: (page: Page) =>
    page.getByRole('button', { name: /confirm.*submit|confirm and submit/i }),
  /** Cancel button in dialog */
  cancelButton: (page: Page) =>
    page.getByRole('button', { name: /cancel/i }),
  /** Research title input (Step 2) */
  researchTitleInput: (page: Page) =>
    page.getByLabel(/research title|title/i),
  /** No research data message */
  noResearchData: (page: Page) =>
    page.getByText(/no research data|no data/i),
} as const;
