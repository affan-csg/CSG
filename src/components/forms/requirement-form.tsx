import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import {
  type RequirementFormData,
  engagementTermsOptions,
  regionPreferenceOptions,
  seniorityOptions,
  specialtyOptions,
  targetStartOptions,
  workArrangementOptions,
} from "@/lib/forms";
import { submitRequirementForm } from "@/lib/form-actions";
import { useFormSubmit } from "@/lib/use-form-submit";
import {
  FormError,
  FormSuccess,
  Honeypot,
  SelectField,
  SubmitButton,
  TextAreaField,
  TextField,
} from "@/components/site/form-controls";

interface RequirementFormProps {
  defaultSkill?: string | undefined;
  className?: string;
}

function makeInitialData(defaultSkill?: string): RequirementFormData {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    skillsNeeded: defaultSkill ? [defaultSkill] : [],
    skillOther: "",
    numberOfHires: "1",
    engagement: "",
    workArrangement: "",
    locationOrTimezone: "",
    targetStart: "",
    topSkills: "",
    seniority: "",
    budgetRate: "",
    regionPreference: "",
    message: "",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    referrer: "",
    sourcePage: "",
  };
}

const CALENDLY_URL = (import.meta.env as unknown as Record<string, string | undefined>)[
  "NEXT_PUBLIC_CALENDLY_URL"
];

export function RequirementForm({ defaultSkill, className }: RequirementFormProps) {
  const { status, setStatus, errorMessage, formData, setFormData, handleChange, submit } =
    useFormSubmit<RequirementFormData>(makeInitialData(defaultSkill));
  const [step, setStep] = useState(1);
  const [stepError, setStepError] = useState("");
  const [showOtherSkill, setShowOtherSkill] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Capture UTM/referrer/source-page once on mount (implementation_plan.docx
  // section 11.2) — client-only, so this runs post-hydration, never during SSR.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFormData((prev) => ({
      ...prev,
      utmSource: params.get("utm_source") ?? "",
      utmMedium: params.get("utm_medium") ?? "",
      utmCampaign: params.get("utm_campaign") ?? "",
      referrer: document.referrer,
      sourcePage: window.location.pathname,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleSkill(value: string) {
    setFormData((prev) => ({
      ...prev,
      skillsNeeded: prev.skillsNeeded.includes(value)
        ? prev.skillsNeeded.filter((s) => s !== value)
        : [...prev.skillsNeeded, value],
    }));
  }

  function validateStep(current: number): string {
    if (current === 1) {
      if (!formData.firstName.trim()) return "First name is required.";
      if (!formData.lastName.trim()) return "Last name is required.";
      if (!formData.email.trim()) return "Work email is required.";
      if (!formData.companyName.trim()) return "Company name is required.";
    }
    if (current === 2) {
      if (formData.skillsNeeded.length === 0 && !formData.skillOther.trim()) {
        return "Select at least one skill, or describe it under Other.";
      }
      if (!formData.numberOfHires || Number(formData.numberOfHires) < 1) {
        return "Enter the number of hires.";
      }
      if (!formData.engagement) return "Select an engagement type.";
      if (!formData.workArrangement) return "Select a work arrangement.";
      if (formData.workArrangement !== "remote" && !formData.locationOrTimezone.trim()) {
        return "Location or time zone is required for onsite or hybrid roles.";
      }
      if (!formData.targetStart) return "Select a target start.";
    }
    if (current === 3) {
      const skillCount = formData.topSkills
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean).length;
      if (skillCount < 3) {
        return "List at least three must-have skills, separated by commas.";
      }
      if (!formData.seniority) return "Select a seniority level.";
    }
    return "";
  }

  function goNext() {
    const error = validateStep(step);
    if (error) {
      setStepError(error);
      return;
    }
    setStepError("");
    setStep((s) => Math.min(s + 1, 3));
  }

  function goBack() {
    setStepError("");
    setStep((s) => Math.max(s - 1, 1));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateStep(3) || validateStep(2) || validateStep(1);
    if (error) {
      setStepError(error);
      return;
    }

    void submit(() => {
      const payload = new FormData();
      for (const [key, value] of Object.entries(formData)) {
        if (key === "jobDescription") continue;
        if (key === "skillsNeeded") {
          payload.set(key, (value as string[]).join(","));
          continue;
        }
        payload.set(key, (value as string) ?? "");
      }
      if (formData.jobDescription) {
        payload.set("jobDescription", formData.jobDescription);
      }
      payload.set("honeypot", honeypotRef.current?.value ?? "");

      return submitRequirementForm({ data: payload });
    }, makeInitialData(defaultSkill));
  };

  if (status === "success") {
    return (
      <div className="space-y-4">
        <FormSuccess
          title="Thank you."
          message="We will review your requirement and respond within one business day."
          resetLabel="Submit another requirement"
          onReset={() => {
            setStatus("idle");
            setStep(1);
          }}
        />
        {CALENDLY_URL ? (
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-md border border-border px-6 py-3.5 text-center button-text text-foreground transition-all duration-300 hover:border-gold hover:text-gold"
          >
            Skip the wait, book a 20-minute call
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "space-y-5 rounded-2xl border border-white/10 bg-card p-8 shadow-2xl shadow-black/60",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="form-label-small text-muted-foreground">Step {step} of 3</p>
        <div className="flex gap-1.5">
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className={cn(
                "h-1.5 w-8 rounded-full transition-colors",
                s <= step ? "bg-gold" : "bg-white/10",
              )}
            />
          ))}
        </div>
      </div>

      {step === 1 ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="First name"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Jane"
              autoComplete="given-name"
            />
            <TextField
              label="Last name"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              autoComplete="family-name"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Work email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="jane@company.com"
              autoComplete="email"
            />
            <TextField
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(443) 875-9677"
              autoComplete="tel"
            />
          </div>

          <TextField
            label="Company name"
            name="companyName"
            required
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Acme Inc."
            autoComplete="organization"
          />
        </>
      ) : null}

      {step === 2 ? (
        <>
          <div>
            <p className="form-label-small mb-2 text-muted-foreground">
              Role or skill <span className="text-gold">*</span>
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {specialtyOptions.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-foreground transition-colors hover:border-white/25"
                >
                  <input
                    type="checkbox"
                    checked={formData.skillsNeeded.includes(opt.value)}
                    onChange={() => toggleSkill(opt.value)}
                    className="h-4 w-4 accent-gold"
                  />
                  {opt.label}
                </label>
              ))}
              <label className="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-foreground transition-colors hover:border-white/25">
                <input
                  type="checkbox"
                  checked={showOtherSkill}
                  onChange={() => {
                    setShowOtherSkill((prev) => {
                      const next = !prev;
                      if (!next) {
                        setFormData((p) => ({ ...p, skillOther: "" }));
                      }
                      return next;
                    });
                  }}
                  className="h-4 w-4 accent-gold"
                />
                Other (Not Listed Above)
              </label>
            </div>
            {showOtherSkill ? (
              <TextField
                label="Describe the skill"
                name="skillOther"
                value={formData.skillOther}
                onChange={handleChange}
                placeholder="Describe the skill"
                className="mt-3"
              />
            ) : null}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Number of hires"
              name="numberOfHires"
              type="number"
              min="1"
              required
              value={formData.numberOfHires}
              onChange={handleChange}
            />
            <SelectField
              label="Engagement"
              name="engagement"
              required
              placeholder="Select an engagement type"
              options={engagementTermsOptions}
              value={formData.engagement}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              label="Work arrangement"
              name="workArrangement"
              required
              placeholder="Onsite, hybrid, or remote?"
              options={workArrangementOptions}
              value={formData.workArrangement}
              onChange={handleChange}
            />
            <SelectField
              label="Target start"
              name="targetStart"
              required
              placeholder="When do you need them?"
              options={targetStartOptions}
              value={formData.targetStart}
              onChange={handleChange}
            />
          </div>

          {formData.workArrangement !== "remote" ? (
            <TextField
              label="Location / time zone"
              name="locationOrTimezone"
              required
              value={formData.locationOrTimezone}
              onChange={handleChange}
              placeholder="Atlanta, GA or EST"
            />
          ) : null}
        </>
      ) : null}

      {step === 3 ? (
        <>
          <TextAreaField
            label="Top three must-have skills"
            name="topSkills"
            required
            value={formData.topSkills}
            onChange={handleChange}
            rows={3}
            maxLength={500}
            placeholder="e.g. React, Node.js, AWS"
          />

          <SelectField
            label="Seniority"
            name="seniority"
            required
            placeholder="Select the level you need"
            options={seniorityOptions}
            value={formData.seniority}
            onChange={handleChange}
          />

          <TextField
            label="Budget / rate"
            name="budgetRate"
            value={formData.budgetRate}
            onChange={handleChange}
            placeholder="Optional"
            hint="Leave blank if you're not sure yet."
          />

          <SelectField
            label="Region preference"
            name="regionPreference"
            placeholder="US, LATAM, or Pakistan"
            options={regionPreferenceOptions}
            value={formData.regionPreference}
            onChange={handleChange}
          />

          <div>
            <label
              htmlFor="jobDescription"
              className="form-label-small mb-2 block text-muted-foreground"
            >
              Job description
            </label>
            <input
              type="file"
              id="jobDescription"
              name="jobDescription"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFormData((prev) => ({ ...prev, jobDescription: file }));
                }
              }}
              className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-foreground shadow-inner shadow-black/20 transition-colors hover:border-white/25 file:mr-4 file:rounded-md file:border-0 file:bg-gold/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gold hover:file:bg-gold/30"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Optional: PDF or Word document, 5 MB max.
            </p>
          </div>

          <TextAreaField
            label="Additional context"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            maxLength={1000}
            placeholder="Anything else that helps us match the right talent."
          />
        </>
      ) : null}

      <Honeypot name="website" inputRef={honeypotRef} />

      <FormError message={stepError || errorMessage} />

      {step === 3 ? (
        <p className="text-xs text-muted-foreground">
          By submitting this form, you agree to our{" "}
          <a href="/privacy" className="underline hover:text-gold">
            Privacy Policy
          </a>
          .
        </p>
      ) : null}

      <div className="flex gap-3">
        {step > 1 ? (
          <button
            type="button"
            onClick={goBack}
            className="button-text rounded-md border border-border px-6 py-3.5 text-foreground transition-all duration-300 hover:border-gold hover:text-gold"
          >
            Back
          </button>
        ) : null}

        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            className="button-text flex-1 rounded-md bg-cream px-6 py-3.5 font-display text-navy transition-all duration-300 hover:bg-gold"
          >
            Continue
          </button>
        ) : (
          <div className="flex-1">
            <SubmitButton
              status={status}
              idleLabel="Submit requirement"
              submittingLabel="Submitting requirement..."
            />
          </div>
        )}
      </div>
    </form>
  );
}
