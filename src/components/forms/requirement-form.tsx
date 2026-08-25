import { useRef } from "react";

import { cn } from "@/lib/utils";
import {
  type RequirementFormData,
  basisOptions,
  engagementOptions,
  specialtyOptions,
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
    skillNeeded: defaultSkill || "",
    engagementType: "",
    basis: "",
    message: "",
  };
}

export function RequirementForm({ defaultSkill, className }: RequirementFormProps) {
  const { status, setStatus, errorMessage, formData, handleChange, submit } =
    useFormSubmit<RequirementFormData>(makeInitialData(defaultSkill));
  const honeypotRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submit(
      () =>
        submitRequirementForm({
          data: { ...formData, honeypot: honeypotRef.current?.value ?? "" },
        }),
      makeInitialData(defaultSkill),
    );
  };

  if (status === "success") {
    return (
      <FormSuccess
        title="Thank you."
        message="We will review your requirement and respond within one business day."
        resetLabel="Submit another requirement"
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
        label="Company name"
        name="companyName"
        value={formData.companyName}
        onChange={handleChange}
        placeholder="Acme Inc."
        autoComplete="organization"
      />

      <SelectField
        label="Skill needed"
        name="skillNeeded"
        required
        placeholder="Select the specialty you need"
        options={specialtyOptions}
        value={formData.skillNeeded}
        onChange={handleChange}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Engagement type"
          name="engagementType"
          required
          placeholder="Specialist or pod?"
          options={engagementOptions}
          value={formData.engagementType}
          onChange={handleChange}
        />
        <SelectField
          label="Basis"
          name="basis"
          required
          placeholder="Contract or full-time?"
          options={basisOptions}
          value={formData.basis}
          onChange={handleChange}
        />
      </div>

      <TextAreaField
        label="Tell us more"
        name="message"
        value={formData.message}
        onChange={handleChange}
        rows={4}
        maxLength={1000}
        placeholder="Anything else that helps us match the right talent — timeline, must-have skills, team context."
      />

      <Honeypot name="website" inputRef={honeypotRef} />

      <FormError message={errorMessage} />

      <SubmitButton
        status={status}
        idleLabel="Submit requirement"
        submittingLabel="Submitting requirement..."
      />
    </form>
  );
}
