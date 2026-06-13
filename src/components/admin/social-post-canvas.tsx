"use client";

import { forwardRef } from "react";
import type { GeneratedPostContent, PostFormat } from "@/lib/social/generate-post";
import { POST_DIMENSIONS } from "@/lib/social/generate-post";

interface SocialPostCanvasProps {
  content: GeneratedPostContent;
  format: PostFormat;
}

function BrandBar({ accent, secondary }: { accent: string; secondary: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: `linear-gradient(135deg, ${accent}, ${secondary})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          boxShadow: `0 8px 32px ${accent}66`,
        }}
      >
        🏋️
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>
          AI Fitness<span style={{ color: accent }}>Coach</span>
        </div>
        <div style={{ fontSize: 14, color: "rgba(240,253,244,0.55)", marginTop: 2 }}>South Africa</div>
      </div>
    </div>
  );
}

function FooterCard({ content, accent, secondary }: { content: GeneratedPostContent; accent: string; secondary: string }) {
  return (
    <div
      style={{
        marginTop: "auto",
        padding: "22px 28px",
        borderRadius: 20,
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span style={{ fontSize: 18, fontWeight: 600, color: "rgba(240,253,244,0.9)" }}>{content.footer}</span>
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#064e3b",
          background: `linear-gradient(135deg, ${accent}, ${secondary})`,
          padding: "10px 20px",
          borderRadius: 999,
        }}
      >
        Start for Free
      </span>
    </div>
  );
}

function ThemeLayout({
  content,
  isStory,
  isPortrait,
  children,
}: {
  content: GeneratedPostContent;
  isStory: boolean;
  isPortrait: boolean;
  children: React.ReactNode;
}) {
  const { accentColor: accent, secondaryColor: secondary } = content;
  const padding = isStory ? 72 : isPortrait ? 64 : 56;

  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding,
        boxSizing: "border-box",
      }}
    >
      <div style={{ marginBottom: isStory ? 48 : 32 }}>
        <BrandBar accent={accent} secondary={secondary} />
      </div>
      {children}
      <FooterCard content={content} accent={accent} secondary={secondary} />
    </div>
  );
}

export const SocialPostCanvas = forwardRef<HTMLDivElement, SocialPostCanvasProps>(
  function SocialPostCanvas({ content, format }, ref) {
    const { width, height } = POST_DIMENSIONS[format];
    const isStory = format === "story";
    const isPortrait = format === "portrait";
    const { accentColor: accent, secondaryColor: secondary, theme } = content;
    const headlineSize = isStory ? 72 : isPortrait ? 62 : 58;

    const baseBg =
      theme === "minimalCard"
        ? "#0c1210"
        : theme === "boldQuote"
          ? `linear-gradient(160deg, #050807 0%, #0a1512 50%, ${accent}22 100%)`
          : theme === "splitAccent"
            ? `linear-gradient(90deg, ${accent}33 0%, ${accent}33 8%, #0a0f0d 8%, #0f1a16 100%)`
            : theme === "diagonalSlice"
              ? `linear-gradient(135deg, #0a0f0d 0%, #0f1a16 40%, ${accent}18 40%, ${secondary}12 100%)`
              : "linear-gradient(145deg, #0a0f0d 0%, #0f1a16 45%, #0a1410 100%)";

    return (
      <div
        ref={ref}
        style={{
          width,
          height,
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          background: baseBg,
          color: "#f0fdf4",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {theme !== "minimalCard" && theme !== "splitAccent" && (
          <>
            <div
              style={{
                position: "absolute",
                top: -120,
                right: -80,
                width: 420,
                height: 420,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${accent}59 0%, transparent 70%)`,
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
                background: `radial-gradient(circle, ${secondary}40 0%, transparent 70%)`,
              }}
            />
          </>
        )}

        {theme === "statBlocks" && (
          <div style={{ position: "absolute", top: 80, right: 56, display: "flex", gap: 12 }}>
            {["7 Days Free", "R500/mo", "🇿🇦"].map((stat) => (
              <div
                key={stat}
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid ${accent}44`,
                  fontSize: 14,
                  fontWeight: 600,
                  color: accent,
                }}
              >
                {stat}
              </div>
            ))}
          </div>
        )}

        {theme === "diagonalSlice" && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "45%",
              height: "100%",
              background: `linear-gradient(135deg, transparent 0%, ${accent}15 100%)`,
              clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)",
            }}
          />
        )}

        <ThemeLayout content={content} isStory={isStory} isPortrait={isPortrait}>
          <div
            style={{
              display: "inline-flex",
              alignSelf: "flex-start",
              padding: "10px 18px",
              borderRadius: 999,
              background: `${accent}26`,
              border: `1px solid ${accent}59`,
              fontSize: 15,
              fontWeight: 600,
              color: secondary,
              marginBottom: 28,
            }}
          >
            {content.badge}
          </div>

          {theme === "boldQuote" ? (
            <blockquote
              style={{
                fontSize: headlineSize + 8,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                margin: 0,
                fontStyle: "italic",
                color: "#f0fdf4",
                maxWidth: "95%",
              }}
            >
              &ldquo;{content.headline}&rdquo;
            </blockquote>
          ) : theme === "minimalCard" ? (
            <div
              style={{
                padding: 32,
                borderRadius: 24,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                flex: 1,
                marginBottom: 24,
              }}
            >
              <h1
                style={{
                  fontSize: headlineSize - 8,
                  fontWeight: 800,
                  lineHeight: 1.1,
                  margin: 0,
                  color: "#f0fdf4",
                }}
              >
                {content.headline}
              </h1>
              <p style={{ fontSize: 22, color: accent, marginTop: 16, fontWeight: 600 }}>{content.subheadline}</p>
              <p style={{ fontSize: 20, lineHeight: 1.55, color: "rgba(240,253,244,0.75)", marginTop: 20 }}>
                {content.body}
              </p>
            </div>
          ) : (
            <>
              <h1
                style={{
                  fontSize: headlineSize,
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  margin: 0,
                  background: `linear-gradient(135deg, #f0fdf4 0%, ${accent} 50%, ${secondary} 100%)`,
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
                  color: accent,
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
                  flex: theme === "statBlocks" ? 0 : 1,
                }}
              >
                {content.body}
              </p>
            </>
          )}

          {theme === "boldQuote" && (
            <p
              style={{
                fontSize: isStory ? 26 : 22,
                lineHeight: 1.55,
                color: "rgba(240,253,244,0.75)",
                marginTop: 28,
                flex: 1,
              }}
            >
              {content.body}
            </p>
          )}
        </ThemeLayout>
      </div>
    );
  }
);
