"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Sparkles, Download, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/ui/glass-card";
import { SocialPostCanvas } from "./social-post-canvas";
import {
  generatePostFromPrompt,
  POST_DIMENSIONS,
  type PostFormat,
  type GeneratedPostContent,
} from "@/lib/social/generate-post";
import { cn } from "@/lib/utils/cn";

const FORMATS: { id: PostFormat; label: string; desc: string }[] = [
  { id: "square", label: "Square", desc: "1080 × 1080 · Instagram feed" },
  { id: "portrait", label: "Portrait", desc: "1080 × 1350 · Instagram portrait" },
  { id: "story", label: "Story", desc: "1080 × 1920 · Stories / Reels cover" },
];

export function SocialPostCreator() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const [prompt, setPrompt] = useState("Create a welcome post for new members");
  const [format, setFormat] = useState<PostFormat>("square");
  const [content, setContent] = useState<GeneratedPostContent | null>(
    generatePostFromPrompt("Create a welcome post for new members", "square")
  );
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setContent(generatePostFromPrompt(prompt, format));
      setGenerating(false);
    }, 400);
  };

  const handleExport = async () => {
    const node = exportRef.current ?? canvasRef.current;
    if (!node || !content) return;
    setExporting(true);
    try {
      const { width, height } = POST_DIMENSIONS[format];
      const dataUrl = await toPng(node, {
        width,
        height,
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `ai-fitness-coach-${content.template}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setExporting(false);
    }
  };

  const handleCopyCaption = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content.caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCaption = () => {
    if (!content) return;
    const blob = new Blob([content.caption], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `caption-${content.template}-${Date.now()}.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const previewScale = format === "story" ? 0.22 : format === "portrait" ? 0.28 : 0.32;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <GlassCard>
        <h2 className="text-lg font-semibold">Create Social Post</h2>
        <p className="mt-1 text-sm text-foreground/60">
          Describe the post you want. Each generation picks a random layout and colour variation while keeping the site theme.
        </p>

        <div className="mt-6 space-y-4">
          <Textarea
            label="Your prompt"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Create a December fitness post with motivation for South Africans"
          />

          <div>
            <p className="mb-2 text-sm font-medium">Format</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormat(f.id)}
                  className={cn(
                    "rounded-xl border p-3 text-left transition-all",
                    format === f.id
                      ? "border-emerald-500/50 bg-emerald-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  )}
                >
                  <p className="text-sm font-semibold">{f.label}</p>
                  <p className="mt-0.5 text-xs text-foreground/50">{f.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full gap-2" onClick={handleGenerate} disabled={generating || !prompt.trim()}>
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate Post
          </Button>
        </div>

        {content && (
          <div className="mt-6 space-y-3">
            <p className="text-sm font-medium">Caption</p>
            <pre className="max-h-48 overflow-auto rounded-xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-foreground/70 whitespace-pre-wrap">
              {content.caption}
            </pre>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={handleCopyCaption} className="gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy Caption"}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDownloadCaption}>
                Download Caption (.txt)
              </Button>
            </div>
          </div>
        )}
      </GlassCard>

      <div className="space-y-4">
        <GlassCard className="overflow-hidden">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Preview</h3>
            <Button size="sm" onClick={handleExport} disabled={exporting || !content} className="gap-2">
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Save HD Image
            </Button>
          </div>

          {content && (
            <div className="flex justify-center overflow-auto rounded-xl border border-white/10 bg-black/40 p-4">
              <div style={{ transform: `scale(${previewScale})`, transformOrigin: "top center" }}>
                <SocialPostCanvas ref={canvasRef} content={content} format={format} />
              </div>
            </div>
          )}

          {content && (
            <>
              <p className="mt-2 text-center text-xs text-foreground/40">
                Theme: {content.theme.replace(/([A-Z])/g, " $1").trim()} · Template: {content.template}
              </p>
              <p className="mt-1 text-center text-xs text-foreground/40">
                Exports at 2× resolution ({POST_DIMENSIONS[format].width * 2} × {POST_DIMENSIONS[format].height * 2}px)
              </p>
            </>
          )}
        </GlassCard>

        {/* Off-screen full-size canvas for crisp HD export */}
        {content && (
          <div className="pointer-events-none fixed -left-[9999px] top-0 opacity-0" aria-hidden>
            <SocialPostCanvas ref={exportRef} content={content} format={format} />
          </div>
        )}
      </div>
    </div>
  );
}
