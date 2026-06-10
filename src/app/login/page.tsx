import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata = {
  title: "Log In | AI Fitness Coach",
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
