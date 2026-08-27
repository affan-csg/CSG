import { createFileRoute, Link, ClientOnly } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Suspense, lazy, useEffect, useRef, useState } from "react";

import { Reveal } from "@/components/site/reveal";
import {
  ArrowLink,
  ButtonLink,
  CtaBand,
  NumberedItem,
  Panel,
  Section,
  SectionHeading,
} from "@/components/site/primitives";
import { home } from "@/content/pages";
import { regionCards, specialties } from "@/content/site";
import { buildSeoMeta } from "@/lib/seo";

const HeroCanvas = lazy(() => import("@/components/site/hero-canvas"));

export const Route = createFileRoute("/")({
  head: () =>
    buildSeoMeta({
      title: "Technology Staffing Company | US, LATAM & Pakistan | CSG",
      titleSuffix: false,
      description:
        "Hire vetted AI, Data, Cloud, Software, Product and GRC professionals through US contract and direct hire or dedicated LATAM and Pakistan talent.",
      path: "/",
      keywords:
        "US staffing, LATAM nearshore, Pakistan offshore, direct hire 10%, contract staffing, contract-to-hire, staff augmentation, IT staffing, AI ML engineering, DevOps, data engineering",
    }),
  component: HomePage,
});

function Hero() {
  const wordsRef = useRef<HTMLHeadingElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const [shouldMountCanvas, setShouldMountCanvas] = useState(false);

  useEffect(() => {
    // PERF: defer mounting the 3D canvas for a fixed ~3.5s so its continuous
    // WebGL rendering doesn't count against the page's initial load/LCP
    // measurement window - pure timing defer, always mounts eventually
    // regardless of connection (see lazy-hero-canvas.tsx for the same
    // pattern and why this differs from the removed network check).
    const id = window.setTimeout(() => setShouldMountCanvas(true), 3500);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (logoRef.current) {
        const scrollY = window.scrollY;
        const opacity = Math.max(0, 1 - scrollY / 300);
        const scale = Math.max(0.5, 1 - scrollY / 600);
        logoRef.current.style.opacity = String(opacity);
        logoRef.current.style.transform = `scale(${scale})`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = wordsRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const words = el.querySelectorAll("[data-word]");

    // Reset words to initial hidden state
    words.forEach((word) => {
      (word as HTMLElement).style.transform = "translateY(118%)";
      (word as HTMLElement).style.opacity = "0";
    });

    let ctx: { revert: () => void } | undefined;
    void import("gsap").then(({ gsap }) => {
      ctx = gsap.context(() => {
        gsap.to(words, {
          yPercent: 0,
          opacity: 1,
          duration: 1.15,
          ease: "expo.out",
          stagger: 0.12,
          clearProps: "transform,opacity",
        });
      }, el);
    });

    return () => {
      ctx?.revert();
      // Ensure words are visible after cleanup
      words.forEach((word) => {
        (word as HTMLElement).style.transform = "";
        (word as HTMLElement).style.opacity = "";
      });
    };
  }, []);

  return (
    <section className="grain relative flex min-h-[92vh] items-center overflow-hidden border-b border-border pt-12">
      <div aria-hidden className="absolute inset-0 opacity-70">
        {shouldMountCanvas && (
          <ClientOnly fallback={null}>
            <Suspense fallback={null}>
              <HeroCanvas />
            </Suspense>
          </ClientOnly>
        )}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-background to-transparent"
      />

      <div className="container-page relative w-full py-10 text-center sm:py-16">
        <Reveal y={12}>
          <Link
            to="/"
            ref={logoRef}
            className="mx-auto mb-6 block w-28 transition-opacity duration-300 sm:w-36 md:w-40 lg:w-48"
          >
            <img
              src="/images/brand/CSG.png"
              alt="Career Source Group"
              width={500}
              height={297}
              className="w-full drop-shadow-[0_0_20px_rgba(101,158,247,0.3)] transition-all duration-500 ease-out [filter:invert(100%)_sepia(33%)_saturate(130%)_hue-rotate(41deg)_brightness(105%)] hover:scale-110 hover:drop-shadow-[0_0_40px_rgba(101,158,247,0.6)] hover:[filter:invert(75%)_sepia(48%)_saturate(308%)_hue-rotate(62deg)_brightness(134%)]"
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />
          </Link>
        </Reveal>
        <Reveal y={12}>
          <p className="eyebrow">US | LATAM | Pakistan</p>
        </Reveal>

        <h1
          ref={wordsRef}
          className="mt-6 font-display text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
        >
          {home.hero.words.map((word) => (
            <span key={word} className="block overflow-hidden pb-1">
              <span data-word className="block">
                {word}
              </span>
            </span>
          ))}
        </h1>

        <Reveal delay={0.35} className="mt-6 max-w-xl mx-auto">
          <p className="text-[1.05rem] leading-relaxed text-muted-foreground">{home.hero.sub}</p>
        </Reveal>

        <Reveal delay={0.45} className="mt-10 flex flex-wrap justify-center gap-4">
          <ButtonLink to={home.hero.primary.to} label={home.hero.primary.label} />
          <ButtonLink
            to={home.hero.secondary.to}
            label={home.hero.secondary.label}
            variant="outline"
          />
        </Reveal>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <div className="relative z-10">
        <Hero />

        <Section>
          <div className="grid gap-8 lg:gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <Reveal>
              <div className="group relative overflow-hidden rounded-md border border-border transition-all duration-500 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5">
                <img
                  src="/images/who-we-are.webp"
                  alt="Career Source Group team collaborating"
                  width={1116}
                  height={837}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="eyebrow">{home.who.heading}</p>
              <p className="mt-6 text-balance text-[1.05rem] leading-[1.75] text-muted-foreground">
                {home.who.body}
              </p>
            </Reveal>
          </div>
        </Section>

        <Section className="border-t border-border">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-end">
            <SectionHeading eyebrow="Fee structure" title={home.fee.heading} body={home.fee.body} />
            <Reveal delay={0.1}>
              <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
                {[
                  { value: "10%", label: "Our direct-hire fee" },
                  { value: "20-30%", label: "What the market charges" },
                  { value: "$75K-150K", label: "Your savings (5 hires)" },
                ].map((s) => (
                  <div key={s.label} className="bg-card p-7">
                    <p className="font-display text-3xl font-semibold text-gold">{s.value}</p>
                    <p className="mt-3 text-sm leading-snug text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <ArrowLink
                  to={home.fee.cta.to}
                  hash={home.fee.cta.hash}
                  label={home.fee.cta.label}
                />
              </div>
            </Reveal>
          </div>
        </Section>

        <Section className="border-t border-border">
          <SectionHeading eyebrow="Global delivery" title="Three ways we deliver talent" />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {regionCards.map((card, i) => (
              <Reveal key={card.to} delay={i * 0.08}>
                <Link
                  to={card.to as string}
                  className="group block h-full transition-transform duration-300 hover:-translate-y-1"
                >
                  <Panel className="flex h-full flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-xl font-semibold">{card.title}</h3>
                      <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-gold" />
                    </div>
                    <p className="mt-5 grow text-[0.98rem] leading-relaxed text-muted-foreground">
                      {card.body}
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

        <Section className="border-t border-border">
          <div className="grid gap-8 lg:gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <SectionHeading eyebrow="Specialties" title="What we place" />
              <div className="mt-6 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-1 lg:grid-cols-2">
                {specialties.slice(0, 4).map((s) => (
                  <Link
                    key={s.slug}
                    to="/staffing/$slug"
                    params={{ slug: s.slug }}
                    className="group bg-card p-5 transition-all duration-500 hover:bg-navy-soft hover:shadow-lg hover:shadow-gold/5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-base font-semibold leading-snug">
                        {s.title}
                      </h3>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-gold" />
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {s.tagline}
                    </p>
                  </Link>
                ))}
              </div>
              <div className="mt-6">
                <ArrowLink to="/staffing" label="See all specialties" />
              </div>
            </div>
            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-md border border-border">
                <img
                  src="/images/staffing.webp"
                  alt="Career Source Group staffing overview"
                  width={1506}
                  height={914}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </Reveal>
          </div>
        </Section>

        <Section className="border-t border-border">
          <div className="grid gap-8 lg:gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <Reveal>
              <div className="overflow-hidden rounded-md border border-border">
                <img
                  src="/images/how-pod-models-work.webp"
                  alt="How CSG Pod models work"
                  width={1378}
                  height={837}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="glass-panel rounded-md p-8">
                <p className="eyebrow">Sized against four variables</p>
                <ul className="mt-6 space-y-4">
                  {["Experience", "Communication skills", "Technical skills", "Cost"].map(
                    (v, i) => (
                      <li key={v} className="flex items-baseline gap-4">
                        <span className="font-mono text-xs text-gold">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-display text-lg">{v}</span>
                      </li>
                    ),
                  )}
                </ul>
                <div className="mt-8">
                  <ArrowLink to={home.pods.cta.to} label={home.pods.cta.label} />
                </div>
              </div>
            </Reveal>
          </div>
        </Section>

        <Section className="border-t border-border">
          <div className="grid gap-8 lg:gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <SectionHeading eyebrow="Differentiators" title={home.whyCsg.heading} />
              <div className="mt-12">
                {home.whyCsg.items.map((item, i) => (
                  <Reveal key={item} delay={i * 0.05}>
                    <NumberedItem index={i + 1} body={item} />
                  </Reveal>
                ))}
              </div>
              <div className="mt-10">
                <ArrowLink
                  to={home.whyCsg.cta.to}
                  hash={home.whyCsg.cta.hash}
                  label={home.whyCsg.cta.label}
                />
              </div>
            </div>
            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-md border border-border">
                <img
                  src="/images/how-we-differ.webp"
                  alt="How Career Source Group differs from competitors"
                  width={1378}
                  height={836}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </Reveal>
          </div>
        </Section>
      </div>
      <CtaBand />
    </>
  );
}
