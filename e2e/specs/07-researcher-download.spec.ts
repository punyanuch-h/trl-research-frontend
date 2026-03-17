import { test, expect } from '@playwright/test';
import { ensureResearcherLogin } from '../helpers/auth.helpers';

test.describe('Download research result', () => {
  test.beforeEach(async ({ page }) => {
    await ensureResearcherLogin(page);
    await expect(page.getByRole('heading', { name: /my research/i })).toBeVisible({ timeout: 15000 });
  });

  test('should trigger file download when clicking download button', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const downloadButtons = page.getByRole('button', { name: /assessment result|ผลการประเมิน/i });
    if ((await downloadButtons.count()) === 0) {
      test.skip(true, 'No approved research item available for download');
    }

    const downloadPromise = page.waitForEvent('download', { timeout: 15000 });
    await downloadButtons.first().click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
    expect(await download.path()).toBeTruthy();
  });
});
