import { createFileRoute } from "@tanstack/react-router";

import { Reveal } from "@/components/site/reveal";
import {
  CtaBand,
  FaqSection,
  NumberedItem,
  PageHero,
  Panel,
  PullQuote,
  Section,
  SectionHeading,
} from "@/components/site/primitives";
import { about, whyCsg } from "@/content/pages";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/our-story")({
  head: () =>
    buildSeoMeta({
      title: "Our Story — US, LATAM & Pakistan Staffing",
      description:
        "A US staffing and talent delivery firm placing tech and non-tech talent across direct hire, contract and contract-to-hire in the US, plus LATAM and Pakistan delivery. Why companies work with us instead of managing vendors across regions.",
      path: "/our-story",
      keywords:
        "our story Career Source Group, why Career Source Group, staffing company Alpharetta GA, US staffing firm, talent delivery, direct hire staffing",
    }),
  component: OurStoryPage,
});

function OurStoryPage() {
  return (
    <>
      <PageHero eyebrow="Our Story" title={about.title} body={about.lead} showParticles={true} />

      <Section>
        <SectionHeading eyebrow="How we work" title={about.howWeWork.heading} />
        <div className="mt-10 max-w-3xl">
          {about.howWeWork.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <p className="mt-6 text-[1.04rem] leading-[1.75] text-muted-foreground">{p}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="why-csg" className="border-t border-border">
        <SectionHeading
          eyebrow="Why CSG"
          title={whyCsg.title}
          body="Five reasons companies work with us instead of managing multiple vendors across regions."
        />
        <div className="mt-10 space-y-0">
          {whyCsg.reasons.map((reason, i) => (
            <Reveal key={reason.heading} delay={i * 0.05}>
              <NumberedItem index={i + 1} heading={reason.heading} body={reason.body} />
            </Reveal>
          ))}
        </div>
        <div className="mt-14">
          <PullQuote>
            We're the only staffing firm that sells all three regions — US, LATAM, and Pakistan — so
            our incentive is to put the work where it actually belongs.
          </PullQuote>
          <Reveal className="mt-8 max-w-2xl">
            <p className="text-[1.02rem] leading-[1.75] text-muted-foreground">
              While other firms push their own region because that's all they sell, we have no
              reason to push one over another. Geography is decided after experience, communication
              skills, and technical skills are settled — not before.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="Communication"
          title="We score communication before we score anything else."
        />
        <Reveal className="mt-8 max-w-3xl">
          <p className="text-[1.04rem] leading-[1.75] text-muted-foreground">
            Most offshore engagements don't fail on technical skill. They fail because nobody
            designed for how the work would actually get discussed. We staff communication-critical
            seats differently than execution seats, on purpose. Every pod is scored on communication
            first, then on technical skill against the client's actual stack.
          </p>
        </Reveal>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Leadership" title={about.founder.name} body={about.founder.role} />
        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <Reveal>
            <Panel className="flex flex-col items-center text-center">
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-border">
                <img
                  src={about.founder.image}
                  alt={about.founder.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="mt-4 font-display text-lg font-semibold">{about.founder.name}</p>
              <p className="mt-2 text-sm text-muted-foreground">{about.founder.role}</p>
              <div className="mt-6 flex gap-4">
                {about.founder.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-sm font-semibold text-gold transition-colors hover:text-gold/80"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </Panel>
          </Reveal>
          <div className="min-w-0">
            {about.founder.bio.map((p, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <p className="mt-6 text-[1.02rem] leading-[1.75] text-muted-foreground">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Team" title="The people behind the work" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {about.team.map((member, i) => (
            <Reveal key={member.name} delay={i * 0.06}>
              <a
                href={member.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <Panel className="flex h-full flex-col items-center text-center">
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-border">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{member.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{member.role}</p>
                  <div className="mt-auto pt-6">
                    <span className="font-display text-sm font-semibold text-gold transition-colors group-hover:text-gold/80">
                      LinkedIn →
                    </span>
                  </div>
                </Panel>
              </a>
            </Reveal>
          ))}
        </div>
      </Section>

      <FaqSection questions={whyCsg.faqQuestions} />
      <CtaBand />
    </>
  );
}
