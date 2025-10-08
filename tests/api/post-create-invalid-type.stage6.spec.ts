/**
 * Stage 6 – Step 5
 * File: tests/api/post-create-invalid-type.stage6.spec.ts
 * Objective: Validate that the API fails to create a new resource when a required field has
 * the wrong type, returning the expected failure status code and ensuring the response does not
 * contain a valid resource object.
 */

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { buildCreatePostPayloadStage6InvalidType } from '../utils/builders';

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

test.describe('Stage 6 – POST – Negative (Invalid Type)', () => {
  test('should reject create when "userId" is a string instead of number', async ({ request }) => {
    // Load endpoints configuration
    const projectRoot = 'D:\\QA_MiniFramework\\source';
    const configPath = path.join(projectRoot, 'config', 'endpoints.json');
    const cfg: EndpointsConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

    const baseUrl = cfg.baseUrl;
    const create = cfg.endpoints.posts.create;

    // Build payload with wrong type: userId as string instead of number
    const payload = buildCreatePostPayloadStage6InvalidType('userId', 'not-a-number');

    // Perform request
    const response = await request.post(`${baseUrl}${create.path}`, {
      data: payload,
    });

    // Expect failure status
    expect([400, 422]).toContain(response.status());

    // Parse body if JSON
    const contentType = response.headers()['content-type'] ?? '';
    let body: unknown = null;
    try {
      body = contentType.includes('application/json')
        ? await response.json()
        : await response.text();
    } catch {
      body = null;
    }

    // Ensure body does not represent a valid resource
    const expectedFields = create.expect;
    const hasAllExpected =
      body &&
      typeof body === 'object' &&
      expectedFields.every((k) => Object.prototype.hasOwnProperty.call(body as Record<string, unknown>, k));

    expect(hasAllExpected).toBeFalsy();
  });
});
