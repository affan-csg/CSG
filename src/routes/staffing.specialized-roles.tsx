import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/site/reveal";
import {
  CtaBand,
  PageHero,
  Panel,
  Pill,
  PullQuote,
  Section,
  SectionHeading,
  StatGrid,
} from "@/components/site/primitives";
import { specializedRolesPage } from "@/content/staffing";
import { specialties, specialtyTags } from "@/content/site";
import { buildBreadcrumbJsonLd, buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/staffing/specialized-roles")({
  head: () => ({
    ...buildSeoMeta({
      title: "Specialized Technical Roles We Fill",
      description:
        "AI/ML, MLOps, data, DevOps, DevSecOps, cloud, software development, product and cybersecurity & GRC roles, placed as specialists or pods.",
      path: "/staffing/specialized-roles",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          buildBreadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Staffing", url: "/staffing" },
            { name: "Specialized Roles", url: "/staffing/specialized-roles" },
          ]),
        ),
      },
    ],
  }),
  component: SpecializedRolesIndex,
});

function SpecializedRolesIndex() {
  return (
    <>
      <PageHero
        eyebrow="Specialized Roles"
        title={specializedRolesPage.title}
        showParticles={true}
      />

      <Section>
        <SectionHeading eyebrow="Market" title={specializedRolesPage.whyNow.heading} />
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div className="min-w-0">
            {specializedRolesPage.whyNow.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p className="mt-6 text-[1.04rem] leading-[1.75] text-muted-foreground">{p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
              {specializedRolesPage.whyNow.stats.map((s) => (
                <div key={s.label} className="bg-card p-6">
                  <p className="font-display text-2xl font-semibold text-gold">{s.value}</p>
                  <p className="mt-2 text-sm leading-snug text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Practices" title="Nine technical practices" />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {specialties.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 2) * 0.06}>
              <Link to="/staffing/$slug" params={{ slug: s.slug }} className="group block h-full">
                <Panel className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-lg font-semibold leading-snug">{s.title}</h3>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-gold" />
                  </div>
                  <p className="mt-4 grow text-[0.98rem] leading-relaxed text-muted-foreground">
                    {s.tagline}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {specialtyTags.map((tag) => (
                      <Pill key={tag}>{tag}</Pill>
                    ))}
                  </div>
                </Panel>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <PullQuote>{specializedRolesPage.closing}</PullQuote>
        <div className="mt-8">
          <StatGrid
            stats={[
              { value: "9", label: "Technical practices" },
              { value: "3", label: "Delivery regions" },
              { value: "4", label: "Engagement models" },
              { value: "1", label: "Point of contact" },
            ]}
          />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
