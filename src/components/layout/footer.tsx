import Link from "next/link";
import { Dumbbell } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                <Dumbbell className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">
                AI Fitness<span className="text-emerald-400">Coach</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground/60">
              Your personal AI-powered fitness coach. Get fully personalized workout
              and meal plans tailored to your body, goals, and lifestyle.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li>
                <Link href="/assessment" className="hover:text-emerald-400">
                  Get Started
                </Link>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-emerald-400">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/#benefits" className="hover:text-emerald-400">
                  Benefits
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li>
                <a href="/#faq" className="hover:text-emerald-400">
                  FAQ
                </a>
              </li>
              <li>
                <span className="cursor-default">Privacy Policy</span>
              </li>
              <li>
                <span className="cursor-default">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-foreground/50">
            &copy; {new Date().getFullYear()} AI Fitness Coach. All rights reserved.
          </p>
          <p className="text-xs text-foreground/50">
            Not medical advice. Consult a physician before starting any fitness program.
          </p>
        </div>
      </div>
    </footer>
  );
}
