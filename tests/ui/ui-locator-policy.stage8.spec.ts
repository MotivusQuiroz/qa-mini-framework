/**
 * Stage 8 – Step 4
 * File: tests/ui/ui-locator-policy.stage8.spec.ts
 * Objective: Enforce "testid-only" locator policy across Stage 8 UI specs.
 * Portable across OS/CI (no hard-coded paths).
 */

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Portable dir: this spec's folder (tests/ui)
const TARGET_DIR = __dirname;

// Stage 8 UI specs only, excluding this policy file
const FILE_MATCH = /\.stage8\.spec\.ts$/;
const EXCLUDE = new Set(['ui-locator-policy.stage8.spec.ts']);

// Allowed locator patterns
const ALLOWED = [
  /getByTestId\s*\(/,           // page.getByTestId('...')
  /\.getByTestId\s*\(/,         // locator.getByTestId('...')
];

// Forbidden patterns (broad on purpose)
const FORBIDDEN: Array<{ name: string; rx: RegExp }> = [
  { name: 'page.$ / page.$$', rx: /\bpage\.\${1,2}\s*\(/ },
  { name: 'raw locator with string', rx: /\blocator\s*\(\s*(['"`]).+?\1\s*\)/ },
  { name: 'getByText', rx: /\bgetByText\s*\(/ },
  { name: 'getByRole', rx: /\bgetByRole\s*\(/ },
  { name: 'getByPlaceholder', rx: /\bgetByPlaceholder\s*\(/ },
  { name: 'getByLabel', rx: /\bgetByLabel\s*\(/ },
  { name: 'getByAltText', rx: /\bgetByAltText\s*\(/ },
  { name: 'getByTitle', rx: /\bgetByTitle\s*\(/ },
  { name: 'testId() shorthand', rx: /\btestId\s*\(/ }, // disallow alt API here
  { name: 'text= selector', rx: /text\s*=\s*['"`]/ },
  { name: 'xpath selector', rx: /['"`]\s*\/\/.+['"`]/ },
  { name: 'css selector #/.', rx: /['"`]\s*[#\.][A-Za-z0-9_-]/ },
];

// List Stage 8 specs in this directory
function listStage8Specs(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter(f => FILE_MATCH.test(f))
    .filter(f => !EXCLUDE.has(f))
    .map(f => path.join(dir, f));
}

test.describe('Stage 8 – Locator Policy (testid-only)', () => {
  const files = listStage8Specs(TARGET_DIR);

  test(`should scan ${files.length} Stage 8 UI spec(s) (excluding policy spec)`, async () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    test(`enforce testid-only locators: ${path.basename(file)}`, async () => {
      const src = fs.readFileSync(file, 'utf-8');

      // Must include at least one allowed usage
      expect(ALLOWED.some(rx => rx.test(src))).toBeTruthy();

      // Must not include any forbidden usage
      const hits: string[] = [];
      for (const rule of FORBIDDEN) {
        if (rule.rx.test(src)) hits.push(rule.name);
      }
      if (hits.length) {
        throw new Error(
          `Locator policy violation(s) in ${path.basename(file)}:\n` +
          hits.map(h => ` - ${h}`).join('\n')
        );
      }
    });
  }
});
