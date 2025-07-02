import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";
import StickyButton from "../components/StickyButton";
import CustomerCarousel from "../components/CustomerCarousel";
import LandingSection from "../components/LandingSection";
import SpecialitiesSection from "../components/SpecialitiesSection";
import AlternativesSection from "../components/AlternativesSection";


export default function Home() {
  return (
    <>
      {/* Main section with background image */}
      <main className="hero-container relative min-h-screen bg-[url('/bg.png')] bg-cover bg-no-repeat bg-center">
        <Navigation />
        <Hero />
        {/* Customer Carousel section */}
        <CustomerCarousel />
      </main>

      {/* Combined Features and Pricing section */}
      <section className="relative bg-white">
        <div className="max-w-[1400px] mx-auto">
          {/* Features */}
          <Features />
          
          {/* Pricing */}
          <Pricing />
        </div>
      </section>
      <LandingSection />
      <SpecialitiesSection />
      <AlternativesSection />
   
      {/* Footer */}
      <Footer />

      {/* Sticky Button */}
      <StickyButton />
    </>
  );
}
