import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

// Load endpoints.json
const endpointsPath = path.join(__dirname, "../../config/endpoints.json");
const endpoints = JSON.parse(fs.readFileSync(endpointsPath, "utf-8"));

// Extract the GET by ID endpoint
const baseUrl: string = endpoints.baseUrl;
const getById = endpoints.endpoints.posts.getById;

test.describe("API • Negative GET", () => {
  test("GET /posts/999999 should return 404", async ({ request }) => {
    const url = baseUrl + getById.path.replace("{id}", "999999");

    const res = await request.get(url);

    // Expect a 404 Not Found
    expect(res.status()).toBe(404);

    // Response body should be empty object {}
    const body = await res.json();
    expect(body).toEqual({});
  });
});
