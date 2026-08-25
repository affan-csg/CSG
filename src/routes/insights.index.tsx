import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/site/reveal";
import { buildSeoMeta } from "@/lib/seo";
import { CtaBand, PageHero, Panel, Section } from "@/components/site/primitives";

export const Route = createFileRoute("/insights/")({
  head: () =>
    buildSeoMeta({
      title: "Insights",
      description:
        "Hiring intelligence on technical staffing, delivery models, and workforce strategy from Career Source Group.",
      path: "/insights",
    }),
  component: InsightsPage,
});

const posts = [
  {
    slug: "the-hidden-costs-of-a-bad-hire",
    title: "The Hidden Costs of a Bad Hire and How to Avoid Them",
    excerpt:
      "A bad hire costs more than just salary — here's how to identify and prevent costly hiring mistakes before they impact your bottom line.",
    date: "2024-08-15",
    readTime: "8 min read",
    image: "/images/blog/hiring.avif",
  },
  {
    slug: "is-outsourcing-it-staffing-right-for-your-business",
    title: "Is Outsourcing IT Staffing Right for Your Business?",
    excerpt:
      "Outsourcing IT staffing can save time and money, but it's not for everyone. Learn when it makes sense and what to look for in a staffing partner.",
    date: "2024-07-22",
    readTime: "7 min read",
    image: "/images/blog/outsourcing.avif",
  },
];

function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Hiring intelligence"
        body="Technical staffing strategy, delivery-model comparisons, and practical hiring advice from the Career Source Group team."
      />

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 3) * 0.06}>
              <Link
                to="/insights/$slug"
                params={{ slug: post.slug }}
                className="group block h-full"
              >
                <Panel className="flex h-full flex-col overflow-hidden p-0">
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
                          {post.date}
                        </p>
                        <h3 className="mt-3 font-display text-lg font-semibold leading-snug">
                          {post.title}
                        </h3>
                      </div>
                      <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-gold" />
                    </div>
                    <p className="mt-4 grow text-[0.96rem] leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <div className="mt-6">
                      <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-gold">
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </Panel>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
