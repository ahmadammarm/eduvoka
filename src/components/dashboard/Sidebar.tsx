"use client"

import {
	Book,
	CircleQuestionMark,
	CreditCard,
	FilePen,
	Home,
	NotebookText,
	Settings,
	Sparkles,
} from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const data = {
	navMain: [
		{
			title: "Main",
			items: [
				{
					icon: Home,
					title: "Dashboard",
					url: "/dashboard",
				},
				{
					icon: Book,
					title: "Try Out UTBK",
					url: "/dashboard/utbk-tryout",
				},
				{
					icon: NotebookText,
					title: "Generate Soal",
					url: "/dashboard/generate-soal",
				},
				{
					icon: FilePen,
					title: "Evaluasi",
					url: "/dashboard/evaluasi",
				},
			],
		},
		{
			title: "Other",
			items: [
				{
					icon: CreditCard,
					title: "Subscriptions",
					url: "/dashboard/subscriptions",
				},
				{
					icon: CircleQuestionMark,
					title: "Help Center",
					url: "/dashboard/help",
				},
				{
					icon: Settings,
					title: "Settings",
					url: "/dashboard/settings",
				},
			],
		},
	],
};


export function DashboardSidebar(props: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();

	return (
		<Sidebar variant="floating" className="py-6 pl-6" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem className="flex items-center gap-4 p-2 bg-primary/10 rounded-lg">
						<div className="bg-white flex size-8 items-center justify-center rounded-full">
							<Image
								src="/assets/images/logo-eduvoka.png"
								alt="Eduvoka"
								width={24}
								height={24}
							/>
						</div>
						<div className="font-bold text-xl">EDUVOKA</div>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu className="gap-4">
						{data.navMain.map((group) => (
							<SidebarMenuItem key={group.title}>
								<SidebarMenu className="font-medium text-sm p-2 text-gray-700 dark:text-gray-300">
									{group.title}
								</SidebarMenu>

								<SidebarMenuSub className="ml-0 border-l-0 px-1.5 gap-2">
									{group.items.map((item) => {
										const isDashboardRoot = item.url === "/dashboard";
										const isActive = isDashboardRoot
											? pathname === "/dashboard"
											: pathname === item.url || pathname.startsWith(item.url + "/");

										return (
											<SidebarMenuSubItem key={item.title}>
												<SidebarMenuSubButton
													asChild
													className={`py-5 rounded-lg transition-colors ${isActive
														? "bg-primary text-white hover:bg-primary"
														: "border border-primary/10 bg-stone-100 dark:bg-stone-900 hover:bg-primary/10 hover:text-black dark:hover:text-white"
														}`}
												>
													<Link href={item.url}>
														<item.icon className="size-4 mr-2" />
														{item.title}
													</Link>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										);
									})}
								</SidebarMenuSub>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<div className="rounded-md bg-linear-to-br from-primary/90 to-primary/80 p-4 text-white">
					<div className="mb-3 flex items-center gap-2">
						<div className="rounded-full bg-white/20 p-1.5">
							<Sparkles className="size-4" />
						</div>
						<span className="font-semibold text-sm">Eduvoka Premium</span>
					</div>
					<p className="text-xs mb-4 text-white/90">
						Dapatkan akses penuh ke semua fitur dengan berlangganan Eduvoka Pro!
					</p>
					<Button size="sm" variant="secondary" className="w-full text-white">
						Upgrade Sekarang
					</Button>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
