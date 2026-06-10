import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Benefits } from "@/components/landing/benefits";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <FAQ />
    </>
  );
}
