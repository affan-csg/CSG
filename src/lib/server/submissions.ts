import { getSupabaseAdmin } from "@/lib/server/supabase-admin";
import type {
  CandidateApplicationInsert,
  CandidateApplicationRow,
  ClientRequirementInsert,
  ClientRequirementRow,
  ContactSubmissionInsert,
  ContactSubmissionRow,
} from "@/lib/server/db-types";

/** Private Supabase Storage bucket. Already provisioned on the live project. */
export const RESUME_BUCKET = "resumes";

/** Private Storage bucket for the /get-started form's optional job-description
 * upload — provisioned by 008_get_started_progressive_form.sql. */
export const JOB_DESCRIPTION_BUCKET = "job-descriptions";

// ------------------------------------------------------------- client intake

export async function insertClientRequirement(
  data: ClientRequirementInsert,
): Promise<ClientRequirementRow | null> {
  const { data: row, error } = await getSupabaseAdmin()
    .from("client_requirements")
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error("insertClientRequirement failed", error);
    return null;
  }

  return row;
}

// ---------------------------------------------------------- candidate intake

export async function insertCandidateApplication(
  data: CandidateApplicationInsert,
): Promise<CandidateApplicationRow | null> {
  const { data: row, error } = await getSupabaseAdmin()
    .from("candidate_applications")
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error("insertCandidateApplication failed", error);
    return null;
  }

  return row;
}

/**
 * Uploads a résumé to the private Storage bucket and returns its object path
 * (not a public URL — résumés are personal data; staff read them through a
 * short-lived signed URL generated at read time).
 */
export async function uploadResume(file: File, applicantEmail: string): Promise<string | null> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "pdf";
  const path = `${crypto.randomUUID()}-${applicantEmail.replace(/[^a-z0-9]/gi, "_")}.${extension}`;

  const { error } = await getSupabaseAdmin()
    .storage.from(RESUME_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    console.error("uploadResume failed", error);
    return null;
  }

  return path;
}

/**
 * Uploads a job description to the private Storage bucket and returns its
 * object path (not a public URL) — mirrors uploadResume above.
 */
export async function uploadJobDescription(
  file: File,
  submitterEmail: string,
): Promise<string | null> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "pdf";
  const path = `${crypto.randomUUID()}-${submitterEmail.replace(/[^a-z0-9]/gi, "_")}.${extension}`;

  const { error } = await getSupabaseAdmin()
    .storage.from(JOB_DESCRIPTION_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    console.error("uploadJobDescription failed", error);
    return null;
  }

  return path;
}

/** Short-lived signed URL for staff to read a résumé — never a public link. */
export async function getResumeSignedUrl(
  path: string,
  expiresInSeconds = 3600,
): Promise<string | null> {
  const { data, error } = await getSupabaseAdmin()
    .storage.from(RESUME_BUCKET)
    .createSignedUrl(path, expiresInSeconds);

  if (error) {
    console.error("getResumeSignedUrl failed", error);
    return null;
  }

  return data.signedUrl;
}

// --------------------------------------------------------- contact inquiries

export async function insertContactSubmission(
  data: ContactSubmissionInsert,
): Promise<ContactSubmissionRow | null> {
  const { data: row, error } = await getSupabaseAdmin()
    .from("contact_submissions")
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error("insertContactSubmission failed", error);
    return null;
  }

  return row;
}

// -------------------------------------------------------------- rate limiting

export async function countRecentClientRequirementsByEmail(
  email: string,
  withinHours = 1,
): Promise<number> {
  const since = new Date(Date.now() - withinHours * 60 * 60 * 1000).toISOString();

  const { count, error } = await getSupabaseAdmin()
    .from("client_requirements")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("submitted_at", since);

  if (error) {
    console.error("countRecentClientRequirementsByEmail failed", error);
    return 0;
  }

  return count ?? 0;
}

export async function countRecentApplicationsByEmail(
  email: string,
  withinHours = 1,
): Promise<number> {
  const since = new Date(Date.now() - withinHours * 60 * 60 * 1000).toISOString();

  const { count, error } = await getSupabaseAdmin()
    .from("candidate_applications")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("applied_at", since);

  if (error) {
    console.error("countRecentApplicationsByEmail failed", error);
    return 0;
  }

  return count ?? 0;
}

export async function countRecentClientRequirementsByIp(
  ip: string,
  withinHours = 1,
): Promise<number> {
  const since = new Date(Date.now() - withinHours * 60 * 60 * 1000).toISOString();

  const { count, error } = await getSupabaseAdmin()
    .from("client_requirements")
    .select("id", { count: "exact", head: true })
    .eq("ip_address", ip)
    .gte("submitted_at", since);

  if (error) {
    console.error("countRecentClientRequirementsByIp failed", error);
    return 0;
  }

  return count ?? 0;
}

export async function countRecentApplicationsByIp(ip: string, withinHours = 1): Promise<number> {
  const since = new Date(Date.now() - withinHours * 60 * 60 * 1000).toISOString();

  const { count, error } = await getSupabaseAdmin()
    .from("candidate_applications")
    .select("id", { count: "exact", head: true })
    .eq("ip_address", ip)
    .gte("applied_at", since);

  if (error) {
    console.error("countRecentApplicationsByIp failed", error);
    return 0;
  }

  return count ?? 0;
}
