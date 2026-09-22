"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell } from "lucide-react";
import { PaymentTrustBadges } from "@/components/ui/payment-trust-badges";
import { FooterCtaLink } from "./footer-cta-link";
import { cn } from "@/lib/utils/cn";

export function Footer() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <footer
      className={cn(
        "border-t border-white/10 bg-background/50",
        isLanding && "pb-24 md:pb-0"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                <Dumbbell className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">
                AI Fitness<span className="text-emerald-400">Coach</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground/60">
              Personalised workouts and meal plans for South Africans.
              Priced in Rands. Start for free.
            </p>
            <div className="mt-6">
              <PaymentTrustBadges />
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li>
                <FooterCtaLink />
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-emerald-400">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/#pricing" className="hover:text-emerald-400">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li>
                <Link href="/privacy" className="hover:text-emerald-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-400">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <a href="/#faq" className="hover:text-emerald-400">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-foreground/50">
            &copy; {new Date().getFullYear()} AI Fitness Coach. All rights reserved. 🇿🇦
          </p>
          <PaymentTrustBadges compact className="items-center sm:items-end" />
          <p className="text-xs text-foreground/50">
            Not medical advice. Consult a physician before starting any fitness programme.
          </p>
        </div>
      </div>
    </footer>
  );
}
