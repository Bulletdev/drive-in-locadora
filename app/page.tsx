import { HeroSection } from "@/components/home/hero-section"
import { OffersSection } from "@/components/home/offers-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { AboutSection } from "@/components/home/about-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { FinalCTASection } from "@/components/home/final-cta-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <OffersSection />
      <CategoriesSection />
      <AboutSection />
      <TestimonialsSection />
      <FinalCTASection />
    </div>
  )
}
