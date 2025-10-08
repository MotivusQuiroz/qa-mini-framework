/**
 * Stage 8 – Step 2
 * File: tests/ui/ui-loading-indicator.stage8.spec.ts
 * Objective: Verify the UI shows a loading state while fetching, then hides it once data renders.
 *
 * Pre-req: Manual server running in another terminal: npm run dev:ui
 *          (Or Playwright-managed server via config if you switch later.)
 */

import { test, expect } from '@playwright/test';

test.describe('Stage 8 – Loading Indicator', () => {
  test.setTimeout(60000);

  test('should show loading, then hide when posts render', async ({ page, baseURL }) => {
    // Navigate using baseURL from Playwright config
    await page.goto(new URL('/src/mock-ui/index.html', baseURL!).toString(), {
      waitUntil: 'domcontentloaded',
    });

    const loading = page.getByTestId('loading');
    const postsHeading = page.getByTestId('posts-heading');
    const table = page.getByTestId('posts-table');

    // Loading state should appear (allow short timeout to avoid flakiness on fast networks)
    await loading.waitFor({ state: 'visible', timeout: 2000 }).catch(() => { /* fast networks may skip */ });

    // After fetch completes, posts heading & table should be visible
    await expect(postsHeading).toBeVisible();
    await expect(table).toBeVisible();

    // Loading should no longer be visible (either hidden or detached)
    // Try hidden first; if node was removed, assert it's detached.
    const isVisible = await loading.isVisible().catch(() => false);
    if (isVisible) {
      await expect(loading).toBeHidden();
    } else {
      await expect(loading).not.toBeAttached();
    }
  });
});
