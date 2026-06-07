import { AppError } from "@/lib/errors";
import { findConcept } from "@/lib/concepts";

export type FeedbackInput = {
  conceptSlug: string;
  rating: number;
  comment?: string;
};

export type FeedbackEntry = FeedbackInput & { id: string; savedAt: string };

const store: FeedbackEntry[] = [];

export function parseFeedbackInput(body: unknown): FeedbackInput {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new AppError("body must be an object", {
      status: 400,
      code: "invalid_input",
    });
  }

  const { conceptSlug, rating, comment } = body as Record<string, unknown>;

  if (typeof conceptSlug !== "string" || !findConcept(conceptSlug)) {
    throw new AppError("conceptSlug must reference an existing concept", {
      status: 400,
      code: "invalid_input",
    });
  }

  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new AppError("rating must be an integer between 1 and 5", {
      status: 400,
      code: "invalid_input",
    });
  }

  if (comment !== undefined && (typeof comment !== "string" || comment.length > 200)) {
    throw new AppError("comment must be a string of at most 200 characters", {
      status: 400,
      code: "invalid_input",
    });
  }

  const input: FeedbackInput = { conceptSlug, rating };
  if (typeof comment === "string" && comment.length > 0) {
    input.comment = comment;
  }
  return input;
}

export function addFeedback(input: FeedbackInput): { id: string; savedAt: string } {
  const id = crypto.randomUUID();
  const savedAt = new Date().toISOString();
  store.push({ ...input, id, savedAt });
  return { id, savedAt };
}

export function listFeedback(): FeedbackEntry[] {
  return [...store];
}

export function _clearFeedback(): void {
  store.length = 0;
}
