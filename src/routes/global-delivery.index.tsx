import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, Minus } from "lucide-react";

import { Reveal } from "@/components/site/reveal";
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
import {
  comparisonCaption,
  comparisonRows,
  globalDeliveryPage,
  prosCons,
} from "@/content/delivery";
import { regionCards } from "@/content/site";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/global-delivery/")({
  head: () =>
    buildSeoMeta({
      title: "US vs LATAM vs Pakistan: The Honest Comparison",
      description:
        "Cost, time zone overlap, engagement models and speed to start compared across US staffing, LATAM nearshore and Pakistan offshore.",
      path: "/global-delivery",
    }),
  component: GlobalDeliveryIndex,
});

function ProsConsCard({
  data,
}: {
  data: { title: string; pros: readonly string[]; cons: readonly string[] };
}) {
  return (
    <Panel className="h-full">
      <h3 className="font-display text-xl font-semibold">{data.title}</h3>
      <p className="eyebrow mt-7">Strengths</p>
      <ul className="mt-4 space-y-3">
        {data.pros.map((p) => (
          <li key={p} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span>{highlightText(p, extractStatTerms(p))}</span>
          </li>
        ))}
      </ul>
      <p className="eyebrow mt-8">Trade-offs</p>
      <ul className="mt-4 space-y-3">
        {data.cons.map((c) => (
          <li key={c} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
            <Minus className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span>{highlightText(c, extractStatTerms(c))}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function GlobalDeliveryIndex() {
  return (
    <>
      <PageHero
        eyebrow="Global delivery"
        title={globalDeliveryPage.title}
        body={globalDeliveryPage.intro}
        showParticles={true}
        showRing={true}
      />

      <Section>
        <SectionHeading eyebrow="Side by side" title="The comparison table" />
        <Reveal className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
            <caption className="sr-only">{comparisonCaption}</caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="py-4 pr-6 eyebrow font-normal">
                  &nbsp;
                </th>
                <th scope="col" className="py-4 pr-6 font-display text-base">
                  United States
                </th>
                <th scope="col" className="py-4 pr-6 font-display text-base">
                  LATAM
                </th>
                <th scope="col" className="py-4 font-display text-base">
                  Pakistan
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.label} className="border-b border-border/70 align-top">
                  <th
                    scope="row"
                    className="w-48 py-6 pr-6 font-mono text-[0.66rem] font-normal uppercase tracking-[0.16em] text-gold"
                  >
                    {row.label}
                  </th>
                  <td className="py-6 pr-6 leading-relaxed text-muted-foreground">
                    {highlightText(row.us, extractStatTerms(row.us))}
                  </td>
                  <td className="py-6 pr-6 leading-relaxed text-muted-foreground">
                    {highlightText(row.latam, extractStatTerms(row.latam))}
                  </td>
                  <td className="py-6 leading-relaxed text-muted-foreground">
                    {highlightText(row.pakistan, extractStatTerms(row.pakistan))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Honest trade-offs" title="Strengths and trade-offs by region" />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          <Reveal>
            <ProsConsCard data={prosCons.us} />
          </Reveal>
          <Reveal delay={0.07}>
            <ProsConsCard data={prosCons.latam} />
          </Reveal>
          <Reveal delay={0.14}>
            <ProsConsCard data={prosCons.pakistan} />
          </Reveal>
        </div>
      </Section>

      <Section className="border-t border-border">
        <PullQuote>{globalDeliveryPage.pullQuote}</PullQuote>
        <Reveal className="mt-8 max-w-2xl">
          <p className="text-[1.02rem] leading-[1.75] text-muted-foreground">
            {globalDeliveryPage.pullQuoteFollow}
          </p>
        </Reveal>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Detail" title="Explore each region" />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {regionCards.map((card, i) => (
            <Reveal key={card.to} delay={i * 0.07}>
              <Link to={card.to as string} className="group block h-full">
                <Panel className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-xl font-semibold">{card.title}</h3>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-gold" />
                  </div>
                  <p className="mt-5 grow text-[0.98rem] leading-relaxed text-muted-foreground">
                    {highlightText(card.body, extractStatTerms(card.body))}
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

      <FaqSection questions={globalDeliveryPage.faqQuestions} />
      <CtaBand />
    </>
  );
}
