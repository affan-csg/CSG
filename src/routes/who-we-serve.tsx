import { createFileRoute } from "@tanstack/react-router";

import { Reveal } from "@/components/site/reveal";
import {
  ArrowLink,
  CtaBand,
  Panel,
  PageHero,
  Section,
  SectionHeading,
} from "@/components/site/primitives";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/who-we-serve")({
  head: () =>
    buildSeoMeta({
      title: "Who We Serve",
      description:
        "How Career Source Group staffs startups, small and mid-sized businesses, and enterprises across the US, LATAM and Pakistan.",
      path: "/who-we-serve",
    }),
  component: WhoWeServePage,
});

const audiences = [
  {
    id: "startups",
    eyebrow: "Startups",
    heading: "Move fast without a full-time recruiting function.",
    body: "Early-stage teams need to add technical capacity without standing up an internal recruiting org. We work as your hiring bench — a single point of contact for a specialist, a first hire in a new discipline, or a small pod to cover a sprint of work — priced and staffed to match a startup's pace and budget.",
    cta: { label: "Hire a specialist", to: "/staffing/roles" },
  },
  {
    id: "smb",
    eyebrow: "Small & Mid-Sized Businesses",
    heading: "Scale a team without juggling five vendors.",
    body: "Growing companies usually end up managing separate agencies for US contract work, nearshore engineering, and offshore execution. We consolidate that into one contract, one invoice, and one point of contact — so you can staff a role, a pod, or a mixed US/LATAM/Pakistan team through a single relationship.",
    cta: { label: "Explore pods", to: "/staffing/pods" },
  },
  {
    id: "enterprises",
    eyebrow: "Enterprises",
    heading: "Add delivery capacity that fits inside existing process.",
    body: "Larger organizations need talent that can operate inside established security, compliance, and communication requirements from day one. We vet for communication before technical skill for exactly this reason, and we staff across contract, contract-to-hire, and direct hire so procurement can choose the engagement model that fits.",
    cta: { label: "Compare delivery regions", to: "/global-delivery" },
  },
] as const;

function WhoWeServePage() {
  return (
    <>
      <PageHero
        eyebrow="Who We Serve"
        title="Startups, growing companies, and enterprises — staffed differently, on purpose."
        body="The work looks different at each stage. We size the engagement — specialist, pod, or full delivery team — to match."
      />

      {audiences.map((audience, i) => (
        <Section
          key={audience.id}
          id={audience.id}
          className={i > 0 ? "border-t border-border" : ""}
        >
          <SectionHeading eyebrow={audience.eyebrow} title={audience.heading} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <Reveal>
              <p className="max-w-2xl text-[1.04rem] leading-[1.75] text-muted-foreground">
                {audience.body}
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <Panel>
                <ArrowLink to={audience.cta.to} label={audience.cta.label} />
              </Panel>
            </Reveal>
          </div>
        </Section>
      ))}

      <CtaBand />
    </>
  );
}
