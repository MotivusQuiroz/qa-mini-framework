import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

type Ep = {
  baseUrl: string;
  endpoints: {
    posts: {
      create: { path: string };
    };
  };
};

const endpointsPath = path.join(__dirname, '../../config/endpoints.json');
const endpoints: Ep = JSON.parse(fs.readFileSync(endpointsPath, 'utf-8'));

test('[API] POST /posts with invalid body should fail', async ({ request }) => {
  const base = endpoints.baseUrl;
  const ep = endpoints.endpoints.posts.create;

  // deliberately send garbage instead of proper JSON
  const invalidPayload = { badField: 123 };

  const res = await request.post(`${base}${ep.path}`, {
    data: invalidPayload,
    headers: { 'Content-Type': 'application/json' }
  });

  // Expect failure status (400 or not 201)
  expect(res.status()).not.toBe(201);
});