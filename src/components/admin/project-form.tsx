"use client";

import { useActionState } from "react";
import { saveProject } from "@/app/actions/admin";
import {
  CheckboxField,
  FormMessage,
  SubmitButton,
  TextAreaField,
  TextField,
  initialFormState,
} from "@/components/admin/form-fields";
import { ImageUpload } from "@/components/admin/image-upload";
import type { Tables } from "@/lib/supabase/database.types";

export function ProjectForm({ project }: { project?: Tables<"projects"> }) {
  const [state, action] = useActionState(saveProject.bind(null, project?.id ?? null), initialFormState);
  const e = state.errors ?? {};

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="title" label="Title" required maxLength={120} defaultValue={project?.title} error={e.title} />
        <TextField
          name="slug"
          label="Slug"
          required
          maxLength={80}
          defaultValue={project?.slug}
          hint="URL: /projects/your-slug"
          error={e.slug}
        />
      </div>
      <TextField name="summary" label="Summary" required maxLength={300} defaultValue={project?.summary} error={e.summary} />
      <TextAreaField
        name="body"
        label="Write-up"
        rows={10}
        defaultValue={project?.body}
        hint="Plain text. Blank lines separate paragraphs."
        error={e.body}
      />
      <TextField
        name="tech_stack"
        label="Tech stack"
        defaultValue={project?.tech_stack.join(", ")}
        hint="Comma separated"
        error={e.tech_stack}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="repo_url" label="Repository URL" type="url" defaultValue={project?.repo_url ?? ""} error={e.repo_url} />
        <TextField name="live_url" label="Live URL" type="url" defaultValue={project?.live_url ?? ""} error={e.live_url} />
      </div>
      <ImageUpload name="cover_image_path" label="Cover image" folder="projects" defaultValue={project?.cover_image_path} error={e.cover_image_path} />
      <div className="grid gap-3 sm:grid-cols-3">
        <TextField name="sort_order" label="Sort order" type="number" defaultValue={project?.sort_order ?? 0} error={e.sort_order} />
        <CheckboxField name="featured" label="Featured" defaultChecked={project?.featured} />
        <CheckboxField name="published" label="Published" hint="Visible to visitors" defaultChecked={project?.published} />
      </div>
      <FormMessage state={state} />
      <SubmitButton>{project ? "Save project" : "Create project"}</SubmitButton>
    </form>
  );
}
