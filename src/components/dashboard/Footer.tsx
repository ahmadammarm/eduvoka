import { Facebook, Instagram } from "lucide-react";
import Link from "next/link";

export default function DashboardFooter() {
	return (
		<footer className="mt-auto pt-8 pb-4 px-6">
			<div className="flex items-center justify-between text-sm text-black/60 dark:text-white/60">
				<div className="flex items-center gap-2">
					<span>&copy; {new Date().getFullYear()} Eduvoka.</span>
					<span className="hidden sm:inline">All rights reserved.</span>
				</div>
				<div className="flex items-center gap-4">
					<Link
						href="https://instagram.com"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-black/40 dark:hover:text-white/40 text-black/60 dark:text-white/60 transition-colors duration-200"
						aria-label="Instagram"
					>
						<Instagram className="w-5 h-5" />
					</Link>
					<Link
						href="https://facebook.com"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-black/40 dark:hover:text-white/40 text-black/60 dark:text-white/60 transition-colors duration-200"
						aria-label="Facebook"
					>
						<Facebook className="w-5 h-5" />
					</Link>
					<Link
						href="https://tiktok.com"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-black/40 dark:hover:text-white/40 text-black/60 dark:text-white/60 transition-colors duration-200"
						aria-label="TikTok"
					>
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
						</svg>
					</Link>
				</div>
			</div>
		</footer>
	);
}
