-- =============================================================================
-- Notify the owner about new contact messages.
--
-- AFTER INSERT, a trigger calls the `contact-notify` Edge Function through
-- pg_net. pg_net is asynchronous, so the visitor's insert never waits on (or
-- fails because of) the email provider.
--
-- The function URL and a shared secret come from Supabase Vault, so nothing
-- environment-specific or secret is committed. Until both secrets exist the
-- trigger is a no-op. Create them once per environment (see README):
--
--   select vault.create_secret('https://<project-ref>.supabase.co', 'project_url');
--   select vault.create_secret('<long random string>', 'contact_webhook_secret');
-- =============================================================================

create extension if not exists pg_net;

create or replace function private.notify_contact_message()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_project_url text;
  v_secret      text;
begin
  select ds.decrypted_secret into v_project_url
  from vault.decrypted_secrets ds
  where ds.name = 'project_url';

  select ds.decrypted_secret into v_secret
  from vault.decrypted_secrets ds
  where ds.name = 'contact_webhook_secret';

  if v_project_url is null or v_secret is null then
    return new;
  end if;

  perform net.http_post(
    url     := rtrim(v_project_url, '/') || '/functions/v1/contact-notify',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', v_secret
    ),
    body    := jsonb_build_object(
      'type', 'INSERT',
      'table', 'contact_messages',
      'record', jsonb_build_object(
        'id', new.id,
        'name', new.name,
        'email', new.email,
        'subject', new.subject,
        'message', new.message,
        'created_at', new.created_at
      )
    ),
    timeout_milliseconds := 5000
  );

  return new;
end;
$$;

revoke all on function private.notify_contact_message() from public;

create trigger contact_messages_notify
  after insert on public.contact_messages
  for each row execute function private.notify_contact_message();
