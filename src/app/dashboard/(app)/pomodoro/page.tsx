"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function Pomodoro() {
	const [spotifyId, setSpotifyId] = useState("37i9dQZF1DXdLK5wjKyhVm");
	const [pomodoroTime, setPomodoroTime] = useState(25);
	const [timeLeft, setTimeLeft] = useState(25 * 60); // dalam detik
	const [isRunning, setIsRunning] = useState(false);

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isRunning && timeLeft > 0) {
			interval = setInterval(() => {
				setTimeLeft((prev) => prev - 1);
			}, 1000);
		} else if (timeLeft === 0) {
			setIsRunning(false);
			// Sweet Alert ketika timer selesai
			Swal.fire({
				title: "Pomodoro Finished!",
				text: "Time to take a break 😊",
				icon: "success",
				confirmButtonText: "OK",
				confirmButtonColor: "#10b981",
			});
		}
		return () => clearInterval(interval);
	}, [isRunning, timeLeft]);

	const handleStart = () => {
		if (!isRunning && timeLeft === pomodoroTime * 60) {
			setIsRunning(true);
		} else if (!isRunning) {
			setIsRunning(true);
		} else {
			setIsRunning(false);
		}
	};

	const handleReset = () => {
		setIsRunning(false);
		setTimeLeft(pomodoroTime * 60);
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	};

	return (
		<div className="relative h-screen overflow-hidden">
			<video
				autoPlay
				loop
				muted
				playsInline
				className="absolute inset-0 w-full h-full object-cover"
				preload="auto"
				style={{ filter: "contrast(1.1) saturate(1.2)" }}
			>
				<source src="/assets/vid/bg_vid.mp4" type="video/mp4" />
			</video>

			<div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />

			{/* Main Content */}
			<div className="relative z-10 h-full flex items-center justify-center px-8 gap-6">
				{/* Left Section - Timer & Controls */}
				<div className="flex flex-col gap-6">
					{/* Timer Display */}
					<div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl p-10 text-center">
						<div className="text-7xl font-bold text-white mb-6 tracking-tight">
							{formatTime(timeLeft)}
						</div>
						<div className="flex gap-3">
							<Button
								onClick={handleStart}
								size="lg"
								className={`px-6 py-5 text-base font-medium transition-all ${isRunning
										? "bg-red-500 hover:bg-red-600"
										: "bg-green-500 hover:bg-green-600"
									}`}
							>
								{isRunning ? "⏸ Pause" : "▶ Start"}
							</Button>
							<Button
								onClick={handleReset}
								size="lg"
								variant="outline"
								className="px-6 py-5 text-base bg-white/5 border-white/20 text-white hover:bg-white/10"
							>
								↻ Reset
							</Button>
						</div>
					</div>

					{/* Settings Panel */}
					<div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 shadow-2xl p-5">
						<div className="space-y-4">
							<div>
								<label className="block text-xs font-medium text-white/70 mb-2">
									Playlist ID
								</label>
								<Input
									type="text"
									value={spotifyId}
									onChange={(e) => setSpotifyId(e.target.value)}
									placeholder="37i9dQZF1DXdLK5wjKyhVm"
									disabled={isRunning}
									className="bg-white/5 border-white/10 text-white placeholder:text-white/40 text-sm h-9 disabled:opacity-50"
								/>
							</div>

							<div>
								<label className="block text-xs font-medium text-white/70 mb-2">
									Time (minutes)
								</label>
								<Input
									type="number"
									value={pomodoroTime}
									onChange={(e) => {
										const newTime = Number(e.target.value);
										setPomodoroTime(newTime);
										if (!isRunning) {
											setTimeLeft(newTime * 60);
										}
									}}
									placeholder="25"
									min="1"
									max="120"
									disabled={isRunning}
									className="bg-white/5 border-white/10 text-white placeholder:text-white/40 text-sm h-9 disabled:opacity-50"
								/>
							</div>

							<div className="flex items-center gap-2 pt-3 border-t border-white/10">
								<input
									type="checkbox"
									id="fullscreen"
									className="w-4 h-4 rounded border-white/20 bg-white/10 cursor-pointer"
									onChange={(e) => {
										if (e.target.checked) {
											document.documentElement.requestFullscreen();
										} else {
											document.exitFullscreen();
										}
									}}
								/>
								<label
									htmlFor="fullscreen"
									className="text-xs font-medium text-white/70 cursor-pointer"
								>
									⛶ Fullscreen Mode
								</label>
							</div>
						</div>
					</div>
				</div>

				{/* Right Section - Spotify Embed */}
				<div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 shadow-2xl p-4">
					<iframe
						data-testid="embed-iframe"
						className="rounded-xl"
						src={`https://open.spotify.com/embed/playlist/${spotifyId}?utm_source=generator`}
						width="450"
						height="550"
						frameBorder="0"
						allowFullScreen
						allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
						loading="lazy"
					/>
				</div>
			</div>
		</div>
	);
}
