/**
 * Stage 6 – Data Builders (Deterministic Variants)
 * File: tests/utils/builders.ts
 * Purpose: Provide deterministic and reusable payloads for POST requests.
 * Notes:
 *  - No randomness: all outputs are reproducible across runs.
 *  - Includes minimal valid payload, missing-field, and invalid-type variants.
 */

export type CreatePostPayloadValid = {
  title: string;
  body: string;
  userId: number;
};

// Kept for backward compatibility with Step 1 imports
export type CreatePostPayload = CreatePostPayloadValid;

/**
 * Base minimal valid payload (deterministic).
 */
const BASE_VALID_PAYLOAD: CreatePostPayloadValid = Object.freeze({
  title: 'stage6-happy',
  body: 'stage6-body',
  userId: 1,
});

/**
 * Build a minimal, deterministic payload for Stage 6 POST happy path.
 * Backward-compatible alias used by Step 1.
 *
 * @param overrides - optional partial object to replace default fields
 * @returns CreatePostPayloadValid
 */
export function buildCreatePostPayloadStage6(
  overrides?: Partial<CreatePostPayloadValid>
): CreatePostPayloadValid {
  return { ...BASE_VALID_PAYLOAD, ...(overrides ?? {}) };
}

/**
 * Build a minimal, deterministic VALID payload (explicit named variant).
 *
 * @param overrides - optional partial overrides
 * @returns CreatePostPayloadValid
 */
export function buildCreatePostPayloadStage6Valid(
  overrides?: Partial<CreatePostPayloadValid>
): CreatePostPayloadValid {
  return { ...BASE_VALID_PAYLOAD, ...(overrides ?? {}) };
}

/**
 * Build an INVALID payload by omitting a required field.
 *
 * @param missing - which required field to omit ("title" | "body" | "userId")
 * @param overrides - optional partial overrides applied before omission
 * @returns Record<string, unknown> (intentionally not typed as valid)
 */
export function buildCreatePostPayloadStage6Missing(
  missing: keyof CreatePostPayloadValid,
  overrides?: Partial<Record<string, unknown>>
): Record<string, unknown> {
  const base: Record<string, unknown> = {
    ...BASE_VALID_PAYLOAD,
    ...(overrides ?? {}),
  };
  delete base[missing];
  return base;
}

/**
 * Build an INVALID payload by assigning a wrong type to a required field.
 *
 * @param field - which required field to corrupt ("title" | "body" | "userId")
 * @param badValue - wrong-typed value to force failure (e.g., number for title)
 * @param overrides - optional partial overrides applied before corruption
 * @returns Record<string, unknown> (intentionally not typed as valid)
 */
export function buildCreatePostPayloadStage6InvalidType(
  field: keyof CreatePostPayloadValid,
  badValue: unknown,
  overrides?: Partial<Record<string, unknown>>
): Record<string, unknown> {
  const base: Record<string, unknown> = {
    ...BASE_VALID_PAYLOAD,
    ...(overrides ?? {}),
  };
  base[field] = badValue;
  return base;
}
