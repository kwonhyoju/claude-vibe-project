import { NextResponse } from "next/server";
import { AppError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { toErrorResponse } from "@/lib/api/error-response";
import { addFeedback, parseFeedbackInput } from "@/lib/feedback-store";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => {
      throw new AppError("invalid JSON body", {
        status: 400,
        code: "invalid_input",
      });
    });
    const input = parseFeedbackInput(body);
    const saved = addFeedback(input);
    logger.info({
      module: "feedback",
      event: "created",
      id: saved.id,
      conceptSlug: input.conceptSlug,
    });
    return NextResponse.json(saved);
  } catch (err) {
    return toErrorResponse(err);
  }
}
