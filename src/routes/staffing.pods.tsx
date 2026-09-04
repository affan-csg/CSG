import { createFileRoute } from "@tanstack/react-router";

import { Reveal } from "@/components/site/reveal";
import {
  ArrowLink,
  CtaBand,
  FaqSection,
  PageHero,
  Panel,
  PullQuote,
  Section,
  SectionHeading,
  USP_TERMS,
  highlightText,
} from "@/components/site/primitives";
import { pods } from "@/content/pods";
import { buildBreadcrumbJsonLd, buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/staffing/pods")({
  head: () => ({
    ...buildSeoMeta({
      title: "The Pod Model: Purpose-Built Teams",
      description:
        "A CSG Pod is a complete, purpose-built team delivered under one contract, one invoice and one point of contact.",
      path: "/staffing/pods",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          buildBreadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Staffing", url: "/staffing" },
            { name: "Pods", url: "/staffing/pods" },
          ]),
        ),
      },
    ],
  }),
  component: PodsPage,
});

function PodsPage() {
  return (
    <>
      <PageHero eyebrow="The pod model" title={pods.title} showParticles={true} />

      <Section>
        <SectionHeading
          eyebrow={pods.problem.heading}
          title={pods.problem.answer}
          highlight={USP_TERMS}
        />
        <Reveal delay={0.08} className="mt-8 max-w-3xl">
          <p className="text-[1.04rem] leading-[1.75] text-muted-foreground">{pods.problem.body}</p>
        </Reveal>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="Method"
          title="How we build a pod"
          body='We size every pod against four variables, not three, not "cost and skills".'
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {pods.variables.map((v, i) => (
            <Reveal key={v.title} delay={(i % 2) * 0.07}>
              <Panel className="h-full">
                <span className="font-mono text-xs text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold">{v.title}</h3>
                <p className="mt-4 text-[0.98rem] leading-relaxed text-muted-foreground">
                  {v.body}
                </p>
              </Panel>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Anatomy" title="What a pod actually looks like" />
        <Reveal className="mt-10">
          <p className="eyebrow">{pods.example.heading}</p>
        </Reveal>
        <div className="mt-8 grid gap-px overflow-hidden rounded-md border border-border bg-border lg:grid-cols-3">
          {pods.example.seats.map((seat) => (
            <div key={seat.role} className="bg-card p-8">
              <p className="font-display text-4xl font-semibold text-gold">{seat.count}</p>
              <h3 className="mt-5 font-display text-lg font-semibold leading-snug">{seat.role}</h3>
              <p className="mt-2 font-mono text-[0.64rem] uppercase tracking-[0.18em] text-muted-foreground">
                {seat.region}
              </p>
              <p className="mt-5 text-[0.96rem] leading-relaxed text-muted-foreground">
                {seat.body}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <PullQuote>
            {highlightText(pods.example.kicker, ["One SOW. One invoice. One person you call."])}
          </PullQuote>
        </div>
        <Reveal className="mt-8 max-w-3xl">
          <p className="text-[1.02rem] leading-[1.75] text-muted-foreground">{pods.example.body}</p>
        </Reveal>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Catalogue" title="Pods we stand up" />
        <div className="mt-14 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {pods.podTypes.map((p) => (
            <div key={p.title} className="bg-card p-7">
              <h3 className="font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-3 text-[0.96rem] leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Specialized" title="Specialized delivery pods" />
        <div className="mt-14 space-y-px overflow-hidden rounded-md border border-border bg-border">
          {pods.specialized.map((p) => (
            <div
              key={p.title}
              className="grid gap-4 bg-card p-7 md:grid-cols-[1fr_1.1fr_1fr] md:items-baseline md:p-9"
            >
              <h3 className="font-display text-lg font-semibold">{p.title}</h3>
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-gold">
                {p.composition}
              </p>
              <p className="text-[0.96rem] leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
        <Reveal className="mt-8 max-w-3xl">
          <p className="text-[0.98rem] leading-relaxed text-muted-foreground">
            {pods.specializedFootnote}
          </p>
        </Reveal>
        <div className="mt-8">
          <ArrowLink to="/staffing/specialized-roles" label="See Specialty Practice Pages" />
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Timing" title={pods.whyNow.heading} />
        <Reveal className="mt-8 max-w-3xl">
          <p className="text-[1.04rem] leading-[1.75] text-muted-foreground">
            {highlightText(pods.whyNow.body, [
              "twelve staffing vendors down to three or four",
              "three geographies, and four engagement models under one contract",
            ])}
          </p>
        </Reveal>
        <div className="mt-12">
          <PullQuote>{pods.whyNow.kicker}</PullQuote>
        </div>
      </Section>

      <FaqSection questions={pods.faqQuestions} />
      <CtaBand />
    </>
  );
}
