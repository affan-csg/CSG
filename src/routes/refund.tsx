import { createFileRoute } from "@tanstack/react-router";

import { PageHero, Section } from "@/components/site/primitives";
import { legalPages } from "@/content/pages";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/refund")({
  head: () =>
    buildSeoMeta({
      title: "Direct-Hire Guarantee",
      description: "Career Source Group's direct-hire replacement guarantee.",
      path: "/refund",
    }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title={legalPages.refund.title} />

      <Section>
        <div className="max-w-3xl">
          <p className="text-[1.04rem] leading-[1.75] text-muted-foreground">
            {legalPages.refund.body}
          </p>
        </div>
      </Section>
    </>
  );
}
