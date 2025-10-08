import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

// Load endpoints.json
const endpointsPath = path.join(__dirname, "../../config/endpoints.json");
const endpoints = JSON.parse(fs.readFileSync(endpointsPath, "utf-8"));

// Extract the GET by ID endpoint
const baseUrl: string = endpoints.baseUrl;
const getById = endpoints.endpoints.posts.getById;

test.describe("API • Happy-path GET", () => {
  test("GET /posts/1 returns 200 and expected fields", async ({ request }) => {
    const url = baseUrl + getById.path.replace("{id}", "1");

    // Perform request
    const res = await request.get(url);

    // Check status and content type
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"] ?? "").toContain("application/json");

    // Parse response
    const body = await res.json();

    // Validate all expected keys from endpoints.json
    for (const key of getById.expect) {
      expect(body).toHaveProperty(key);
    }

    // Deterministic sanity checks
    expect(body.id).toBe(1);
    expect(typeof body.userId).toBe("number");
    expect(typeof body.title).toBe("string");
    expect((body.title as string).length).toBeGreaterThan(0);
    expect(typeof body.body).toBe("string");
    expect((body.body as string).length).toBeGreaterThan(0);
  });
});

