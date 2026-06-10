"use client";

import { useState } from "react";
import {
  Download,
  FileText,
  Calendar,
  Copy,
  Mail,
  Share2,
  Check,
  ChevronDown,
} from "lucide-react";
import type { GeneratedPlan } from "@/lib/types/plan";
import {
  planToMarkdown,
  planToICS,
  planToPdfHtml,
  downloadFile,
} from "@/lib/integrations/export-plan";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface PlanIntegrationsProps {
  plan: GeneratedPlan;
}

export function PlanIntegrations({ plan }: PlanIntegrationsProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const name = plan.userProfile.name.replace(/\s+/g, "-").toLowerCase();

  const handlePdf = () => {
    const html = planToPdfHtml(plan);
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      win.onload = () => win.print();
    }
  };

  const handleMarkdown = () => {
    downloadFile(planToMarkdown(plan), `${name}-fitness-plan.md`, "text/markdown");
  };

  const handleCalendar = () => {
    downloadFile(planToICS(plan), `${name}-workout-schedule.ics`, "text/calendar");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(planToMarkdown(plan));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`My AI Fitness Coach Plan — ${plan.userProfile.name}`);
    const body = encodeURIComponent(planToMarkdown(plan).slice(0, 2000) + "\n\n[Full plan attached via export]");
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  const handleShare = async () => {
    const text = planToMarkdown(plan);
    if (navigator.share) {
      await navigator.share({
        title: `My Fitness Plan — ${plan.userProfile.name}`,
        text: text.slice(0, 500) + "...",
      });
    } else {
      handleCopy();
    }
  };

  const actions = [
    { icon: Download, label: "Download PDF", desc: "Print-ready formatted plan", onClick: handlePdf },
    { icon: FileText, label: "Save as Notes", desc: "Markdown file for Notes / Keep", onClick: handleMarkdown },
    { icon: Calendar, label: "Add to Calendar", desc: "Weekly workout schedule (.ics)", onClick: handleCalendar },
    { icon: copied ? Check : Copy, label: copied ? "Copied!" : "Copy to Clipboard", desc: "Paste anywhere", onClick: handleCopy },
    { icon: Mail, label: "Email Plan", desc: "Send via your email app", onClick: handleEmail },
    { icon: Share2, label: "Share", desc: "Share via device", onClick: handleShare },
  ];

  return (
    <div className="relative">
      <Button variant="outline" onClick={() => setOpen(!open)} className="gap-2">
        <Download className="h-4 w-4" />
        Export &amp; Share
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-white/10 bg-background/95 shadow-2xl backdrop-blur-xl">
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => {
                  action.onClick();
                  if (action.label !== "Copy to Clipboard" && action.label !== "Copied!") {
                    setOpen(false);
                  }
                }}
                className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
              >
                <action.icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <div>
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="text-xs text-foreground/50">{action.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
