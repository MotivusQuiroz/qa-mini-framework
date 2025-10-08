import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { validateObjectShape } from "../utils/assertions";

// Load endpoints.json
const endpointsPath = path.join(__dirname, "../../config/endpoints.json");
const endpoints = JSON.parse(fs.readFileSync(endpointsPath, "utf-8"));

const baseUrl: string = endpoints.baseUrl;
const listCfg = endpoints.endpoints.posts.list;

test.describe("API • Using reusable assertion helper", () => {
  test("GET /posts validates shape via helper", async ({ request }) => {
    const res = await request.get(baseUrl + listCfg.path);

    expect(res.status()).toBe(200);
    const body = await res.json();

    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);

    for (const item of body) {
      validateObjectShape(item, listCfg.expect);
    }
  });
});
