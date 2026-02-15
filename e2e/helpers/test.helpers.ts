import type { Page } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Reusable helper functions for E2E tests
 */

/** Wait for network to be idle (no requests for 500ms) */
export async function waitForNetworkIdle(page: Page, timeout = 5000) {
  await page.waitForLoadState('networkidle');
}

/** Take screenshot on failure - called from test */
export async function takeScreenshotOnFailure(
  page: Page,
  testName: string,
  outputDir = 'e2e/test-results'
) {
  const safeName = testName.replace(/[^a-z0-9]/gi, '_');
  const filepath = path.join(outputDir, `failure_${safeName}_${Date.now()}.png`);
  await page.screenshot({ path: filepath, fullPage: true });
  return filepath;
}

/** Verify file was downloaded (Playwright download event) */
export async function expectDownload(
  page: Page,
  downloadPromise: Promise<unknown>,
  expectedSuffix?: string
) {
  // Use page.waitForEvent('download') if passed
  const download = await (downloadPromise as Promise<import('@playwright/test').Download>);
  const filename = download.suggestedFilename();
  const filepath = await download.path();
  expect(filepath).toBeTruthy();
  if (expectedSuffix) {
    expect(filename.toLowerCase()).toMatch(new RegExp(`\\.${expectedSuffix}$`));
  }
  return { filename, filepath };
}

/** Set localStorage token (for authenticated state) */
export async function setAuthToken(page: Page, token: string) {
  await page.evaluate((t) => {
    localStorage.setItem('token', t);
  }, token);
}
