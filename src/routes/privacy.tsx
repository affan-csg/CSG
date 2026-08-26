import { createFileRoute } from "@tanstack/react-router";

import { Markdown } from "@/components/site/markdown";
import { PageHero, Section } from "@/components/site/primitives";
import { privacyMarkdown } from "@/content/legal";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () =>
    buildSeoMeta({
      title: "Privacy Policy",
      description: "Privacy policy for Career Source Group.",
      path: "/privacy",
    }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />

      <Section>
        <div className="max-w-3xl">
          <Markdown text={privacyMarkdown} />
        </div>
      </Section>
    </>
  );
}
