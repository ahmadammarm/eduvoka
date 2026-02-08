"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FAQSection() {
	const [openItems, setOpenItems] = useState<number[]>([]);

	const toggleItem = (index: number) => {
		setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
	};

	const faqs = [
		{
			question: "What is EDUVOKA?",
			answer:
				"EDUVOKA is an adaptive e-learning platform that uses learning analytics, real-time action data, and AI-powered Socratic tutoring to deliver a personalized and effective study experience for every student.",
		},
		{
			question: "How does the Learning Analytics feature work?",
			answer:
				"The platform continuously tracks your accuracy, time-per-question, error patterns, and weakness clusters across every subject. These insights are used to adapt your practice sessions so you always focus on the areas that matter most.",
		},
		{
			question: "What is the Socratic AI Tutor?",
			answer:
				"Instead of giving you direct answers, the AI tutor uses the PAPE method—Probe, Analyze, Persist, Evaluate—to ask guided questions that help you discover the solution on your own, building deeper understanding.",
		},
		{
			question: "How does EDUVOKA detect burnout?",
			answer:
				"Every click, answer change, and hesitation is captured in real time. The system analyzes these signals to detect cognitive overload and fatigue, then suggests smart breaks or adjusts session difficulty before burnout hits.",
		},
		{
			question: "What is the Learning Velocity score?",
			answer:
				"Learning Velocity is a composite score (0–100) that measures how quickly you truly master concepts. It combines your accuracy rate, response speed, consistency, and improvement trend—giving you a clear picture of real progress over time.",
		},
	];

	return (
		<section id="faq" className="relative overflow-hidden pb-120 pt-24">
			{/* Background blur effects */}
			<div className="bg-primary/20 absolute top-1/2 -right-20 z-[-1] h-64 w-64 rounded-full opacity-80 blur-3xl"></div>
			<div className="bg-primary/20 absolute top-1/2 -left-20 z-[-1] h-64 w-64 rounded-full opacity-80 blur-3xl"></div>

			<div className="z-10 container mx-auto px-4">
				<motion.div
					className="flex justify-center"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
				>
					<div className="border-primary/40 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 uppercase">
						<span>✶</span>
						<span className="text-sm">Faqs</span>
					</div>
				</motion.div>

				<motion.h2
					className="mx-auto mt-6 max-w-2xl text-center text-4xl font-medium md:text-[54px] md:leading-[60px]"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					viewport={{ once: true }}
				>
					Got questions? We have{" "}
					<span className="bg-gradient-to-b from-foreground via-rose-200 to-primary bg-clip-text text-transparent">
						answers
					</span>
				</motion.h2>

				<div className="mx-auto mt-12 flex max-w-xl flex-col gap-6">
					{faqs.map((faq, index) => (
						<motion.div
							key={index}
							className="from-primary/20 to-primary/10 rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-b p-6 shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)_inset] transition-all duration-300 hover:border-black/20 dark:hover:border-white/20 cursor-pointer"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							viewport={{ once: true }}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => toggleItem(index)}
							role="button"
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									toggleItem(index);
								}
							}}
							{...(index === faqs.length - 1 && { "data-faq": faq.question })}
						>
							<div className="flex items-start justify-between">
								<h3 className="m-0 font-medium pr-4">{faq.question}</h3>
								<motion.div
									animate={{ rotate: openItems.includes(index) ? 180 : 0 }}
									transition={{ duration: 0.3, ease: "easeInOut" }}
									className=""
								>
									{openItems.includes(index) ? (
										<Minus className="text-primary flex-shrink-0 transition duration-300" size={24} />
									) : (
										<Plus className="text-primary flex-shrink-0 transition duration-300" size={24} />
									)}
								</motion.div>
							</div>
							<AnimatePresence>
								{openItems.includes(index) && (
									<motion.div
										className="mt-4 text-muted-foreground leading-relaxed overflow-hidden"
										initial={{ opacity: 0, height: 0, marginTop: 0 }}
										animate={{ opacity: 1, height: "auto", marginTop: 16 }}
										exit={{ opacity: 0, height: 0, marginTop: 0 }}
										transition={{
											duration: 0.4,
											ease: "easeInOut",
											opacity: { duration: 0.2 },
										}}
									>
										{faq.answer}
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
