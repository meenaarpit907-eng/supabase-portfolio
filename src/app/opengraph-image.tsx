import { ImageResponse } from "next/og";
import { getPortfolioContent } from "@/lib/content";

export const alt = "Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

export default async function OpengraphImage() {
  const { profile } = await getPortfolioContent();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 20% 0%, #1f4a39 0%, #141716 55%)",
          color: "#f4f6f5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, color: "#3ecf8e" }}>
          <div style={{ width: 16, height: 16, borderRadius: 8, background: "#3ecf8e" }} />
          Clerk · Supabase · Vercel
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -2 }}>{profile.full_name}</div>
          <div style={{ fontSize: 36, color: "#b5bdb9", maxWidth: 1000, lineHeight: 1.3 }}>{profile.headline}</div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#8a948f" }}>
          Clerk auth · Postgres RLS · Storage · Edge Functions · Next.js
        </div>
      </div>
    ),
    size,
  );
}
