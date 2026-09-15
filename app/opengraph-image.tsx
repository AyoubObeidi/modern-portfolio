import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpengraphImage() {
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
          backgroundColor: "#0e0f0c",
          color: "#ecebe4",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, color: "#a3a399" }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: "#c8f560" }} />
          {profile.role}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>{profile.name}</div>
          <div style={{ fontSize: 36, color: "#a3a399", maxWidth: 960, lineHeight: 1.3 }}>{profile.headline}</div>
        </div>
        <div style={{ width: 160, height: 6, backgroundColor: "#c8f560" }} />
      </div>
    ),
    size,
  );
}
