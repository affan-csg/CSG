import { createFileRoute } from "@tanstack/react-router";

import { Markdown } from "@/components/site/markdown";
import { PageHero, Section } from "@/components/site/primitives";
import { candidatePrivacyMarkdown } from "@/content/legal";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/candidate-privacy")({
  head: () =>
    buildSeoMeta({
      title: "Candidate Privacy Notice",
      description:
        "How Career Source Group handles information submitted through candidate applications.",
      path: "/candidate-privacy",
    }),
  component: CandidatePrivacyPage,
});

function CandidatePrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Candidate Privacy Notice" />

      <Section>
        <div className="max-w-3xl">
          <Markdown text={candidatePrivacyMarkdown} />
        </div>
      </Section>
    </>
  );
}
