import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

type Ep = {
  baseUrl: string;
  endpoints: {
    posts: {
      create: {
        method: string;
        path: string;
        sampleBody: { title: string; body: string; userId: number };
        expect: string[];
      };
    };
  };
};

// Load API contract so we reuse the same base URL and sample payload
const endpointsPath = path.join(__dirname, '../../config/endpoints.json');
const endpoints: Ep = JSON.parse(fs.readFileSync(endpointsPath, 'utf-8'));

test('[API] POST /posts returns 201 and echoes payload with a new id', async ({ request }) => {
  const base = endpoints.baseUrl;
  const ep = endpoints.endpoints.posts.create;
  const payload = ep.sampleBody;

  const res = await request.post(`${base}${ep.path}`, {
    data: payload,
    headers: { 'Content-Type': 'application/json' }
  });

  // Status code for a successful creation
  expect(res.status(), 'Expect 201 Created').toBe(201);

  const body = await res.json();

  // The API should echo back the data we sent
  expect(body).toMatchObject(payload);

  // And also include a generated numeric id
  expect(typeof body.id).toBe('number');
});