"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button, buttonVariants } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";

export default function Navbar() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [activeSection, setActiveSection] = useState("hero");

	const { data: session, status } = useSession();
	if (status === "loading") {
		return <Spinner />;
	}

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 100);

			const sections = ["hero", "features", "pricing", "testimonials", "faq"];
			const scrollPosition = window.scrollY + 200;

			for (const section of sections) {
				const element = document.getElementById(section);
				if (element) {
					const offsetTop = element.offsetTop;
					const offsetBottom = offsetTop + element.offsetHeight;

					if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
						setActiveSection(section);
						break;
					}
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleMobileNavClick = (elementId: string) => {
		setIsMobileMenuOpen(false);
		setTimeout(() => {
			const element = document.getElementById(elementId);
			if (element) {
				const headerOffset = 120;
				const elementPosition =
					element.getBoundingClientRect().top + window.pageYOffset;
				const offsetPosition = elementPosition - headerOffset;

				window.scrollTo({
					top: offsetPosition,
					behavior: "smooth",
				});
			}
		}, 100);
	};

	return (
		<>
			{/* Desktop Header */}
			<header
				className={`sticky top-4 z-9999 mx-auto hidden w-full flex-row items-center justify-between self-start rounded-full bg-background/80 md:flex backdrop-blur-sm border border-border/50 shadow-lg transition-all duration-300 ${
					isScrolled ? "max-w-4xl px-2" : "max-w-6xl px-4"
				} py-2`}
				style={{
					willChange: "transform",
					transform: "translateZ(0)",
					backfaceVisibility: "hidden",
					perspective: "1000px",
				}}
			>
				<a
					className={`z-50 flex items-center justify-center gap-2 transition-all duration-300 dark:bg-white dark:rounded-full ${
						isScrolled ? "ml-4" : ""
					}`}
					href="/"
				>
					<Image
						src="/assets/images/eduvoka-logo.png"
						alt="Eduvoka Logo"
						width={80}
						height={80}
						className="p-3"
					/>
				</a>

				<div className="absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-muted-foreground transition duration-200 hover:text-foreground md:flex md:space-x-2">
					<a
						className={`relative px-4 py-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer${
							activeSection === "hero"
								? " text-primary border border-primary rounded-full font-semibold"
								: ""
						}`}
						onClick={(e) => {
							e.preventDefault();
							const element = document.getElementById("hero");
							if (element) {
								const headerOffset = 120;
								const elementPosition =
									element.getBoundingClientRect().top + window.pageYOffset;
								const offsetPosition = elementPosition - headerOffset;

								window.scrollTo({
									top: offsetPosition,
									behavior: "smooth",
								});
							}
						}}
					>
						<span>Home</span>
					</a>
					<a
						className={`relative px-4 py-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer${
							activeSection === "features"
								? " text-primary border border-primary rounded-full font-semibold"
								: ""
						}`}
						onClick={(e) => {
							e.preventDefault();
							const element = document.getElementById("features");
							if (element) {
								const headerOffset = 50;
								const elementPosition =
									element.getBoundingClientRect().top + window.pageYOffset;
								const offsetPosition = elementPosition - headerOffset;

								window.scrollTo({
									top: offsetPosition,
									behavior: "smooth",
								});
							}
						}}
					>
						<span className="relative z-20">Features</span>
					</a>
					<a
						className={`relative px-4 py-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer${
							activeSection === "pricing"
								? " text-primary border border-primary rounded-full font-semibold"
								: ""
						}`}
						onClick={(e) => {
							e.preventDefault();
							const element = document.getElementById("pricing");
							if (element) {
								const headerOffset = 60;
								const elementPosition =
									element.getBoundingClientRect().top + window.pageYOffset;
								const offsetPosition = elementPosition - headerOffset;

								window.scrollTo({
									top: offsetPosition,
									behavior: "smooth",
								});
							}
						}}
					>
						<span className="relative z-20">Pricing</span>
					</a>
					<a
						className={`relative px-4 py-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer${
							activeSection === "testimonials"
								? " text-primary border border-primary rounded-full font-semibold"
								: ""
						}`}
						onClick={(e) => {
							e.preventDefault();
							const element = document.getElementById("testimonials");
							if (element) {
								const headerOffset = 120;
								const elementPosition =
									element.getBoundingClientRect().top + window.pageYOffset;
								const offsetPosition = elementPosition - headerOffset;

								window.scrollTo({
									top: offsetPosition,
									behavior: "smooth",
								});
							}
						}}
					>
						<span className="relative z-20">Testimonials</span>
					</a>
					<a
						className={`relative px-4 py-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer${
							activeSection === "faq"
								? " text-primary border border-primary rounded-full font-semibold"
								: ""
						}`}
						onClick={(e) => {
							e.preventDefault();
							const element = document.getElementById("faq");
							if (element) {
								const headerOffset = 60;
								const elementPosition =
									element.getBoundingClientRect().top + window.pageYOffset;
								const offsetPosition = elementPosition - headerOffset;

								window.scrollTo({
									top: offsetPosition,
									behavior: "smooth",
								});
							}
						}}
					>
						<span className="relative z-20">FAQ</span>
					</a>
				</div>

				<div className="flex items-center">
					{!session ? (
						<>
							<Button
								variant="link"
								className="relative z-50 font-medium cursor-pointer transition-colors hover:text-primary hover:no-underline text-muted-foreground text-sm"
								asChild
							>
								<Link href="/auth/sign-in">Sign in</Link>
							</Button>

							<Button
								variant="default"
								className="relative z-50 font-bold cursor-pointer rounded-full hover:-translate-y-0.5 transition duration-200"
								asChild
							>
								<Link href="/auth/sign-up">Sign up</Link>
							</Button>
						</>
					) : (
						<Button
							variant="default"
							className="relative z-50 font-bold cursor-pointer rounded-full hover:-translate-y-0.5 transition duration-200"
							asChild
						>
							<Link href="/dashboard">Dashboard</Link>
						</Button>
					)}

					{/* theme changer */}
					<AnimatedThemeToggler
						className={buttonVariants({
							variant: "outline",
							size: "icon",
							className:
								"dark:border-white/20 rounded-full ml-2 cursor-pointer relative z-50 hover:-translate-y-0.5 hover:bg-white/60 hover:text-black/60 dark:hover:text-white/60 transition duration-200",
						})}
					/>
				</div>
			</header>

			{/* Mobile Header */}
			<header className="sticky top-4 z-[9999] mx-4 flex w-auto flex-row items-center justify-between rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg md:hidden px-4 py-3">
				<a
					className="flex items-center justify-center gap-2"
					href="https://v0.app"
					target="_blank"
					rel="noopener noreferrer"
				>
					<svg
						fill="currentColor"
						viewBox="0 0 147 70"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
						className="text-foreground rounded-full size-7 w-7"
					>
						<path d="M56 50.2031V14H70V60.1562C70 65.5928 65.5928 70 60.1562 70C57.5605 70 54.9982 68.9992 53.1562 67.1573L0 14H19.7969L56 50.2031Z"></path>
						<path d="M147 56H133V23.9531L100.953 56H133V70H96.6875C85.8144 70 77 61.1856 77 50.3125V14H91V46.1562L123.156 14H91V0H127.312C138.186 0 147 8.81439 147 19.6875V56Z"></path>
					</svg>
				</a>

				<button
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					className="flex items-center justify-center w-10 h-10 rounded-full bg-background/50 border border-border/50 transition-colors hover:bg-background/80"
					aria-label="Toggle menu"
				>
					<div className="flex flex-col items-center justify-center w-5 h-5 space-y-1">
						<span
							className={`block w-4 h-0.5 bg-foreground transition-all duration-300 ${
								isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
							}`}
						></span>
						<span
							className={`block w-4 h-0.5 bg-foreground transition-all duration-300 ${
								isMobileMenuOpen ? "opacity-0" : ""
							}`}
						></span>
						<span
							className={`block w-4 h-0.5 bg-foreground transition-all duration-300 ${
								isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
							}`}
						></span>
					</div>
				</button>
			</header>

			{/* Mobile Menu Overlay */}
			{isMobileMenuOpen && (
				<div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm md:hidden">
					<div className="absolute top-20 left-4 right-4 bg-background/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-2xl p-6">
						<nav className="flex flex-col space-y-4">
							<button
								onClick={() => handleMobileNavClick("features")}
								className="text-left px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-background/50"
							>
								Features
							</button>
							<button
								onClick={() => handleMobileNavClick("pricing")}
								className="text-left px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-background/50"
							>
								Pricing
							</button>
							<button
								onClick={() => handleMobileNavClick("testimonials")}
								className="text-left px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-background/50"
							>
								Testimonials
							</button>
							<button
								onClick={() => handleMobileNavClick("faq")}
								className="text-left px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-background/50"
							>
								FAQ
							</button>
							<div className="border-t border-border/50 pt-4 mt-4 flex flex-col space-y-3">
								<a
									href="/login"
									className="px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-background/50 cursor-pointer"
								>
									Log In
								</a>
								<a
									href="/signup"
									className="px-4 py-3 text-lg font-bold text-center bg-gradient-to-b from-primary to-primary/80 text-primary-foreground rounded-lg shadow-lg hover:-translate-y-0.5 transition-all duration-200"
								>
									Sign Up
								</a>
							</div>
						</nav>
					</div>
				</div>
			)}
		</>
	);
}
