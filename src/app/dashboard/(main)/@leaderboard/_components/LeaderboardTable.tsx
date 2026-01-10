"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { LeaderboardProps } from "../_types/leaderboard";

export default function LeaderboardTable({
	users,
	page,
	totalPages,
	currentUser,
}: LeaderboardProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", newPage.toString());
		router.push(`?${params.toString()}`);
	};

	const topThree = users.slice(0, 3);
	const remainingUsers = users.slice(3);

	return (
		<div className="space-y-4">
			{/* Top 3 Podium */}
			{topThree.length >= 0 && (
				<div className="relative flex items-end justify-center gap-4 mb-8">
					{/* Rank 2 */}
					<div className="flex flex-col items-center">
						<Avatar className="w-16 h-16 mb-2 border-4 border-slate-400">
							<AvatarImage src={topThree[1]?.user?.image || ""} />
							<AvatarFallback className="bg-gray-200 text-gray-600">
								{topThree[1]?.user?.name?.substring(0, 2).toUpperCase() || "?"}
							</AvatarFallback>
						</Avatar>
						<p className="font-semibold text-sm">
							{topThree[1]?.user?.name || "-"}
						</p>
						<p className="text-sm text-gray-600">{topThree[1]?.score}</p>
						<div className="mt-4 w-32 h-32 bg-linear-to-t from-slate-600 to-slate-400 rounded-t-2xl flex items-center justify-center">
							<span className="text-6xl font-bold text-white">2</span>
						</div>
					</div>

					{/* Rank 1 */}
					<div className="flex flex-col items-center -mt-8">
						<div className="relative">
							<Avatar className="w-20 h-20 mb-2 border-4 border-yellow-400">
								<AvatarImage src={topThree[0]?.user?.image || ""} />
								<AvatarFallback className="bg-gray-200 text-gray-600">
									{topThree[0]?.user?.name?.substring(0, 2).toUpperCase() ||
										"?"}
								</AvatarFallback>
							</Avatar>
							<span className="absolute -top-1 -right-1 text-3xl">
								<Crown className="text-yellow-400 fill-yellow-400 h-8 w-8" />
							</span>
						</div>
						<p className="font-semibold">{topThree[0]?.user?.name || "-"}</p>
						<p className="text-sm text-gray-600">{topThree[0]?.score}</p>
						<div className="mt-4 w-32 h-40 bg-linear-to-t from-yellow-600 to-yellow-400 rounded-t-2xl flex items-center justify-center">
							<span className="text-7xl font-bold text-white">1</span>
						</div>
					</div>

					{/* Rank 3 */}
					<div className="flex flex-col items-center">
						<Avatar className="w-16 h-16 mb-2 border-4 border-yellow-800">
							<AvatarImage src={topThree[2]?.user?.image || ""} />
							<AvatarFallback className="bg-gray-200 text-gray-600">
								{topThree[2]?.user?.name?.substring(0, 2).toUpperCase() || "?"}
							</AvatarFallback>
						</Avatar>
						<p className="font-semibold text-sm">
							{topThree[2]?.user?.name || "-"}
						</p>
						<p className="text-sm text-gray-600">{topThree[2]?.score}</p>
						<div className="mt-4 w-32 h-28 bg-linear-to-t from-yellow-900 to-yellow-700 rounded-t-2xl flex items-center justify-center">
							<span className="text-6xl font-bold text-white">3</span>
						</div>
					</div>
				</div>
			)}

			{/* Table */}
			<div className="bg-gray-50 dark:bg-stone-800 rounded-lg overflow-hidden">
				{/* Header */}
				<div className="bg-black text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
					<div className="flex items-center gap-8">
						<span className="font-semibold w-12">Rank</span>
						<span className="font-semibold">Nama</span>
					</div>
					<span className="font-semibold">Skor</span>
				</div>

				{/* List Users */}
				<div className="divide-y divide-gray-200 dark:divide-stone-700">
					{remainingUsers.length > 0 ? (
						remainingUsers.map((user: any) => (
							<div
								key={user.userId}
								className="px-6 py-4 flex items-center justify-between gap-4"
							>
								<span className="text-2xl font-semibold text-gray-400 w-12">
									{user.rank}
								</span>
								<div className="flex items-center gap-3 flex-1">
									<Avatar className="w-10 h-10">
										<AvatarImage src={user.user?.image || ""} />
										<AvatarFallback className="bg-gray-200 text-gray-600">
											{user.user?.name?.substring(0, 2).toUpperCase() || "U"}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className="font-semibold">{user.user?.name}</p>
									</div>
								</div>
								<span className="text-xl font-bold text-primary">
									{user.score}
								</span>
							</div>
						))
					) : (
						<div className="px-6 py-8 text-center text-gray-500">-</div>
					)}
				</div>

				{/* Your rank */}
				{currentUser && (
					<div className="bg-primary text-white px-6 py-4 flex items-center justify-between rounded-lg gap-4">
						<span className="text-2xl font-semibold w-12">
							{currentUser.rank}
						</span>
						<div className="flex items-center gap-3 flex-1">
							<Avatar className="w-10 h-10">
								<AvatarImage
									src={currentUser.user?.image || ""}
									alt={currentUser.user?.name || "User"}
								/>
								<AvatarFallback className="bg-white text-primary font-semibold">
									{currentUser.user?.name?.substring(0, 2).toUpperCase() || "U"}
								</AvatarFallback>
							</Avatar>
							<div>
								<p className="font-semibold">Kamu</p>
							</div>
						</div>
						<span className="text-xl font-bold">{currentUser.score}</span>
					</div>
				)}
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<Pagination className="mt-6">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() => handlePageChange(Math.max(1, page - 1))}
								className={
									page <= 1
										? "pointer-events-none opacity-50"
										: "cursor-pointer"
								}
							/>
						</PaginationItem>
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
							<PaginationItem key={p}>
								<PaginationLink
									onClick={() => handlePageChange(p)}
									isActive={p === page}
									className="cursor-pointer"
								>
									{p}
								</PaginationLink>
							</PaginationItem>
						))}
						<PaginationItem>
							<PaginationNext
								onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
								className={
									page >= totalPages
										? "pointer-events-none opacity-50"
										: "cursor-pointer"
								}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	);
}
