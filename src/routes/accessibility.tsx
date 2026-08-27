import { createFileRoute } from "@tanstack/react-router";

import { Markdown } from "@/components/site/markdown";
import { PageHero, Section } from "@/components/site/primitives";
import { accessibilityMarkdown } from "@/content/legal";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/accessibility")({
  head: () =>
    buildSeoMeta({
      title: "Accessibility Statement",
      description: "Career Source Group's accessibility statement and commitment to WCAG 2.1 AA.",
      path: "/accessibility",
    }),
  component: AccessibilityPage,
});

function AccessibilityPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Accessibility Statement" />

      <Section>
        <div className="max-w-3xl">
          <Markdown text={accessibilityMarkdown} />
        </div>
      </Section>
    </>
  );
}
