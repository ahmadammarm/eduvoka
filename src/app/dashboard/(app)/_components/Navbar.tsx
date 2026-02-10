"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UserNav from "./UserNav";
import SearchDialogContent from "./SearchDialogContent";
import LanguageSettings from "./LanguageSettings";
import Notifications from "./Notifications";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";
import { UserNavProps } from "../_types/user";

export default function DashboardNavbar() {
	const [mounted, setMounted] = useState(false);
	const isMobile = useIsMobile();

	const { data: session, status } = useSession();
	if (status === "loading") {
		return <Spinner />;
	}

	useEffect(() => {
		const id = requestAnimationFrame(() => setMounted(true));
		return () => cancelAnimationFrame(id);
	}, []);

	if (!mounted) return null;

	return (
		<header className="sticky top-6 z-10 flex items-center justify-between gap-4 px-2 bg-white dark:bg-stone-900 h-12 rounded-xl mb-4 mx-4 shadow-md border border-gray-100 dark:border-stone-800">
			<div className="flex items-center gap-2">
				<SidebarTrigger className="bg-white dark:bg-stone-900 rounded-md hover:bg-white dark:hover:bg-stone-900 hover:text-black dark:hover:text-white cursor-pointer" />
				<Separator orientation="vertical" className="mr-2 h-4" />
				<div className="font-semibold md:text-lg text-sm">
					Hey There, {session?.user?.name}
				</div>
			</div>

			{/* {!isMobile && (
				<div className="flex flex-1 justify-center">
					<Dialog>
						<DialogTrigger asChild>
							<Button className="flex justify-start rounded-lg text-gray-500 hover:text-gray-700 hover:bg-black/20 bg-gray-200 w-80 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600 font-light">
								<Search />
								Search something...
							</Button>
						</DialogTrigger>
						<SearchDialogContent />
					</Dialog>
				</div>
			)} */}

			<div className="flex items-center gap-1">
				{/* {isMobile && (
					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="rounded-lg hover:bg-black/80 dark:hover:bg-white/80"
							>
								<Search />
							</Button>
						</DialogTrigger>
						<SearchDialogContent />
					</Dialog>
				)} */}

				{/* <LanguageSettings /> */}
				<AnimatedThemeToggler
					className={buttonVariants({
						variant: "ghost",
						size: "icon",
						className: "rounded-lg hover:bg-black/80 dark:hover:bg-white/80",
					})}
				/>
				{/* <Notifications /> */}
				<UserNav session={session as UserNavProps["session"]} />
			</div>
		</header>
	);
}
