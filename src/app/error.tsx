"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="max-w-md text-sm text-foreground/60">
        Try refreshing the page. If this keeps happening, clear site data for this
        app in your browser settings and sign in again.
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
