import { NextResponse } from "next/server";
import { AppError } from "@/lib/errors";

export function toErrorResponse(err: unknown): NextResponse {
  if (err instanceof AppError) {
    return NextResponse.json(
      { error: { code: err.code, message: err.message } },
      { status: err.status },
    );
  }
  const message = err instanceof Error ? err.message : "unknown error";
  return NextResponse.json(
    { error: { code: "internal_error", message } },
    { status: 500 },
  );
}
