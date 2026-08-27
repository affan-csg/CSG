export type FormStatus = "idle" | "submitting" | "success" | "error";

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
}

export interface RequirementFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  skillsNeeded: string[];
  skillOther: string;
  numberOfHires: string;
  engagement: string;
  workArrangement: string;
  locationOrTimezone: string;
  targetStart: string;
  topSkills: string;
  seniority: string;
  budgetRate: string;
  needsBudgetGuidance: boolean;
  regionPreference: string;
  jobDescription?: File;
  message: string;
  // Hidden, captured automatically — see requirement-form.tsx.
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  referrer: string;
  sourcePage: string;
}

export interface BenchFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  specialty: string;
  seniority: string;
  basis: string;
  region: string;
  workAuthorization: string;
  workArrangement: string;
  compensationAmount: string;
  availability: string;
  portfolioUrl: string;
  linkedinUrl: string;
  resume?: File;
  message: string;
}

export const specialtyOptions = [
  { value: "ai-ml", label: "AI/ML Engineer" },
  { value: "mlops", label: "MLOps Engineer" },
  { value: "data", label: "Data Engineer / Data Scientist" },
  { value: "devops", label: "DevOps Engineer" },
  { value: "devsecops", label: "DevSecOps / Platform Engineer" },
  { value: "cloud", label: "Cloud Engineer / Architect" },
  { value: "software-dev", label: "Software Engineer" },
  { value: "product", label: "Product / Project Manager" },
  { value: "cybersecurity-grc", label: "Cybersecurity / GRC" },
] as const;

export const seniorityOptions = [
  { value: "junior", label: "Junior" },
  { value: "mid-level", label: "Mid-Level" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
  { value: "principal", label: "Principal" },
] as const;

export const engagementOptions = [
  { value: "specialist", label: "A single specialist" },
  { value: "pod", label: "A consulting pod" },
] as const;

export const basisOptions = [
  { value: "contract", label: "Contract" },
  { value: "full-time", label: "Full-time" },
  { value: "open", label: "Open to either" },
] as const;

export const availabilityOptions = [
  { value: "immediately", label: "Immediately" },
  { value: "2-4-weeks", label: "2–4 weeks" },
  { value: "1-3-months", label: "1–3 months" },
] as const;

export const inquiryTypeOptions = [
  { value: "service_inquiry", label: "I need to hire talent" },
  { value: "job_application", label: "I'm looking for work" },
  { value: "general", label: "Something else" },
] as const;

// --- /get-started progressive form (implementation_plan.docx section 11.1) --

/** Brief's "Engagement" field — distinct from the legacy engagementOptions
 * (specialist/pod) above, which the new form no longer collects. */
export const engagementTermsOptions = [
  { value: "contract", label: "Contract" },
  { value: "contract-to-hire", label: "Contract-to-hire" },
  { value: "full-time", label: "Full-time" },
  { value: "pod", label: "Pod" },
  { value: "unsure", label: "Not sure yet" },
] as const;

/** Shared by the employer form (work arrangement for the role) and the
 * candidate form (candidate's own preference). */
export const workArrangementOptions = [
  { value: "onsite", label: "Onsite" },
  { value: "hybrid", label: "Hybrid" },
  { value: "remote", label: "Remote" },
] as const;

export const targetStartOptions = [
  { value: "immediate", label: "Immediate" },
  { value: "2-4-weeks", label: "2–4 weeks" },
  { value: "1-3-months", label: "1–3 months" },
  { value: "planning", label: "Just planning ahead" },
] as const;

export const regionPreferenceOptions = [
  { value: "us", label: "United States" },
  { value: "latam", label: "LATAM" },
  { value: "pakistan", label: "Pakistan" },
  { value: "recommend", label: "Recommend a region for me" },
] as const;

// --- Join Our Bench form additions (implementation_plan.docx section 12) ---

/** Candidate's own region — drives which compensation question is asked. */
export const candidateRegionOptions = [
  { value: "us", label: "United States" },
  { value: "latam", label: "LATAM" },
  { value: "pakistan", label: "Pakistan" },
] as const;

export const workAuthorizationOptions = [
  { value: "us-citizen-or-green-card", label: "US Citizen or Green Card holder" },
  { value: "authorized-no-sponsorship", label: "Authorized to work without sponsorship" },
  { value: "requires-sponsorship", label: "Requires visa sponsorship" },
] as const;

export type CompensationType = "hourly" | "annual-salary" | "monthly";

/** Brief section 12: "hourly rate, annual salary or monthly compensation
 * conditionally by region/engagement — not one universal monthly USD field."
 * US full-time asks salary; US contract/open asks hourly; LATAM/Pakistan
 * (contract-only regions) ask monthly, matching how those rates are quoted
 * everywhere else on the site. */
export function compensationTypeFor(region: string, basis: string): CompensationType {
  if (region === "us") {
    return basis === "full-time" ? "annual-salary" : "hourly";
  }
  return "monthly";
}

export const compensationLabels: Record<CompensationType, string> = {
  hourly: "Expected hourly rate (USD)",
  "annual-salary": "Expected annual salary (USD)",
  monthly: "Expected monthly rate (USD)",
};
