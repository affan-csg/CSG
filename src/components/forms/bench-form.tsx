import { useRef, useState } from "react";

import { cn } from "@/lib/utils";
import {
  type BenchFormData,
  availabilityOptions,
  basisOptions,
  candidateRegionOptions,
  compensationLabels,
  compensationTypeFor,
  seniorityOptions,
  specialtyOptions,
  workArrangementOptions,
  workAuthorizationOptions,
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

function labelFor(options: readonly { value: string; label: string }[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

function buildSuccessMessage(profile: BenchFormData): string {
  const specialtyLabel = labelFor(specialtyOptions, profile.specialty);
  const seniorityLabel = labelFor(seniorityOptions, profile.seniority);
  const regionLabel = labelFor(candidateRegionOptions, profile.region);
  const basisClause =
    profile.basis === "open"
      ? "open to contract or full-time roles"
      : `looking for ${labelFor(basisOptions, profile.basis).toLowerCase()} roles`;
  const availabilityClause = profile.availability
    ? profile.availability === "immediately"
      ? ", available immediately"
      : `, available in ${labelFor(availabilityOptions, profile.availability).toLowerCase()}`
    : "";

  return (
    `Thanks for applying${profile.firstName ? `, ${profile.firstName}` : ""}, you're now in our ` +
    `talent network as a ${seniorityLabel} ${specialtyLabel}, based in ${regionLabel} and ` +
    `${basisClause}${availabilityClause}. We'll reach out when a matching opportunity opens.`
  );
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
    region: "",
    workAuthorization: "",
    workArrangement: "",
    compensationAmount: "",
    availability: "",
    portfolioUrl: "",
    linkedinUrl: "",
    message: "",
  };
}

export function BenchForm({ defaultSkill, className }: BenchFormProps) {
  const { status, setStatus, errorMessage, formData, setFormData, handleChange, submit } =
    useFormSubmit<BenchFormData>(makeInitialData(defaultSkill));
  const [submittedProfile, setSubmittedProfile] = useState<BenchFormData | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submittingProfile = { ...formData };
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
        if (result.success) setSubmittedProfile(submittingProfile);
        return result;
      });
    }, makeInitialData(defaultSkill));
  };

  if (status === "success") {
    return (
      <FormSuccess
        title="Application received!"
        message={
          submittedProfile
            ? buildSuccessMessage(submittedProfile)
            : "Thanks for applying. We'll be in touch when opportunities open."
        }
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
        hint="Wherever you're based, our clients hire across the US, LATAM, and Pakistan."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Job Title"
          name="specialty"
          required
          placeholder="Select your job title"
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
          label="Job Type"
          name="basis"
          required
          placeholder="Contract or full-time?"
          options={basisOptions}
          value={formData.basis}
          onChange={handleChange}
        />
        <SelectField
          label="Region"
          name="region"
          required
          placeholder="Where are you based?"
          options={candidateRegionOptions}
          value={formData.region}
          onChange={handleChange}
        />
      </div>

      {formData.region === "us" ? (
        <SelectField
          label="Work authorization"
          name="workAuthorization"
          required
          placeholder="Select your work authorization status"
          options={workAuthorizationOptions}
          value={formData.workAuthorization}
          onChange={handleChange}
        />
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Work arrangement"
          name="workArrangement"
          required
          placeholder="Remote, hybrid, or onsite?"
          options={workArrangementOptions}
          value={formData.workArrangement}
          onChange={handleChange}
        />
        <TextField
          label={
            formData.region && formData.basis
              ? compensationLabels[compensationTypeFor(formData.region, formData.basis)]
              : "Expected compensation (USD)"
          }
          name="compensationAmount"
          type="number"
          min="0"
          step="50"
          inputMode="numeric"
          value={formData.compensationAmount}
          onChange={handleChange}
          placeholder="6,500"
          prefix="$"
          hint="Select your job type and region above to see the right question."
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
          hint="Optional: a personal site, GitHub, or work samples."
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
          <a href="/candidate-privacy" className="underline hover:text-gold">
            Candidate Privacy Notice
          </a>
          . Career Source Group is an equal opportunity employer; see our{" "}
          <a href="/eeo-notice" className="underline hover:text-gold">
            EEO & Employment Notice
          </a>{" "}
          for how we classify placements and handle work authorization by region.
        </p>
      </div>

      <SubmitButton
        status={status}
        idleLabel="Create Your Talent Profile"
        submittingLabel="Creating your talent profile..."
      />
    </form>
  );
}
