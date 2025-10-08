import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

// Load endpoints.json (shared contract)
const endpointsPath = path.join(__dirname, "../../config/endpoints.json");
const endpoints = JSON.parse(fs.readFileSync(endpointsPath, "utf-8"));

const baseUrl: string = endpoints.baseUrl;
const listCfg = endpoints.endpoints.posts.list; // { method, path, expect }

test.describe("API • Schema/shape validation for list", () => {
  test("GET /posts returns array with required fields", async ({ request }) => {
    const url = baseUrl + listCfg.path;
    const res = await request.get(url);

    // Status & content-type
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"] ?? "").toContain("application/json");

    const body = await res.json();

    // Body is an array and not empty (shape-level check, not data correctness)
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);

    // Every item has the required keys from the contract
    for (const item of body) {
      for (const key of listCfg.expect) {
        expect(item).toHaveProperty(key);
      }
      // Light type sanity checks (non-brittle)
      expect(typeof item.userId).toBe("number");
      expect(typeof item.id).toBe("number");
      expect(typeof item.title).toBe("string");
      expect(typeof item.body).toBe("string");
    }
  });
});
