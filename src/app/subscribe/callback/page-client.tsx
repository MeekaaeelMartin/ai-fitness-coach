"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { Button } from "@/components/ui/button";

export default function SubscribeCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useCurrentUser();
  const syncBillingFromServer = useAuthStore((state) => state.syncBillingFromServer);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Confirming your payment...");

  useEffect(() => {
    const reference =
      searchParams.get("reference")?.trim() ?? searchParams.get("trxref")?.trim();

    if (!reference) {
      setStatus("error");
      setMessage("Missing payment reference. Please try subscribing again.");
      return;
    }

    if (!user) {
      setStatus("error");
      setMessage("Please log in to complete your subscription.");
      return;
    }

    let cancelled = false;

    async function verifyPayment() {
      try {
        const response = await fetch("/api/paystack/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference,
            userId: user!.id,
            email: user!.email,
            name: user!.name,
          }),
        });

        const data = (await response.json()) as { error?: string };

        if (!response.ok) {
          throw new Error(data.error ?? "Payment verification failed");
        }

        await syncBillingFromServer();

        if (cancelled) return;
        setStatus("success");
        setMessage("Payment successful. Your full plan is now unlocked.");
        setTimeout(() => router.replace("/dashboard?subscribed=1"), 2000);
      } catch (error) {
        if (cancelled) return;
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "We could not confirm your payment yet. If you were charged, it should unlock shortly."
        );
      }
    }

    verifyPayment();
    return () => {
      cancelled = true;
    };
  }, [searchParams, user, syncBillingFromServer, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        {status === "loading" && (
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-400" />
        )}
        {status === "success" && (
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />
        )}
        {status === "error" && <XCircle className="mx-auto h-10 w-10 text-red-400" />}

        <h1 className="mt-4 text-2xl font-bold">
          {status === "loading"
            ? "Processing payment"
            : status === "success"
              ? "You're subscribed"
              : "Payment issue"}
        </h1>
        <p className="mt-2 text-sm text-foreground/60">{message}</p>

        {status === "error" && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/dashboard">
              <Button variant="secondary">Go to Dashboard</Button>
            </Link>
            <Link href="/profile">
              <Button>Try Again</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
