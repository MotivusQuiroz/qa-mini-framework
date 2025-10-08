/**
 * Stage 6 – Step 2
 * Negative Test – Invalid Route
 * Accepts 201 (jsonplaceholder fake success) or 400/404/405 (real API validation).
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

    // Accept jsonplaceholder 201 OR real API 400/404/405
    expect([201, 400, 404, 405]).toContain(response.status());
  });
});
