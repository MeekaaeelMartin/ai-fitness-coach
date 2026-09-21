import { Suspense } from "react";
import type { Metadata } from "next";
import SubscribeCallbackPage from "./page-client";

export const metadata: Metadata = {
  title: "Payment Confirmation",
  robots: { index: false, follow: false },
};

export default function SubscribeCallbackRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      }
    >
      <SubscribeCallbackPage />
    </Suspense>
  );
}
