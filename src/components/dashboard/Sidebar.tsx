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

const data = {
	navMain: [
		{
			title: "Main",
			url: "#",
			items: [
				{
					icon: Home,
					title: "Dashboard",
					url: "#",
					isActive: true,
				},
				{
					icon: Book,
					title: "Try Out UTBK",
					url: "/try-out-utbk",
					isActive: false,
				},
				{
					icon: NotebookText,
					title: "Generate Soal",
					url: "#",
					isActive: false,
				},
				{
					icon: FilePen,
					title: "Evaluasi",
					url: "#",
					isActive: false,
				},
			],
		},
		{
			title: "Other",
			url: "#",
			items: [
				{
					icon: CreditCard,
					title: "Subscriptions",
					url: "#",
					isActive: false,
				},
				{
					icon: CircleQuestionMark,
					title: "Help Center",
					url: "#",
					isActive: false,
				},
				{
					icon: Settings,
					title: "Settings",
					url: "#",
					isActive: false,
				},
			],
		},
	],
};

export function DashboardSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar variant="floating" className="py-6 pl-6" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem className="flex items-center gap-4 p-2 bg-primary/10 rounded-lg">
						<div className="bg-white text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-full">
							<Image
								src="/assets/images/logo-eduvoka.png"
								alt="Eduvolka"
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
						{data.navMain.map((item) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenu className="font-medium text-sm p-2 text-gray-700 dark:text-gray-300">
									{item.title}
								</SidebarMenu>
								{item.items?.length ? (
									<SidebarMenuSub className="ml-0 border-l-0 px-1.5 gap-2">
										{item.items.map((item) => (
											<SidebarMenuSubItem key={item.title}>
												<SidebarMenuSubButton
													asChild
													className={`py-5 rounded-lg ${
														item.isActive
															? "bg-primary text-white hover:text-white hover:bg-primary border active:bg-primary"
															: "hover:bg-primary/10 dark:hover:bg-primary/10 border-2 border-primary/10 bg-stone-100 dark:bg-stone-900 hover:text-black dark:hover:text-white"
													}`}
												>
													<a href={item.url}>
														<item.icon className="size-4 mr-2" />
														{item.title}
													</a>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								) : null}
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
					<p className="text-xs leading-relaxed mb-4 text-white/90">
						Dapatkan akses penuh ke semua fitur dengan berlangganan Eduvoka Pro!
					</p>
					<Button size="sm" variant="secondary" className="w-full font-medium">
						Upgrade Sekarang
					</Button>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
