"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Instagram, Facebook, Phone, MapPin } from "lucide-react";

export function StickyFooter() {
	const [isAtBottom, setIsAtBottom] = useState(false);

	useEffect(() => {
		let ticking = false;

		const handleScroll = () => {
			if (!ticking) {
				requestAnimationFrame(() => {
					const scrollTop = window.scrollY;
					const windowHeight = window.innerHeight;
					const documentHeight = document.documentElement.scrollHeight;
					const isNearBottom = scrollTop + windowHeight >= documentHeight - 100;

					setIsAtBottom(isNearBottom);
					ticking = false;
				});
				ticking = true;
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll(); // Check initial state
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<AnimatePresence>
			{isAtBottom && (
				<motion.div
					className="fixed z-50 bottom-0 left-0 w-full h-auto min-h-96 flex justify-center items-center"
					style={{ backgroundColor: "#e36a24" }}
					initial={{ y: "100%" }}
					animate={{ y: 0 }}
					exit={{ y: "100%" }}
					transition={{ duration: 0.3, ease: "easeOut" }}
				>
					<div
						className="relative overflow-hidden w-full h-full flex flex-col lg:flex-row justify-between px-8 lg:px-12 py-12 gap-8"
						style={{ color: "#121113" }}
					>
						{/* Left Section - About & Logo */}
						<motion.div
							className="flex flex-col space-y-4 max-w-md"
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.1 }}
						>
							<h2
								className="text-4xl sm:text-5xl lg:text-6xl font-bold"
								style={{ color: "#121113" }}
							>
								EDUVOKA
							</h2>
							<p className="text-sm sm:text-base" style={{ color: "#121113" }}>
							An adaptive e-learning platform powered by learning analytics,
							real-time action data, and a Socratic AI tutor — helping
							students learn smarter, avoid burnout, and track real progress.
							</p>
						</motion.div>

						{/* Middle Section - Navigation & Social Media */}
						<motion.div
							className="flex flex-col sm:flex-row gap-8 sm:gap-12 lg:gap-16"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
						>
							{/* Navigation Links */}
							<div>
								<h3
									className="font-semibold text-lg mb-3"
									style={{ color: "#121113" }}
								>
									Navigation
								</h3>
								<ul className="space-y-2">
									<li
										className="hover:underline cursor-pointer transition-colors text-sm sm:text-base"
										style={{ color: "#121113" }}
										onMouseEnter={(e) =>
											((e.target as HTMLElement).style.color =
												"rgba(18, 17, 19, 0.8)")
										}
										onMouseLeave={(e) =>
											((e.target as HTMLElement).style.color = "#121113")
										}
									>
										Home
									</li>
									<li
										className="hover:underline cursor-pointer transition-colors text-sm sm:text-base"
										style={{ color: "#121113" }}
										onMouseEnter={(e) =>
											((e.target as HTMLElement).style.color =
												"rgba(18, 17, 19, 0.8)")
										}
										onMouseLeave={(e) =>
											((e.target as HTMLElement).style.color = "#121113")
										}
									>
										Feature
									</li>
									<li
										className="hover:underline cursor-pointer transition-colors text-sm sm:text-base"
										style={{ color: "#121113" }}
										onMouseEnter={(e) =>
											((e.target as HTMLElement).style.color =
												"rgba(18, 17, 19, 0.8)")
										}
										onMouseLeave={(e) =>
											((e.target as HTMLElement).style.color = "#121113")
										}
									>
										Dashboard
									</li>
								</ul>
							</div>

							{/* Social Media Icons */}
							<div>
								<h3
									className="font-semibold text-lg mb-3"
									style={{ color: "#121113" }}
								>
									Follow Us
								</h3>
								<div className="flex gap-4">
									<a
										href="#"
										className="hover:scale-110 transition-transform"
										aria-label="Instagram"
									>
										<Instagram
											className="w-6 h-6"
											style={{ color: "#121113" }}
										/>
									</a>
									<a
										href="#"
										className="hover:scale-110 transition-transform"
										aria-label="TikTok"
									>
										<svg
											className="w-6 h-6"
											style={{ fill: "#121113" }}
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
										</svg>
									</a>
									<a
										href="#"
										className="hover:scale-110 transition-transform"
										aria-label="Facebook"
									>
										<Facebook
											className="w-6 h-6"
											style={{ color: "#121113" }}
										/>
									</a>
								</div>
							</div>
						</motion.div>

						{/* Right Section - Contact & Map */}
						<motion.div
							className="flex flex-col space-y-4 max-w-md mb-4"
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
						>
							<div>
								<h3
									className="font-semibold text-lg mb-3"
									style={{ color: "#121113" }}
								>
									Contact Us
								</h3>
								<div className="space-y-2 text-sm sm:text-base">
									<div className="flex items-start gap-2">
										<MapPin
											className="w-5 h-5 flex-shrink-0 mt-0.5"
											style={{ color: "#121113" }}
										/>
										<p style={{ color: "#121113" }}>
											Jl. Cakrawala No.5, Sumbersari, Kec. Lowokwaru, Kota
											Malang, Jawa Timur 65145
										</p>
									</div>
									<div className="flex items-center gap-2">
										<Phone className="w-5 h-5" style={{ color: "#121113" }} />
										<p style={{ color: "#121113" }}>+62xx xxxx xxxx</p>
									</div>
								</div>
							</div>

							{/* Map */}
							<div className="w-full h-48 rounded-lg overflow-hidden border-2 border-black/20">
								<iframe
									src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.3706440132637!2d112.6176771!3d-7.960594299999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e788281bdd08839%3A0xc915f268bffa831f!2sUniversitas%20Negeri%20Malang!5e0!3m2!1sid!2sid!4v1767144376468!5m2!1sid!2sid"
									width="100%"
									height="100%"
									style={{ border: 0 }}
									allowFullScreen
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
								/>
							</div>
						</motion.div>

						{/* Copyright - Absolute positioned */}
						<motion.p
							className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs sm:text-sm font-medium"
							style={{ color: "#121113" }}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.6, delay: 0.5 }}
						>
							© 2026 EDUVOKA. All rights reserved.
						</motion.p>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
