/**
 * Stage 6 – Step 1
 * File: tests/api/post-create-happy.stage6.spec.ts
 * Objective: Validate that the API can successfully create a new resource
 * using a deterministic payload, returning the expected status code and
 * contract-defined fields.
 */

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { validateObjectShape } from '../utils/assertions';
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

test.describe('Stage 6 – POST – Happy Path', () => {
  test('should create a post and return expected fields', async ({ request }) => {
    const configPath = path.join('D:\\QA_MiniFramework\\source', 'config', 'endpoints.json');
    const cfg: EndpointsConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

    const baseUrl = getApiBaseUrl();
    const create = cfg.endpoints.posts.create;

    const payload = buildCreatePostPayloadStage6();

    const response = await request.post(`${baseUrl}${create.path}`, {
      data: payload,
    });

    expect([200, 201]).toContain(response.status());

    const body = await response.json();
    validateObjectShape(body, create.expect);

    expect(body.title).toBe(payload.title);
    expect(body.body).toBe(payload.body);
    expect(body.userId).toBe(payload.userId);
  });
});
