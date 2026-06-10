"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Dumbbell, Menu, X, User } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/auth-store";
import { cn } from "@/lib/utils/cn";

const navLinks = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#testimonials", label: "Results" },
  { href: "/#faq", label: "FAQ" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { getCurrentUser } = useAuthStore();
  const user = getCurrentUser();
  const isLanding = pathname === "/";

  useEffect(() => setMounted(true), []);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
            <Dumbbell className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            AI Fitness<span className="text-emerald-400">Coach</span>
          </span>
        </Link>

        {isLanding && (
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/70 transition-colors hover:text-emerald-400"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {mounted && user ? (
            <Link href="/profile" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                {user.name.split(" ")[0]}
              </Button>
            </Link>
          ) : (
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
          )}
          <Link href="/assessment" className="hidden sm:block">
            <Button size="sm" className="shadow-lg shadow-emerald-500/20">
              Start for Free
            </Button>
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-white/10 bg-background/95 backdrop-blur-xl transition-all duration-300 md:hidden",
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="flex flex-col gap-1 p-4">
          {isLanding &&
            navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/70 hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          {mounted && user ? (
            <Link href="/profile" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="mt-2 w-full justify-start" size="sm">
                <User className="h-4 w-4" />
                My Profile
              </Button>
            </Link>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="mt-2 w-full" size="sm">
                Log In
              </Button>
            </Link>
          )}
          <Link href="/assessment" onClick={() => setMobileOpen(false)}>
            <Button className="mt-2 w-full" size="sm">
              Start for Free
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
