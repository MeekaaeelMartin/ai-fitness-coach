"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useAssessmentStore } from "@/lib/store/assessment-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type LoginData = z.infer<typeof loginSchema>;
type SignupData = z.infer<typeof signupSchema>;

interface AuthFormProps {
  mode: "login" | "signup";
}

function useAuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromAssessment = searchParams.get("from") === "assessment";
  const { saveUserPlan } = useAuthStore();
  const { assessment, generatedPlan } = useAssessmentStore();

  return () => {
    if (generatedPlan) {
      saveUserPlan(assessment, generatedPlan);
      router.push("/dashboard");
    } else {
      router.push("/profile");
    }
  };
}

function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const redirect = useAuthRedirect();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    setError("");
    setLoading(true);
    const result = login(data.email, data.password);
    if (!result.success) {
      setError(result.error ?? "Login failed");
      setLoading(false);
      return;
    }
    redirect();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />
      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log In"}
      </Button>
    </form>
  );
}

function SignupForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuthStore();
  const { assessment } = useAssessmentStore();
  const redirect = useAuthRedirect();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: assessment.name || "" },
  });

  const onSubmit = async (data: SignupData) => {
    setError("");
    setLoading(true);
    const result = signup(data.email, data.password, data.name);
    if (!result.success) {
      setError(result.error ?? "Signup failed");
      setLoading(false);
      return;
    }
    redirect();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        placeholder="Your name"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />
      <Input
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Create Account & Save Plan"
        )}
      </Button>
    </form>
  );
}

export function AuthForm({ mode }: AuthFormProps) {
  const searchParams = useSearchParams();
  const fromAssessment = searchParams.get("from") === "assessment";

  return (
    <GlassCard className="mx-auto max-w-md">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">
          {mode === "login" ? "Welcome Back" : "Create Your Account"}
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          {fromAssessment
            ? "Save your personalised plan and start tracking your progress"
            : mode === "login"
              ? "Log in to access your plan and track workouts"
              : "Start for free — no payment required"}
        </p>
      </div>

      {fromAssessment && (
        <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-center text-sm text-emerald-400">
          Your plan is ready! Create an account to save it and start tracking.
        </div>
      )}

      {mode === "login" ? <LoginForm /> : <SignupForm />}

      <p className="mt-6 text-center text-sm text-foreground/50">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link
              href={fromAssessment ? "/signup?from=assessment" : "/signup"}
              className="text-emerald-400 hover:underline"
            >
              Sign up free
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link
              href={fromAssessment ? "/login?from=assessment" : "/login"}
              className="text-emerald-400 hover:underline"
            >
              Log in
            </Link>
          </>
        )}
      </p>
    </GlassCard>
  );
}
