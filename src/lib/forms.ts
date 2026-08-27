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
  skillNeeded: string;
  engagementType: string;
  basis: string;
  message: string;
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
  expectedMonthlyRate: string;
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
