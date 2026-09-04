import { createFileRoute } from "@tanstack/react-router";

import { Markdown } from "@/components/site/markdown";
import { PageHero, Section } from "@/components/site/primitives";
import { eeoMarkdown } from "@/content/legal";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/eeo-notice")({
  head: () =>
    buildSeoMeta({
      title: "EEO & Employment Notice",
      description:
        "Career Source Group's equal opportunity, work classification, and jurisdiction-specific employment notice for candidates.",
      path: "/eeo-notice",
    }),
  component: EeoNoticePage,
});

function EeoNoticePage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="EEO & Employment Notice" />

      <Section>
        <div className="max-w-3xl">
          <Markdown text={eeoMarkdown} />
        </div>
      </Section>
    </>
  );
}
