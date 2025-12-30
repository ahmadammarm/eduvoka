"use client";

import { FollowerPointerCard } from "../ui/following-pointer";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Marquee } from "../magicui/marquee";
import { AnimatedBeam } from "../ui/animated-beam";

export default function Features() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, amount: 0.3 });
	const [isHovering, setIsHovering] = useState(false);
	const [isCliHovering, setIsCliHovering] = useState(false);
	const [isFeature3Hovering, setIsFeature3Hovering] = useState(false);
	const [isFeature4Hovering, setIsFeature4Hovering] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const div1Ref = useRef<HTMLDivElement>(null);
	const div2Ref = useRef<HTMLDivElement>(null);
	const div3Ref = useRef<HTMLDivElement>(null);
	const div4Ref = useRef<HTMLDivElement>(null);
	const div5Ref = useRef<HTMLDivElement>(null);

	return (
		<section
			id="features"
			className="text-foreground relative overflow-hidden py-12 sm:py-24 md:py-32"
		>
			<div className="bg-primary absolute -top-10 left-1/2 h-16 w-44 -translate-x-1/2 rounded-full opacity-40 blur-3xl select-none"></div>
			<div className="via-primary/50 absolute top-0 left-1/2 h-px w-3/5 -translate-x-1/2 bg-gradient-to-r from-transparent to-transparent transition-all ease-in-out"></div>
			<motion.div
				ref={ref}
				initial={{ opacity: 0, y: 50 }}
				animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
				transition={{ duration: 0.5, delay: 0 }}
				className="container mx-auto flex flex-col items-center gap-6 sm:gap-12"
			>
				<h2
					className={cn(
						"via-foreground mb-8 bg-gradient-to-b from-zinc-800 to-zinc-700 bg-clip-text text-center text-4xl font-semibold tracking-tighter text-transparent md:text-[54px] md:leading-[60px]"
					)}
				>
					Features
				</h2>
				<FollowerPointerCard
					title={
						<div className="flex items-center gap-2">
							<span>Interactive Features</span>
						</div>
					}
				>
					<div className="cursor-none">
						<div className="grid grid-cols-12 gap-4 justify-center">
							{/* Feature 1 */}
							<motion.div
								className="group border-primary/40 text-card-foreground relative col-span-12 flex flex-col overflow-hidden rounded-xl border-2 p-6 shadow-xl transition-all ease-in-out md:col-span-6 xl:col-span-6 xl:col-start-2"
								onMouseEnter={() => setIsCliHovering(true)}
								onMouseLeave={() => setIsCliHovering(false)}
								ref={ref}
								initial={{ opacity: 0, y: 50 }}
								animate={
									isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
								}
								transition={{ duration: 0.5, delay: 0.5 }}
								whileHover={{
									scale: 1.02,
									borderColor: "rgba(231, 138, 83, 0.6)",
									boxShadow: "0 0 30px rgba(231, 138, 83, 0.2)",
								}}
								style={{ transition: "all 0s ease-in-out" }}
							>
								<div className="flex flex-col gap-4 mb-2">
									<h3 className="text-2xl leading-none font-semibold tracking-tight">
										Simulasi TO & Latihan Soal
									</h3>
									<div className="text-md text-muted-foreground flex flex-col gap-2 text-sm">
										<p className="max-w-[460px]">
											Latihan intensif dengan konsep VAK (Visual, Auditory,
											Kinesthetic) untuk memaksimalkan pemahaman Anda.
										</p>
									</div>
								</div>
								<div className="pointer-events-none flex grow items-center justify-center select-none relative">
									<div
										className="relative w-full h-[400px] rounded-xl overflow-hidden"
										style={{ borderRadius: "20px" }}
									>
										{/* Background Image */}
										<div className="absolute inset-0">
											<img
												src="https://framerusercontent.com/images/UjqUIiBHmIcSH9vos9HlG2BF4bo.png"
												alt="Arrow-CoreExchange"
												className="w-full h-full object-cover rounded-xl"
											/>
										</div>

										{/* Animated SVG Connecting Lines */}
										<motion.div
											className="absolute inset-0 flex items-center justify-center"
											initial={{ opacity: 0 }}
											animate={isCliHovering ? { opacity: 1 } : { opacity: 0 }}
											transition={{ duration: 0.5 }}
										>
											<svg
												width="100%"
												height="100%"
												viewBox="0 0 121 94"
												className="absolute"
											>
												<motion.path
													d="M 60.688 1.59 L 60.688 92.449 M 60.688 92.449 L 119.368 92.449 M 60.688 92.449 L 1.414 92.449"
													stroke="rgb(255, 255, 255)"
													fill="transparent"
													strokeDasharray="2 2"
													initial={{ pathLength: 0 }}
													animate={
														isCliHovering
															? { pathLength: 1 }
															: { pathLength: 0 }
													}
													transition={{
														duration: 2,
														ease: "easeInOut",
													}}
												/>
											</svg>
											<svg
												width="100%"
												height="100%"
												viewBox="0 0 121 94"
												className="absolute"
											>
												<motion.path
													d="M 60.688 92.449 L 60.688 1.59 M 60.688 1.59 L 119.368 1.59 M 60.688 1.59 L 1.414 1.59"
													stroke="rgb(255, 255, 255)"
													fill="transparent"
													strokeDasharray="2 2"
													initial={{ pathLength: 0 }}
													animate={
														isCliHovering
															? { pathLength: 1 }
															: { pathLength: 0 }
													}
													transition={{
														duration: 2,
														delay: 0.5,
														ease: "easeInOut",
													}}
												/>
											</svg>
										</motion.div>

										{/* Animated Glow Effect */}
										<motion.div
											className="absolute top-1/2 left-1/2 w-20 h-20 bg-primary rounded-full blur-[80px] opacity-50 transform -translate-x-1/2 -translate-y-1/2"
											initial={{ scale: 1 }}
											animate={
												isCliHovering
													? { scale: [1, 1.5, 1, 1.5] }
													: { scale: 1 }
											}
											transition={{
												duration: 3,
												ease: "easeInOut",
												repeat: isCliHovering ? Number.POSITIVE_INFINITY : 0,
												repeatType: "loop",
											}}
										/>

										{/* Main Content Container with Staggered Animations */}
										<div className="absolute inset-0 flex items-center justify-center">
											<div className="flex items-center gap-6">
												{/* Left Column - TPS */}
												<div className="flex flex-col gap-3">
													{[
														{
															label: "Penalaran Umum",
															icon: "🧠",
															color: "bg-blue-500",
														},
														{
															label: "Pemahaman Bacaan",
															icon: "📖",
															color: "bg-purple-500",
														},
														{
															label: "Pengetahuan Umum",
															icon: "🌍",
															color: "bg-green-500",
														},
														{
															label: "Pengetahuan Kuantitatif",
															icon: "📊",
															color: "bg-indigo-500",
														},
													].map((item, index) => (
														<motion.div
															key={`tps-${index}`}
															className="bg-white rounded-full p-2 flex items-center gap-2 text-gray-800 text-xs font-medium shadow"
															initial={{ opacity: 0, x: -30 }}
															animate={
																isCliHovering
																	? { opacity: 1, x: 0 }
																	: { opacity: 0, x: -30 }
															}
															transition={{
																duration: 0.6,
																delay: index * 0.15,
																ease: "easeOut",
															}}
															whileHover={{ scale: 1.05, x: -5 }}
														>
															<div
																className={`w-6 h-6 ${item.color} rounded-full flex items-center justify-center text-white text-xs`}
															>
																{item.icon}
															</div>
															<span className="whitespace-nowrap">
																{item.label}
															</span>
														</motion.div>
													))}
												</div>

												{/* Center Logo with Badge */}
												<motion.div
													className="relative"
													initial={{ opacity: 1, scale: 1 }}
													animate={
														isCliHovering
															? { scale: [1, 1.15, 1] }
															: { scale: 1 }
													}
													transition={{ duration: 0.8, ease: "easeOut" }}
												>
													<div className="w-20 h-20 bg-white rounded-full overflow-hidden shadow-xl flex items-center justify-center">
														<Image
															src="/assets/images/logo-eduvoka.png"
															alt="Eduvoka Logo"
															width={100}
															height={100}
															className="p-2"
														/>
													</div>
												</motion.div>

												{/* Right Column - TL */}
												<div className="flex flex-col gap-3">
													{[
														{
															label: "Literasi B. Indonesia",
															icon: "🇮🇩",
															color: "bg-red-500",
														},
														{
															label: "Literasi B. Inggris",
															icon: "🇬🇧",
															color: "bg-blue-600",
														},
														{
															label: "Penalaran Matematika",
															icon: "🔢",
															color: "bg-orange-500",
														},
													].map((item, index) => (
														<motion.div
															key={`tl-${index}`}
															className="bg-white rounded-full p-2 flex items-center gap-2 text-gray-800 text-xs font-medium shadow"
															initial={{ opacity: 0, x: 30 }}
															animate={
																isCliHovering
																	? { opacity: 1, x: 0 }
																	: { opacity: 0, x: 30 }
															}
															transition={{
																duration: 0.6,
																delay: index * 0.15,
																ease: "easeOut",
															}}
															whileHover={{ scale: 1.05, x: 5 }}
														>
															<div
																className={`w-6 h-6 ${item.color} rounded-full flex items-center justify-center text-white text-xs`}
															>
																{item.icon}
															</div>
															<span className="whitespace-nowrap">
																{item.label}
															</span>
														</motion.div>
													))}
												</div>
											</div>
										</div>

										{/* Animated Circular Border */}
										<motion.div
											className="absolute inset-0 flex items-center justify-center"
											initial={{ opacity: 0 }}
											animate={isCliHovering ? { opacity: 1 } : { opacity: 0 }}
											transition={{ duration: 0.5 }}
										>
											<svg
												width="350"
												height="350"
												viewBox="0 0 350 350"
												className="opacity-30"
											>
												<motion.path
													d="M 175 1.159 C 271.01 1.159 348.841 78.99 348.841 175 C 348.841 271.01 271.01 348.841 175 348.841 C 78.99 348.841 1.159 271.01 1.159 175 C 1.159 78.99 78.99 1.159 175 1.159 Z"
													stroke="rgba(255, 255, 255, 0.5)"
													strokeWidth="2"
													fill="transparent"
													strokeDasharray="6 6"
													initial={{ pathLength: 0, rotate: 0 }}
													animate={
														isCliHovering
															? { pathLength: 1, rotate: 360 }
															: { pathLength: 0, rotate: 0 }
													}
													transition={{
														pathLength: { duration: 3, ease: "easeInOut" },
														rotate: {
															duration: 20,
															repeat: isCliHovering
																? Number.POSITIVE_INFINITY
																: 0,
															ease: "linear",
														},
													}}
												/>
											</svg>
										</motion.div>
									</div>
								</div>
							</motion.div>

							{/* Feature 2 */}
							<motion.div
								className="group border-primary/40 text-card-foreground relative col-span-12 flex flex-col overflow-hidden rounded-xl border-2 p-6 shadow-xl transition-all ease-in-out md:col-span-6 xl:col-span-6 xl:col-start-8"
								onMouseEnter={() => setIsHovering(true)}
								onMouseLeave={() => setIsHovering(false)}
								ref={ref}
								initial={{ opacity: 0, y: 50 }}
								animate={
									isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
								}
								transition={{ duration: 0.5, delay: 0.5 }}
								whileHover={{
									scale: 1.02,
									borderColor: "rgba(231, 138, 83, 0.6)",
									boxShadow: "0 0 30px rgba(231, 138, 83, 0.2)",
								}}
								style={{ transition: "all 0s ease-in-out" }}
							>
								<div className="flex flex-col gap-4 mb-4">
									<h3 className="text-2xl leading-none font-semibold tracking-tight">
										Studi Planner With Pomodoro
									</h3>
									<div className="text-md text-muted-foreground flex flex-col gap-2 text-sm">
										<p className="max-w-[460px]">
											Kelola waktu belajar dengan sistem Pomodoro terintegrasi.
											Jadwal harian yang disesuaikan dengan materi TPS & TKA.
										</p>
									</div>
								</div>
								<div className="pointer-events-none flex grow items-center justify-center select-none relative">
									<div className="relative w-full h-[400px] rounded-xl overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/20 dark:via-red-950/20 dark:to-pink-950/20">
										{/* Animated Background Glow */}
										<motion.div
											className="absolute top-1/2 left-1/2 w-32 h-32 bg-primary rounded-full blur-[100px] opacity-40 transform -translate-x-1/2 -translate-y-1/2"
											initial={{ scale: 1 }}
											animate={
												isHovering ? { scale: [1, 1.3, 1, 1.3] } : { scale: 1 }
											}
											transition={{
												duration: 4,
												ease: "easeInOut",
												repeat: isHovering ? Number.POSITIVE_INFINITY : 0,
												repeatType: "loop",
											}}
										/>

										{/* Main Content Container */}
										<div className="absolute inset-0 items-center justify-center p-6">
											<div className="w-full max-w-md">
												{/* Pomodoro Timer Card */}
												<motion.div
													className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
													initial={{ y: 20, opacity: 0 }}
													animate={{ y: 0, opacity: 1 }}
													transition={{ duration: 0.6, ease: "easeOut" }}
												>
													{/* Timer Display */}
													<div className="p-8 text-center">
														<div className="text-xl text-gray-500 dark:text-gray-400 font-medium mb-4">
															Pomodoro
														</div>

														{/* Progress Ring */}
														<motion.div
															className="relative w-48 h-48 mx-auto mb-6"
															initial={{ rotate: 0 }}
															animate={
																isHovering ? { rotate: 360 } : { rotate: 0 }
															}
															transition={{
																duration: 25,
																repeat: isHovering
																	? Number.POSITIVE_INFINITY
																	: 0,
																ease: "linear",
															}}
														>
															<svg className="w-full h-full transform -rotate-90">
																<circle
																	cx="96"
																	cy="96"
																	r="88"
																	stroke="rgba(231, 138, 83, 0.1)"
																	strokeWidth="8"
																	fill="none"
																/>
																<motion.circle
																	cx="96"
																	cy="96"
																	r="88"
																	stroke="rgb(231, 138, 83)"
																	strokeWidth="8"
																	fill="none"
																	strokeLinecap="round"
																	initial={{ pathLength: 0 }}
																	animate={
																		isHovering
																			? { pathLength: 0.6 }
																			: { pathLength: 0 }
																	}
																	transition={{
																		duration: 2,
																		ease: "easeInOut",
																	}}
																	strokeDasharray="552.92"
																	strokeDashoffset="0"
																/>
															</svg>
															<div className="absolute inset-0 flex items-center justify-center">
																<div className="text-center">
																	<div className="text-gray-500 dark:text-gray-400 font-bold text-2xl">
																		25:00
																	</div>
																</div>
															</div>
														</motion.div>

														{/* Action Buttons */}
														<div className="flex gap-3 justify-center mb-4">
															<motion.button
																className="px-6 py-2.5 bg-primary hover:bg-primary text-white dark:text-black rounded-full font-medium shadow flex items-center gap-2"
																whileHover={{ scale: 1.05 }}
																whileTap={{ scale: 0.95 }}
															>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	width="16"
																	height="16"
																	viewBox="0 0 24 24"
																	fill="currentColor"
																>
																	<polygon points="5 3 19 12 5 21 5 3"></polygon>
																</svg>
																Start
															</motion.button>
															<motion.button
																className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-full font-medium shadow"
																whileHover={{ scale: 1.05 }}
																whileTap={{ scale: 0.95 }}
															>
																Reset
															</motion.button>
														</div>
													</div>
													<div className="flex min-h-[300px] grow items-start justify-center select-none">
														<div className="absolute top-1/2 w-full translate-y-20 scale-x-[1.2] opacity-70 transition-all duration-1000 group-hover:translate-y-8 group-hover:opacity-100">
															<div className="from-primary/50 to-primary/0 absolute left-1/2 h-[256px] w-[60%] -translate-x-1/2 scale-[2.5] rounded-[50%] bg-radial from-10% to-60% opacity-20 sm:h-[512px] dark:opacity-100"></div>
															<div className="from-primary/30 to-primary/0 absolute left-1/2 h-[128px] w-[40%] -translate-x-1/2 scale-200 rounded-[50%] bg-radial from-10% to-60% opacity-20 sm:h-[256px] dark:opacity-100"></div>
														</div>
													</div>
												</motion.div>
											</div>
										</div>
									</div>
								</div>
							</motion.div>

							{/* Feature 3 */}
							<motion.div
								className="group border-primary/40 text-card-foreground relative col-span-12 flex flex-col overflow-hidden rounded-xl border-2 p-6 shadow-xl transition-all ease-in-out md:col-span-6 xl:col-span-6 xl:col-start-2"
								onMouseEnter={() => setIsFeature3Hovering(true)}
								onMouseLeave={() => setIsFeature3Hovering(false)}
								initial={{ opacity: 0, y: 50 }}
								animate={
									isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
								}
								transition={{ duration: 0.5, delay: 1.0 }}
								whileHover={{
									scale: 1.02,
									borderColor: "rgba(231, 138, 83, 0.6)",
									boxShadow: "0 0 30px rgba(231, 138, 83, 0.2)",
								}}
								style={{ transition: "all 0s ease-in-out" }}
							>
								<div className="flex flex-col gap-4 mb-4">
									<h3 className="text-2xl leading-none font-semibold tracking-tight">
										Roadmap Kebut Masuk PTN (RKMP)
									</h3>
									<div className="text-md text-muted-foreground flex flex-col gap-2 text-sm">
										<p className="max-w-[460px]">
											Program intensif 45-50 hari dengan sistem bertahap:
											Akuisisi, Konsolidasi, dan Otomatisasi untuk persiapan
											optimal.
										</p>
									</div>
								</div>
								<div className="pointer-events-none flex grow items-center justify-center select-none relative">
									<div className="relative w-full h-[400px] rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 via-white to-primary/20 dark:from-primary/10 dark:via-gray-900 dark:to-primary/10">
										{/* Animated Background Glow */}
										<motion.div
											className="absolute top-1/2 left-1/2 w-40 h-40 bg-primary rounded-full blur-[120px] opacity-30 transform -translate-x-1/2 -translate-y-1/2"
											initial={{ scale: 1 }}
											animate={
												isFeature3Hovering
													? { scale: [1, 1.4, 1, 1.4] }
													: { scale: 1 }
											}
											transition={{
												duration: 5,
												ease: "easeInOut",
												repeat: isFeature3Hovering
													? Number.POSITIVE_INFINITY
													: 0,
												repeatType: "loop",
											}}
										/>

										{/* Left Gradient */}
										<div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/50 to-transparent dark:from-black dark:via-black/50 dark:to-transparent z-10 pointer-events-none"></div>

										{/* Right Gradient */}
										<div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/50 to-transparent dark:from-black dark:via-black/50 dark:to-transparent z-10 pointer-events-none"></div>

										{/* Main Content Container */}
										<div className="absolute inset-0 flex flex-col items-center justify-center">
											<div className="w-full mb-2">
												<Marquee pauseOnHover className="[--duration:20s]">
													{[
														{
															phase: "1",
															title: "Fase Akuisisi",
															days: "Hari 1-14",
															gradient: "from-black/80 to-black/80",
															bgColor: "bg-white/50 dark:bg-gray-800/50",
															borderColor:
																"border-black/20 dark:border-white/10",
														},
														{
															phase: "1",
															title: "Fase Akuisisi",
															days: "Hari 1-14",
															gradient: "from-black/80 to-black/80",
															bgColor: "bg-white/50 dark:bg-gray-800/50",
															borderColor:
																"border-black/20 dark:border-white/10",
														},
													].map((phase, idx) => (
														<div
															key={`phase1-${idx}`}
															className={`${phase.bgColor} ${phase.borderColor} border rounded-xl p-4 w-[280px] shadow-lg`}
														>
															<div className="flex items-start gap-3">
																<div className="flex-1">
																	<div className="flex items-center gap-2 mb-1">
																		<span
																			className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${phase.gradient} text-white`}
																		>
																			Fase {phase.phase}
																		</span>
																	</div>
																	<h4 className="text-base font-semibold text-gray-800 dark:text-white mb-1">
																		{phase.title}
																	</h4>
																	<p className="text-xs text-primary dark:text-primary font-semibold">
																		{phase.days}
																	</p>
																</div>
															</div>
														</div>
													))}
												</Marquee>
											</div>
											<div className="w-full mb-2">
												<Marquee
													reverse
													pauseOnHover
													className="[--duration:25s]"
												>
													{[
														{
															phase: "2",
															title: "Fase Konsolidasi",
															days: "Hari 15-35",
															gradient: "from-black/80 to-black/80",
															bgColor: "bg-white/50 dark:bg-gray-800/50",
															borderColor:
																"border-black/20 dark:border-white/10",
														},
														{
															phase: "2",
															title: "Fase Konsolidasi",
															days: "Hari 15-35",
															gradient: "from-black/80 to-black/80",
															bgColor: "bg-white/50 dark:bg-gray-800/50",
															borderColor:
																"border-black/20 dark:border-white/10",
														},
													].map((phase, idx) => (
														<div
															key={`phase2-${idx}`}
															className={`${phase.bgColor} ${phase.borderColor} border rounded-xl p-4 w-[280px] shadow-lg`}
														>
															<div className="flex items-start gap-3">
																<div className="flex-1">
																	<div className="flex items-center gap-2 mb-1">
																		<span
																			className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${phase.gradient} text-white`}
																		>
																			Fase {phase.phase}
																		</span>
																	</div>
																	<h4 className="text-base font-semibold text-gray-800 dark:text-white mb-1">
																		{phase.title}
																	</h4>
																	<p className="text-xs text-primary dark:text-primary font-semibold">
																		{phase.days}
																	</p>
																</div>
															</div>
														</div>
													))}
												</Marquee>
											</div>
											<div className="w-full">
												<Marquee pauseOnHover className="[--duration:22s]">
													{[
														{
															phase: "3",
															title: "Fase Otomatisasi",
															days: "Hari 36-50",
															gradient: "from-black/80 to-black/80",
															bgColor: "bg-white/50 dark:bg-gray-800/50",
															borderColor:
																"border-black/20 dark:border-white/10",
														},
														{
															phase: "3",
															title: "Fase Otomatisasi",
															days: "Hari 36-50",
															gradient: "from-black/80 to-black/80",
															bgColor: "bg-white/50 dark:bg-gray-800/50",
															borderColor:
																"border-black/20 dark:border-white/10",
														},
													].map((phase, idx) => (
														<div
															key={`phase3-${idx}`}
															className={`${phase.bgColor} ${phase.borderColor} border rounded-xl p-4 w-[280px] shadow-lg`}
														>
															<div className="flex items-start gap-3">
																<div className="flex-1">
																	<div className="flex items-center gap-2 mb-1">
																		<span
																			className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${phase.gradient} text-white`}
																		>
																			Fase {phase.phase}
																		</span>
																	</div>
																	<h4 className="text-base font-semibold text-gray-800 dark:text-white mb-1">
																		{phase.title}
																	</h4>
																	<p className="text-xs text-primary dark:text-primary font-semibold">
																		{phase.days}
																	</p>
																</div>
															</div>
														</div>
													))}
												</Marquee>
											</div>
										</div>
									</div>
								</div>
							</motion.div>

							{/* Feature 4 */}
							<motion.div
								className="group border-primary/40 text-card-foreground relative col-span-12 flex flex-col overflow-hidden rounded-xl border-2 p-6 shadow-xl transition-all ease-in-out md:col-span-6 xl:col-span-6 xl:col-start-8"
								onMouseEnter={() => setIsFeature4Hovering(true)}
								onMouseLeave={() => setIsFeature4Hovering(false)}
								initial={{ opacity: 0, y: 50 }}
								animate={
									isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
								}
								transition={{ duration: 0.5, delay: 1.0 }}
								whileHover={{
									scale: 1.02,
									borderColor: "rgba(231, 138, 83, 0.6)",
									boxShadow: "0 0 30px rgba(231, 138, 83, 0.2)",
								}}
								style={{ transition: "all 0s ease-in-out" }}
							>
								<div className="flex flex-col gap-4 mb-4">
									<h3 className="text-2xl leading-none font-semibold tracking-tight">
										Rasionalisasi Nilai Untuk SNBP
									</h3>
									<div className="text-md text-muted-foreground flex flex-col gap-2 text-sm">
										<p className="max-w-[460px]">
											Prediksi peluang kelulusan SNBP berdasarkan nilai
											akademik, prestasi, dan data sekolah Anda secara
											real-time.
										</p>
									</div>
								</div>
								<div className="pointer-events-none flex grow items-center justify-center select-none relative">
									<div className="relative w-full h-[400px] rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 via-white to-primary/20 dark:from-primary/10 dark:via-gray-900 dark:to-primary/10">
										{/* Animated Background Glow */}
										<motion.div
											className="absolute top-1/2 left-1/2 w-40 h-40 bg-primary rounded-full blur-[120px] opacity-30 transform -translate-x-1/2 -translate-y-1/2"
											initial={{ scale: 1 }}
											animate={
												isFeature4Hovering
													? { scale: [1, 1.4, 1, 1.4] }
													: { scale: 1 }
											}
											transition={{
												duration: 5,
												ease: "easeInOut",
												repeat: isFeature4Hovering
													? Number.POSITIVE_INFINITY
													: 0,
												repeatType: "loop",
											}}
										/>

										{/* AnimatedBeam Container */}
										<div className="absolute inset-0 flex items-center justify-center p-6">
											<div
												className="relative w-full max-w-md h-full flex items-center justify-center"
												ref={containerRef}
											>
												<div className="flex w-full h-full flex-col items-stretch justify-between py-8">
													{/* Top Row */}
													<div className="flex flex-row items-center justify-between">
														<div
															ref={div1Ref}
															className="z-10 text-sm flex items-center justify-center rounded-full bg-white dark:bg-gray-800 p-3 px-4 shadow-lg border border-gray-200 dark:border-gray-700"
														>
															Data akademik
														</div>
														<div
															ref={div2Ref}
															className="z-10 text-sm flex items-center justify-center rounded-full bg-white dark:bg-gray-800 p-3 px-4 shadow-lg border border-gray-200 dark:border-gray-700"
														>
															Pilihan Jurusan
														</div>
													</div>

													{/* Center */}
													<div className="flex flex-row items-center justify-center">
														<div
															ref={div3Ref}
															className="z-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 p-4 px-6 shadow-xl border-2 border-primary"
														>
															<span className="font-bold text-primary">
																Possibility
															</span>
														</div>
													</div>

													{/* Bottom Row */}
													<div className="flex flex-row items-center justify-between">
														<div
															ref={div4Ref}
															className="z-10 text-sm flex items-center justify-center rounded-full bg-white dark:bg-gray-800 p-3 px-4 shadow-lg border border-gray-200 dark:border-gray-700"
														>
															Data Sekolah
														</div>
														<div
															ref={div5Ref}
															className="z-10 text-sm flex items-center justify-center rounded-full bg-white dark:bg-gray-800 p-3 px-4 shadow-lg border border-gray-200 dark:border-gray-700"
														>
															Prestasi
														</div>
													</div>
												</div>

												{/* Animated Beams */}
												<AnimatedBeam
													containerRef={containerRef}
													fromRef={div1Ref}
													toRef={div3Ref}
													curvature={-75}
													endYOffset={-10}
												/>
												<AnimatedBeam
													containerRef={containerRef}
													fromRef={div2Ref}
													toRef={div3Ref}
													curvature={75}
													endYOffset={-10}
												/>
												<AnimatedBeam
													containerRef={containerRef}
													fromRef={div4Ref}
													toRef={div3Ref}
													curvature={-75}
													endYOffset={10}
												/>
												<AnimatedBeam
													containerRef={containerRef}
													fromRef={div5Ref}
													toRef={div3Ref}
													curvature={75}
													endYOffset={10}
													reverse
												/>
											</div>
										</div>
									</div>
								</div>
							</motion.div>
						</div>
					</div>
				</FollowerPointerCard>
			</motion.div>
		</section>
	);
}
