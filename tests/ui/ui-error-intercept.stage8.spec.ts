/**
 * Stage 8 – Step 3
 * File: tests/ui/ui-error-intercept.stage8.spec.ts
 * Objective: Force an error from the UI’s config/data request and verify the error UI is shown.
 *
 * Pre-req: Manual server running: npm run dev:ui
 */

import { test, expect } from '@playwright/test';

test.describe('Stage 8 – Error State (Network Intercept)', () => {
  test.setTimeout(60000);

  test('should render error UI when endpoints.json fails', async ({ page, baseURL }) => {
    // Intercept the config request and force a 500 so the UI shows error
    await page.route('**/config/endpoints.json', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'forced failure' }),
      });
    });

    // Navigate
    await page.goto(new URL('/src/mock-ui/index.html', baseURL!).toString(), {
      waitUntil: 'domcontentloaded',
    });

    // Loading may flash briefly
    await page.getByTestId('loading').waitFor({ state: 'visible', timeout: 1500 }).catch(() => {});

    // Error UI must appear; message should include endpoints.json and 500
    const errorBox = page.getByTestId('error');
    await expect(errorBox).toBeVisible();
    await expect(errorBox).toContainText('endpoints.json');
    await expect(errorBox).toContainText('500');

    // And the normal posts UI should not be present
    await expect(page.getByTestId('posts-heading')).toHaveCount(0);
    await expect(page.getByTestId('posts-table')).toHaveCount(0);
  });
});
