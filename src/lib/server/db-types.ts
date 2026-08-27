import type {
  availabilityOptions,
  basisOptions,
  candidateRegionOptions,
  compensationLabels,
  engagementOptions,
  engagementTermsOptions,
  inquiryTypeOptions,
  regionPreferenceOptions,
  seniorityOptions,
  specialtyOptions,
  targetStartOptions,
  workArrangementOptions,
  workAuthorizationOptions,
} from "@/lib/forms";

type ValueOf<T extends ReadonlyArray<{ value: string }>> = T[number]["value"];

export type SpecialtyValue = ValueOf<typeof specialtyOptions>;
export type SeniorityValue = ValueOf<typeof seniorityOptions>;
export type BasisValue = ValueOf<typeof basisOptions>;
export type AvailabilityValue = ValueOf<typeof availabilityOptions>;
export type InquiryTypeValue = ValueOf<typeof inquiryTypeOptions>;
/** Legacy engagement_type column (specialist/pod) — no longer written by the
 * rebuilt /get-started form, kept for reading historical rows. */
export type EngagementTypeValue = ValueOf<typeof engagementOptions>;
export type EngagementTermsValue = ValueOf<typeof engagementTermsOptions>;
export type WorkArrangementValue = ValueOf<typeof workArrangementOptions>;
export type TargetStartValue = ValueOf<typeof targetStartOptions>;
export type RegionPreferenceValue = ValueOf<typeof regionPreferenceOptions>;
export type CandidateRegionValue = ValueOf<typeof candidateRegionOptions>;
export type WorkAuthorizationValue = ValueOf<typeof workAuthorizationOptions>;
export type CompensationTypeValue = keyof typeof compensationLabels;

/** Mirrors client_requirements after 008_get_started_progressive_form.sql.
 * skill_needed/engagement_type/basis are legacy (pre-rebuild) columns, kept
 * nullable for historical rows — the current form no longer populates them. */
export type ClientRequirementRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  /** Required by requirementSchema (the app layer) but nullable at the DB
   * level — historical rows predate that requirement. See 008_*.sql. */
  company_name: string | null;
  skill_needed: SpecialtyValue | null;
  engagement_type: EngagementTypeValue | null;
  basis: BasisValue | null;
  skills_needed: SpecialtyValue[] | null;
  skill_other: string | null;
  number_of_hires: number | null;
  engagement: EngagementTermsValue | null;
  work_arrangement: WorkArrangementValue | null;
  location_or_timezone: string | null;
  target_start: TargetStartValue | null;
  top_skills: string | null;
  seniority: SeniorityValue | null;
  budget_rate: string | null;
  needs_budget_guidance: boolean | null;
  region_preference: RegionPreferenceValue | null;
  job_description_url: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
  source_page: string | null;
  message: string | null;
  ip_address: string | null;
  submitted_at: string;
  read_by_staff: boolean;
  archived_at: string | null;
};

export type ClientRequirementInsert = Omit<
  ClientRequirementRow,
  "id" | "submitted_at" | "read_by_staff" | "archived_at"
> & {
  id?: string;
  submitted_at?: string;
  read_by_staff?: boolean;
  archived_at?: string | null;
};

/** Mirrors candidate_applications after 009_bench_form_work_auth_compensation.sql. */
export type CandidateApplicationRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  specialty: SpecialtyValue;
  seniority: SeniorityValue | null;
  basis: BasisValue;
  region: CandidateRegionValue | null;
  work_authorization: WorkAuthorizationValue | null;
  work_arrangement: WorkArrangementValue | null;
  compensation_amount: number | null;
  compensation_type: CompensationTypeValue | null;
  resume_url: string | null;
  availability: AvailabilityValue | null;
  portfolio_url: string | null;
  linkedin_url: string | null;
  message: string | null;
  ip_address: string | null;
  applied_at: string;
  reviewed_by_staff: boolean;
  archived_at: string | null;
};

export type CandidateApplicationInsert = Omit<
  CandidateApplicationRow,
  "id" | "applied_at" | "reviewed_by_staff" | "archived_at"
> & {
  id?: string;
  applied_at?: string;
  reviewed_by_staff?: boolean;
  archived_at?: string | null;
};

export type ContactSubmissionRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  inquiry_type: InquiryTypeValue;
  message: string | null;
  ip_address: string | null;
  submitted_at: string;
  read_by_staff: boolean;
  archived_at: string | null;
};

export type ContactSubmissionInsert = Omit<
  ContactSubmissionRow,
  "id" | "submitted_at" | "read_by_staff" | "archived_at"
> & {
  id?: string;
  submitted_at?: string;
  read_by_staff?: boolean;
  archived_at?: string | null;
};

export type Database = {
  public: {
    Tables: {
      client_requirements: {
        Row: ClientRequirementRow;
        Insert: ClientRequirementInsert;
        Update: Partial<ClientRequirementInsert>;
        Relationships: [];
      };
      candidate_applications: {
        Row: CandidateApplicationRow;
        Insert: CandidateApplicationInsert;
        Update: Partial<CandidateApplicationInsert>;
        Relationships: [];
      };
      contact_submissions: {
        Row: ContactSubmissionRow;
        Insert: ContactSubmissionInsert;
        Update: Partial<ContactSubmissionInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
