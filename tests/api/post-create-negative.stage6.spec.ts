/**
 * Stage 6 – Step 2
 * File: tests/api/post-create-negative.stage6.spec.ts
 * Objective: Validate that the API rejects a create request with an invalid route,
 * returning 400/404/405 and not producing a valid resource body.
 */

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { buildCreatePostPayloadStage6 } from '../utils/builders';
import { getApiBaseUrl } from '../utils/env';

type EndpointsConfig = {
  endpoints: {
    posts: {
      create: {
        method: string;
        path: string;
        expect: string[];
      };
    };
  };
};

test.describe('Stage 6 – POST – Negative', () => {
  test('should reject create on an invalid route and not return a valid resource', async ({ request }) => {
    const configPath = path.join('D:\\QA_MiniFramework\\source', 'config', 'endpoints.json');
    const cfg: EndpointsConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

    const baseUrl = getApiBaseUrl();
    const create = cfg.endpoints.posts.create;

    const payload = buildCreatePostPayloadStage6();

    const invalidCreatePath = `${create.path}/not-found`;

    const response = await request.post(`${baseUrl}${invalidCreatePath}`, { data: payload });

    // Expect real API behavior
    expect([400, 404, 405]).toContain(response.status());

    const contentType = response.headers()['content-type'] ?? '';
    let body: unknown = null;
    try {
      body = contentType.includes('application/json')
        ? await response.json()
        : await response.text();
    } catch {
      body = null;
    }

    const expectedFields = create.expect;
    const hasAllExpected =
      body &&
      typeof body === 'object' &&
      expectedFields.every(k => Object.prototype.hasOwnProperty.call(body as Record<string, unknown>, k));

    expect(hasAllExpected).toBeFalsy();
  });
});
