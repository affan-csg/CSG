import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Reveal } from "@/components/site/reveal";
import { buildSeoMeta } from "@/lib/seo";
import {
  CtaBand,
  FaqSection,
  PageHero,
  Panel,
  PullQuote,
  Section,
  SectionHeading,
  extractStatTerms,
  highlightText,
} from "@/components/site/primitives";
import { offerCalibration } from "@/content/delivery";

export const Route = createFileRoute("/offer-calibration")({
  head: () =>
    buildSeoMeta({
      title: "Global Talent Cost & Delivery Comparison",
      description:
        "See what your hiring budget can realistically buy by role and region: US starting-salary benchmarks and what the same budget buys in LATAM and Pakistan.",
      path: "/offer-calibration",
    }),
  component: OfferCalibrationPage,
});

function OfferCalibrationPage() {
  const [selectedSlug, setSelectedSlug] = useState(offerCalibration.rows[0]!.slug);
  const selectedRow =
    offerCalibration.rows.find((row) => row.slug === selectedSlug) ?? offerCalibration.rows[0]!;

  return (
    <>
      <PageHero
        eyebrow="Global talent cost & delivery comparison"
        title="See what your hiring budget can realistically buy by role and region."
        body={offerCalibration.intro}
      />

      <Section>
        <SectionHeading
          eyebrow="Pick a role"
          title="What does this role cost, by region?"
          body={offerCalibration.caption}
        />

        <Reveal className="mt-10 max-w-xl">
          <label htmlFor="calibration-role" className="form-label block text-muted-foreground">
            Role
          </label>
          <select
            id="calibration-role"
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            className="mt-2 w-full rounded-md border border-border bg-card px-4 py-3 text-[0.98rem] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {offerCalibration.rows.map((row) => (
              <option key={row.slug} value={row.slug}>
                {row.role}
              </option>
            ))}
          </select>
        </Reveal>

        <Reveal className="mt-8" key={selectedRow.slug}>
          <Panel className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="eyebrow">United States</p>
              <p className="mt-3 text-[1.1rem] leading-relaxed text-foreground">
                {highlightText(selectedRow.us, extractStatTerms(selectedRow.us))}
              </p>
            </div>
            <div>
              <p className="eyebrow">LATAM</p>
              <p className="mt-3 text-[1.1rem] leading-relaxed text-foreground">
                {highlightText(selectedRow.latam, extractStatTerms(selectedRow.latam))}
              </p>
            </div>
            <div>
              <p className="eyebrow">Pakistan</p>
              <p className="mt-3 text-[1.1rem] leading-relaxed text-foreground">
                {highlightText(selectedRow.pakistan, extractStatTerms(selectedRow.pakistan))}
              </p>
            </div>
            {selectedRow.note ? (
              <p className="sm:col-span-3 text-[0.85rem] text-muted-foreground">
                {selectedRow.note}
              </p>
            ) : null}
          </Panel>
        </Reveal>

        <Reveal className="mt-8 max-w-3xl">
          <p className="text-[0.9rem] leading-relaxed text-muted-foreground">
            {highlightText(offerCalibration.footnote, extractStatTerms(offerCalibration.footnote))}
          </p>
        </Reveal>
        <Reveal className="mt-6 max-w-2xl">
          <p className="text-[0.98rem] leading-[1.75] text-muted-foreground">
            {offerCalibration.emphasis}
          </p>
        </Reveal>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="How we think" title={offerCalibration.note.heading} />
        <Reveal className="mt-8 max-w-3xl">
          <p className="text-[1.04rem] leading-[1.75] text-muted-foreground">
            {offerCalibration.note.body}
          </p>
        </Reveal>
      </Section>

      <Section className="border-t border-border">
        <PullQuote>
          Give us the offer (base, bonus, equity, remote flexibility, and how fast you need
          someone), and before we source a single candidate we'll tell you what it realistically
          buys in the US market and how long that search will take, what it buys in LATAM, and what
          it buys in Pakistan. Then you decide.
        </PullQuote>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="Next step"
          title="Want an actual search plan for this role?"
          body="Send us the role and we'll come back with market feedback, a recommended delivery region, and a search plan, before you commit to anything."
        />
        <Reveal className="mt-10">
          <Link
            to="/get-started"
            search={{ skill: selectedRow.slug }}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-cream px-6 py-3.5 button-text text-navy transition-all duration-300 hover:bg-gold hover:shadow-md hover:shadow-gold/20 active:scale-95"
          >
            Request {selectedRow.role} Talent
          </Link>
        </Reveal>
      </Section>

      <FaqSection questions={offerCalibration.faqQuestions} />
      <CtaBand />
    </>
  );
}
