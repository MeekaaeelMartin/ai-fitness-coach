import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to AI Fitness Coach to access your personalised workout and meal plan.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <div className="gradient-mesh flex min-h-screen items-center py-16">
      <div className="mx-auto w-full max-w-md px-4">
        <Suspense>
          <AuthForm mode="login" />
        </Suspense>
      </div>
    </div>
  );
}
