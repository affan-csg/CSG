import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/site/reveal";
import {
  FaqSection,
  PageHero,
  Panel,
  PullQuote,
  Section,
  SectionHeading,
  extractStatTerms,
  highlightText,
} from "@/components/site/primitives";
import type { StaffingRole } from "@/content/staffing";
import { getStaffingRole, otherStaffingRoles } from "@/content/staffing";
import { buildBreadcrumbJsonLd, buildSeoMeta, buildStaffingJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/staffing/$slug")({
  loader: ({ params }) => {
    const role = getStaffingRole(params.slug);
    if (!role) throw notFound();
    return { role };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Specialty not found | Career Source Group" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { role } = loaderData;
    return {
      ...buildSeoMeta({
        title: `${role.title} Staffing`,
        description: role.tagline,
        path: `/staffing/${role.slug}`,
        noindex: false,
      }),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            buildStaffingJsonLd({
              name: `${role.title} Staffing`,
              description: role.tagline,
            }),
          ),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            buildBreadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Staffing", url: "/staffing" },
              { name: "Specialized Roles", url: "/staffing/specialized-roles" },
              { name: role.title, url: `/staffing/${role.slug}` },
            ]),
          ),
        },
      ],
    };
  },
  component: StaffingRoleDetail,
});

function StaffingRoleDetail() {
  const { role } = Route.useLoaderData() as { role: StaffingRole };

  return (
    <>
      <PageHero eyebrow="Specialty" title={role.title} body={role.tagline} />

      <Section>
        <div className="max-w-3xl">
          {role.blocks.map((block, i) => (
            <Reveal key={block.heading} delay={i * 0.05} className="mt-14 first:mt-0">
              <p className="eyebrow">{block.heading}</p>
              <p className="mt-5 text-[1.06rem] leading-[1.75] text-muted-foreground">
                {highlightText(block.body, extractStatTerms(block.body))}
              </p>
            </Reveal>
          ))}
        </div>
        {role.pullQuote ? (
          <div className="mt-16">
            <PullQuote>{role.pullQuote}</PullQuote>
          </div>
        ) : null}
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Delivery" title="Where this role can sit" />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {role.regions.map((r, i) => (
            <Reveal key={r.region} delay={i * 0.07}>
              <Panel className="h-full">
                <p className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-gold">
                  {r.region}
                </p>
                <p className="mt-5 text-[0.98rem] leading-relaxed text-muted-foreground">
                  {highlightText(r.body, extractStatTerms(r.body))}
                </p>
              </Panel>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Next steps" title="Ready to get started?" />
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/get-started"
            search={{ skill: role.slug }}
            className="inline-flex items-center justify-center rounded-md bg-cream px-6 py-3.5 font-display text-[0.88rem] font-semibold text-navy transition-all duration-300 hover:bg-gold"
          >
            Submit a requirement
          </Link>
          <Link
            to="/join-our-bench"
            search={{ skill: role.slug }}
            className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3.5 font-display text-[0.88rem] font-semibold text-foreground transition-all duration-300 hover:border-gold hover:text-gold"
          >
            Apply as specialist
          </Link>
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Related" title="Other practices" />
        <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
          {otherStaffingRoles(role.slug).map((s) => (
            <Link
              key={s.slug}
              to="/staffing/$slug"
              params={{ slug: s.slug }}
              className="group bg-card p-7 transition-colors duration-500 hover:bg-navy-soft"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-base font-semibold leading-snug">{s.title}</h3>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-gold" />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.tagline}</p>
            </Link>
          ))}
        </div>
      </Section>

      {role.faqQuestions.length ? <FaqSection questions={role.faqQuestions} /> : null}
    </>
  );
}
