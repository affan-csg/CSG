import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  trackEvent,
  trackLeadFormSubmitted,
  trackCTAClicked,
  trackPageView,
  trackCandidateProfileSubmitted,
  trackFAQExpanded,
  trackRegionSelected,
} from "./analytics";

describe("Analytics Module", () => {
  beforeEach(() => {
    // Mock window.gtag
    const mockGtag = vi.fn();
    global.window = {
      gtag: mockGtag,
      dataLayer: [],
    } as unknown as Window & typeof globalThis;
  });

  describe("trackEvent", () => {
    it("should call gtag with event name and params", () => {
      trackEvent("test_event", { category: "test" });
      expect(window.gtag).toHaveBeenCalledWith("event", "test_event", {
        category: "test",
      });
    });

    it("should handle missing params", () => {
      trackEvent("test_event");
      expect(window.gtag).toHaveBeenCalledWith("event", "test_event", undefined);
    });

    it("should not throw if gtag is not available", () => {
      window.gtag = undefined;
      expect(() => trackEvent("test_event")).not.toThrow();
    });
  });

  describe("Employer tracking events", () => {
    it("should track lead form submission", () => {
      trackLeadFormSubmitted({
        specialty: "AI/ML Engineer",
        location: "us",
        workArrangement: "contract",
      });

      expect(window.gtag).toHaveBeenCalledWith(
        "event",
        "lead_form_submitted",
        expect.objectContaining({
          event_category: "lead_generation",
          event_label: "employer_requirement",
          specialty: "AI/ML Engineer",
          location: "us",
          work_arrangement: "contract",
        }),
      );
    });

    it("should track CTA clicks", () => {
      trackCTAClicked("Request Talent", "homepage_hero");

      expect(window.gtag).toHaveBeenCalledWith(
        "event",
        "cta_clicked",
        expect.objectContaining({
          event_category: "engagement",
          event_label: "Request Talent",
          location: "homepage_hero",
        }),
      );
    });
  });

  describe("Candidate tracking events", () => {
    it("should track candidate profile submission", () => {
      trackCandidateProfileSubmitted({
        specialty: "DevOps Engineer",
        yearsExperience: 5,
        availability: "2-4 weeks",
      });

      expect(window.gtag).toHaveBeenCalledWith(
        "event",
        "candidate_profile_submitted",
        expect.objectContaining({
          event_category: "candidate_recruitment",
          event_label: "profile_submission",
          specialty: "DevOps Engineer",
          years_experience: 5,
          availability: "2-4 weeks",
        }),
      );
    });
  });

  describe("Engagement tracking events", () => {
    it("should track page views", () => {
      trackPageView("Home", "/");

      expect(window.gtag).toHaveBeenCalledWith(
        "event",
        "page_view",
        expect.objectContaining({
          event_category: "navigation",
          page_title: "Home",
          page_path: "/",
        }),
      );
    });

    it("should track FAQ expansions", () => {
      trackFAQExpanded("Why do you charge 10%?");

      expect(window.gtag).toHaveBeenCalledWith(
        "event",
        "faq_expanded",
        expect.objectContaining({
          event_category: "engagement",
          event_label: "faq_interaction",
        }),
      );
    });

    it("should track region selection", () => {
      trackRegionSelected("latam");

      expect(window.gtag).toHaveBeenCalledWith(
        "event",
        "region_selected",
        expect.objectContaining({
          event_category: "navigation",
          region: "latam",
        }),
      );
    });
  });
});
