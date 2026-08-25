import { createFileRoute } from "@tanstack/react-router";

import { PageHero, Section } from "@/components/site/primitives";
import { legalPages } from "@/content/pages";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () =>
    buildSeoMeta({
      title: "Terms & Conditions",
      description: "Terms and conditions for Career Source Group.",
      path: "/terms",
    }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title={legalPages.terms.title} />

      <Section>
        <div className="max-w-3xl">
          <p className="text-[1.04rem] leading-[1.75] text-muted-foreground">
            {legalPages.terms.body}
          </p>
          <p className="mt-6 text-[1.04rem] leading-[1.75] text-muted-foreground">
            For questions about our terms and conditions, please{" "}
            <a href="/contact" className="text-gold transition-colors hover:text-gold/80">
              contact us
            </a>{" "}
            or email{" "}
            <a
              href="mailto:hello@careersourcegroup.com"
              className="text-gold transition-colors hover:text-gold/80"
            >
              hello@careersourcegroup.com
            </a>
            .
          </p>
        </div>
      </Section>
    </>
  );
}
