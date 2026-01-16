import {
  Navbar,
  HeroSection,
  LogosSection,
  FeaturesSection,
  StatsSection,
  TestimonialsSection,
  PricingSection,
  CTASection,
  FooterSection,
} from "./components";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#030303]">
      <Navbar />
      <main>
        <HeroSection />
        <LogosSection />
        <section id="features">
          <FeaturesSection />
        </section>
        <StatsSection />
        <section id="testimonials">
          <TestimonialsSection />
        </section>
        <section id="pricing">
          <PricingSection />
        </section>
        <section id="contact">
          <CTASection />
        </section>
      </main>
      <FooterSection />
    </div>
  );
};
