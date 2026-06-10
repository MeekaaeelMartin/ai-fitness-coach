"use client";

import Link from "next/link";
import { useAppHydrated } from "@/lib/hooks/use-app-hydrated";
import { useCurrentUser } from "@/lib/hooks/use-current-user";

export function FooterCtaLink() {
  const hydrated = useAppHydrated();
  const user = useCurrentUser();

  if (!hydrated) {
    return <span className="text-foreground/60">Start for Free</span>;
  }

  if (user) {
    return (
      <Link href="/dashboard" className="hover:text-emerald-400">
        My Dashboard
      </Link>
    );
  }

  return (
    <Link href="/assessment" className="hover:text-emerald-400">
      Start for Free
    </Link>
  );
}
