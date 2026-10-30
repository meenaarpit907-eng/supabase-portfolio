"use client";

import { useActionState } from "react";
import { saveProfile } from "@/app/actions/admin";
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

export function ProfileForm({ profile }: { profile: Tables<"profile"> | null }) {
  const [state, action] = useActionState(saveProfile, initialFormState);
  const e = state.errors ?? {};

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="full_name" label="Full name" required maxLength={120} defaultValue={profile?.full_name} error={e.full_name} />
        <TextField name="location" label="Location" maxLength={120} defaultValue={profile?.location ?? ""} error={e.location} />
      </div>
      <TextField name="headline" label="Headline" required maxLength={200} defaultValue={profile?.headline} error={e.headline} />
      <TextAreaField name="bio" label="Bio" rows={8} defaultValue={profile?.bio} hint="Blank lines separate paragraphs." error={e.bio} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="email" label="Public email" type="email" defaultValue={profile?.email ?? ""} error={e.email} />
        <TextField name="website_url" label="Website" type="url" defaultValue={profile?.website_url ?? ""} error={e.website_url} />
        <TextField name="github_url" label="GitHub" type="url" defaultValue={profile?.github_url ?? ""} error={e.github_url} />
        <TextField name="linkedin_url" label="LinkedIn" type="url" defaultValue={profile?.linkedin_url ?? ""} error={e.linkedin_url} />
        <TextField name="x_url" label="X / Twitter" type="url" defaultValue={profile?.x_url ?? ""} error={e.x_url} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <ImageUpload name="avatar_path" label="Avatar" folder="profile" defaultValue={profile?.avatar_path} error={e.avatar_path} />
        <ImageUpload
          name="resume_path"
          label="Resume (PDF)"
          folder="profile"
          accept="application/pdf"
          defaultValue={profile?.resume_path}
          error={e.resume_path}
        />
      </div>
      <CheckboxField
        name="available_for_work"
        label="Open to work"
        hint="Shows the badge in the hero"
        defaultChecked={profile?.available_for_work ?? true}
      />
      <FormMessage state={state} />
      <SubmitButton>Save profile</SubmitButton>
    </form>
  );
}
