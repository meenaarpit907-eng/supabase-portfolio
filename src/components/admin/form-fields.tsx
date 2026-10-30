"use client";

import { useFormStatus } from "react-dom";
import { LoaderCircle, Save } from "lucide-react";
import type { FormState } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type BaseProps = {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
};

function Help({ name, hint, error }: { name: string; hint?: string; error?: string }) {
  if (error) {
    return (
      <p id={`${name}-error`} className="text-xs text-destructive">
        {error}
      </p>
    );
  }
  return hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null;
}

export function TextField({
  name,
  label,
  hint,
  error,
  className,
  ...props
}: BaseProps & Omit<React.ComponentProps<typeof Input>, "name">) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      />
      <Help name={name} hint={hint} error={error} />
    </div>
  );
}

export function TextAreaField({
  name,
  label,
  hint,
  error,
  className,
  ...props
}: BaseProps & Omit<React.ComponentProps<typeof Textarea>, "name">) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>{label}</Label>
      <Textarea
        id={name}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      />
      <Help name={name} hint={hint} error={error} />
    </div>
  );
}

export function CheckboxField({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 rounded-lg border border-border p-3 text-sm">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 size-4 accent-[var(--primary)]"
      />
      <span>
        <span className="font-medium">{label}</span>
        {hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
      </span>
    </label>
  );
}

export function FormMessage({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <p
      role={state.status === "error" ? "alert" : "status"}
      className={
        state.status === "error"
          ? "rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
          : "rounded-md bg-primary/10 px-3 py-2 text-sm text-primary"
      }
    >
      {state.message}
    </p>
  );
}

export function SubmitButton({ children = "Save" }: { children?: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <LoaderCircle className="animate-spin" /> : <Save />}
      {children}
    </Button>
  );
}

export const initialFormState: FormState = { status: "idle", message: null };
