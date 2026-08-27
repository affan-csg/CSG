import { describe, it, expect } from "vitest";
import {
  specialtyOptions,
  seniorityOptions,
  engagementOptions,
  basisOptions,
  availabilityOptions,
  inquiryTypeOptions,
  engagementTermsOptions,
  workArrangementOptions,
  targetStartOptions,
  regionPreferenceOptions,
  candidateRegionOptions,
  workAuthorizationOptions,
  compensationTypeFor,
} from "./forms";

describe("Form Options", () => {
  describe("specialtyOptions", () => {
    it("should export specialty options", () => {
      expect(Array.isArray(specialtyOptions)).toBe(true);
      expect(specialtyOptions.length).toBeGreaterThan(0);
    });

    it("should have valid structure", () => {
      specialtyOptions.forEach((option) => {
        expect(option).toHaveProperty("value");
        expect(option).toHaveProperty("label");
        expect(typeof option.value).toBe("string");
        expect(typeof option.label).toBe("string");
      });
    });

    it("should include AI/ML engineer option", () => {
      const option = specialtyOptions.find((o) => o.value === "ai-ml");
      expect(option).toBeDefined();
      expect(option?.label).toBe("AI/ML Engineer");
    });

    it("should have unique values", () => {
      const values = specialtyOptions.map((o) => o.value);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });
  });

  describe("seniorityOptions", () => {
    it("should export seniority options", () => {
      expect(Array.isArray(seniorityOptions)).toBe(true);
      expect(seniorityOptions.length).toBeGreaterThan(0);
    });

    it("should have valid structure", () => {
      seniorityOptions.forEach((option) => {
        expect(option).toHaveProperty("value");
        expect(option).toHaveProperty("label");
      });
    });

    it("should include all seniority levels", () => {
      const values = seniorityOptions.map((o) => o.value);
      expect(values).toContain("junior");
      expect(values).toContain("mid-level");
      expect(values).toContain("senior");
      expect(values).toContain("lead");
      expect(values).toContain("principal");
    });
  });

  describe("engagementOptions", () => {
    it("should export engagement options", () => {
      expect(Array.isArray(engagementOptions)).toBe(true);
      expect(engagementOptions.length).toBe(2);
    });

    it("should include specialist and pod options", () => {
      const values = engagementOptions.map((o) => o.value);
      expect(values).toContain("specialist");
      expect(values).toContain("pod");
    });
  });

  describe("basisOptions", () => {
    it("should export basis options", () => {
      expect(Array.isArray(basisOptions)).toBe(true);
      expect(basisOptions.length).toBeGreaterThan(0);
    });

    it("should include all basis types", () => {
      const values = basisOptions.map((o) => o.value);
      expect(values).toContain("contract");
      expect(values).toContain("full-time");
      expect(values).toContain("open");
    });
  });

  describe("availabilityOptions", () => {
    it("should export availability options", () => {
      expect(Array.isArray(availabilityOptions)).toBe(true);
      expect(availabilityOptions.length).toBeGreaterThan(0);
    });

    it("should include all availability types", () => {
      const values = availabilityOptions.map((o) => o.value);
      expect(values).toContain("immediately");
      expect(values).toContain("2-4-weeks");
      expect(values).toContain("1-3-months");
    });
  });

  describe("inquiryTypeOptions", () => {
    it("should export inquiry type options", () => {
      expect(Array.isArray(inquiryTypeOptions)).toBe(true);
      expect(inquiryTypeOptions.length).toBeGreaterThan(0);
    });

    it("should include all inquiry types", () => {
      const values = inquiryTypeOptions.map((o) => o.value);
      expect(values).toContain("service_inquiry");
      expect(values).toContain("job_application");
      expect(values).toContain("general");
    });

    it("should have descriptive labels", () => {
      const option = inquiryTypeOptions.find((o) => o.value === "service_inquiry");
      expect(option?.label).toBe("I need to hire talent");
    });
  });

  describe("engagementTermsOptions", () => {
    it("should include all five brief-specified engagement terms", () => {
      const values = engagementTermsOptions.map((o) => o.value);
      expect(values).toEqual(["contract", "contract-to-hire", "full-time", "pod", "unsure"]);
    });
  });

  describe("workArrangementOptions", () => {
    it("should include onsite, hybrid, remote", () => {
      const values = workArrangementOptions.map((o) => o.value);
      expect(values).toEqual(["onsite", "hybrid", "remote"]);
    });
  });

  describe("targetStartOptions", () => {
    it("should include all four brief-specified start options", () => {
      const values = targetStartOptions.map((o) => o.value);
      expect(values).toEqual(["immediate", "2-4-weeks", "1-3-months", "planning"]);
    });
  });

  describe("regionPreferenceOptions", () => {
    it("should include us, latam, pakistan, recommend", () => {
      const values = regionPreferenceOptions.map((o) => o.value);
      expect(values).toEqual(["us", "latam", "pakistan", "recommend"]);
    });
  });

  describe("candidateRegionOptions", () => {
    it("should include us, latam, pakistan", () => {
      const values = candidateRegionOptions.map((o) => o.value);
      expect(values).toEqual(["us", "latam", "pakistan"]);
    });
  });

  describe("workAuthorizationOptions", () => {
    it("should export three work authorization categories", () => {
      expect(workAuthorizationOptions.length).toBe(3);
    });
  });

  describe("compensationTypeFor", () => {
    it("asks for annual salary for US full-time", () => {
      expect(compensationTypeFor("us", "full-time")).toBe("annual-salary");
    });

    it("asks for hourly rate for US contract", () => {
      expect(compensationTypeFor("us", "contract")).toBe("hourly");
    });

    it("asks for hourly rate for US 'open to either'", () => {
      expect(compensationTypeFor("us", "open")).toBe("hourly");
    });

    it("asks for monthly rate for LATAM regardless of basis", () => {
      expect(compensationTypeFor("latam", "full-time")).toBe("monthly");
      expect(compensationTypeFor("latam", "contract")).toBe("monthly");
    });

    it("asks for monthly rate for Pakistan regardless of basis", () => {
      expect(compensationTypeFor("pakistan", "contract")).toBe("monthly");
    });
  });
});
