import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

type Ep = {
  provider: string;
  baseUrl: string;
  endpoints: {
    posts: {
      list: { method: string; path: string; expect: string[] };
    };
  };
};

// Load API contract (no TS config tweaks needed)
const endpoints: Ep = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../config/endpoints.json'), 'utf-8')
);

test('GET /posts returns an array with expected fields', async ({ request }) => {
  const base = endpoints.baseUrl;
  const ep = endpoints.endpoints.posts.list;

  const res = await request.get(`${base}${ep.path}`);
  expect(res.status(), 'status should be 200').toBe(200);

  const data = await res.json();
  expect(Array.isArray(data), 'response should be an array').toBe(true);
  expect(data.length, 'array should not be empty').toBeGreaterThan(0);

  // Check required fields exist on the first item
  for (const key of ep.expect) {
    expect(data[0], `missing field: ${key}`).toHaveProperty(key);
  }
});
