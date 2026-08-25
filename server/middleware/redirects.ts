// Server middleware for handling 301 redirects
// Maps deprecated routes to new locations

const redirectMap: Record<string, string> = {
  // Old form URLs → New form URL
  "/submit-requirement": "/get-started",
  "/requirement-form": "/get-started",
  "/staffing/form": "/get-started",

  // Specialty role aliases → Canonical URLs
  // Note: only redirect a specialty slug here if its page/content has
  // actually been merged into the target. /staffing/devops has its own
  // unique content (src/content/staffing.ts) and is listed in the sitemap,
  // so it stays live — no redirect.
  "/staffing/mlops": "/staffing/ai-ml",

  // Legacy paths (if any)
  "/hire": "/get-started",
  "/jobs": "/join-our-bench",
};

export default defineEventHandler((event) => {
  const url =
    getHeader(event, "x-forwarded-proto") === "https"
      ? `https://${getHeader(event, "x-forwarded-host")}${event.node.req.url}`
      : `http://localhost${event.node.req.url}`;

  const pathname = new URL(url).pathname;
  const redirectTarget = redirectMap[pathname];

  if (redirectTarget) {
    // Return 301 (permanent) redirect
    setResponseStatus(event, 301);
    setHeader(event, "Location", redirectTarget);
    return null;
  }

  // Continue to next middleware/route handler if no redirect matches
});
