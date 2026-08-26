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
  it("accepts valid requirement form data", () => {
    const data = {
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@company.com",
      phone: "(555) 555-5555",
      companyName: "Acme Corp",
      skillNeeded: "ai-ml",
      engagementType: "specialist",
      basis: "contract",
      message: "Urgent hiring needed",
    };

    const result = requirementSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("rejects requirement form without company name", () => {
    const data = {
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@company.com",
      phone: "(555) 555-5555",
      companyName: "",
      skillNeeded: "devops",
      engagementType: "pod",
      basis: "full-time",
    };

    const result = requirementSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("accepts requirement form without phone", () => {
    const data = {
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@company.com",
      companyName: "Acme Inc.",
      skillNeeded: "devops",
      engagementType: "pod",
      basis: "full-time",
    };

    const result = requirementSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBeUndefined();
    }
  });

  it("validates all valid specialty options", () => {
    const specialties = [
      "ai-ml",
      "mlops",
      "data",
      "devops",
      "devsecops",
      "cloud",
      "software-dev",
      "product",
    ];

    specialties.forEach((skill) => {
      const result = requirementSchema.safeParse({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "(555) 123-4567",
        companyName: "Acme Inc.",
        skillNeeded: skill,
        engagementType: "specialist",
        basis: "contract",
      });
      expect(result.success).toBe(true);
    });
  });

  it("validates all valid engagement types", () => {
    const types = ["specialist", "pod"];

    types.forEach((type) => {
      const result = requirementSchema.safeParse({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "(555) 123-4567",
        companyName: "Acme Inc.",
        skillNeeded: "ai-ml",
        engagementType: type,
        basis: "contract",
      });
      expect(result.success).toBe(true);
    });
  });

  it("validates all valid basis options", () => {
    const bases = ["contract", "full-time", "open"];

    bases.forEach((basis) => {
      const result = requirementSchema.safeParse({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "(555) 123-4567",
        companyName: "Acme Inc.",
        skillNeeded: "ai-ml",
        engagementType: "specialist",
        basis,
      });
      expect(result.success).toBe(true);
    });
  });

  it("rejects invalid skill", () => {
    const data = {
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@company.com",
      phone: "(555) 555-5555",
      skillNeeded: "invalid-skill",
      engagementType: "specialist",
      basis: "contract",
    };

    const result = requirementSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects company name exceeding max length", () => {
    const data = {
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@company.com",
      phone: "(555) 555-5555",
      companyName: "x".repeat(201),
      skillNeeded: "ai-ml",
      engagementType: "specialist",
      basis: "contract",
    };

    const result = requirementSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects message exceeding max length (1000)", () => {
    const data = {
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@company.com",
      phone: "(555) 555-5555",
      skillNeeded: "ai-ml",
      engagementType: "specialist",
      basis: "contract",
      message: "x".repeat(1001),
    };

    const result = requirementSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe("benchSchema", () => {
  it("accepts valid bench application data", () => {
    const data = {
      firstName: "Bob",
      lastName: "Developer",
      email: "bob@example.com",
      phone: "(555) 555-5555",
      location: "San Francisco",
      specialty: "software-dev",
      seniority: "senior",
      basis: "contract",
      expectedMonthlyRate: 15000,
      availability: "immediately",
      portfolioUrl: "https://portfolio.example.com",
      linkedinUrl: "https://linkedin.com/in/bob",
      message: "Ready to join",
    };

    const result = benchSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("coerces monthly rate to number", () => {
    const data = {
      firstName: "Bob",
      lastName: "Developer",
      email: "bob@example.com",
      phone: "(555) 555-5555",
      location: "San Francisco",
      specialty: "software-dev",
      seniority: "senior",
      basis: "contract",
      expectedMonthlyRate: "15000",
      availability: "immediately",
    };

    const result = benchSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.expectedMonthlyRate).toBe(15000);
    }
  });

  it("accepts bench application without optional fields", () => {
    const data = {
      firstName: "Bob",
      lastName: "Developer",
      email: "bob@example.com",
      phone: "(555) 555-5555",
      location: "San Francisco",
      specialty: "ai-ml",
      seniority: "junior",
      basis: "full-time",
    };

    const result = benchSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.expectedMonthlyRate).toBeUndefined();
      expect(result.data.portfolioUrl).toBeUndefined();
      expect(result.data.linkedinUrl).toBeUndefined();
      expect(result.data.message).toBeUndefined();
    }
  });

  it("validates all seniority levels", () => {
    const levels = ["junior", "mid-level", "senior", "lead", "principal"];

    levels.forEach((level) => {
      const result = benchSchema.safeParse({
        firstName: "Bob",
        lastName: "Developer",
        email: "bob@example.com",
        phone: "(555) 555-5555",
        location: "San Francisco",
        specialty: "software-dev",
        seniority: level,
        basis: "contract",
      });
      expect(result.success).toBe(true);
    });
  });

  it("validates all availability options", () => {
    const options = ["immediately", "2-4-weeks", "1-3-months"];

    options.forEach((avail) => {
      const result = benchSchema.safeParse({
        firstName: "Bob",
        lastName: "Developer",
        email: "bob@example.com",
        phone: "(555) 555-5555",
        location: "San Francisco",
        specialty: "software-dev",
        seniority: "senior",
        basis: "contract",
        availability: avail,
      });
      expect(result.success).toBe(true);
    });
  });

  it("rejects negative monthly rate", () => {
    const data = {
      firstName: "Bob",
      lastName: "Developer",
      email: "bob@example.com",
      phone: "(555) 555-5555",
      location: "San Francisco",
      specialty: "software-dev",
      seniority: "senior",
      basis: "contract",
      expectedMonthlyRate: -5000,
    };

    const result = benchSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects monthly rate exceeding max (1_000_000)", () => {
    const data = {
      firstName: "Bob",
      lastName: "Developer",
      email: "bob@example.com",
      phone: "(555) 555-5555",
      location: "San Francisco",
      specialty: "software-dev",
      seniority: "senior",
      basis: "contract",
      expectedMonthlyRate: 1_000_001,
    };

    const result = benchSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects invalid portfolio URL", () => {
    const data = {
      firstName: "Bob",
      lastName: "Developer",
      email: "bob@example.com",
      phone: "(555) 555-5555",
      location: "San Francisco",
      specialty: "software-dev",
      seniority: "senior",
      basis: "contract",
      portfolioUrl: "not-a-url",
    };

    const result = benchSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects invalid LinkedIn URL", () => {
    const data = {
      firstName: "Bob",
      lastName: "Developer",
      email: "bob@example.com",
      phone: "(555) 555-5555",
      location: "San Francisco",
      specialty: "software-dev",
      seniority: "senior",
      basis: "contract",
      linkedinUrl: "not-a-url",
    };

    const result = benchSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects location exceeding max length", () => {
    const data = {
      firstName: "Bob",
      lastName: "Developer",
      email: "bob@example.com",
      phone: "(555) 555-5555",
      location: "x".repeat(201),
      specialty: "software-dev",
      seniority: "senior",
      basis: "contract",
    };

    const result = benchSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects missing required location", () => {
    const data = {
      firstName: "Bob",
      lastName: "Developer",
      email: "bob@example.com",
      phone: "(555) 555-5555",
      location: "",
      specialty: "software-dev",
      seniority: "senior",
      basis: "contract",
    };

    const result = benchSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});
