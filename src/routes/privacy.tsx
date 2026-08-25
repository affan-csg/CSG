import { createFileRoute } from "@tanstack/react-router";

import { PageHero, Section } from "@/components/site/primitives";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () =>
    buildSeoMeta({
      title: "Privacy Policy",
      description: "Privacy policy for Career Source Group.",
      path: "/privacy",
    }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />

      <Section>
        <div className="max-w-3xl">
          <h2 className="font-display text-2xl font-semibold mb-6">Our Privacy Commitment</h2>
          <p className="text-[1.04rem] leading-[1.75] text-muted-foreground">
            Career Source Group, LLC is committed to protecting your privacy. Our Privacy Policy
            covers:
          </p>
          <ul className="mt-4 ml-6 space-y-2 text-[1.04rem] leading-[1.75] text-muted-foreground list-disc">
            <li>What data we collect and why</li>
            <li>How we use and protect your information</li>
            <li>Your rights and choices regarding your data</li>
            <li>Data retention and security practices</li>
            <li>How to contact us about privacy concerns</li>
          </ul>
          <p className="mt-8 text-[1.04rem] leading-[1.75] text-muted-foreground">
            For the complete Privacy Policy document and detailed information about our data
            practices, please{" "}
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
