import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

// PERF: inlined (not `?url` + <link rel="stylesheet">) - at ~18KB this is
// small enough that inlining removes a render-blocking network round-trip
// entirely, with no flash-of-unstyled-content risk (unlike deferring it
// would carry, since this CSS controls actual layout, not just typography).
import appCss from "../styles.css?inline";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { getNonce, setServerNonce } from "@/lib/get-nonce";
import { logCoreWebVitals } from "@/lib/performance-monitor";
import { initializeAnalytics } from "@/lib/analytics";
import { ErrorBoundary } from "@/components/error-boundary/error-boundary";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { FloatingConsultCTA } from "@/components/site/floating-consult-cta";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { LazyScrollProgress } from "@/components/animation/lazy-scroll-progress";
import { CustomCursor } from "@/components/site/custom-cursor";
import { LazyHeroCanvas } from "@/components/animation/lazy-hero-canvas";
import { buildOrganizationJsonLd } from "@/lib/seo";

// Server-side: inject nonce during SSR. This is called from src/server.ts before rendering.
if (typeof globalThis !== "undefined" && globalThis.__CSP_NONCE__) {
  setServerNonce(globalThis.__CSP_NONCE__);
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 pt-32">
      <div className="max-w-md text-center">
        <p className="font-mono text-sm text-gold">404</p>
        <h1 className="mt-5 font-display text-3xl font-semibold">Page not found</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-cream px-6 py-3 font-display text-sm font-semibold text-navy transition-colors hover:bg-gold"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 pt-32">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-semibold">This page didn't load</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-cream px-6 py-3 font-display text-sm font-semibold text-navy transition-colors hover:bg-gold"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-md border border-border px-6 py-3 font-display text-sm transition-colors hover:border-gold hover:text-gold"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const nonce = getNonce();
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        { name: "author", content: "Career Source Group, LLC" },
        { name: "theme-color", content: "#0F172A" },
        { httpEquiv: "x-dns-prefetch-control", content: "on" },
        {
          name: "keywords",
          content:
            "staffing, talent acquisition, US staffing, LATAM nearshore, Pakistan offshore, direct hire, contract staffing, contract-to-hire, staff augmentation, IT staffing",
        },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Career Source Group" },
        { property: "og:locale", content: "en_US" },
        { property: "og:image", content: "https://careersourcegroup.com/images/brand/CSG.png" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@careersourcegrp" },
        { name: "twitter:image", content: "https://careersourcegroup.com/images/brand/CSG.png" },
      ],
      links: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
        { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
        { rel: "dns-prefetch", href: "https://fonts.gstatic.com" },
        {
          // PERF: preload (not render-blocking `rel=stylesheet`) - the actual
          // stylesheet is applied non-blocking via the inline script below.
          // To revert: swap this back to `rel: "stylesheet"` and drop the
          // matching script from the `scripts` array.
          rel: "preload",
          as: "style",
          href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap",
        },
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
        { rel: "apple-touch-icon", href: "/images/brand/CSG.png" },
      ],
      scripts: [
        {
          // PERF: applies the preloaded Google Fonts stylesheet without
          // blocking initial render (pairs with the `rel: "preload"` link
          // above). CSP requires the nonce for this inline script to run.
          ...(nonce && { nonce }),
          children:
            "(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap';document.head.appendChild(l);})();",
        },
        {
          type: "application/ld+json",
          ...(nonce && { nonce }),
          children: JSON.stringify(buildOrganizationJsonLd()),
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const nonce = getNonce();
  return (
    <html lang="en">
      <head>
        {/* PERF: inlined app CSS - rendered directly here (not via the
            `styles` head-config array, which doesn't pass the `nonce` prop
            through and gets silently CSP-blocked) so it needs its own
            nonce like the inline scripts below already have. */}
        <style {...(nonce && { nonce })} dangerouslySetInnerHTML={{ __html: appCss }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    // Initialize GA4 analytics
    initializeAnalytics();
    // Log Core Web Vitals in development
    logCoreWebVitals();
  }, []);

  return (
    <ErrorBoundary boundary="root" level="page">
      <QueryClientProvider client={queryClient}>
        <SmoothScroll />
        <LazyScrollProgress />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[60] focus:rounded-md focus:bg-cream focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-navy"
        >
          Skip to main content
        </a>
        <SiteNav />
        <main id="main-content">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <SiteFooter />
        <FloatingConsultCTA />
        <CustomCursor />
        {/* Lazy-loaded 3D canvas background with respects for reduced motion and slow networks */}
        <LazyHeroCanvas showRing={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
