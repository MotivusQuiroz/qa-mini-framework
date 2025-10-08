/**
 * Stage 6 – Data Builders
 * File: tests/utils/builders.ts
 * Purpose: Provide deterministic and reusable payloads for POST requests.
 */

export type CreatePostPayload = {
  title: string;
  body: string;
  userId: number;
};

/**
 * Build a minimal, deterministic payload for Stage 6 POST happy path.
 * 
 * @param overrides - optional partial object to replace default fields
 * @returns CreatePostPayload - ready-to-send payload for API POST /posts
 */
export function buildCreatePostPayloadStage6(
  overrides?: Partial<CreatePostPayload>
): CreatePostPayload {
  const base: CreatePostPayload = {
    title: 'stage6-happy',
    body: 'stage6-body',
    userId: 1,
  };

  return { ...base, ...(overrides ?? {}) };
}
