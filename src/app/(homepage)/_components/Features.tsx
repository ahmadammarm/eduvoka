"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Marquee } from "@/components/magicui/marquee";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { FollowerPointerCard } from "@/components/ui/following-pointer";

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
                    Key Features
                </h2>
                <FollowerPointerCard
                    title={
                        <div className="flex items-center gap-2">
                            <span>Data-Driven Learning</span>
                        </div>
                    }
                >
                    <div className="cursor-none">
                        <div className="grid grid-cols-12 gap-4 justify-center">
                            {/* Feature 1 — Adaptive Learning Velocity Tracker */}
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
                                        Adaptive Learning Velocity Tracker
                                    </h3>
                                    <div className="text-md text-muted-foreground flex flex-col gap-2 text-sm">
                                        <p className="max-w-[460px]">
                                            Go beyond scores. Your velocity score (0–100) measures how fast you truly master each concept by combining accuracy, response speed, consistency, and improvement trends — adapting every session to your pace.
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
                                                alt="Analytics Background"
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
                                                {/* Left Column — Velocity Inputs */}
                                                <div className="flex flex-col gap-3">
                                                    {[
                                                        {
                                                            label: "Accuracy Rate",
                                                            icon: "🎯",
                                                            color: "bg-blue-500",
                                                        },
                                                        {
                                                            label: "Response Speed",
                                                            icon: "⚡",
                                                            color: "bg-purple-500",
                                                        },
                                                        {
                                                            label: "Consistency",
                                                            icon: "📈",
                                                            color: "bg-green-500",
                                                        },
                                                        {
                                                            label: "Improvement",
                                                            icon: "🚀",
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
                                                            src="/assets/images/eduvoka-logo.png"
                                                            alt="Eduvoka Logo"
                                                            width={100}
                                                            height={100}
                                                            className="p-2"
                                                        />
                                                    </div>
                                                </motion.div>

                                                {/* Right Column — Velocity Outputs */}
                                                <div className="flex flex-col gap-3">
                                                    {[
                                                        {
                                                            label: "Velocity: 78.5",
                                                            icon: "📊",
                                                            color: "bg-primary",
                                                        },
                                                        {
                                                            label: "Mastery Level",
                                                            icon: "✅",
                                                            color: "bg-emerald-500",
                                                        },
                                                        {
                                                            label: "Next Focus Area",
                                                            icon: "🎯",
                                                            color: "bg-blue-600",
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

                            {/* Feature 2 — Socratic Discussion System */}
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
                                        Socratic Discussion System
                                    </h3>
                                    <div className="text-md text-muted-foreground flex flex-col gap-2 text-sm">
                                        <p className="max-w-[460px]">
                                            Learn through guided dialogue, not spoon-fed answers. Our Gemini-powered AI uses the PAPE method — Probe, Analyze, Persist, Evaluate — asking the right questions until you truly understand.
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

                                        {/* Main Content — Chat Simulation */}
                                        <div className="absolute inset-0 flex items-center justify-center p-6">
                                            <div className="w-full max-w-sm space-y-3">
                                                {/* AI Message */}
                                                <motion.div
                                                    className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm p-4 shadow-lg max-w-[85%]"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.5, delay: 0.2 }}
                                                >
                                                    <p className="text-xs text-primary font-semibold mb-1">🤖 EDUVOKA AI — Probe</p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">&quot;Interesting answer! Can you walk me through how you arrived at that conclusion?&quot;</p>
                                                </motion.div>

                                                {/* User Message */}
                                                <motion.div
                                                    className="bg-primary/10 rounded-2xl rounded-tr-sm p-4 shadow-lg max-w-[85%] ml-auto"
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={isHovering ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                                                    transition={{ duration: 0.5, delay: 0.3 }}
                                                >
                                                    <p className="text-xs text-primary font-semibold mb-1 text-right">👧 Student</p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">&quot;I thought B connects A and C, so I reversed the direction...&quot;</p>
                                                </motion.div>

                                                {/* AI Follow-up */}
                                                <motion.div
                                                    className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm p-4 shadow-lg max-w-[85%]"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={isHovering ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                                    transition={{ duration: 0.5, delay: 0.6 }}
                                                >
                                                    <p className="text-xs text-primary font-semibold mb-1">🤖 EDUVOKA AI — Persist</p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">&quot;Great intuition! Now imagine: All cats are animals. Does that mean all animals are cats? 🤔&quot;</p>
                                                </motion.div>

                                                {/* AI Evaluate */}
                                                <motion.div
                                                    className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm p-4 shadow-lg max-w-[85%]"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={isHovering ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                                    transition={{ duration: 0.5, delay: 0.9 }}
                                                >
                                                    <p className="text-xs text-emerald-600 font-semibold mb-1">🤖 EDUVOKA AI — Evaluate</p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">&quot;Perfect! 🌟 You just grasped the subset concept in syllogisms.&quot;</p>
                                                </motion.div>

                                                {/* Phase Labels */}
                                                <motion.div
                                                    className="flex gap-2 justify-center pt-2 flex-wrap"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.5, delay: 0.4 }}
                                                >
                                                    {["Probe", "Analyze", "Persist", "Evaluate"].map(
                                                        (phase) => (
                                                            <motion.span
                                                                key={phase}
                                                                className="px-3 py-1.5 bg-primary/10 text-primary rounded-full font-medium text-xs"
                                                                whileHover={{ scale: 1.05 }}
                                                            >
                                                                {phase}
                                                            </motion.span>
                                                        )
                                                    )}
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Feature 3 — Behavioral Intelligence & Burnout Prevention */}
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
                                        Behavioral Intelligence & Burnout Prevention
                                    </h3>
                                    <div className="text-md text-muted-foreground flex flex-col gap-2 text-sm">
                                        <p className="max-w-[460px]">
                                            Every click, answer change, and hesitation is captured live. The system scores your cognitive load, detects early burnout signals, and automatically suggests smart breaks before fatigue impacts your performance.
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
                                                            title: "Behavioral Capture",
                                                            days: "Clicks · Hesitations · Answer Changes",
                                                            gradient: "from-black/80 to-black/80",
                                                            bgColor: "bg-white/50 dark:bg-gray-800/50",
                                                            borderColor:
                                                                "border-black/20 dark:border-white/10",
                                                        },
                                                        {
                                                            phase: "1",
                                                            title: "Behavioral Capture",
                                                            days: "Clicks · Hesitations · Answer Changes",
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
                                                                            Step {phase.phase}
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
                                                            title: "Burnout Scoring",
                                                            days: "Cognitive Load · Focus Decay · Fatigue",
                                                            gradient: "from-black/80 to-black/80",
                                                            bgColor: "bg-white/50 dark:bg-gray-800/50",
                                                            borderColor:
                                                                "border-black/20 dark:border-white/10",
                                                        },
                                                        {
                                                            phase: "2",
                                                            title: "Burnout Scoring",
                                                            days: "Cognitive Load · Focus Decay · Fatigue",
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
                                                                            Step {phase.phase}
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
                                                            title: "Smart Break Engine",
                                                            days: "Auto-pause · Recovery · Re-engage",
                                                            gradient: "from-black/80 to-black/80",
                                                            bgColor: "bg-white/50 dark:bg-gray-800/50",
                                                            borderColor:
                                                                "border-black/20 dark:border-white/10",
                                                        },
                                                        {
                                                            phase: "3",
                                                            title: "Smart Break Engine",
                                                            days: "Auto-pause · Recovery · Re-engage",
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
                                                                            Step {phase.phase}
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

                            {/* Feature 4 — Real-Time Study Dashboard */}
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
                                        Real-Time Study Dashboard
                                    </h3>
                                    <div className="text-md text-muted-foreground flex flex-col gap-2 text-sm">
                                        <p className="max-w-[460px]">
                                            See everything in one place — velocity trends, burnout status, weakness clusters, and Socratic session history. All metrics flow into a single dashboard that updates live as you study.
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
                                                    {/* Top Row — Data Sources */}
                                                    <div className="flex flex-row items-center justify-between">
                                                        <div
                                                            ref={div1Ref}
                                                            className="z-10 text-sm flex items-center justify-center rounded-full bg-white dark:bg-gray-800 p-3 px-4 shadow-lg border border-gray-200 dark:border-gray-700"
                                                        >
                                                            📈 Velocity Trend
                                                        </div>
                                                        <div
                                                            ref={div2Ref}
                                                            className="z-10 text-sm flex items-center justify-center rounded-full bg-white dark:bg-gray-800 p-3 px-4 shadow-lg border border-gray-200 dark:border-gray-700"
                                                        >
                                                            🔥 Burnout Status
                                                        </div>
                                                    </div>

                                                    {/* Center — Dashboard Hub */}
                                                    <div className="flex flex-row items-center justify-center">
                                                        <div
                                                            ref={div3Ref}
                                                            className="z-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 p-4 px-6 shadow-xl border-2 border-primary"
                                                        >
                                                            <span className="font-bold text-primary">
                                                                📊 Live Dashboard
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Bottom Row — Additional Feeds */}
                                                    <div className="flex flex-row items-center justify-between">
                                                        <div
                                                            ref={div4Ref}
                                                            className="z-10 text-sm flex items-center justify-center rounded-full bg-white dark:bg-gray-800 p-3 px-4 shadow-lg border border-gray-200 dark:border-gray-700"
                                                        >
                                                            🔍 Weakness Map
                                                        </div>
                                                        <div
                                                            ref={div5Ref}
                                                            className="z-10 text-sm flex items-center justify-center rounded-full bg-white dark:bg-gray-800 p-3 px-4 shadow-lg border border-gray-200 dark:border-gray-700"
                                                        >
                                                            💬 AI Sessions
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