// GA4 Event Tracking Utility
// Tracks all conversion and engagement events for Career Source Group

type EventParams = Record<string, string | number | boolean | string[] | number[]>;

declare global {
  var dataLayer: unknown[];
  interface Window {
    gtag?: ((...args: unknown[]) => void) | undefined;
    dataLayer?: unknown[];
  }
}

const env = import.meta.env as unknown as Record<string, string | undefined>;
const GA4_ID = env["VITE_GA4_ID"] || env["NEXT_PUBLIC_GA4_ID"];
const ENABLE_ANALYTICS =
  env["VITE_ENABLE_ANALYTICS"] !== "false" && env["NEXT_PUBLIC_ENABLE_ANALYTICS"] !== "false";

/**
 * Initialize GA4 tracking
 */
export function initializeAnalytics(): void {
  if (!ENABLE_ANALYTICS || !GA4_ID) {
    console.warn("Analytics not enabled or GA4 ID not configured");
    return;
  }

  // Load gtag script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  if (!window.dataLayer) {
    window.dataLayer = [];
  }
  function gtag(...args: unknown[]): void {
    window.dataLayer!.push(args);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA4_ID, {
    page_path: window.location.pathname,
    page_title: document.title,
  });
}

/**
 * Track custom events
 */
export function trackEvent(eventName: string, params?: EventParams): void {
  if (!ENABLE_ANALYTICS || !window.gtag) {
    return;
  }

  window.gtag("event", eventName, params);
}

// Employer Journey Events
export function trackLeadFormSubmitted(data: {
  specialty: string;
  location: string;
  workArrangement?: string;
}): void {
  trackEvent("lead_form_submitted", {
    event_category: "lead_generation",
    event_label: "employer_requirement",
    specialty: data.specialty,
    location: data.location,
    work_arrangement: data.workArrangement || "not_specified",
  });
}

export function trackCTAClicked(ctaLabel: string, location: string): void {
  trackEvent("cta_clicked", {
    event_category: "engagement",
    event_label: ctaLabel,
    location,
  });
}

export function trackPageView(pageTitle: string, path: string): void {
  trackEvent("page_view", {
    event_category: "navigation",
    page_title: pageTitle,
    page_path: path,
  });
}

// Candidate Journey Events
export function trackCandidateProfileSubmitted(data: {
  specialty: string;
  yearsExperience?: number;
  availability?: string;
}): void {
  trackEvent("candidate_profile_submitted", {
    event_category: "candidate_recruitment",
    event_label: "profile_submission",
    specialty: data.specialty,
    years_experience: data.yearsExperience || 0,
    availability: data.availability || "not_specified",
  });
}

export function trackTabViewed(tabName: string): void {
  trackEvent("tab_viewed", {
    event_category: "engagement",
    event_label: tabName,
  });
}

export function trackFAQExpanded(question: string): void {
  trackEvent("faq_expanded", {
    event_category: "engagement",
    event_label: "faq_interaction",
    question: question.substring(0, 100), // Limit to 100 chars
  });
}

// Content Interaction Events
export function trackVideoPlayed(videoTitle: string, duration?: number): void {
  trackEvent("video_played", {
    event_category: "content_engagement",
    event_label: videoTitle,
    video_duration_seconds: duration || 0,
  });
}

export function trackResourceDownloaded(resourceName: string): void {
  trackEvent("resource_downloaded", {
    event_category: "content_engagement",
    event_label: resourceName,
  });
}

export function trackScrollDepth(percentage: number, pageSection?: string): void {
  trackEvent("scroll_depth", {
    event_category: "engagement",
    scroll_percentage: percentage,
    page_section: pageSection || "unknown",
  });
}

// Conversion Events
export function trackLeadQualified(specialty: string, estimatedValue?: number): void {
  trackEvent("lead_qualified", {
    event_category: "conversion",
    event_label: "lead_qualification",
    specialty,
    estimated_value_usd: estimatedValue || 0,
  });
}

export function trackPlacementCompleted(
  specialty: string,
  region: string,
  engagementType: string,
): void {
  trackEvent("placement_completed", {
    event_category: "conversion",
    event_label: "successful_placement",
    specialty,
    region,
    engagement_type: engagementType,
  });
}

// Regional Tracking
export function trackRegionSelected(region: string): void {
  trackEvent("region_selected", {
    event_category: "navigation",
    region,
  });
}

export function trackRegionalComparisonViewed(): void {
  trackEvent("regional_comparison_viewed", {
    event_category: "engagement",
    event_label: "comparison_page",
  });
}

// Search and Filter Events
export function trackSearchPerformed(searchTerm: string): void {
  trackEvent("search_performed", {
    event_category: "engagement",
    event_label: "site_search",
    search_term: searchTerm,
  });
}

export function trackFilterApplied(filterType: string, filterValue: string): void {
  trackEvent("filter_applied", {
    event_category: "engagement",
    filter_type: filterType,
    filter_value: filterValue,
  });
}

// Error Tracking
export function trackFormError(formName: string, errorMessage: string): void {
  trackEvent("form_error", {
    event_category: "error",
    form_name: formName,
    error_message: errorMessage.substring(0, 100),
  });
}

export function trackAPIError(endpoint: string, statusCode: number): void {
  trackEvent("api_error", {
    event_category: "error",
    endpoint,
    status_code: statusCode,
  });
}
