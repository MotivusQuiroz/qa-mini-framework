import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

type Ep = {
  baseUrl: string;
  endpoints: {
    posts: {
      list: { method: string; path: string; expect: string[] };
    };
  };
};

const endpointsPath = path.join(__dirname, '../../config/endpoints.json');
const endpoints: Ep = JSON.parse(fs.readFileSync(endpointsPath, 'utf-8'));

test('[API] GET /posts returns an array with expected fields', async ({ request }) => {
  const base = endpoints.baseUrl;
  const ep = endpoints.endpoints.posts.list;

  const res = await request.get(`${base}${ep.path}`);
  expect(res.status()).toBe(200);

  const data = await res.json();
  expect(Array.isArray(data)).toBe(true);
  expect(data.length).toBeGreaterThan(0);

  // verify required fields exist on first item
  for (const key of ep.expect) {
    expect(data[0]).toHaveProperty(key);
  }
});