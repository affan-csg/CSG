import { createFileRoute } from "@tanstack/react-router";

import { Markdown } from "@/components/site/markdown";
import { PageHero, Section } from "@/components/site/primitives";
import { termsMarkdown } from "@/content/legal";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () =>
    buildSeoMeta({
      title: "Terms of Use",
      description: "Terms of use for Career Source Group.",
      path: "/terms",
    }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Use" />

      <Section>
        <div className="max-w-3xl">
          <Markdown text={termsMarkdown} />
        </div>
      </Section>
    </>
  );
}
