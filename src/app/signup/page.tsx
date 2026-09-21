import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create your AI Fitness Coach account and start your free trial for personalised workouts and meal plans in South Africa.",
  alternates: { canonical: "/signup" },
};

export default function SignupPage() {
  return (
    <div className="gradient-mesh flex min-h-screen items-center py-16">
      <div className="mx-auto w-full max-w-md px-4">
        <Suspense>
          <AuthForm mode="signup" />
        </Suspense>
      </div>
    </div>
  );
}
