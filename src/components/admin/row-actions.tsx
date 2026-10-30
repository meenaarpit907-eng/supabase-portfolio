"use client";

import { Eye, EyeOff, Trash2 } from "lucide-react";
import { removeRow, setPublished } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";

type Table = "projects" | "skills" | "experience";

export function PublishToggle({ table, id, published }: { table: Table; id: string; published: boolean }) {
  return (
    <form action={setPublished}>
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="published" value={String(!published)} />
      <Button type="submit" variant="ghost" size="sm" title={published ? "Unpublish" : "Publish"}>
        {published ? <Eye /> : <EyeOff />}
        {published ? "Published" : "Draft"}
      </Button>
    </form>
  );
}

export function RemoveButton({ table, id, label }: { table: Table; id: string; label: string }) {
  return (
    <form
      action={removeRow}
      onSubmit={(event) => {
        if (!window.confirm(`Remove "${label}"? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="destructive" size="sm">
        <Trash2 /> Remove
      </Button>
    </form>
  );
}
