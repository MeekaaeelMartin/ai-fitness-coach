import { Lock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";

function VisaLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 32"
      aria-label="Visa"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="32" rx="4" fill="#fff" />
      <path
        fill="#1434CB"
        d="M19.5 21h-2.5l1.6-9.6h2.5L19.5 21zm11.7-9.4c-.5-.2-1.3-.4-2.3-.4-2.6 0-4.4 1.4-4.4 3.3 0 1.4 1.3 2.2 2.3 2.7 1 .5 1.4.8 1.4 1.2 0 .7-.8 1-1.6 1-1.1 0-1.7-.2-2.5-.7l-.3-.2-.4 2.3c.6.3 1.8.6 3 .6 2.7 0 4.4-1.4 4.4-3.5 0-1.2-.7-2-2.3-2.7-1-.5-1.5-.8-1.5-1.3 0-.4.5-.9 1.5-.9.9 0 1.5.2 2 .3l.2.1.4-2.2zm6.6-.2h-2c-.7 0-1.1.2-1.4.8l-3.8 9.2h2.5l.5-1.5h3.1l.3 1.5h2.2l-2.5-10.4zm-3.5 5.7c.3-.7 1.2-2.9 1.2-2.9s-.2.6-.4 1l-.7 1.9h-1.9l.8-3zm-7-6.5-2.7 6.9-.2-1.3c-.5-1.5-1.9-3.1-3.5-3.7l2.2 7.9h2.8l4-9.2h-2.6z"
      />
    </svg>
  );
}

function MastercardLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 32"
      aria-label="Mastercard"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="32" rx="4" fill="#fff" />
      <circle cx="19" cy="16" r="9" fill="#EB001B" />
      <circle cx="29" cy="16" r="9" fill="#F79E1B" />
      <path d="M24 9.8a9 9 0 0 1 0 12.4 9 9 0 0 1 0-12.4z" fill="#FF5F00" />
    </svg>
  );
}

interface PaymentTrustBadgesProps {
  className?: string;
  compact?: boolean;
}

export function PaymentTrustBadges({ className, compact }: PaymentTrustBadgesProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <VisaLogo className="h-7 w-10" />
        <MastercardLogo className="h-7 w-10" />
        {!compact && (
          <>
            <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-foreground/60">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Secure checkout
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-foreground/60">
              <Lock className="h-3.5 w-3.5 text-emerald-400" />
              SSL encrypted
            </div>
          </>
        )}
      </div>
      {!compact && (
        <p className="text-xs text-foreground/40">
          We accept Visa and Mastercard. Cancel anytime.
        </p>
      )}
    </div>
  );
}
