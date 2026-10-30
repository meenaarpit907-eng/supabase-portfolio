-- =============================================================================
-- Storage: one public bucket for project images, avatar and resume.
--
-- Public bucket = files are served from /storage/v1/object/public/portfolio/...
-- without a policy. Listing, uploading, replacing and deleting objects all go
-- through storage.objects RLS, which only admins pass.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio',
  'portfolio',
  true,
  5 * 1024 * 1024, -- 5 MiB
  array['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif', 'application/pdf']
)
on conflict (id) do update
set public             = excluded.public,
    file_size_limit    = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Upsert (replacing a file) needs INSERT + SELECT + UPDATE, so admins get all
-- four. Anonymous visitors get none: public URLs do not need a SELECT policy.
create policy "Admins can list portfolio files"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'portfolio' and (select private.is_admin()));

create policy "Admins can upload portfolio files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio' and (select private.is_admin()));

create policy "Admins can replace portfolio files"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio' and (select private.is_admin()))
  with check (bucket_id = 'portfolio' and (select private.is_admin()));

create policy "Admins can delete portfolio files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio' and (select private.is_admin()));
