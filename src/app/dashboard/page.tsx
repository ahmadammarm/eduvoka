import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export default function Page() {
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
				<h1 className="font-bold md:text-2xl text-lg text-white">
					Pantau Progress Belajarmu
				</h1>
			</div>
			<div className="grid auto-rows-min gap-4 md:grid-cols-3">
				<div className="bg-white dark:bg-stone-900 aspect-video rounded-xl" />
				<div className="bg-white dark:bg-stone-900 aspect-video rounded-xl" />
				<div className="bg-white dark:bg-stone-900 aspect-video rounded-xl" />
			</div>
			<div className="bg-white dark:bg-stone-900 min-h-200 flex-1 rounded-xl" />
		</div>
	);
}
