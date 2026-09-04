import { createFileRoute, Link } from "@tanstack/react-router";

import { BenchForm } from "@/components/forms/bench-form";
import { Reveal } from "@/components/site/reveal";
import { PageHero, Panel, Pill, Section, SectionHeading } from "@/components/site/primitives";
import { bench } from "@/content/pages";
import { specialtyOptions } from "@/lib/forms";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/join-our-bench")({
  validateSearch: (search: Record<string, unknown>): { skill?: string } => {
    const skill = search["skill"];
    return typeof skill === "string" ? { skill } : {};
  },
  head: () =>
    buildSeoMeta({
      title: "Join Our Talent Network | Contract & Full-Time AI, Data & Cloud Roles",
      description:
        "Apply to join Career Source Group bench: AI/ML, MLOps, Data, DevOps, DevSecOps, Cloud, Software Development, Product, and Cybersecurity & GRC roles.",
      path: "/join-our-bench",
    }),
  component: JoinOurBenchPage,
});

function JoinOurBenchPage() {
  const { skill } = Route.useSearch();
  return (
    <>
      <PageHero eyebrow="Join Our Talent Network" title={bench.title} body={bench.lead} />

      <Section>
        <SectionHeading eyebrow="How it works" title={bench.what.heading} />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {bench.what.items.map((item, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <Panel className="h-full">
                <span className="font-mono text-xs text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-5 text-[0.98rem] leading-relaxed text-muted-foreground">{item}</p>
              </Panel>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Specialties" title="What we place" />
        <div className="mt-10 flex flex-wrap gap-3">
          {specialtyOptions.map((specialty) => (
            <Reveal key={specialty.value}>
              <Pill>{specialty.label}</Pill>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 max-w-2xl">
          <p className="text-[1.02rem] leading-[1.75] text-muted-foreground">
            We place specialists and pods with clients who need these roles, on a contract or
            full-time basis. Apply once and we'll match you as opportunities open.
          </p>
        </Reveal>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Apply now" title="Submit your application" align="center" />
        <Reveal className="mx-auto mt-10 max-w-2xl">
          <Panel>
            <h3 className="font-display text-xl font-semibold">Join Our Talent Network</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Apply once and we'll match you as opportunities open.
            </p>
            <div className="mt-6">
              <BenchForm defaultSkill={skill} />
            </div>
          </Panel>
        </Reveal>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="For clients" title="Looking to hire instead?" />
        <Reveal className="mt-8">
          <Link
            to="/get-started"
            className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3.5 font-display text-[0.88rem] font-semibold text-foreground transition-all duration-300 hover:border-gold hover:text-gold"
          >
            Request Talent
          </Link>
        </Reveal>
      </Section>
    </>
  );
}
