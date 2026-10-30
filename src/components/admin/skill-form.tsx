"use client";

import { useActionState } from "react";
import { saveSkill } from "@/app/actions/admin";
import { CheckboxField, FormMessage, SubmitButton, TextField, initialFormState } from "@/components/admin/form-fields";
import type { Tables } from "@/lib/supabase/database.types";

export function SkillForm({ skill }: { skill?: Tables<"skills"> }) {
  const [state, action] = useActionState(saveSkill.bind(null, skill?.id ?? null), initialFormState);
  const e = state.errors ?? {};

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="name" label="Skill" required maxLength={60} defaultValue={skill?.name} error={e.name} />
        <TextField
          name="category"
          label="Category"
          required
          maxLength={60}
          defaultValue={skill?.category}
          hint="e.g. Supabase, Frontend, Tooling"
          error={e.category}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <TextField
          name="proficiency"
          label="Proficiency (1-5)"
          type="number"
          min={1}
          max={5}
          required
          defaultValue={skill?.proficiency ?? 3}
          error={e.proficiency}
        />
        <TextField name="sort_order" label="Sort order" type="number" defaultValue={skill?.sort_order ?? 0} error={e.sort_order} />
        <CheckboxField name="published" label="Published" defaultChecked={skill?.published ?? true} />
      </div>
      <FormMessage state={state} />
      <SubmitButton>{skill ? "Save skill" : "Add skill"}</SubmitButton>
    </form>
  );
}
