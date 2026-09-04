import { z } from "zod";

import {
  availabilityOptions,
  basisOptions,
  candidateRegionOptions,
  engagementTermsOptions,
  inquiryTypeOptions,
  regionPreferenceOptions,
  seniorityOptions,
  specialtyOptions,
  targetStartOptions,
  workArrangementOptions,
  workAuthorizationOptions,
} from "@/lib/forms";

function valuesOf<T extends ReadonlyArray<{ value: string }>>(options: T) {
  return options.map((o) => o.value) as unknown as [T[number]["value"], ...T[number]["value"][]];
}

const specialtyValues = valuesOf(specialtyOptions);
const seniorityValues = valuesOf(seniorityOptions);
const basisValues = valuesOf(basisOptions);
const availabilityValues = valuesOf(availabilityOptions);
const inquiryTypeValues = valuesOf(inquiryTypeOptions);
const engagementTermsValues = valuesOf(engagementTermsOptions);
const workArrangementValues = valuesOf(workArrangementOptions);
const targetStartValues = valuesOf(targetStartOptions);
const regionPreferenceValues = valuesOf(regionPreferenceOptions);
const candidateRegionValues = valuesOf(candidateRegionOptions);
const workAuthorizationValues = valuesOf(workAuthorizationOptions);

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

// ---------------------------------------------------------------------------
// /get-started progressive form (implementation_plan.docx section 11.1/11.2)
// ---------------------------------------------------------------------------

/** Comma-separated on the wire (FormData can't carry a real array cleanly
 * alongside a file field) — split back into a list here. */
const skillsNeededField = z
  .string()
  .trim()
  .transform((v) =>
    v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  )
  .pipe(z.array(z.enum(specialtyValues)));

export const requirementSchema = z
  .object({
    firstName: name,
    lastName: name,
    email,
    phone: optionalPhone,
    companyName: z.string().trim().min(1, "Required").max(200),
    skillsNeeded: optional(skillsNeededField),
    skillOther: optional(z.string().trim().max(120)),
    numberOfHires: z.coerce.number().int().min(1, "Enter at least 1"),
    engagement: z.enum(engagementTermsValues),
    workArrangement: z.enum(workArrangementValues),
    locationOrTimezone: optional(z.string().trim().max(200)),
    targetStart: z.enum(targetStartValues),
    topSkills: z.string().trim().min(1, "Required").max(500),
    seniority: z.enum(seniorityValues),
    budgetRate: optional(z.string().trim().max(200)),
    regionPreference: optional(z.enum(regionPreferenceValues)),
    message: optional(z.string().trim().max(1000)),
    // Hidden — captured automatically, not user-entered.
    utmSource: optional(z.string().trim().max(200)),
    utmMedium: optional(z.string().trim().max(200)),
    utmCampaign: optional(z.string().trim().max(200)),
    referrer: optional(z.string().trim().max(500)),
    sourcePage: optional(z.string().trim().max(200)),
  })
  .superRefine((data, ctx) => {
    if ((!data.skillsNeeded || data.skillsNeeded.length === 0) && !data.skillOther) {
      ctx.addIssue({
        code: "custom",
        path: ["skillsNeeded"],
        message: "Select at least one skill, or describe it under Other",
      });
    }
    if (data.workArrangement !== "remote" && !data.locationOrTimezone) {
      ctx.addIssue({
        code: "custom",
        path: ["locationOrTimezone"],
        message: "Required for onsite or hybrid roles",
      });
    }
  });

// ---------------------------------------------------------------------------
// Join Our Bench form (implementation_plan.docx section 12)
// ---------------------------------------------------------------------------

export const benchSchema = z
  .object({
    firstName: name,
    lastName: name,
    email,
    phone,
    location: z.string().trim().min(1, "Required").max(200),
    specialty: z.enum(specialtyValues),
    seniority: z.enum(seniorityValues),
    basis: z.enum(basisValues),
    region: z.enum(candidateRegionValues),
    workAuthorization: optional(z.enum(workAuthorizationValues)),
    workArrangement: z.enum(workArrangementValues),
    compensationAmount: optional(
      z.coerce
        .number()
        .nonnegative("Enter a valid compensation figure")
        .max(1_000_000, "Enter a valid compensation figure"),
    ),
    availability: optional(z.enum(availabilityValues)),
    portfolioUrl: optional(z.string().trim().url("Enter a valid URL").max(500)),
    linkedinUrl: optional(z.string().trim().url("Enter a valid URL").max(500)),
    message: optional(z.string().trim().max(1000)),
  })
  .superRefine((data, ctx) => {
    if (data.region === "us" && !data.workAuthorization) {
      ctx.addIssue({
        code: "custom",
        path: ["workAuthorization"],
        message: "Required for US applicants",
      });
    }
  });
