import { Marquee } from "@/components/magicui/marquee";

const testimonials = [
	{
		id: 1,
		name: "Arjun Mehta",
		school: "SMA Negeri 1 Ngawi",
		body: "v0 has completely changed the way I build UIs. Generate, copy-paste, done. No more design stress.",
		img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
	},
	{
		id: 2,
		name: "Sara Lin",
		school: "SMA Negeri 1 Ngawi",
		body: "Honestly shocked at how smooth the v0 generated components are out of the box. Just works perfectly.",
		img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
	},
	{
		id: 3,
		name: "Devon Carter",
		school: "SMA Negeri 1 Ngawi",
		body: "Our team launched a client site in 2 days using v0 components. Saved so much development time.",
		img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
	},
	{
		id: 4,
		name: "Priya Shah",
		school: "SMA Negeri 1 Ngawi",
		body: "Generated a few components in v0 and everything blended perfectly with our codebase. Massive W.",
		img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
	},
	{
		id: 5,
		name: "Leo Martin",
		school: "SMA Negeri 1 Ngawi",
		body: "Found a beautiful hero section in v0, tweaked the prompt, and shipped in 15 minutes. Game changer.",
		img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
	},
	{
		id: 6,
		name: "Chloe Winters",
		school: "SMA Negeri 1 Ngawi",
		body: "v0 helped us prototype multiple landing pages without writing CSS once. Pure magic.",
		img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
	},
	{
		id: 7,
		name: "Ayaan Malik",
		school: "SMA Negeri 1 Ngawi",
		body: "As a solo founder, v0 lets me move fast without sacrificing design quality. Essential tool.",
		img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
	},
	{
		id: 8,
		name: "Monica Reeves",
		school: "SMA Negeri 1 Ngawi",
		body: "Can't believe how polished the v0 generated components look. Clients are impressed every time.",
		img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
	},
	{
		id: 9,
		name: "James Roy",
		school: "SMA Negeri 1 Ngawi",
		body: "v0 is a lifesaver when deadlines are tight. Generate a component, tweak, and deploy instantly.",
		img: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
	},
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialCard = ({
	img,
	name,
	school,
	body,
}: {
	img: string;
	name: string;
	school: string;
	body: string;
}) => {
	return (
		<div className="relative w-full max-w-xs overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-10 shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)_inset]">
			<div className="absolute -top-5 -left-5 -z-10 h-40 w-40 rounded-full bg-gradient-to-b from-[#e78a53]/10 to-transparent blur-md"></div>

			<div className="text-black/90 dark:text-white/90 leading-relaxed">
				{body}
			</div>

			<div className="mt-5 flex items-center gap-2">
				<img
					src={img || "/placeholder.svg"}
					alt={name}
					height="40"
					width="40"
					className="h-10 w-10 rounded-full"
				/>
				<div className="flex flex-col">
					<div className="leading-5 font-medium tracking-tight text-black dark:text-white">
						{name}
					</div>
					<div className="leading-5 tracking-tight text-black/60 dark:text-white/60">
						{school}
					</div>
				</div>
			</div>
		</div>
	);
};

export function TestimonialsSection() {
	return (
		<section id="testimonials" className="mb-24">
			<div className="mx-auto max-w-7xl">
				<div className="mx-auto max-w-[540px]">
					<div className="flex justify-center">
						<button
							type="button"
							className="group relative z-[60] mx-auto rounded-full border border-black/20 dark:border-white/20 bg-white/80 dark:bg-white/5 px-6 py-1 text-xs backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-100 md:text-sm"
						>
							<div className="absolute inset-x-0 -top-px mx-auto h-0.5 w-1/2 bg-gradient-to-r from-transparent via-[#e78a53] to-transparent shadow-2xl transition-all duration-500 group-hover:w-3/4"></div>
							<div className="absolute inset-x-0 -bottom-px mx-auto h-0.5 w-1/2 bg-gradient-to-r from-transparent via-[#e78a53] to-transparent shadow-2xl transition-all duration-500 group-hover:h-px"></div>
							<span className="relative text-black dark:text-white">
								Testimonials
							</span>
						</button>
					</div>
					<h2 className="from-foreground/60 via-foreground to-foreground/60 dark:from-muted-foreground/55 dark:via-foreground dark:to-muted-foreground/55 mt-5 bg-gradient-to-r bg-clip-text text-center text-4xl font-semibold tracking-tighter text-transparent md:text-[54px] md:leading-[60px] __className_bb4e88 relative z-10">
						Apa kata mereka tentang EDUVOKA?
					</h2>

					<p className="mt-5 relative z-10 text-center text-lg text-zinc-500">
						Dengar langsung dari para pelajar dan pendidik yang telah merasakan
						manfaat dari platform kami.
					</p>
				</div>

				<div className="my-16 flex max-h-[738px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
					<div>
						<Marquee pauseOnHover vertical className="[--duration:20s]">
							{firstColumn.map((testimonial) => (
								<TestimonialCard key={testimonial.id} {...testimonial} />
							))}
						</Marquee>
					</div>

					<div className="hidden md:block">
						<Marquee reverse pauseOnHover vertical className="[--duration:25s]">
							{secondColumn.map((testimonial) => (
								<TestimonialCard key={testimonial.id} {...testimonial} />
							))}
						</Marquee>
					</div>

					<div className="hidden lg:block">
						<Marquee pauseOnHover vertical className="[--duration:30s]">
							{thirdColumn.map((testimonial) => (
								<TestimonialCard key={testimonial.id} {...testimonial} />
							))}
						</Marquee>
					</div>
				</div>

				<div className="-mt-8 flex justify-center">
					<button className="group relative inline-flex items-center gap-2 rounded-full border border-[#e78a53]/30 bg-white/50 dark:bg-black/50 px-6 py-3 text-sm font-medium text-black dark:text-white transition-all hover:border-[#e78a53]/60 hover:bg-[#e78a53]/10 active:scale-95">
						<div className="absolute inset-x-0 -top-px mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-[#e78a53]/40 to-transparent"></div>
						<div className="absolute inset-x-0 -bottom-px mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-[#e78a53]/40 to-transparent"></div>
						<svg
							className="h-4 w-4 text-[#e78a53]"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
						</svg>
						Bagikan pengalamanmu
					</button>
				</div>
			</div>
		</section>
	);
}
