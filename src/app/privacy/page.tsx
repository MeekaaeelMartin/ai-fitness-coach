import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for AI Fitness Coach — how we collect, use, and protect your personal and fitness data in South Africa.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="gradient-mesh min-h-screen py-16">
      <article className="mx-auto max-w-3xl px-4 sm:px-6 prose prose-invert prose-emerald">
        <Link href="/" className="text-sm text-emerald-400 hover:underline no-underline">
          ← Back to home
        </Link>
        <h1 className="mt-6 text-3xl font-bold text-foreground">Privacy Policy</h1>
        <p className="text-foreground/60 text-sm">Last updated: {new Date().toLocaleDateString("en-ZA")}</p>

        <div className="mt-8 space-y-6 text-foreground/80 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Introduction</h2>
            <p>
              AI Fitness Coach (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates aifitnesscoach.co.za and is
              committed to protecting your privacy in line with the Protection of Personal
              Information Act 4 of 2013 (POPIA).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Account information: name, email address, and password</li>
              <li>Fitness assessment data: age, weight, height, goals, health notes, dietary preferences</li>
              <li>Usage data: workout and meal logs, points, and exercise selections</li>
              <li>Billing data: subscription status, Paystack customer/subscription references, payment confirmation timestamps</li>
              <li>Technical data: browser type, device information, and IP address</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Generate personalised workout and meal plans</li>
              <li>Track progress and manage your free trial / paid subscription</li>
              <li>Process payments and prevent fraud via our payment provider</li>
              <li>Improve the service and communicate important account updates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Data Storage &amp; Processors</h2>
            <p>
              Your plan and progress may be stored in your browser for speed, while account
              engagement and billing status are also stored on our servers so we can restore
              paid access after payment. Payment card details are never stored by us.
            </p>
            <p className="mt-3">
              Payments are processed by <strong>Paystack</strong>, an independent payment service
              provider. Paystack may process data in jurisdictions outside South Africa under
              their own privacy terms. We do not sell your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Retention</h2>
            <p>
              We keep account and billing records for as long as your account is active and for
              a reasonable period afterwards for legal, tax, and dispute purposes. You may request
              deletion of personal data subject to those obligations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Your Rights (POPIA)</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access the personal information we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Object to processing of your personal information</li>
              <li>Lodge a complaint with the Information Regulator of South Africa</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Health Disclaimer</h2>
            <p>
              Information provided through AI Fitness Coach is for general fitness and wellness
              purposes only. It is not medical advice. Consult a qualified healthcare professional
              before starting any exercise or nutrition programme.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">8. Contact</h2>
            <p>
              Privacy enquiries:{" "}
              <a href="mailto:privacy@aifitnesscoach.co.za" className="text-emerald-400">
                privacy@aifitnesscoach.co.za
              </a>
              <br />
              Support:{" "}
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
