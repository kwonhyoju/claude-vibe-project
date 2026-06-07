import Link from "next/link";
import { notFound } from "next/navigation";
import { findConcept, listConcepts } from "@/lib/concepts";
import { FeedbackForm } from "@/components/FeedbackForm";

// 정적 페이지가 없는 개념 slug도 데이터만 있으면 이 동적 라우트가 렌더한다.
// (agent-loop / memory-hierarchy 는 정적 페이지가 우선 매칭되어 그대로 동작)
export function generateStaticParams() {
  return listConcepts().map((c) => ({ slug: c.slug }));
}

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const concept = findConcept(slug);

  if (!concept) {
    notFound();
  }

  return (
    <main>
      <nav className="mb-8">
        <Link
          href="/"
          className="text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)]"
        >
          ← 홈으로
        </Link>
      </nav>

      <header className="mb-10">
        <p className="mb-2 text-xs uppercase tracking-widest text-[var(--color-muted)]">
          개념 · 출처: {new URL(concept.source).host}
        </p>
        <h1 className="text-3xl font-bold leading-tight">
          <span className="text-brand-gradient">{concept.title}</span>
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
          {concept.summary}
        </p>
      </header>

      {concept.tags.length > 0 && (
        <section className="mb-10 flex flex-wrap gap-2">
          {concept.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-muted)]"
            >
              #{tag}
            </span>
          ))}
        </section>
      )}

      <section className="surface mb-8 p-6">
        <h2 className="mb-3 text-lg font-semibold">이 페이지가 도움됐나요?</h2>
        <FeedbackForm slug={concept.slug} />
      </section>

      <section className="surface p-6">
        <h2 className="mb-3 text-lg font-semibold">원문</h2>
        <a
          href={concept.source}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[var(--color-brand)] underline"
        >
          {concept.source}
        </a>
      </section>
    </main>
  );
}
