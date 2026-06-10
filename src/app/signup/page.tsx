import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata = {
  title: "Sign Up | AI Fitness Coach",
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
