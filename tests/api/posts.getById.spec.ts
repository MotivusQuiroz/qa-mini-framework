import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

type Ep = {
  baseUrl: string;
  endpoints: { posts: { getById: { path: string; expect: string[] } } };
};

const endpointsPath = path.join(__dirname, '../../config/endpoints.json');
const endpoints: Ep = JSON.parse(fs.readFileSync(endpointsPath, 'utf-8'));

test('[API] GET /posts/1 returns expected fields and id=1', async ({ request }) => {
  const url = `${endpoints.baseUrl}${endpoints.endpoints.posts.getById.path.replace('{id}', '1')}`;

  const res = await request.get(url);
  expect(res.status(), 'Expect 200 OK').toBe(200);

  const body = await res.json();

  // Required fields present
  for (const key of endpoints.endpoints.posts.getById.expect) {
    expect(body, `missing field: ${key}`).toHaveProperty(key);
  }

  // Data-specific checks
  expect(typeof body.id).toBe('number');
  expect(body.id).toBe(1);
  expect(typeof body.userId).toBe('number');
  expect(typeof body.title).toBe('string');
  expect(body.title.length).toBeGreaterThan(0);
});