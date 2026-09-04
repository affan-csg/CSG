import { createFileRoute } from "@tanstack/react-router";

import { ArrowLink, CtaBand, PageHero, Prose, Section } from "@/components/site/primitives";
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildSeoMeta } from "@/lib/seo";

const insightsContent: Record<
  string,
  { title: string; date: string; readTime: string; content: string }
> = {
  "the-hidden-costs-of-a-bad-hire": {
    title: "The Hidden Costs of a Bad Hire and How to Avoid Them",
    date: "2024-08-15",
    readTime: "8 min read",
    content: `A bad hire costs more than just salary. Here's how to identify and prevent costly hiring mistakes before they impact your bottom line.

The true cost of a bad hire goes far beyond the salary you pay. Studies show that a bad hire can cost a company 30% of that employee's first-year earnings. For a $100,000 salary, that's $30,000 lost in recruitment, training, and lost productivity.

## The Hidden Costs

When you factor in all the indirect costs, the impact becomes even more significant:

- Lost productivity during the hiring and training period
- Impact on team morale and culture
- Customer dissatisfaction and potential lost business
- Management time spent on performance issues
- Severance and outplacement costs

## How to Avoid Bad Hires

The key to avoiding bad hires is a structured, data-driven hiring process. Here's what works:

- Define clear role requirements before starting the search
- Use structured interviews with consistent questions
- Check references thoroughly
- Consider working with a staffing partner who specializes in your industry

## The Staffing Partner Advantage

Working with a specialized staffing partner like Career Source Group can significantly reduce the risk of bad hires. Our vetting process includes communication skills assessment, technical skill verification, and culture fit evaluation, before you ever see a resume.`,
  },
  "is-outsourcing-it-staffing-right-for-your-business": {
    title: "Is Outsourcing IT Staffing Right for Your Business?",
    date: "2024-07-22",
    readTime: "7 min read",
    content: `Outsourcing IT staffing can save time and money, but it's not for everyone. Learn when it makes sense and what to look for in a staffing partner.

## When to Consider Outsourcing

Outsourcing IT staffing makes sense when:

- You need to fill positions quickly
- You don't have internal HR resources
- You're hiring for specialized technical roles
- You want to reduce recruitment costs
- You need flexibility in team size

## Benefits of Outsourcing

The benefits of outsourcing IT staffing include:

- Access to a larger talent pool
- Faster time-to-hire
- Reduced recruitment costs
- Expertise in technical hiring
- Flexibility to scale up or down

## What to Look for in a Partner

When choosing a staffing partner, look for:

- Industry expertise in your specific tech stack
- Transparent pricing and communication
- Strong vetting process
- Track record of successful placements
- Understanding of your culture and values`,
  },
};

export const Route = createFileRoute("/insights/$slug")({
  head: ({ params }) => {
    const post = insightsContent[params.slug];
    if (!post) {
      return {
        meta: [
          { title: "Post Not Found | Career Source Group" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const description = post.content.split("\n\n")[0] ?? post.content;
    const path = `/insights/${params.slug}`;
    return {
      ...buildSeoMeta({
        title: post.title,
        description,
        path,
        ogType: "article",
      }),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            buildArticleJsonLd({
              title: post.title,
              description,
              publishedDate: post.date,
            }),
          ),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            buildBreadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Insights", url: "/insights" },
              { name: post.title, url: path },
            ]),
          ),
        },
      ],
    };
  },
  component: InsightsPostPage,
});

function InsightsPostPage() {
  const { slug } = Route.useParams();
  const post = insightsContent[slug] || {
    title: "Insight",
    date: "",
    readTime: "",
    content: "This post is coming soon. Check back later for the full article.",
  };

  return (
    <>
      <PageHero
        eyebrow={`Insights · ${post.readTime}`}
        title={post.title}
        body={post.date ? `Published ${post.date}` : undefined}
      />

      <Section>
        <Prose content={post.content} />
      </Section>

      <Section className="border-t border-border">
        <ArrowLink to="/insights" label="← Back to all insights" />
      </Section>

      <CtaBand />
    </>
  );
}
