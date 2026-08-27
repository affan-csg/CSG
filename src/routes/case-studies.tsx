import { createFileRoute } from "@tanstack/react-router";

import { CtaBand, LogoWall, PageHero, Section, SectionHeading } from "@/components/site/primitives";
import { about } from "@/content/pages";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/case-studies")({
  head: () =>
    buildSeoMeta({
      title: "Case Studies",
      description:
        "How Career Source Group delivers technical talent across the US, LATAM and Pakistan for clients in fintech, AI, SaaS and digital services.",
      path: "/case-studies",
    }),
  component: CaseStudiesPage,
});

function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Case Studies"
        title="Delivery proof, published as clients approve it."
        body="Every case study we publish is reviewed and approved by the client first. Here's who we've delivered for while detailed write-ups are in progress."
      />

      <Section>
        <SectionHeading eyebrow="Client proof" title={about.delivered.heading} />
        <div className="mt-10">
          <LogoWall logos={about.delivered.logos} />
        </div>
        <p className="mt-8 max-w-2xl text-[1.02rem] leading-[1.75] text-muted-foreground">
          Enterprise-tested leadership. Our team brings experience supporting complex hiring
          programs across financial technology, AI, SaaS and digital services environments.
        </p>
      </Section>

      <CtaBand />
    </>
  );
}
