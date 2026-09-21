import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { SocialProofBar } from "@/components/landing/social-proof-bar";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Transformation } from "@/components/landing/transformation";
import { Benefits } from "@/components/landing/benefits";
import { PricingValue } from "@/components/landing/pricing-value";
import { Testimonials } from "@/components/landing/testimonials";
import { FinalCta } from "@/components/landing/final-cta";
import { FAQ } from "@/components/landing/faq";
import { StickyCta } from "@/components/landing/sticky-cta";
import { HomeJsonLd } from "@/components/seo/json-ld";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: `${SITE_NAME} | AI Personal Trainer & Meal Plans for South Africa`,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: `${SITE_NAME} | AI Personal Trainer for South Africa`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
};

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <Hero />
      <SocialProofBar />
      <HowItWorks />
      <Transformation />
      <Benefits />
      <PricingValue />
      <Testimonials />
      <FinalCta />
      <FAQ />
      <StickyCta />
    </>
  );
}
