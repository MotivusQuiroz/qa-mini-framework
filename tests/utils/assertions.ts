import { expect } from "@playwright/test";

/**
 * Validates that the object has the expected keys and the values are of the right type.
 * @param obj - The JSON object to validate
 * @param expectedKeys - Keys to check
 */
export function validateObjectShape(obj: any, expectedKeys: string[]) {
  for (const key of expectedKeys) {
    expect(obj).toHaveProperty(key);

    // Optional lightweight type checks for known fields
    switch (key) {
      case "userId":
      case "id":
        expect(typeof obj[key]).toBe("number");
        break;
      case "title":
      case "body":
        expect(typeof obj[key]).toBe("string");
        expect((obj[key] as string).length).toBeGreaterThan(0);
        break;
      default:
        // no-op
        break;
    }
  }
}
