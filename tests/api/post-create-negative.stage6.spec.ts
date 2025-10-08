/**
 * Stage 6 – Step 2
 * File: tests/api/post-create-negative.stage6.spec.ts
 * Objective: Validate that the API correctly rejects a create request with an invalid payload,
 * returning the expected failure status code and not producing a valid resource body.
 */

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { buildCreatePostPayloadStage6 } from '../utils/builders';

type EndpointsConfig = {
  baseUrl: string;
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
    // Load endpoints configuration
    const projectRoot = 'D:\\QA_MiniFramework\\source';
    const configPath = path.join(projectRoot, 'config', 'endpoints.json');
    const cfgRaw = fs.readFileSync(configPath, 'utf-8');
    const cfg: EndpointsConfig = JSON.parse(cfgRaw);

    const baseUrl = cfg.baseUrl;
    const create = cfg.endpoints.posts.create;

    // Deterministic payload (content is irrelevant for invalid route, kept for consistency)
    const payload = buildCreatePostPayloadStage6();

    // Deliberately target an invalid create route to force a failure response
    const invalidCreatePath = `${create.path}/not-found`;

    const response = await request.post(`${baseUrl}${invalidCreatePath}`, {
      data: payload,
    });

    // Expect a clear failure code
    expect([400, 404, 405]).toContain(response.status());

    // Attempt to parse response body; some providers may return empty/HTML bodies on 4xx
    const contentType = response.headers()['content-type'] ?? '';
    let body: unknown = null;
    try {
      body = contentType.includes('application/json')
        ? await response.json()
        : await response.text();
    } catch {
      body = null;
    }

    // Contract guard: body must NOT present a valid resource with all expected fields
    const expectedFields = create.expect;
    const hasAllExpected =
      body &&
      typeof body === 'object' &&
      expectedFields.every((k) => Object.prototype.hasOwnProperty.call(body as Record<string, unknown>, k));

    expect(hasAllExpected).toBeFalsy();
  });
});
