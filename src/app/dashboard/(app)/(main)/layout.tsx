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
		<div className="flex flex-1 flex-col gap-4 px-6 pt-2">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbPage className="text-black dark:text-white">Dashboard</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div>
				<h1 className="font-bold md:text-3xl text-lg text-foreground">
					Pantau Progress Belajarmu
				</h1>
			</div>

			<div className="space-y-6 mt-2">
				{/* Action Center (Main Content) */}
				{children}

				{/* analytics */}
				{analytics}
				
				<ScientificMethodologyCard />
			</div>
		</div>
	);
}
