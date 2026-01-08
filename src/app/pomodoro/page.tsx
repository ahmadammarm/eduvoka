"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";

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
			// Alert ketika timer selesai
			alert("Pomodoro selesai! Waktunya istirahat.");
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

			<div className="absolute inset-0 " />

			{/* Info Section */}
			<div className="relative z-10 p-6 text-white w-fit mx-6 mt-6 backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 shadow-2xl">
				<h1 className="text-2xl font-bold mb-4">Selamat datang di Pomodoro</h1>
				<p className="mb-6">
					Disini kamu akan belajar sesuai rentang waktu yang <br /> kamu atur.
					Disini kamu juga bisa play lagu untuk <br /> menjaga konstrasi kamu
					selama belajar.
				</p>

				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-2">
							Spotify Playlist/Track ID
						</label>
						<Input
							type="text"
							value={spotifyId}
							onChange={(e) => setSpotifyId(e.target.value)}
							placeholder="37i9dQZF1DXdLK5wjKyhVm"
							className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">
							Waktu Pomodoro (menit)
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
							className="bg-white/10 border-white/20 text-white placeholder:text-white/50 disabled:opacity-50"
						/>
					</div>
					<div className="flex items-center space-x-2">
						<input
							type="checkbox"
							id="fullscreen"
							className="w-4 h-4 rounded border-white/20 bg-white/10 text-white cursor-pointer"
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
							className="text-sm font-medium cursor-pointer"
						>
							Mode Layar Penuh
						</label>
					</div>

					{/* Timer Display */}
					<div className="text-center py-4">
						<div className="text-5xl font-bold mb-4">
							{formatTime(timeLeft)}
						</div>
						<div className="flex gap-2">
							<Button
								onClick={handleStart}
								className="flex-1"
								variant={isRunning ? "destructive" : "default"}
							>
								{isRunning ? "Pause" : "Mulai"}
							</Button>
							<Button
								onClick={handleReset}
								variant="outline"
								className="bg-white/10 border-white/20 text-white hover:bg-white/20"
							>
								Reset
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Spotify Embed - Centered */}
			<div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-6">
				<iframe
					data-testid="embed-iframe"
					style={{ borderRadius: "12px" }}
					src={`https://open.spotify.com/embed/playlist/${spotifyId}?utm_source=generator`}
					width="100%"
					height="352"
					frameBorder="0"
					allowFullScreen
					allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
					loading="lazy"
				/>
			</div>
		</div>
	);
}
