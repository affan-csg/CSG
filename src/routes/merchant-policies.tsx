import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Removed per implementation brief: this page's "cash and collection"
 * copy was leftover from an unrelated e-commerce template and doesn't
 * apply to a staffing business. Never linked from navigation or the
 * sitemap - redirect covers any stray/bookmarked link.
 */
export const Route = createFileRoute("/merchant-policies")({
  beforeLoad: () => {
    throw redirect({ to: "/", statusCode: 301 });
  },
});
