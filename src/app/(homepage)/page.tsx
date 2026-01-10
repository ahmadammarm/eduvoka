import { FAQSection } from "./_components/Faq";
import Features from "./_components/Features";
import { StickyFooter } from "./_components/Footer";
import Hero from "./_components/Hero";
import Navbar from "./_components/Navbar";
import { NewReleasePromo } from "./_components/NewRelease";
import { PricingSection } from "./_components/Pricing";
import { TestimonialsSection } from "./_components/Testimonials";

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
