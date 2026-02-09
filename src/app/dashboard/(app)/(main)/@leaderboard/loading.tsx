import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="min-h-200 bg-white dark:bg-stone-900 rounded-xl p-6">
			{/* Header */}
			<div className="flex justify-between items-start mb-4">
				<Skeleton className="h-8 w-48" />
			</div>

			{/* Tabs */}
			<div className="space-y-4">
				<div className="w-full py-6 bg-gray-100 dark:bg-stone-800 rounded-lg flex gap-2">
					<Skeleton className="flex-1 h-12" />
					<Skeleton className="flex-1 h-12" />
					<Skeleton className="flex-1 h-12" />
				</div>

				{/* Podium */}
				<div className="relative flex items-end justify-center gap-4 mb-8 mt-14">
					<div className="flex flex-col items-center">
						<Skeleton className="w-16 h-16 rounded-full mb-2" />
						<Skeleton className="h-4 w-20 mb-1" />
						<Skeleton className="h-3 w-12 mb-4" />
						<Skeleton className="w-32 h-32 rounded-t-2xl" />
					</div>

					<div className="flex flex-col items-center -mt-8">
						<Skeleton className="w-20 h-20 rounded-full mb-2" />
						<Skeleton className="h-4 w-24 mb-1" />
						<Skeleton className="h-3 w-12 mb-4" />
						<Skeleton className="w-32 h-40 rounded-t-2xl" />
					</div>

					<div className="flex flex-col items-center">
						<Skeleton className="w-16 h-16 rounded-full mb-2" />
						<Skeleton className="h-4 w-20 mb-1" />
						<Skeleton className="h-3 w-12 mb-4" />
						<Skeleton className="w-32 h-28 rounded-t-2xl" />
					</div>
				</div>

				{/* Table */}
				<div className="bg-gray-50 dark:bg-stone-800 rounded-lg overflow-hidden">
					<div className="bg-black text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
						<div className="flex items-center gap-8">
							<Skeleton className="h-6 w-12 bg-gray-700" />
							<Skeleton className="h-6 w-24 bg-gray-700" />
						</div>
						<Skeleton className="h-6 w-16 bg-gray-700" />
					</div>

					<div className="divide-y divide-gray-200 dark:divide-stone-700">
						{Array.from({ length: 7 }).map((_, index) => (
							<div
								key={index}
								className="px-6 py-4 flex items-center justify-between gap-4 h-[72px]"
							>
								<Skeleton className="h-8 w-12" />
								<div className="flex items-center gap-3 flex-1">
									<Skeleton className="w-10 h-10 rounded-full" />
									<Skeleton className="h-5 w-32" />
								</div>
								<Skeleton className="h-6 w-12" />
							</div>
						))}
					</div>

					<div className="px-6 py-4 flex items-center justify-between gap-4 mt-4">
						<Skeleton className="h-8 w-12" />
						<div className="flex items-center gap-3 flex-1">
							<Skeleton className="w-10 h-10 rounded-full" />
							<Skeleton className="h-5 w-24" />
						</div>
						<Skeleton className="h-6 w-12" />
					</div>
				</div>
			</div>
		</div>
	);
}
