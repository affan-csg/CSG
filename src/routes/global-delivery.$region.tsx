import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, Minus } from "lucide-react";

import { Reveal } from "@/components/site/reveal";
import {
  CtaBand,
  FaqSection,
  PageHero,
  Panel,
  PullQuote,
  Section,
  SectionHeading,
} from "@/components/site/primitives";
import { regionPages, prosCons, type RegionPage } from "@/content/delivery";
import { buildBreadcrumbJsonLd, buildSeoMeta } from "@/lib/seo";

function getRegionPage(region: string): RegionPage | undefined {
  return regionPages.find((p) => p.slug === region);
}

export const Route = createFileRoute("/global-delivery/$region")({
  head: ({ params }) => {
    const region = getRegionPage(params.region);
    if (!region) {
      return {
        meta: [{ title: "Not Found | CSG" }],
      };
    }
    return {
      ...buildSeoMeta({
        title: region.meta.title,
        description: region.meta.description,
        path: `/global-delivery/${params.region}`,
      }),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            buildBreadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Global Delivery", url: "/global-delivery" },
              { name: region.meta.title, url: `/global-delivery/${params.region}` },
            ]),
          ),
        },
      ],
    };
  },
  loader: ({ params }) => {
    const region = getRegionPage(params.region);
    if (!region) {
      throw notFound();
    }
  },
  component: RegionDeliveryPage,
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
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <p className="eyebrow mt-8">Trade-offs</p>
      <ul className="mt-4 space-y-3">
        {data.cons.map((c) => (
          <li key={c} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
            <Minus className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span>{c}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function RegionDeliveryPage() {
  const { region } = Route.useParams();
  const regionData = getRegionPage(region);

  if (!regionData) {
    return notFound();
  }

  const prosConsData = prosCons[regionData.prosConsKey];

  return (
    <>
      <PageHero
        eyebrow="Global delivery"
        title={regionData.title}
        body={regionData.intro}
        showParticles={true}
        showRing={false}
      >
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/global-delivery" className="hover:text-gold transition-colors">
            Compare Regions
          </Link>
          <span>/</span>
          <span className="text-foreground">{regionData.title.split(":")[0]}</span>
        </nav>
      </PageHero>

      {/* Highlights */}
      {regionData.highlights && regionData.highlights.length > 0 && (
        <Section className="border-t border-border">
          <div className="grid gap-6 lg:grid-cols-2">
            {regionData.highlights.map((highlight, i) => (
              <Reveal key={highlight.heading} delay={i * 0.07}>
                <Panel>
                  <h3 className="font-display text-xl font-semibold">{highlight.heading}</h3>
                  <p className="mt-4 text-[1.02rem] leading-relaxed text-muted-foreground">
                    {highlight.body}
                  </p>
                </Panel>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* Models (US only) */}
      {regionData.models && regionData.models.length > 0 && (
        <Section className="border-t border-border">
          <SectionHeading eyebrow="Engagement models" title="How we deliver in this region" />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {regionData.models.map((model, i) => (
              <Reveal key={model.title} delay={i * 0.07}>
                <Panel className="h-full">
                  <h3 className="font-display text-lg font-semibold">{model.title}</h3>
                  <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                    {model.lead}
                  </p>
                  <div className="mt-6 space-y-4">
                    <div>
                      <p className="eyebrow">When to use</p>
                      <p className="mt-2 text-[0.92rem] leading-relaxed text-muted-foreground">
                        {model.when}
                      </p>
                    </div>
                    <div>
                      <p className="eyebrow">What you get</p>
                      <p className="mt-2 text-[0.92rem] leading-relaxed text-muted-foreground">
                        {model.get}
                      </p>
                    </div>
                  </div>
                </Panel>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* Sections */}
      {regionData.sections && regionData.sections.length > 0 && (
        <Section className="border-t border-border">
          <div className="grid gap-8 lg:grid-cols-2">
            {regionData.sections.map((section, i) => (
              <Reveal key={section.heading} delay={i * 0.07}>
                <div>
                  <h3 className="font-display text-xl font-semibold">{section.heading}</h3>
                  <p className="mt-4 text-[1.02rem] leading-relaxed text-muted-foreground">
                    {section.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* Pull Quote */}
      {regionData.pullQuote && (
        <Section className="border-t border-border">
          <PullQuote>{regionData.pullQuote}</PullQuote>
        </Section>
      )}

      {/* Pros & Cons */}
      {prosConsData && (
        <Section className="border-t border-border">
          <SectionHeading
            eyebrow="Honest assessment"
            title={`${prosConsData.title}: strengths and trade-offs`}
          />
          <div className="mt-12">
            <Reveal>
              <ProsConsCard data={prosConsData} />
            </Reveal>
          </div>
          <div className="mt-10">
            <Link
              to="/global-delivery"
              className="inline-flex items-center gap-2 font-display text-sm font-semibold text-gold hover:text-foreground transition-colors"
            >
              Compare all three regions →
            </Link>
          </div>
        </Section>
      )}

      {/* FAQ */}
      <FaqSection questions={regionData.faqQuestions} />

      {/* CTA */}
      {regionData.cta ? (
        <Section className="border-t border-border">
          <div className="flex flex-col items-center justify-center text-center">
            <Link
              to={regionData.cta.to}
              className="inline-flex items-center justify-center rounded-md bg-cream px-8 py-4 font-display text-base font-semibold text-navy transition-colors hover:bg-gold"
            >
              {regionData.cta.label}
            </Link>
          </div>
        </Section>
      ) : (
        <CtaBand />
      )}
    </>
  );
}
