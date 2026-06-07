import { describe, it, expect, beforeEach } from "vitest";
import { parseFeedbackInput, addFeedback, _clearFeedback } from "@/lib/feedback-store";
import { AppError } from "@/lib/errors";

describe("lib/feedback-store", () => {
  beforeEach(() => {
    _clearFeedback();
  });

  it("유효 입력은 parse 후 addFeedback에서 id·savedAt을 반환한다", () => {
    const input = parseFeedbackInput({
      conceptSlug: "agent-loop",
      rating: 4,
      comment: "좋았어요",
    });
    const { id, savedAt } = addFeedback(input);
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
    expect(typeof savedAt).toBe("string");
    expect(Number.isNaN(new Date(savedAt).getTime())).toBe(false);
  });

  it("rating이 범위 밖이면 status 400 invalid_input AppError를 던진다", () => {
    let caught: unknown;
    try {
      parseFeedbackInput({ conceptSlug: "agent-loop", rating: 6 });
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(AppError);
    expect((caught as AppError).status).toBe(400);
    expect((caught as AppError).code).toBe("invalid_input");
  });

  it("존재하지 않는 conceptSlug면 status 400 AppError를 던진다", () => {
    let caught: unknown;
    try {
      parseFeedbackInput({ conceptSlug: "does-not-exist", rating: 3 });
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(AppError);
    expect((caught as AppError).status).toBe(400);
  });
});
