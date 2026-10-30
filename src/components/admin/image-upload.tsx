"use client";

import { useRef, useState } from "react";
import { FileUp, LoaderCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { STORAGE_BUCKET, storagePublicUrl } from "@/lib/env";
import { useSupabaseClient } from "@/lib/supabase/client";

const MAX_BYTES = 5 * 1024 * 1024;

type ImageUploadProps = {
  name: string;
  label: string;
  folder: "projects" | "profile";
  defaultValue?: string | null;
  accept?: string;
  error?: string;
};

function extension(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  return fromName && /^[a-z0-9]{1,5}$/.test(fromName) ? fromName : "bin";
}

/**
 * Uploads straight from the browser to Supabase Storage with the admin's own
 * Clerk session token. Storage RLS (admin-only insert on the `portfolio` bucket) is the
 * guard, so no service role key is needed. The object path is stored in a
 * hidden input and saved with the rest of the form.
 */
export function ImageUpload({
  name,
  label,
  folder,
  defaultValue,
  accept = "image/png,image/jpeg,image/webp,image/avif,image/gif",
  error,
}: ImageUploadProps) {
  const [path, setPath] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = useSupabaseClient();
  const preview = storagePublicUrl(path);
  const isImage = /\.(png|jpe?g|webp|avif|gif)$/i.test(path);

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadError(null);
    if (file.size > MAX_BYTES) {
      setUploadError("Files must be 5 MB or smaller.");
      return;
    }

    if (!supabase) {
      setUploadError("Supabase is not configured.");
      return;
    }

    setUploading(true);
    const objectPath = `${folder}/${crypto.randomUUID()}.${extension(file)}`;
    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(objectPath, file, { cacheControl: "31536000", contentType: file.type, upsert: false });
    setUploading(false);

    if (storageError) {
      setUploadError(storageError.message);
      return;
    }
    setPath(objectPath);
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <input type="hidden" name={name} value={path} />
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-border p-3">
        {preview && isImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- preview of an arbitrary uploaded file
          <img src={preview} alt="" className="h-16 w-28 rounded-md object-cover" />
        ) : null}
        {path ? (
          <code className="max-w-full truncate text-xs text-muted-foreground">{path}</code>
        ) : (
          <span className="text-xs text-muted-foreground">No file</span>
        )}
        <div className="ml-auto flex gap-2">
          <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={onFileChange} />
          <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
            {uploading ? <LoaderCircle className="animate-spin" /> : <FileUp />}
            Upload
          </Button>
          {path ? (
            <Button type="button" variant="ghost" size="sm" onClick={() => setPath("")}>
              <X /> Clear
            </Button>
          ) : null}
        </div>
      </div>
      {uploadError || error ? <p className="text-xs text-destructive">{uploadError ?? error}</p> : null}
    </div>
  );
}
