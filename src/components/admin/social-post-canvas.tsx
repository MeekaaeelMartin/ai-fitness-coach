"use client";

import { forwardRef } from "react";
import type { GeneratedPostContent } from "@/lib/social/generate-post";
import type { PostFormat } from "@/lib/social/generate-post";
import { POST_DIMENSIONS } from "@/lib/social/generate-post";

interface SocialPostCanvasProps {
  content: GeneratedPostContent;
  format: PostFormat;
}

export const SocialPostCanvas = forwardRef<HTMLDivElement, SocialPostCanvasProps>(
  function SocialPostCanvas({ content, format }, ref) {
    const { width, height } = POST_DIMENSIONS[format];
    const isStory = format === "story";
    const isPortrait = format === "portrait";

    return (
      <div
        ref={ref}
        style={{
          width,
          height,
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          background: "linear-gradient(145deg, #0a0f0d 0%, #0f1a16 45%, #0a1410 100%)",
          color: "#f0fdf4",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Glow orbs */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16,185,129,0.35) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -60,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(20,184,166,0.25) 0%, transparent 70%)",
          }}
        />

        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: isStory ? 72 : isPortrait ? 64 : 56,
            boxSizing: "border-box",
          }}
        >
          {/* Brand bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: isStory ? 48 : 32 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "linear-gradient(135deg, #10b981, #14b8a6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                boxShadow: "0 8px 32px rgba(16,185,129,0.4)",
              }}
            >
              🏋️
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>
                AI Fitness<span style={{ color: "#34d399" }}>Coach</span>
              </div>
              <div style={{ fontSize: 14, color: "rgba(240,253,244,0.55)", marginTop: 2 }}>
                South Africa
              </div>
            </div>
          </div>

          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignSelf: "flex-start",
              padding: "10px 18px",
              borderRadius: 999,
              background: "rgba(16,185,129,0.15)",
              border: "1px solid rgba(52,211,153,0.35)",
              fontSize: 15,
              fontWeight: 600,
              color: "#6ee7b7",
              marginBottom: 28,
            }}
          >
            {content.badge}
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: isStory ? 72 : isPortrait ? 62 : 58,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: 0,
              background: "linear-gradient(135deg, #f0fdf4 0%, #6ee7b7 50%, #2dd4bf 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              maxWidth: "95%",
            }}
          >
            {content.headline}
          </h1>

          <p
            style={{
              fontSize: isStory ? 32 : 26,
              fontWeight: 600,
              color: "#34d399",
              marginTop: 20,
              marginBottom: 0,
              lineHeight: 1.3,
            }}
          >
            {content.subheadline}
          </p>

          <p
            style={{
              fontSize: isStory ? 26 : 22,
              lineHeight: 1.55,
              color: "rgba(240,253,244,0.75)",
              marginTop: 28,
              maxWidth: "92%",
              flex: 1,
            }}
          >
            {content.body}
          </p>

          {/* Footer card */}
          <div
            style={{
              marginTop: "auto",
              padding: "22px 28px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 600, color: "rgba(240,253,244,0.9)" }}>
              {content.footer}
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#064e3b",
                background: "linear-gradient(135deg, #10b981, #2dd4bf)",
                padding: "10px 20px",
                borderRadius: 999,
              }}
            >
              Start for Free
            </span>
          </div>
        </div>
      </div>
    );
  }
);
