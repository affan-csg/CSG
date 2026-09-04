import { createFileRoute, Link } from "@tanstack/react-router";

import { RequirementForm } from "@/components/forms/requirement-form";
import { Reveal } from "@/components/site/reveal";
import {
  FaqSection,
  PageHero,
  Panel,
  Section,
  USP_TERMS,
  highlightText,
} from "@/components/site/primitives";
import { getStarted } from "@/content/pages";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/get-started")({
  validateSearch: (search: Record<string, unknown>): { skill?: string } => {
    const skill = search["skill"];
    return typeof skill === "string" ? { skill } : {};
  },
  head: () =>
    buildSeoMeta({
      title: "Request Talent",
      description:
        "Tell us who you need. Get a realistic hiring plan within one business day. Share the role, critical skills, work arrangement and target start date.",
      path: "/get-started",
    }),
  component: GetStartedPage,
});

function GetStartedPage() {
  const { skill } = Route.useSearch();
  return (
    <>
      <PageHero eyebrow="Get started" title={getStarted.title} body={getStarted.lead} />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <Panel>
              <h3 className="font-display text-xl font-semibold">Submit your requirement</h3>
              <p className="mt-2 text-sm text-muted-foreground">{getStarted.lead}</p>
              <div className="mt-6">
                <RequirementForm defaultSkill={skill} />
              </div>
            </Panel>
          </Reveal>

          <Reveal delay={0.08}>
            <div>
              <p className="eyebrow mb-6">{getStarted.benchNote}</p>
              <Link
                to="/join-our-bench"
                className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3.5 font-display text-[0.88rem] font-semibold text-foreground transition-all duration-300 hover:border-gold hover:text-gold"
              >
                Find Opportunities
              </Link>

              <div className="mt-12">
                <h3 className="font-display text-xl font-semibold">What to expect</h3>
                <ul className="mt-6 space-y-4">
                  {[
                    "We'll have profiles in front of you this week",
                    "No commitment, no retainer required",
                    "Same vetting, same guarantee as a traditional search",
                    "One contract, one invoice, one point of contact",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-[0.98rem] leading-relaxed text-muted-foreground"
                    >
                      <span className="mt-2.5 h-px w-4 shrink-0 bg-gold" />
                      <span>{highlightText(item, USP_TERMS)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <FaqSection questions={getStarted.faqQuestions} />
    </>
  );
}
