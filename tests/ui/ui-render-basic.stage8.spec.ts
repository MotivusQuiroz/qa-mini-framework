/**
 * Stage 8 – Step 1
 * File: tests/ui/ui-render-basic.stage8.spec.ts
 * Objective: Verify that the mock UI loads, fetches posts, and renders the first 10 rows
 * using only data-testid locators.
 *
 * Pre-req: Playwright config manages the dev server automatically
 */

import { test, expect } from '@playwright/test';

test.describe('Stage 8 – UI Render (Happy Path)', () => {
  test.setTimeout(60000);

  test('should load page, fetch posts, and render 10 rows', async ({ page, baseURL }) => {
    // Use Playwright's baseURL + relative path
    await page.goto(new URL('/src/mock-ui/index.html', baseURL!).toString(), {
      waitUntil: 'domcontentloaded',
    });

    // Title exists
    await expect(page.getByTestId('title')).toHaveText(/Mock UI – Minimal App/i);

    // Loading may be very brief
    await page.getByTestId('loading').waitFor({ state: 'visible', timeout: 1500 }).catch(() => {});

    // Posts heading appears after fetch completes
    await expect(page.getByTestId('posts-heading')).toBeVisible();

    // Table and wrapper present
    await expect(page.getByTestId('table-wrapper')).toBeVisible();
    await expect(page.getByTestId('posts-table')).toBeVisible();

    // Rows rendered (exactly 10 by design)
    const rows = page.getByTestId('post-row');
    await expect(rows).toHaveCount(10);

    // Validate representative cells on the first row
    const firstRow = rows.first();
    await expect(firstRow.getByTestId('cell-userId')).toHaveText(/^\d+$/);
    await expect(firstRow.getByTestId('cell-id')).toHaveText(/^\d+$/);
    await expect(firstRow.getByTestId('cell-title')).not.toHaveText('');

    // Spot-check every row has a non-empty title
    const titles = await page.getByTestId('cell-title').allTextContents();
    expect(titles.length).toBe(10);
    titles.forEach(t => expect(String(t).trim().length).toBeGreaterThan(0));
  });
});
