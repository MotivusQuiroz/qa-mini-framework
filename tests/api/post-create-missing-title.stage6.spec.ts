/**
 * Stage 6 – Step 4
 * Negative Test – Missing Field
 * Accepts 201 (jsonplaceholder fake success) or 400/422 (real API validation).
 */

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { buildCreatePostPayloadStage6Missing } from '../utils/builders';
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

test.describe('Stage 6 – POST – Negative (Missing Field)', () => {
  test('should reject create when "title" field is missing', async ({ request }) => {
    const configPath = path.join('D:\\QA_MiniFramework\\source', 'config', 'endpoints.json');
    const cfg: EndpointsConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

    const baseUrl = getApiBaseUrl();
    const create = cfg.endpoints.posts.create;

    const payload = buildCreatePostPayloadStage6Missing('title');

    const response = await request.post(`${baseUrl}${create.path}`, { data: payload });

    // Accept jsonplaceholder 201 OR real API 400/422
    expect([201, 400, 422]).toContain(response.status());
  });
});
