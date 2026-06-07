import { NextResponse } from "next/server";
import { findConcept } from "@/lib/concepts";
import { logger } from "@/lib/logger";
import { AppError } from "@/lib/errors";
import { toErrorResponse } from "@/lib/api/error-response";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const concept = findConcept(slug);
    if (!concept) {
      logger.warn({ module: "concepts", event: "not_found", slug });
      throw new AppError("concept not found", { status: 404, code: "not_found" });
    }
    return NextResponse.json({ concept });
  } catch (err) {
    return toErrorResponse(err);
  }
}
