export function PreviewBanner() {
  return (
    <div className="border-b border-amber-400/20 bg-amber-400/10 px-6 py-2 text-center text-xs text-amber-200">
      Preview mode: Supabase is not connected, so this page shows the placeholder content from{" "}
      <code className="font-mono">supabase/seed.sql</code>.
    </div>
  );
}
