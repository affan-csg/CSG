import { Link } from "@tanstack/react-router";

import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/site/reveal";
import { ctaBand, faqsByQuestion, type Faq } from "@/content/site";
import { HeroParticles } from "@/components/site/hero-particles";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("relative py-20 md:py-28", className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}

/**
 * Wraps each occurrence of `terms` in `text` with the accent color, so a key
 * stat or differentiator (e.g. "10%") stands out from surrounding copy
 * instead of reading at the same weight as everything else.
 */
export function highlightText(text: string, terms?: string | string[]): ReactNode {
  if (!terms) return text;
  const list = (Array.isArray(terms) ? terms : [terms]).filter(Boolean);
  if (list.length === 0) return text;

  const pattern = list.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const parts = text.split(new RegExp(`(${pattern})`, "g"));

  return parts.map((part, i) =>
    list.includes(part) ? (
      <span key={i} className="text-gold">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/**
 * The handful of stats/phrases repeated verbatim across many pages (fee
 * comparison, regional savings, the "one contract" pillar) — used as the
 * default highlight set for FAQ content, which is reused across ~10 routes
 * with too many one-off dollar figures per answer to hand-curate each one.
 */
export const USP_TERMS = [
  "10%",
  "20-40%",
  "30-70%",
  "50-70%",
  "10-20%",
  "one contract, one invoice, one point of contact",
  "One contract, one invoice, one point of contact",
  "one contract, one invoice, and one point of contact",
  "One contract, one invoice, and one point of contact",
  "Same contract, same invoice, same point of contact",
];

/**
 * Auto-detects dollar figures/ranges (e.g. "$134,000-$193,250", "$170K-$230K")
 * and percentage figures (e.g. "10-20%") in a string. For pages where every
 * block is inherently built around one canonical market-rate stat — too many
 * distinct figures across roles/regions to hand-curate a term list for each
 * — the figure itself IS the differentiator, so highlighting every match is
 * safe rather than arbitrary.
 */
export function extractStatTerms(text: string): string[] {
  const dollarPattern = /\$\d{1,3}(?:,\d{3})*K?(?:\s*-\s*\$?\d{1,3}(?:,\d{3})*K?)?/g;
  const percentPattern = /\d{1,3}(?:-\d{1,3})?%/g;
  const multiplierPattern = /\d+(?:\.\d+)?(?:-\d+(?:\.\d+)?)?x\b/g;
  const matches = [
    ...text.matchAll(dollarPattern),
    ...text.matchAll(percentPattern),
    ...text.matchAll(multiplierPattern),
  ].map((m) => m[0]);
  return Array.from(new Set(matches));
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  className,
  align = "left",
  highlight,
  bodyHighlight,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  className?: string;
  align?: "left" | "center";
  highlight?: string | string[];
  bodyHighlight?: string | string[];
}) {
  return (
    <Reveal className={cn(align === "center" && "text-center", className)}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2
        className={cn(
          "mt-4 text-balance heading-section",
          align === "center" && "mx-auto max-w-3xl",
        )}
      >
        {highlightText(title, highlight)}
      </h2>
      {body ? (
        <p
          className={cn(
            "mt-5 max-w-2xl body-copy text-muted-foreground",
            align === "center" && "mx-auto",
          )}
        >
          {highlightText(body, bodyHighlight)}
        </p>
      ) : null}
    </Reveal>
  );
}

export function PageHero({
  eyebrow,
  title,
  body,
  children,
  showParticles = false,
  showRing = true,
  titleHighlight,
  bodyHighlight,
}: {
  eyebrow: string;
  title: string;
  body?: string | string[] | undefined;
  children?: ReactNode;
  showParticles?: boolean;
  showRing?: boolean;
  titleHighlight?: string | string[];
  bodyHighlight?: string | string[];
}) {
  const paragraphs = Array.isArray(body) ? body : body ? [body] : [];
  return (
    <section
      className={cn(
        "grain relative overflow-hidden border-b border-border",
        showParticles ? "min-h-[92vh] flex items-center pt-28" : "pt-36 pb-16 md:pt-44 md:pb-24",
      )}
    >
      {showParticles && <HeroParticles showRing={showRing} />}
      {showParticles && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-background to-transparent"
        />
      )}

      <div className="container-page relative z-10">
        {/* Render hero copy immediately to avoid flash/hide on hydration */}
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-6 max-w-4xl text-balance heading-hero">
          {highlightText(title, titleHighlight)}
        </h1>
        {paragraphs.map((p) => (
          <p key={p} className="mt-6 max-w-2xl body-copy text-muted-foreground">
            {highlightText(p, bodyHighlight)}
          </p>
        ))}
        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  );
}

export function ArrowLink({
  to,
  label,
  className,
  hash,
}: {
  to: string;
  label: string;
  className?: string;
  hash?: string;
}) {
  return (
    <Link
      to={to as never}
      {...(hash ? { hash } : {})}
      className={cn(
        "group inline-flex items-center gap-2 button-text text-gold transition-all duration-300 hover:gap-3",
        className,
      )}
    >
      {label}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

export function ButtonLink({
  to,
  label,
  variant = "solid",
}: {
  to: string;
  label: string;
  variant?: "solid" | "outline";
}) {
  return (
    <Link
      to={to as never}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 button-text transition-all duration-300 hover:scale-[1.07] active:scale-95",
        variant === "solid"
          ? "bg-cream text-navy hover:bg-gold hover:shadow-lg hover:shadow-gold/40"
          : "border border-gold text-foreground shadow-sm shadow-gold/20 hover:text-gold hover:shadow-lg hover:shadow-gold/30",
      )}
    >
      {label}
    </Link>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="badge-text rounded-full border border-border px-3 py-1 text-muted-foreground">
      {children}
    </span>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "glass-panel rounded-md p-7 transition-all duration-500 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5 hover:-translate-y-0.5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function NumberedItem({
  index,
  heading,
  body,
  highlight,
  headingHighlight,
}: {
  index: number;
  heading?: string;
  body: string;
  highlight?: string | string[];
  headingHighlight?: string | string[];
}) {
  return (
    <div className="grid gap-5 border-t border-border py-8 transition-colors duration-300 hover:border-gold/30 md:grid-cols-[5rem_1fr]">
      <span className="label-small text-gold">{String(index).padStart(2, "0")}</span>
      <div className="min-w-0">
        {heading ? (
          <h3 className="card-title">{highlightText(heading, headingHighlight)}</h3>
        ) : null}
        <p className={cn("body-copy text-muted-foreground", heading && "mt-3")}>
          {highlightText(body, highlight)}
        </p>
      </div>
    </div>
  );
}

export function PullQuote({ children }: { children: ReactNode }) {
  return (
    <Reveal className="my-4 border-l-2 border-gold pl-7 transition-all duration-300 hover:border-l-4 hover:pl-6">
      <p className="testimonial-quote text-foreground font-semibold">{children}</p>
    </Reveal>
  );
}

export type ClientLogo = { name: string; image?: string };

export function LogoWall({ logos }: { logos: readonly ClientLogo[] }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
      {logos.map((logo, i) => (
        <Reveal key={logo.name} delay={i * 0.05}>
          <div className="group flex h-40 flex-col items-center justify-center gap-3 bg-card p-5 transition-colors duration-300 hover:bg-navy-soft">
            {logo.image ? (
              <div className="flex h-16 w-full items-center justify-center rounded-md bg-white px-3 py-2 shadow-sm transition-transform duration-300 group-hover:scale-105">
                <img
                  src={logo.image}
                  alt={logo.name}
                  className="h-11 max-w-full object-contain saturate-150"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : (
              <span className="font-display text-lg font-semibold tracking-tight text-muted-foreground/50 transition-all duration-300 group-hover:scale-105 group-hover:text-gold sm:text-xl">
                {logo.name}
              </span>
            )}
            {logo.image ? (
              <span className="text-center text-sm font-medium tracking-wide text-muted-foreground/80">
                {logo.name}
              </span>
            ) : null}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function StatGrid({ stats }: { stats: readonly { value: string; label: string }[] }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-card p-7 transition-colors duration-300 hover:bg-navy-soft"
        >
          <p className="stat-value text-gold">{s.value}</p>
          <p className="stat-label mt-3 text-muted-foreground">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

export function FaqSection({
  questions,
  items,
  heading = "Frequently asked questions",
  showAllLink = true,
}: {
  questions?: string[];
  items?: Faq[];
  heading?: string;
  showAllLink?: boolean;
}) {
  const list = items ?? faqsByQuestion(questions ?? []);
  if (!list.length) return null;

  return (
    <Section className="border-t border-border">
      <SectionHeading eyebrow="FAQ" title={heading} />
      <Accordion type="single" collapsible className="mt-12">
        {list.map((faq) => (
          <AccordionItem key={faq.q} value={faq.q} className="border-border">
            <AccordionTrigger className="py-6 text-left form-label transition-colors duration-300 hover:no-underline hover:text-gold">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="max-w-3xl pb-7 body-copy text-muted-foreground">
              {highlightText(faq.a, USP_TERMS)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {showAllLink ? (
        <div className="mt-10">
          <ArrowLink to="/faq" label="See all FAQs" />
        </div>
      ) : null}
    </Section>
  );
}

export function CtaBand() {
  return (
    <section className="grain relative overflow-hidden border-t border-border bg-navy-deep py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-52 left-1/2 h-[30rem] w-[46rem] -translate-x-1/2 rounded-full opacity-[0.13] blur-[120px]"
        style={{ background: "var(--gold)" }}
      />
      <div className="container-page relative text-center">
        <Reveal>
          <h2 className="mx-auto max-w-3xl text-balance heading-section">{ctaBand.title}</h2>
          <p className="mx-auto mt-6 max-w-xl body-copy text-muted-foreground">{ctaBand.body}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <ButtonLink to={ctaBand.primary.to} label={ctaBand.primary.label} />
            <ButtonLink
              to={ctaBand.secondary.to}
              label={ctaBand.secondary.label}
              variant="outline"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Minimal markdown-ish renderer for long-form content (blog, legal). */
export function Prose({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/).filter(Boolean);

  return (
    <div className="max-w-3xl">
      {blocks.map((block, i) => {
        const trimmed = block.trim();

        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={i} className="mt-12 heading-subsection">
              {trimmed.slice(4)}
            </h3>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={i} className="mt-14 heading-section">
              {trimmed.slice(3)}
            </h2>
          );
        }
        if (/^[-*] /m.test(trimmed)) {
          const lines = trimmed.split("\n").filter((l) => /^[-*] /.test(l.trim()));
          return (
            <ul key={i} className="mt-6 space-y-3">
              {lines.map((line, j) => (
                <li key={j} className="flex gap-3 body-copy text-muted-foreground">
                  <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-gold" />
                  <span>{line.trim().replace(/^[-*] /, "")}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="mt-6 body-copy text-muted-foreground">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
