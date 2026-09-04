import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/site/reveal";
import {
  ArrowLink,
  CtaBand,
  PageHero,
  Panel,
  Section,
  SectionHeading,
  extractStatTerms,
  highlightText,
} from "@/components/site/primitives";
import { engagementModels, staffingRolesPage } from "@/content/staffing";
import { buildBreadcrumbJsonLd, buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/staffing/roles")({
  head: () => ({
    ...buildSeoMeta({
      title: "Staffing Roles: Individual Specialists, Priced by Region",
      description:
        "Direct hire, contract, and contract-to-hire specialists placed into a seat you've already defined, priced across the US, LATAM, and Pakistan.",
      path: "/staffing/roles",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          buildBreadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Staffing", url: "/staffing" },
            { name: "Staffing Roles", url: "/staffing/roles" },
          ]),
        ),
      },
    ],
  }),
  component: StaffingRolesPage,
});

function StaffingRolesPage() {
  return (
    <>
      <PageHero eyebrow="Staffing Roles" title={staffingRolesPage.title} showParticles={true} />

      <Section>
        <SectionHeading eyebrow="Positioning" title="How we price a role" />
        <div className="mt-10 max-w-3xl">
          {staffingRolesPage.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <p className="mt-6 text-[1.04rem] leading-[1.75] text-muted-foreground">{p}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <ArrowLink to={staffingRolesPage.cta.to} label={staffingRolesPage.cta.label} />
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Hiring a specialist" title="Choose your engagement model" />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {engagementModels.map((model, i) => (
            <Reveal key={model.title} delay={i * 0.07}>
              <Link to={model.to} className="group block h-full">
                <Panel className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-xl font-semibold">{model.title}</h3>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-gold" />
                  </div>
                  <p className="mt-5 grow text-[0.98rem] leading-relaxed text-muted-foreground">
                    {highlightText(model.body, [
                      ...extractStatTerms(model.body),
                      "half the market rate",
                    ])}
                  </p>
                  <span className="mt-7 font-display text-sm font-semibold text-gold">
                    {model.cta}
                  </span>
                </Panel>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Related" title="Looking for something else?" />
        <div className="mt-8 flex flex-wrap gap-6">
          <ArrowLink to="/staffing/pods" label="See how Pods work" />
          <ArrowLink to="/staffing/specialized-roles" label="See Specialized Roles" />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
