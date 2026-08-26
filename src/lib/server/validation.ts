import { z } from "zod";

import {
  availabilityOptions,
  basisOptions,
  engagementOptions,
  inquiryTypeOptions,
  seniorityOptions,
  specialtyOptions,
} from "@/lib/forms";

function valuesOf<T extends ReadonlyArray<{ value: string }>>(options: T) {
  return options.map((o) => o.value) as unknown as [T[number]["value"], ...T[number]["value"][]];
}

const specialtyValues = valuesOf(specialtyOptions);
const seniorityValues = valuesOf(seniorityOptions);
const basisValues = valuesOf(basisOptions);
const availabilityValues = valuesOf(availabilityOptions);
const inquiryTypeValues = valuesOf(inquiryTypeOptions);
const engagementValues = valuesOf(engagementOptions);

/** Blank string -> undefined, so optional fields don't fail their inner schema on "". */
function optional<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    schema.optional(),
  );
}

const name = z.string().trim().min(1, "Required").max(120);
const phone = z.string().trim().min(7, "Enter a valid phone number").max(30);
const email = z.string().trim().email("Enter a valid email address").max(200);

const optionalPhone = optional(z.string().trim().min(7, "Enter a valid phone number").max(30));

export const contactSchema = z.object({
  firstName: name,
  lastName: name,
  email,
  phone: optionalPhone,
  inquiryType: z.enum(inquiryTypeValues),
  message: optional(z.string().trim().max(500)),
});

export const requirementSchema = z.object({
  firstName: name,
  lastName: name,
  email,
  phone: optionalPhone,
  companyName: z.string().trim().min(1, "Required").max(200),
  skillNeeded: z.enum(specialtyValues),
  engagementType: z.enum(engagementValues),
  basis: z.enum(basisValues),
  message: optional(z.string().trim().max(1000)),
});

export const benchSchema = z.object({
  firstName: name,
  lastName: name,
  email,
  phone,
  location: z.string().trim().min(1, "Required").max(200),
  specialty: z.enum(specialtyValues),
  seniority: z.enum(seniorityValues),
  basis: z.enum(basisValues),
  expectedMonthlyRate: optional(
    z.coerce
      .number()
      .nonnegative("Enter a valid monthly rate")
      .max(1_000_000, "Enter a valid monthly rate"),
  ),
  availability: optional(z.enum(availabilityValues)),
  portfolioUrl: optional(z.string().trim().url("Enter a valid URL").max(500)),
  linkedinUrl: optional(z.string().trim().url("Enter a valid URL").max(500)),
  message: optional(z.string().trim().max(1000)),
});
