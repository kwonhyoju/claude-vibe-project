import type { Concept } from "@/lib/concepts";
import { AppError } from "@/lib/errors";

export async function fetchConcepts(): Promise<Concept[]> {
  const res = await fetch("/api/concepts");
  if (!res.ok) {
    throw new AppError(`fetchConcepts failed: ${res.status}`, {
      status: res.status,
      code: "request_failed",
    });
  }
  const json = (await res.json()) as { concepts: Concept[] };
  return json.concepts;
}

export type FeedbackPayload = {
  conceptSlug: string;
  rating: number;
  comment?: string;
};

export async function postFeedback(
  payload: FeedbackPayload,
): Promise<{ id: string; savedAt: string }> {
  const res = await fetch("/api/feedback", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new AppError(`postFeedback failed: ${res.status}`, {
      status: res.status,
      code: "request_failed",
    });
  }
  return res.json();
}
