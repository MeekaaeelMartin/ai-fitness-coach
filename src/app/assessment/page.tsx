import type { Metadata } from "next";
import { AssessmentForm } from "@/components/assessment/assessment-form";

export const metadata: Metadata = {
  title: "Free Fitness Assessment",
  description:
    "Take our free AI fitness assessment and get a personalised workout plan and meal plan for South Africa. Home or gym — built around your goals.",
  alternates: { canonical: "/assessment" },
  openGraph: {
    title: "Free Fitness Assessment | AI Fitness Coach",
    description:
      "Get a personalised workout and meal plan tailored to your body, goals, and schedule.",
  },
};

export default function AssessmentPage() {
  return (
    <div className="gradient-mesh min-h-screen py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Your Fitness Assessment
          </h1>
          <p className="mt-2 text-foreground/60">
            Help us understand you better so we can create the perfect plan
          </p>
        </div>
        <AssessmentForm />
      </div>
    </div>
  );
}
