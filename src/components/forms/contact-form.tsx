import { useRef } from "react";

import { cn } from "@/lib/utils";
import { type ContactFormData, inquiryTypeOptions } from "@/lib/forms";
import { submitContactForm } from "@/lib/form-actions";
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

interface ContactFormProps {
  className?: string;
}

const initialData: ContactFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  inquiryType: "",
  message: "",
};

export function ContactForm({ className }: ContactFormProps) {
  const { status, setStatus, errorMessage, formData, handleChange, submit } =
    useFormSubmit<ContactFormData>(initialData);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submit(
      () =>
        submitContactForm({ data: { ...formData, honeypot: honeypotRef.current?.value ?? "" } }),
      initialData,
    );
  };

  if (status === "success") {
    return (
      <FormSuccess
        title="Message sent!"
        message="We'll be in touch soon. Thank you for reaching out."
        resetLabel="Send another message"
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

      <SelectField
        label="What's this about?"
        name="inquiryType"
        required
        placeholder="Select what this is about"
        options={inquiryTypeOptions}
        value={formData.inquiryType}
        onChange={handleChange}
      />

      <TextAreaField
        label="Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        rows={4}
        maxLength={500}
        placeholder="Tell us a bit about what you need or what's on your mind."
      />

      <Honeypot name="company_name" inputRef={honeypotRef} />

      <FormError message={errorMessage} />

      <SubmitButton status={status} idleLabel="Send message" submittingLabel="Sending message..." />
    </form>
  );
}
