"use client";
import React from "react";

import Hero from "./components/hero/hero";
import HowItWorks from "./components/how-its-work/HowItsWork";
import Footer from "./components/footer/footer";
import AboutUs from "./components/about/AboutUs";
import FeaturesSection from "./components/features/featureSection";
import FAQs from "./components/faq/FAQ";
import CTA from "./components/cta/CTA";

export default function LandingPage() {
  return (
    <div className="bg-[#090A0B] w-full ">
      <Hero />
      <FeaturesSection />
      <AboutUs />
      <HowItWorks />
      <FAQs />
      <CTA />
      <Footer />
    </div>
  );
}
