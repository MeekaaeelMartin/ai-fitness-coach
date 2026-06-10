import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | AI Fitness Coach",
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
              AI Fitness Coach (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy.
              This policy explains how we collect, use, and safeguard your information when you use our
              website and services in South Africa, in accordance with the Protection of Personal Information Act (POPIA).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Account information: name, email address, password</li>
              <li>Fitness assessment data: age, weight, height, goals, health history, dietary preferences</li>
              <li>Usage data: workout and meal logs, points, exercise selections</li>
              <li>Technical data: browser type, device information, IP address</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. How We Use Your Information</h2>
            <p>We use your data to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Generate personalised workout and meal plans</li>
              <li>Track your progress and award achievement points</li>
              <li>Improve our services and user experience</li>
              <li>Communicate important account or service updates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Data Storage</h2>
            <p>
              Currently, account and plan data is stored locally in your browser. When we introduce
              cloud storage, we will update this policy and notify you. We do not sell your personal
              information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Your Rights (POPIA)</h2>
            <p>Under POPIA, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access the personal information we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Object to processing of your personal information</li>
              <li>Lodge a complaint with the Information Regulator of South Africa</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Health Disclaimer</h2>
            <p>
              Information provided through AI Fitness Coach is for general fitness and wellness purposes
              only. It is not medical advice. Consult a qualified healthcare professional before starting
              any exercise or nutrition programme.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Contact</h2>
            <p>
              For privacy enquiries, contact us at{" "}
              <a href="mailto:privacy@aifitnesscoach.co.za" className="text-emerald-400">
                privacy@aifitnesscoach.co.za
              </a>
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
