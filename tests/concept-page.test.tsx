import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ConceptPage from "@/app/[slug]/page";

describe("app/[slug]/page", () => {
  it("정적 페이지가 없는 slug(context-portability)도 제목·요약을 렌더한다", async () => {
    const ui = await ConceptPage({
      params: Promise.resolve({ slug: "context-portability" }),
    });
    render(ui);

    expect(
      screen.getByRole("heading", { name: "환경 간 세션 연속성" }),
    ).toBeDefined();
    expect(
      screen.getByText(/Terminal · VS Code · Web · Mobile/),
    ).toBeDefined();
  });

  it("없는 slug면 notFound()가 호출되어 예외를 던진다", async () => {
    let caught: unknown;
    try {
      await ConceptPage({
        params: Promise.resolve({ slug: "does-not-exist" }),
      });
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(Error);
    expect((caught as { digest?: string }).digest).toMatch(
      /NEXT_(NOT_FOUND|HTTP_ERROR_FALLBACK)/,
    );
  });
});
