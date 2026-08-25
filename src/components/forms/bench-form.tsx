import { useRef, useState } from "react";

import { cn } from "@/lib/utils";
import {
  type BenchFormData,
  availabilityOptions,
  basisOptions,
  seniorityOptions,
  specialtyOptions,
} from "@/lib/forms";
import { submitBenchApplication } from "@/lib/form-actions";
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

interface BenchFormProps {
  defaultSkill?: string | undefined;
  className?: string;
}

function makeInitialData(defaultSkill?: string): BenchFormData {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    specialty: defaultSkill || "",
    seniority: "",
    basis: "",
    expectedMonthlyRate: "",
    availability: "",
    portfolioUrl: "",
    linkedinUrl: "",
    message: "",
  };
}

export function BenchForm({ defaultSkill, className }: BenchFormProps) {
  const { status, setStatus, errorMessage, formData, setFormData, handleChange, submit } =
    useFormSubmit<BenchFormData>(makeInitialData(defaultSkill));
  const [submittedName, setSubmittedName] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submittingName = formData.firstName;
    void submit(() => {
      const payload = new FormData();
      for (const [key, value] of Object.entries(formData)) {
        if (key === "resume") continue;
        payload.set(key, value ?? "");
      }
      if (formData.resume) {
        payload.set("resume", formData.resume);
      }
      payload.set("honeypot", honeypotRef.current?.value ?? "");

      return submitBenchApplication({ data: payload }).then((result) => {
        if (result.success) setSubmittedName(submittingName);
        return result;
      });
    }, makeInitialData(defaultSkill));
  };

  if (status === "success") {
    return (
      <FormSuccess
        title="Application received!"
        message={`Thanks for applying${submittedName ? `, ${submittedName}` : ""} — we'll be in touch when opportunities open.`}
        resetLabel="Submit another application"
        onReset={() => setStatus("idle")}
      />
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
          label="Email"
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
          required
          value={formData.phone}
          onChange={handleChange}
          placeholder="(443) 875-9677"
          autoComplete="tel"
        />
      </div>

      <TextField
        label="Location"
        name="location"
        required
        value={formData.location}
        onChange={handleChange}
        placeholder="City, Country"
        autoComplete="address-level2"
        hint="Wherever you're based — our clients hire across the US, LATAM, and Pakistan."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Specialty"
          name="specialty"
          required
          placeholder="Select your specialty"
          options={specialtyOptions}
          value={formData.specialty}
          onChange={handleChange}
        />
        <SelectField
          label="Seniority"
          name="seniority"
          required
          placeholder="Select your level"
          options={seniorityOptions}
          value={formData.seniority}
          onChange={handleChange}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Basis"
          name="basis"
          required
          placeholder="Contract or full-time?"
          options={basisOptions}
          value={formData.basis}
          onChange={handleChange}
        />
        <TextField
          label="Expected monthly rate (USD)"
          name="expectedMonthlyRate"
          type="number"
          min="0"
          step="50"
          inputMode="numeric"
          value={formData.expectedMonthlyRate}
          onChange={handleChange}
          placeholder="6,500"
          prefix="$"
          hint="Per month, in USD — not hourly or annual."
        />
      </div>

      <SelectField
        label="Availability"
        name="availability"
        placeholder="When could you start?"
        options={availabilityOptions}
        value={formData.availability}
        onChange={handleChange}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Portfolio URL"
          name="portfolioUrl"
          type="url"
          value={formData.portfolioUrl}
          onChange={handleChange}
          placeholder="https://yourportfolio.com"
          autoComplete="url"
          hint="Optional — a personal site, GitHub, or work samples."
        />
        <TextField
          label="LinkedIn URL"
          name="linkedinUrl"
          type="url"
          value={formData.linkedinUrl}
          onChange={handleChange}
          placeholder="https://linkedin.com/in/your-name"
          autoComplete="url"
        />
      </div>

      <div>
        <label htmlFor="resume" className="form-label-small mb-2 block text-muted-foreground">
          Résumé <span className="text-gold">*</span>
        </label>
        <input
          type="file"
          id="resume"
          name="resume"
          required
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFormData((prev) => ({ ...prev, resume: file }));
            }
          }}
          className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-foreground shadow-inner shadow-black/20 transition-colors hover:border-white/25 file:mr-4 file:rounded-md file:border-0 file:bg-gold/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gold hover:file:bg-gold/30"
        />
        <p className="mt-1 text-xs text-muted-foreground">PDF or Word document, 5 MB max.</p>
      </div>

      <TextAreaField
        label="Additional information"
        name="message"
        value={formData.message}
        onChange={handleChange}
        rows={3}
        placeholder="Anything else you'd like us to know."
      />

      <Honeypot name="website" inputRef={honeypotRef} />

      <FormError message={errorMessage} />

      <div className="space-y-3 rounded-md border border-white/10 bg-black/20 p-4 text-sm">
        <p className="text-muted-foreground">
          By submitting your application, you consent to Career Source Group retaining and reviewing
          your profile to match you with relevant opportunities. We will contact you only when a
          suitable role opens. Your information is handled according to our{" "}
          <a href="/privacy" className="underline hover:text-gold">
            Privacy Policy
          </a>
          .
        </p>
      </div>

      <SubmitButton
        status={status}
        idleLabel="Submit application"
        submittingLabel="Submitting application..."
      />
    </form>
  );
}
