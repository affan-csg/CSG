import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/site/reveal";
import {
  CtaBand,
  PageHero,
  Panel,
  Section,
  SectionHeading,
  USP_TERMS,
  highlightText,
} from "@/components/site/primitives";
import { staffingHubPage } from "@/content/staffing";
import { staffingSectionCards } from "@/content/site";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/staffing/")({
  head: () =>
    buildSeoMeta({
      title: "Staffing: Roles, Pods, and Specialized Technical Hires",
      description:
        "Individual specialists, purpose-built pods, or deep technical specialties, placed across the US, LATAM, and Pakistan under one contract.",
      path: "/staffing",
    }),
  component: StaffingIndex,
});

function StaffingIndex() {
  return (
    <>
      <PageHero
        eyebrow="Staffing"
        title={staffingHubPage.title}
        body={staffingHubPage.intro}
        showParticles={true}
        bodyHighlight={USP_TERMS}
      />

      <Section>
        <SectionHeading eyebrow="Choose a path" title="Three ways to build with CSG" />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {staffingSectionCards.map((card, i) => (
            <Reveal key={card.to} delay={i * 0.07}>
              <Link to={card.to} className="group block h-full">
                <Panel className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-xl font-semibold">{card.title}</h3>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-gold" />
                  </div>
                  <p className="mt-5 grow text-[0.98rem] leading-relaxed text-muted-foreground">
                    {highlightText(card.body, USP_TERMS)}
                  </p>
                  <span className="mt-7 font-display text-sm font-semibold text-gold">
                    {card.cta}
                  </span>
                </Panel>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
