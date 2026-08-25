/**
 * SEO helper utilities for TanStack Router.
 * Use these in route head() functions for consistent SEO.
 */

const SITE_URL = "https://careersourcegroup.com";
const SITE_NAME = "Career Source Group";
const DEFAULT_OG_IMAGE = "/images/brand/CSG.png";

export interface SeoOptions {
  /** Page-specific title. Do not include " | Career Source Group" — it's appended automatically (see titleSuffix). */
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string;
  noindex?: boolean;
  /** Set false when `title` already stands on its own (e.g. the homepage's brand-led title). Defaults to true. */
  titleSuffix?: boolean;
}

export function buildSeoMeta(opts: SeoOptions) {
  const url = SITE_URL + opts.path;
  const image = opts.ogImage || DEFAULT_OG_IMAGE;
  const imageUrl = image.startsWith("http") ? image : SITE_URL + image;
  const pageTitle = opts.titleSuffix === false ? opts.title : opts.title + " | " + SITE_NAME;

  return {
    meta: [
      { title: pageTitle },
      { name: "description", content: opts.description },
      {
        name: "keywords",
        content:
          opts.keywords ||
          "staffing, talent acquisition, US staffing, LATAM nearshore, Pakistan offshore, direct hire, contract staffing, Career Source Group",
      },
      { name: "author", content: SITE_NAME },
      { name: "robots", content: opts.noindex ? "noindex, nofollow" : "index, follow" },
      // Open Graph
      { property: "og:title", content: opts.title },
      { property: "og:description", content: opts.description },
      { property: "og:type", content: opts.ogType || "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: imageUrl },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_US" },
      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: opts.title },
      { name: "twitter:description", content: opts.description },
      { name: "twitter:image", content: imageUrl },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Career Source Group, LLC",
    url: SITE_URL,
    logo: SITE_URL + DEFAULT_OG_IMAGE,
    description: "Technology staffing and talent delivery across the US, LATAM and Pakistan.",
    email: "hello@careersourcegroup.com",
    telephone: "+1-443-875-9677",
    areaServed: ["United States", "Latin America", "Pakistan"],
    sameAs: [
      "https://www.linkedin.com/in/zohaibkhawaja/",
      "https://www.facebook.com/61559974043500",
      "https://www.instagram.com/careersourcegroup",
    ],
  };
}

export function buildFaqJsonLd(questions: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

export function buildStaffingJsonLd(role: {
  name: string;
  description: string;
  image?: string;
  price?: string;
  region?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: role.name,
    description: role.description,
    image: role.image ? SITE_URL + role.image : DEFAULT_OG_IMAGE,
    provider: {
      "@type": "Organization",
      name: "Career Source Group, LLC",
      url: SITE_URL,
    },
    areaServed: role.region || "United States",
    ...(role.price && { priceRange: role.price }),
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: SITE_URL + item.url,
    })),
  };
}

const REGION_INFO = {
  us: {
    name: "Career Source Group - United States",
    country: "US",
    description:
      "Direct hire staffing, contract staffing, and contract-to-hire talent acquisition across the United States.",
    geoPosition: "34.0754, -84.2941",
    latitude: 34.0754,
    longitude: -84.2941,
    placeType: "Country",
    placeName: "United States",
    regions: ["United States"],
  },
  latam: {
    name: "Career Source Group - LATAM Nearshore",
    country: "Mexico",
    description:
      "Nearshore talent delivery and staffing solutions across Latin America with 30-70% cost savings.",
    geoPosition: "23.6345, -102.5528",
    latitude: 23.6345,
    longitude: -102.5528,
    placeType: "Region",
    placeName: "Latin America",
    regions: ["Mexico", "Colombia", "Argentina", "Brazil"],
  },
  pakistan: {
    name: "Career Source Group - Pakistan Offshore",
    country: "Pakistan",
    description:
      "Offshore talent delivery and staffing solutions from Pakistan with 50-70% cost savings.",
    geoPosition: "30.3753, 69.3451",
    latitude: 30.3753,
    longitude: 69.3451,
    placeType: "Country",
    placeName: "Pakistan",
    regions: ["Pakistan"],
  },
} as const;

export function buildArticleJsonLd(article: {
  title: string;
  description: string;
  image?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image ? SITE_URL + article.image : DEFAULT_OG_IMAGE,
    author: {
      "@type": "Organization",
      name: article.author || "Career Source Group, LLC",
    },
    publisher: {
      "@type": "Organization",
      name: "Career Source Group, LLC",
      logo: {
        "@type": "ImageObject",
        url: SITE_URL + DEFAULT_OG_IMAGE,
      },
    },
    ...(article.publishedDate && { datePublished: article.publishedDate }),
    ...(article.modifiedDate && { dateModified: article.modifiedDate }),
  };
}

export function buildAggregateRatingJsonLd(
  rating: number,
  reviewCount: number,
  bestRating: number = 5,
  worstRating: number = 1,
) {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    ratingValue: rating,
    bestRating: bestRating,
    worstRating: worstRating,
    reviewCount: reviewCount,
  };
}

export function buildGeoTargetingMeta(region: "us" | "latam" | "pakistan") {
  const data = REGION_INFO[region];

  return [
    { name: "geo.position", content: data.geoPosition },
    { name: "geo.placename", content: data.placeName },
    { name: "geo.region", content: `geo.${region}` },
  ];
}

export function buildRegionalBusinessJsonLd(region: "us" | "latam" | "pakistan") {
  const data = REGION_INFO[region];

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: data.name,
    description: data.description,
    url: SITE_URL + `/global-delivery/${region}`,
    areaServed: data.regions,
    geo: {
      "@type": "GeoCoordinates",
      latitude: data.latitude,
      longitude: data.longitude,
    },
    priceRange: region === "us" ? "$$" : "$",
    image: SITE_URL + DEFAULT_OG_IMAGE,
    telephone: "+1-443-875-9677",
    email: "hello@careersourcegroup.com",
    sameAs: [
      "https://www.linkedin.com/company/career-source-group-llc/",
      "https://www.facebook.com/61559974043500",
      "https://www.instagram.com/careersourcegroup",
    ],
  };
}

export function buildHreflangLinks(currentPath: string) {
  return [
    { rel: "canonical", href: SITE_URL + currentPath },
    {
      rel: "alternate",
      hrefLang: "en-US",
      href: SITE_URL + (currentPath.includes("/us") ? currentPath : "/"),
    },
    { rel: "alternate", hrefLang: "es-MX", href: SITE_URL + "/global-delivery/latam" },
    { rel: "alternate", hrefLang: "en-PK", href: SITE_URL + "/global-delivery/pakistan" },
    { rel: "alternate", hrefLang: "x-default", href: SITE_URL + currentPath },
  ];
}
