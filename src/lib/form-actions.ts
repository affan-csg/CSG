import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";

import { compensationTypeFor } from "@/lib/forms";
import { syncLeadToCrm } from "@/lib/server/crm";
import { sendNotificationEmail } from "@/lib/server/notify";
import { checkEmailRateLimit, checkIpRateLimit } from "@/lib/server/rate-limit";
import {
  insertCandidateApplication,
  insertClientRequirement,
  insertContactSubmission,
  uploadJobDescription,
  uploadResume,
} from "@/lib/server/submissions";
import { benchSchema, contactSchema, requirementSchema } from "@/lib/server/validation";

export type SubmitResult = { success: true; id: string } | { success: false; message: string };

const GENERIC_ERROR: SubmitResult = {
  success: false,
  message: "We could not process your submission right now. Please try again shortly.",
};

function clientIp(): string | undefined {
  try {
    return getRequestIP({ xForwardedFor: true }) ?? undefined;
  } catch {
    // Not running inside a request (e.g. a script/test) — degrade gracefully.
    return undefined;
  }
}

// --------------------------------------------------------- contact inquiries

export const submitContactForm = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as Record<string, unknown> & { honeypot?: string })
  .handler(async ({ data }): Promise<SubmitResult> => {
    const honeypot = String(data.honeypot ?? "");
    if (honeypot.length > 0) {
      // Bots fill every field. Report success without doing anything.
      return { success: true, id: "discarded" };
    }

    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        message: "Please correct the highlighted fields and try again.",
      };
    }

    try {
      const row = await insertContactSubmission({
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        email: parsed.data.email,
        phone: parsed.data.phone ?? "",
        inquiry_type: parsed.data.inquiryType,
        message: parsed.data.message ?? null,
        ip_address: clientIp() ?? null,
      });

      if (!row) {
        return {
          success: false,
          message: "We could not save your message right now. Please try again shortly.",
        };
      }

      await sendNotificationEmail(
        `New contact inquiry: ${parsed.data.firstName} ${parsed.data.lastName}`,
        [
          `Inquiry type: ${parsed.data.inquiryType}`,
          `Name: ${parsed.data.firstName} ${parsed.data.lastName}`,
          `Email: ${parsed.data.email}`,
          `Phone: ${parsed.data.phone ?? "(none given)"}`,
          "",
          parsed.data.message ?? "(no message)",
        ].join("\n"),
      );

      return { success: true, id: row.id };
    } catch (error) {
      console.error("submitContactForm failed", error);
      return GENERIC_ERROR;
    }
  });

// -------------------------------------------------------------- client intake

const MAX_JOB_DESCRIPTION_BYTES = 5 * 1024 * 1024;
const ALLOWED_JOB_DESCRIPTION_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const submitRequirementForm = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid submission");
    }
    return data;
  })
  .handler(async ({ data: formData }): Promise<SubmitResult> => {
    const honeypot = String(formData.get("honeypot") ?? "");
    if (honeypot.length > 0) {
      return { success: true, id: "discarded" };
    }

    const raw = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      companyName: formData.get("companyName"),
      skillsNeeded: formData.get("skillsNeeded"),
      skillOther: formData.get("skillOther"),
      numberOfHires: formData.get("numberOfHires"),
      engagement: formData.get("engagement"),
      workArrangement: formData.get("workArrangement"),
      locationOrTimezone: formData.get("locationOrTimezone"),
      targetStart: formData.get("targetStart"),
      topSkills: formData.get("topSkills"),
      seniority: formData.get("seniority"),
      budgetRate: formData.get("budgetRate"),
      regionPreference: formData.get("regionPreference"),
      message: formData.get("message"),
      utmSource: formData.get("utmSource"),
      utmMedium: formData.get("utmMedium"),
      utmCampaign: formData.get("utmCampaign"),
      referrer: formData.get("referrer"),
      sourcePage: formData.get("sourcePage"),
    };

    const parsed = requirementSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        message: "Please correct the highlighted fields and try again.",
      };
    }

    const jdEntry = formData.get("jobDescription");
    const jdFile = jdEntry instanceof File && jdEntry.size > 0 ? jdEntry : undefined;

    if (jdFile) {
      if (jdFile.size > MAX_JOB_DESCRIPTION_BYTES) {
        return { success: false, message: "Job description must be 5 MB or smaller." };
      }
      if (!ALLOWED_JOB_DESCRIPTION_TYPES.has(jdFile.type)) {
        return { success: false, message: "Job description must be a PDF or Word document." };
      }
    }

    try {
      const ip = clientIp();

      const emailLimit = await checkEmailRateLimit(parsed.data.email);
      if (!emailLimit.allowed) {
        return {
          success: false,
          message: "You've submitted several requests recently. Please try again in an hour.",
        };
      }

      if (ip) {
        const ipLimit = await checkIpRateLimit(ip);
        if (!ipLimit.allowed) {
          return {
            success: false,
            message: "Too many submissions from this network. Please try again later.",
          };
        }
      }

      let jdPath: string | null = null;
      if (jdFile) {
        jdPath = await uploadJobDescription(jdFile, parsed.data.email);
        if (!jdPath) {
          return {
            success: false,
            message: "We could not upload the job description right now. Please try again shortly.",
          };
        }
      }

      const row = await insertClientRequirement({
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        email: parsed.data.email,
        phone: parsed.data.phone ?? "",
        company_name: parsed.data.companyName,
        skill_needed: null,
        engagement_type: null,
        basis: null,
        skills_needed: parsed.data.skillsNeeded ?? null,
        skill_other: parsed.data.skillOther ?? null,
        number_of_hires: parsed.data.numberOfHires,
        engagement: parsed.data.engagement,
        work_arrangement: parsed.data.workArrangement,
        location_or_timezone: parsed.data.locationOrTimezone ?? null,
        target_start: parsed.data.targetStart,
        top_skills: parsed.data.topSkills,
        seniority: parsed.data.seniority,
        budget_rate: parsed.data.budgetRate ?? null,
        needs_budget_guidance: null,
        region_preference: parsed.data.regionPreference ?? null,
        job_description_url: jdPath,
        utm_source: parsed.data.utmSource ?? null,
        utm_medium: parsed.data.utmMedium ?? null,
        utm_campaign: parsed.data.utmCampaign ?? null,
        referrer: parsed.data.referrer ?? null,
        source_page: parsed.data.sourcePage ?? null,
        message: parsed.data.message ?? null,
        ip_address: ip ?? null,
      });

      if (!row) {
        return {
          success: false,
          message: "We could not save your requirement right now. Please try again shortly.",
        };
      }

      await syncLeadToCrm({
        email: parsed.data.email,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        companyName: parsed.data.companyName,
        phone: parsed.data.phone,
      });

      const skillsSummary =
        [parsed.data.skillsNeeded?.join(", "), parsed.data.skillOther]
          .filter(Boolean)
          .join(" / ") || "(none given)";

      await sendNotificationEmail(
        `New requirement: ${skillsSummary} (${parsed.data.companyName})`,
        [
          `Skills needed: ${skillsSummary}`,
          `Number of hires: ${parsed.data.numberOfHires}`,
          `Engagement: ${parsed.data.engagement}`,
          `Work arrangement: ${parsed.data.workArrangement}`,
          `Location/timezone: ${parsed.data.locationOrTimezone ?? "(none given)"}`,
          `Target start: ${parsed.data.targetStart}`,
          `Top must-have skills: ${parsed.data.topSkills}`,
          `Seniority: ${parsed.data.seniority}`,
          `Budget/rate: ${parsed.data.budgetRate ?? "(none given)"}`,
          `Region preference: ${parsed.data.regionPreference ?? "(none given)"}`,
          `Job description uploaded: ${jdPath ? "yes" : "no"}`,
          `Company: ${parsed.data.companyName}`,
          `Name: ${parsed.data.firstName} ${parsed.data.lastName}`,
          `Email: ${parsed.data.email}`,
          `Phone: ${parsed.data.phone ?? "(none given)"}`,
          `Source: ${[parsed.data.utmSource, parsed.data.utmMedium, parsed.data.utmCampaign].filter(Boolean).join(" / ") || "(direct)"}`,
          `Referrer: ${parsed.data.referrer ?? "(none)"}`,
          `Source page: ${parsed.data.sourcePage ?? "(none)"}`,
          "",
          parsed.data.message ?? "(no additional context)",
        ].join("\n"),
      );

      return { success: true, id: row.id };
    } catch (error) {
      console.error("submitRequirementForm failed", error);
      return GENERIC_ERROR;
    }
  });

// ---------------------------------------------------------- candidate intake

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const ALLOWED_RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const submitBenchApplication = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid submission");
    }
    return data;
  })
  .handler(async ({ data: formData }): Promise<SubmitResult> => {
    const honeypot = String(formData.get("honeypot") ?? "");
    if (honeypot.length > 0) {
      return { success: true, id: "discarded" };
    }

    const raw = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      location: formData.get("location"),
      specialty: formData.get("specialty"),
      seniority: formData.get("seniority"),
      basis: formData.get("basis"),
      region: formData.get("region"),
      workAuthorization: formData.get("workAuthorization"),
      workArrangement: formData.get("workArrangement"),
      compensationAmount: formData.get("compensationAmount"),
      availability: formData.get("availability"),
      portfolioUrl: formData.get("portfolioUrl"),
      linkedinUrl: formData.get("linkedinUrl"),
      message: formData.get("message"),
    };

    const parsed = benchSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        message: "Please correct the highlighted fields and try again.",
      };
    }

    const resumeEntry = formData.get("resume");
    const resumeFile =
      resumeEntry instanceof File && resumeEntry.size > 0 ? resumeEntry : undefined;

    if (resumeFile) {
      if (resumeFile.size > MAX_RESUME_BYTES) {
        return { success: false, message: "Résumé must be 5 MB or smaller." };
      }
      if (!ALLOWED_RESUME_TYPES.has(resumeFile.type)) {
        return { success: false, message: "Résumé must be a PDF or Word document." };
      }
    }

    try {
      const ip = clientIp();

      const emailLimit = await checkEmailRateLimit(parsed.data.email);
      if (!emailLimit.allowed) {
        return {
          success: false,
          message: "You've submitted several applications recently. Please try again in an hour.",
        };
      }

      if (ip) {
        const ipLimit = await checkIpRateLimit(ip);
        if (!ipLimit.allowed) {
          return {
            success: false,
            message: "Too many submissions from this network. Please try again later.",
          };
        }
      }

      let resumePath: string | null = null;
      if (resumeFile) {
        resumePath = await uploadResume(resumeFile, parsed.data.email);
        if (!resumePath) {
          return {
            success: false,
            message: "We could not upload your résumé right now. Please try again shortly.",
          };
        }
      }

      const compensationType = parsed.data.compensationAmount
        ? compensationTypeFor(parsed.data.region, parsed.data.basis)
        : null;

      const row = await insertCandidateApplication({
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        location: parsed.data.location,
        specialty: parsed.data.specialty,
        seniority: parsed.data.seniority,
        basis: parsed.data.basis,
        region: parsed.data.region,
        work_authorization: parsed.data.workAuthorization ?? null,
        work_arrangement: parsed.data.workArrangement,
        compensation_amount: parsed.data.compensationAmount ?? null,
        compensation_type: compensationType,
        resume_url: resumePath,
        availability: parsed.data.availability ?? null,
        portfolio_url: parsed.data.portfolioUrl ?? null,
        linkedin_url: parsed.data.linkedinUrl ?? null,
        message: parsed.data.message ?? null,
        ip_address: ip ?? null,
      });

      if (!row) {
        return {
          success: false,
          message: "We could not save your application right now. Please try again shortly.",
        };
      }

      await sendNotificationEmail(
        `New bench application: ${parsed.data.firstName} ${parsed.data.lastName} (${parsed.data.specialty})`,
        [
          `Specialty: ${parsed.data.specialty} / ${parsed.data.seniority}`,
          `Basis: ${parsed.data.basis}`,
          `Region: ${parsed.data.region}`,
          `Work authorization: ${parsed.data.workAuthorization ?? "(not applicable)"}`,
          `Work arrangement: ${parsed.data.workArrangement}`,
          `Location: ${parsed.data.location}`,
          `Compensation: ${parsed.data.compensationAmount ?? "(none given)"}${compensationType ? ` (${compensationType})` : ""}`,
          `Name: ${parsed.data.firstName} ${parsed.data.lastName}`,
          `Email: ${parsed.data.email}`,
          `Phone: ${parsed.data.phone}`,
          `Résumé uploaded: ${resumePath ? "yes" : "no"}`,
          `Portfolio: ${parsed.data.portfolioUrl ?? "(none)"}`,
          `LinkedIn: ${parsed.data.linkedinUrl ?? "(none)"}`,
          "",
          parsed.data.message ?? "(no message)",
        ].join("\n"),
      );

      return { success: true, id: row.id };
    } catch (error) {
      console.error("submitBenchApplication failed", error);
      return GENERIC_ERROR;
    }
  });
