import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { getResearcherCredentials } from '../test-data/auth.data';

test.describe('Download research result', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const credentials = getResearcherCredentials();
    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);
    await page.waitForURL(/\/researcher\/homepage/, { timeout: 15000 });
  });

  test('should trigger file download when clicking download button', async ({ page }) => {
    // Download button is only shown for approved research (status = true)
    const downloadBtn = page.getByRole('button', { name: /assessment result|ผลการประเมิน/i });
    await page.waitForLoadState('networkidle');
    const count = await downloadBtn.count();
    expect(count, "No research item found in homepage").toBeGreaterThan(0);
    const downloadPromise = page.waitForEvent('download', { timeout: 15000 });
    await downloadBtn.first().click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
    const path = await download.path();
    expect(path).toBeTruthy();
  });
});
