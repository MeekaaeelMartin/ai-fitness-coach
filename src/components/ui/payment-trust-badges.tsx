import { Lock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";

function VisaLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" aria-label="Visa" role="img">
      <rect width="48" height="32" rx="4" fill="#1A1F71" />
      <path
        d="M20.2 21.5h-3.2l2-12.4h3.2l-2 12.4zm13.1-12.1c-.6-.3-1.6-.6-2.9-.6-3.2 0-5.4 1.7-5.4 4.1 0 1.8 1.6 2.8 2.8 3.4 1.2.6 1.7 1 1.7 1.5 0 .8-1 1.2-2 1.2-1.3 0-2-.3-3.1-.9l-.4-.2-.5 2.9c.8.4 2.3.7 3.8.7 3.4 0 5.6-1.7 5.6-4.3 0-1.4-.9-2.5-2.8-3.4-1.2-.6-1.9-1-1.9-1.6 0-.5.6-1.1 1.9-1.1 1.1 0 1.9.2 2.5.5l.3.1.5-2.8zm8.1-.3h-2.5c-.8 0-1.3.2-1.7 1l-4.7 11.4h3.3l.7-1.8h4l.4 1.8h2.9l-2.9-12.4zm-4.3 8c.3-.8 1.5-3.7 1.5-3.7s-.3.8-.5 1.3l-.9 2.4h-2.1l1-4zm-9.5-8.1l-3.1 8.5-.3-1.6c-.6-1.9-2.4-4-4.4-5l2.9 10.5h3.4l5.1-12.4h-3.6z"
        fill="#fff"
      />
    </svg>
  );
}

function MastercardLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" aria-label="Mastercard" role="img">
      <rect width="48" height="32" rx="4" fill="#252525" />
      <circle cx="19" cy="16" r="9" fill="#EB001B" />
      <circle cx="29" cy="16" r="9" fill="#F79E1B" />
      <path
        d="M24 9.8a9 9 0 0 1 0 12.4 9 9 0 0 1 0-12.4z"
        fill="#FF5F00"
      />
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
