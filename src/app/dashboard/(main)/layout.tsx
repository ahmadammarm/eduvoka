import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ScientificMethodologyCard } from "../_components/ScientificMethodologyCard";

export default function MainLayout({
	children,
	analytics,
}: {
	children: React.ReactNode;
	analytics: React.ReactNode;
}) {
	return (
		<div className="flex flex-1 flex-col gap-4 px-4 pt-0">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbPage className="text-white">Dashboard</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div>
				<h1 className="font-bold md:text-2xl text-lg text-foreground">
					Pantau Progress Belajarmu
				</h1>
			</div>

			{/* statistics */}
			{/* <div className="grid auto-rows-min gap-4 md:grid-cols-4">
				<div className="bg-white dark:bg-stone-900 aspect-video rounded-xl flex items-center justify-center h-full">
					Statistic
				</div>
				<div className="bg-white dark:bg-stone-900 aspect-video rounded-xl flex items-center justify-center h-full">
					Statistic
				</div>
				<div className="bg-white dark:bg-stone-900 aspect-video rounded-xl flex items-center justify-center h-full">
					Statistic
				</div>
				<div className="bg-white dark:bg-stone-900 aspect-video rounded-xl flex items-center justify-center h-full">
					Statistic
				</div>
			</div> */}

			{/* Action Center (Main Content) */}
			{children}

			{/* analytics */}
			{analytics}

			<div className="pb-8">
				<ScientificMethodologyCard />
			</div>
		</div>
	);
}
