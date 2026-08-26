import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";

import { syncLeadToCrm } from "@/lib/server/crm";
import { sendNotificationEmail } from "@/lib/server/notify";
import { checkEmailRateLimit, checkIpRateLimit } from "@/lib/server/rate-limit";
import {
  insertCandidateApplication,
  insertClientRequirement,
  insertContactSubmission,
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

export const submitRequirementForm = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as Record<string, unknown> & { honeypot?: string })
  .handler(async ({ data }): Promise<SubmitResult> => {
    const honeypot = String(data.honeypot ?? "");
    if (honeypot.length > 0) {
      return { success: true, id: "discarded" };
    }

    const parsed = requirementSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        message: "Please correct the highlighted fields and try again.",
      };
    }

    try {
      const ip = clientIp();

      const emailLimit = await checkEmailRateLimit(parsed.data.email);
      if (!emailLimit.allowed) {
        return {
          success: false,
          message: "You've submitted several requests recently — please try again in an hour.",
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

      const row = await insertClientRequirement({
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        email: parsed.data.email,
        phone: parsed.data.phone ?? "",
        company_name: parsed.data.companyName ?? null,
        skill_needed: parsed.data.skillNeeded,
        engagement_type: parsed.data.engagementType,
        basis: parsed.data.basis,
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

      await sendNotificationEmail(
        `New requirement: ${parsed.data.skillNeeded} (${parsed.data.companyName ?? "no company given"})`,
        [
          `Skill needed: ${parsed.data.skillNeeded}`,
          `Engagement: ${parsed.data.engagementType} / ${parsed.data.basis}`,
          `Company: ${parsed.data.companyName ?? "(none given)"}`,
          `Name: ${parsed.data.firstName} ${parsed.data.lastName}`,
          `Email: ${parsed.data.email}`,
          `Phone: ${parsed.data.phone ?? "(none given)"}`,
          "",
          parsed.data.message ?? "(no message)",
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
      expectedMonthlyRate: formData.get("expectedMonthlyRate"),
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
          message: "You've submitted several applications recently — please try again in an hour.",
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

      const row = await insertCandidateApplication({
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        location: parsed.data.location,
        specialty: parsed.data.specialty,
        seniority: parsed.data.seniority,
        basis: parsed.data.basis,
        expected_monthly_rate: parsed.data.expectedMonthlyRate ?? null,
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
          `Location: ${parsed.data.location}`,
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
