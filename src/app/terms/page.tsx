import Link from "next/link";
import { formatZARPerMonth, MONTHLY_PRICE, TRIAL_DAYS } from "@/lib/utils/currency";

export const metadata = {
  title: "Terms & Conditions | AI Fitness Coach",
};

export default function TermsPage() {
  return (
    <div className="gradient-mesh min-h-screen py-16">
      <article className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link href="/" className="text-sm text-emerald-400 hover:underline">
          ← Back to home
        </Link>
        <h1 className="mt-6 text-3xl font-bold">Terms &amp; Conditions</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Last updated: {new Date().toLocaleDateString("en-ZA")}
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground/80">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing or using AI Fitness Coach, you agree to these Terms &amp; Conditions.
              If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Service Description</h2>
            <p>
              AI Fitness Coach provides personalised fitness and nutrition planning tools.
              Plans are generated from the information you provide and are intended as guidance,
              not professional medical or dietetic advice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Free Access &amp; Subscription</h2>
            <p>
              New users get {TRIAL_DAYS} days of full access at no cost.
              After that, continued access requires a subscription
              of {formatZARPerMonth(MONTHLY_PRICE)}. Pricing may change with reasonable notice.
              Payment processing will be handled by a secure third-party provider when launched.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. User Responsibilities</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Provide accurate information in your fitness assessment</li>
              <li>Keep your account credentials secure</li>
              <li>Use the service in compliance with South African law</li>
              <li>Consult a physician before beginning any fitness programme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Health &amp; Safety Disclaimer</h2>
            <p>
              You participate in any workout or nutrition plan at your own risk. AI Fitness Coach,
              its owners, and affiliates are not liable for any injury, illness, or damages arising
              from use of our plans. Stop exercising immediately if you experience pain or discomfort.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Intellectual Property</h2>
            <p>
              All content, branding, and software on this platform are owned by AI Fitness Coach.
              You may download and use your personal plan for individual use only.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by South African law, our liability is limited to the
              amount you paid for the service in the preceding 12 months, or R0 during free access.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">8. Governing Law</h2>
            <p>
              These terms are governed by the laws of the Republic of South Africa. Disputes shall
              be subject to the jurisdiction of South African courts.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">9. Contact</h2>
            <p>
              Questions? Email{" "}
              <a href="mailto:support@aifitnesscoach.co.za" className="text-emerald-400">
                support@aifitnesscoach.co.za
              </a>
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
