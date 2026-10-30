"use client";

import { useActionState } from "react";
import { saveExperience } from "@/app/actions/admin";
import {
  CheckboxField,
  FormMessage,
  SubmitButton,
  TextAreaField,
  TextField,
  initialFormState,
} from "@/components/admin/form-fields";
import type { Tables } from "@/lib/supabase/database.types";

export function ExperienceForm({ item }: { item?: Tables<"experience"> }) {
  const [state, action] = useActionState(saveExperience.bind(null, item?.id ?? null), initialFormState);
  const e = state.errors ?? {};

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="role" label="Role" required maxLength={120} defaultValue={item?.role} error={e.role} />
        <TextField name="company" label="Company" required maxLength={120} defaultValue={item?.company} error={e.company} />
        <TextField name="company_url" label="Company URL" type="url" defaultValue={item?.company_url ?? ""} error={e.company_url} />
        <TextField name="location" label="Location" maxLength={120} defaultValue={item?.location ?? ""} error={e.location} />
        <TextField name="start_date" label="Start date" type="date" required defaultValue={item?.start_date} error={e.start_date} />
        <TextField
          name="end_date"
          label="End date"
          type="date"
          defaultValue={item?.end_date ?? ""}
          hint="Leave empty for a current role"
          error={e.end_date}
        />
      </div>
      <TextAreaField name="summary" label="Summary" rows={3} defaultValue={item?.summary} error={e.summary} />
      <TextAreaField
        name="highlights"
        label="Highlights"
        rows={5}
        defaultValue={item?.highlights.join("\n")}
        hint="One per line"
        error={e.highlights}
      />
      <TextField name="tech_stack" label="Tech stack" defaultValue={item?.tech_stack.join(", ")} hint="Comma separated" error={e.tech_stack} />
      <CheckboxField name="published" label="Published" defaultChecked={item?.published ?? true} />
      <FormMessage state={state} />
      <SubmitButton>{item ? "Save role" : "Add role"}</SubmitButton>
    </form>
  );
}
