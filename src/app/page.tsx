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

export default function HomePage() {
  return (
    <>
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
