// tests/utils/env.ts
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

type EndpointsConfig = {
  baseUrl: string;
};

/**
 * Reads config/endpoints.json and allows override via API_BASE_URL env var
 */
export function getApiBaseUrl(projectRoot = 'D:\\QA_MiniFramework\\source'): string {
  const cfgPath = path.join(projectRoot, 'config', 'endpoints.json');
  const json = JSON.parse(fs.readFileSync(cfgPath, 'utf-8')) as EndpointsConfig;
  return process.env.API_BASE_URL ?? (json?.baseUrl ?? 'https://jsonplaceholder.typicode.com');
}

/**
 * Reads UI base URL, allows override via UI_BASE_URL env var
 */
export function getUiBaseUrl(): string {
  return process.env.UI_BASE_URL ?? 'http://127.0.0.1:5173';
}
