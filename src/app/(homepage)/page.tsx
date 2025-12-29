import Navbar from "@/components/homepage/Navbar";
import Hero from "@/components/homepage/Hero";
import Features from "@/components/homepage/Features";
import { TestimonialsSection } from "@/components/homepage/Testimonials";
import { NewReleasePromo } from "@/components/homepage/NewRelease";
import { FAQSection } from "@/components/homepage/Faq";
import { PricingSection } from "@/components/homepage/Pricing";
import { StickyFooter } from "@/components/homepage/Footer";

export default function Home() {
	return (
		<div className="min-h-screen w-full relative bg-white dark:bg-black">
			<div
				className="absolute inset-0 z-0 bg-white dark:bg-black"
				style={{
					backgroundImage:
						"radial-gradient(ellipse 70% 35% at 50% 0%, rgba(240, 223, 201, 0.5), transparent 80%)",
				}}
			/>

			{/* Navbar */}
			<Navbar />

			{/* Hero Section */}
			<div id="hero">
				<Hero />
			</div>

			{/* Features Section */}
			<div id="features">
				<Features />
			</div>

			{/* Pricing Section */}
			<div id="pricing">
				<PricingSection />
			</div>

			{/* Testimonials Section */}
			<div id="testimonials">
				<TestimonialsSection />
			</div>

			<NewReleasePromo />

			{/* FAQ Section */}
			<div id="faq">
				<FAQSection />
			</div>

			{/* Sticky Footer */}
			<StickyFooter />
		</div>
	);
}
