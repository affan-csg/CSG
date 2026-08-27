import { describe, it, expect } from "vitest";
import { contactSchema, requirementSchema, benchSchema } from "@/lib/server/validation";

describe("contactSchema", () => {
  it("accepts valid contact form data", () => {
    const data = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "(555) 123-4567",
      inquiryType: "service_inquiry",
      message: "I need some help",
    };

    const result = contactSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(data);
    }
  });

  it("accepts contact form without message", () => {
    const data = {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      phone: "(555) 987-6543",
      inquiryType: "job_application",
      message: "",
    };

    const result = contactSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toBeUndefined();
    }
  });

  it("rejects invalid email", () => {
    const data = {
      firstName: "John",
      lastName: "Doe",
      email: "not-an-email",
      phone: "(555) 123-4567",
      inquiryType: "service_inquiry",
    };

    const result = contactSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects missing first name", () => {
    const data = {
      firstName: "",
      lastName: "Doe",
      email: "john@example.com",
      phone: "(555) 123-4567",
      inquiryType: "service_inquiry",
    };

    const result = contactSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects invalid phone (too short)", () => {
    const data = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "123",
      inquiryType: "service_inquiry",
    };

    const result = contactSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects phone exceeding max length", () => {
    const data = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "1".repeat(31),
      inquiryType: "service_inquiry",
    };

    const result = contactSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects invalid inquiry type", () => {
    const data = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "(555) 123-4567",
      inquiryType: "invalid_type",
    };

    const result = contactSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects message exceeding max length", () => {
    const data = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "(555) 123-4567",
      inquiryType: "service_inquiry",
      message: "x".repeat(501),
    };

    const result = contactSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("trims whitespace from string fields", () => {
    const data = {
      firstName: "  John  ",
      lastName: "  Doe  ",
      email: "  john@example.com  ",
      phone: "  (555) 123-4567  ",
      inquiryType: "service_inquiry",
    };

    const result = contactSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.firstName).toBe("John");
      expect(result.data.lastName).toBe("Doe");
      expect(result.data.email).toBe("john@example.com");
    }
  });
});

describe("requirementSchema", () => {
  const base = {
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@company.com",
    phone: "(555) 555-5555",
    companyName: "Acme Corp",
    skillsNeeded: "ai-ml,mlops",
    numberOfHires: 2,
    engagement: "contract",
    workArrangement: "remote",
    targetStart: "immediate",
    topSkills: "React, Node, AWS",
    seniority: "senior",
  };

  it("accepts valid requirement form data", () => {
    const result = requirementSchema.safeParse({ ...base, message: "Urgent hiring needed" });
    expect(result.success).toBe(true);
  });

  it("rejects requirement form without company name", () => {
    const result = requirementSchema.safeParse({ ...base, companyName: "" });
    expect(result.success).toBe(false);
  });

  it("accepts requirement form without phone", () => {
    const { phone, ...rest } = base;
    void phone;
    const result = requirementSchema.safeParse(rest);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBeUndefined();
    }
  });

  it("splits the comma-separated skills field into an array", () => {
    const result = requirementSchema.safeParse(base);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.skillsNeeded).toEqual(["ai-ml", "mlops"]);
    }
  });

  it("accepts skillOther in place of skillsNeeded", () => {
    const { skillsNeeded, ...rest } = base;
    void skillsNeeded;
    const result = requirementSchema.safeParse({ ...rest, skillOther: "Embedded firmware" });
    expect(result.success).toBe(true);
  });

  it("rejects when neither skillsNeeded nor skillOther is given", () => {
    const { skillsNeeded, ...rest } = base;
    void skillsNeeded;
    const result = requirementSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("validates all valid engagement values", () => {
    const values = ["contract", "contract-to-hire", "full-time", "pod", "unsure"];
    values.forEach((engagement) => {
      const result = requirementSchema.safeParse({ ...base, engagement });
      expect(result.success).toBe(true);
    });
  });

  it("requires locationOrTimezone for onsite/hybrid but not remote", () => {
    const onsite = requirementSchema.safeParse({ ...base, workArrangement: "onsite" });
    expect(onsite.success).toBe(false);

    const onsiteWithLocation = requirementSchema.safeParse({
      ...base,
      workArrangement: "onsite",
      locationOrTimezone: "Austin, TX",
    });
    expect(onsiteWithLocation.success).toBe(true);

    const remote = requirementSchema.safeParse({ ...base, workArrangement: "remote" });
    expect(remote.success).toBe(true);
  });

  it("rejects an invalid skill in skillsNeeded", () => {
    const result = requirementSchema.safeParse({ ...base, skillsNeeded: "invalid-skill" });
    expect(result.success).toBe(false);
  });

  it("rejects company name exceeding max length", () => {
    const result = requirementSchema.safeParse({ ...base, companyName: "x".repeat(201) });
    expect(result.success).toBe(false);
  });

  it("rejects message exceeding max length (1000)", () => {
    const result = requirementSchema.safeParse({ ...base, message: "x".repeat(1001) });
    expect(result.success).toBe(false);
  });

  it("rejects zero or negative number of hires", () => {
    const result = requirementSchema.safeParse({ ...base, numberOfHires: 0 });
    expect(result.success).toBe(false);
  });
});

describe("benchSchema", () => {
  const base = {
    firstName: "Bob",
    lastName: "Developer",
    email: "bob@example.com",
    phone: "(555) 555-5555",
    location: "San Francisco",
    specialty: "software-dev",
    seniority: "senior",
    basis: "contract",
    region: "us",
    workAuthorization: "us-citizen-or-green-card",
    workArrangement: "remote",
  };

  it("accepts valid bench application data", () => {
    const result = benchSchema.safeParse({
      ...base,
      compensationAmount: 15000,
      availability: "immediately",
      portfolioUrl: "https://portfolio.example.com",
      linkedinUrl: "https://linkedin.com/in/bob",
      message: "Ready to join",
    });
    expect(result.success).toBe(true);
  });

  it("coerces compensation amount to number", () => {
    const result = benchSchema.safeParse({ ...base, compensationAmount: "15000" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.compensationAmount).toBe(15000);
    }
  });

  it("requires work authorization for US applicants", () => {
    const { workAuthorization, ...rest } = base;
    void workAuthorization;
    const result = benchSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("does not require work authorization for LATAM/Pakistan applicants", () => {
    const { workAuthorization, ...rest } = base;
    void workAuthorization;
    const result = benchSchema.safeParse({ ...rest, region: "latam" });
    expect(result.success).toBe(true);
  });

  it("accepts bench application without optional fields", () => {
    const result = benchSchema.safeParse(base);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.compensationAmount).toBeUndefined();
      expect(result.data.portfolioUrl).toBeUndefined();
      expect(result.data.linkedinUrl).toBeUndefined();
      expect(result.data.message).toBeUndefined();
    }
  });

  it("validates all seniority levels", () => {
    const levels = ["junior", "mid-level", "senior", "lead", "principal"];

    levels.forEach((seniority) => {
      const result = benchSchema.safeParse({ ...base, seniority });
      expect(result.success).toBe(true);
    });
  });

  it("validates all availability options", () => {
    const options = ["immediately", "2-4-weeks", "1-3-months"];

    options.forEach((availability) => {
      const result = benchSchema.safeParse({ ...base, availability });
      expect(result.success).toBe(true);
    });
  });

  it("validates all work arrangement options", () => {
    const options = ["onsite", "hybrid", "remote"];

    options.forEach((workArrangement) => {
      const result = benchSchema.safeParse({ ...base, workArrangement });
      expect(result.success).toBe(true);
    });
  });

  it("rejects negative compensation amount", () => {
    const result = benchSchema.safeParse({ ...base, compensationAmount: -5000 });
    expect(result.success).toBe(false);
  });

  it("rejects compensation amount exceeding max (1_000_000)", () => {
    const result = benchSchema.safeParse({ ...base, compensationAmount: 1_000_001 });
    expect(result.success).toBe(false);
  });

  it("rejects invalid portfolio URL", () => {
    const result = benchSchema.safeParse({ ...base, portfolioUrl: "not-a-url" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid LinkedIn URL", () => {
    const result = benchSchema.safeParse({ ...base, linkedinUrl: "not-a-url" });
    expect(result.success).toBe(false);
  });

  it("rejects location exceeding max length", () => {
    const result = benchSchema.safeParse({ ...base, location: "x".repeat(201) });
    expect(result.success).toBe(false);
  });

  it("rejects missing required location", () => {
    const result = benchSchema.safeParse({ ...base, location: "" });
    expect(result.success).toBe(false);
  });
});
