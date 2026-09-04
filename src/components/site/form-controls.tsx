import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { FormStatus } from "@/lib/forms";

const inputClass =
  "form-input w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-foreground placeholder:text-muted-foreground/60 shadow-inner shadow-black/20 transition-colors hover:border-white/25 focus:border-gold focus:bg-white/[0.07] focus:ring-2 focus:ring-gold/30 focus:outline-none";

const selectClass = cn(inputClass, "appearance-none pr-10");

const textareaClass = cn(inputClass, "resize-none");

function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean | undefined;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="form-label-small mb-2 block text-muted-foreground">
      {children} {required ? <span className="text-gold">*</span> : null}
    </label>
  );
}

type TextFieldProps = {
  label: string;
  name: string;
  required?: boolean;
  hint?: string;
  prefix?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "id">;

export function TextField({
  label,
  name,
  required,
  hint,
  prefix,
  className,
  ...props
}: TextFieldProps) {
  return (
    <div>
      <FieldLabel htmlFor={name} required={required}>
        {label}
      </FieldLabel>
      {prefix ? (
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            {prefix}
          </span>
          <input
            id={name}
            name={name}
            required={required}
            className={cn(inputClass, "pl-8", className)}
            {...props}
          />
        </div>
      ) : (
        <input
          id={name}
          name={name}
          required={required}
          className={cn(inputClass, className)}
          {...props}
        />
      )}
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

type TextAreaFieldProps = {
  label: string;
  name: string;
  required?: boolean;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name" | "id">;

export function TextAreaField({ label, name, required, className, ...props }: TextAreaFieldProps) {
  return (
    <div>
      <FieldLabel htmlFor={name} required={required}>
        {label}
      </FieldLabel>
      <textarea
        id={name}
        name={name}
        required={required}
        className={cn(textareaClass, className)}
        {...props}
      />
    </div>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

type SelectFieldProps = {
  label: string;
  name: string;
  required?: boolean;
  placeholder: string;
  options: readonly SelectOption[];
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "name" | "id">;

export function SelectField({
  label,
  name,
  required,
  placeholder,
  options,
  className,
  ...props
}: SelectFieldProps) {
  return (
    <div>
      <FieldLabel htmlFor={name} required={required}>
        {label}
      </FieldLabel>
      <select
        id={name}
        name={name}
        required={required}
        className={cn(selectClass, className)}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Honeypot({
  name,
  inputRef,
}: {
  name: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="absolute left-[-9999px]" aria-hidden="true">
      <input ref={inputRef} type="text" name={name} tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p className="body-small text-red-400" role="alert">
      {message}
    </p>
  );
}

export function SubmitButton({
  status,
  idleLabel,
  submittingLabel,
}: {
  status: FormStatus;
  idleLabel: string;
  submittingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={status === "submitting"}
      className="button-text w-full rounded-md bg-cream px-6 py-3.5 font-display text-navy transition-all duration-300 hover:bg-gold disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {status === "submitting" ? submittingLabel : idleLabel}
    </button>
  );
}

export function FormSuccess({
  title,
  message,
  resetLabel,
  onReset,
}: {
  title: string;
  message: ReactNode;
  resetLabel: string;
  onReset: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Replacing the full form with this much shorter card collapses the
  // page's height, so the viewport's fixed scroll position ends up showing
  // whatever now sits lower on the page (often the footer) instead of the
  // message — pull it back into view so the confirmation is what's visible.
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return (
    <div
      ref={ref}
      className="rounded-md border border-green-500/30 bg-green-500/10 p-6 text-center"
    >
      <p className="heading-subsection font-display text-green-400">{title}</p>
      <p className="mt-2 body-small text-muted-foreground">{message}</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 button-text text-gold hover:text-gold/80"
      >
        {resetLabel}
      </button>
    </div>
  );
}
