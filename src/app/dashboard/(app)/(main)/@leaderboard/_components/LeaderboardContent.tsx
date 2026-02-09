import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
	getCurrentUserRank,
	getCurrentUserRankToday,
	getLeaderboardData,
	getLeaderboardToday,
} from "../_lib/data";
import LeaderboardTable from "./LeaderboardTable";
import { auth } from "@/lib/auth";
import { LeaderboardUser } from "../_types/leaderboard";

export default async function LeaderboardContent({
	currentPage,
}: {
	currentPage: number;
}) {
	const session = await auth();
	const userId = session?.user?.id;

	const [todayData, allTimeData, currentUserRankToday, currentUserRank] =
		await Promise.all([
			getLeaderboardToday(),
			getLeaderboardData(currentPage),
			userId ? getCurrentUserRankToday(userId) : Promise.resolve(null),
			userId ? getCurrentUserRank(userId) : Promise.resolve(null),
		]);

	return (
		<div className="min-h-200 bg-white dark:bg-stone-900 rounded-xl p-6">
			<div className="flex justify-between items-start mb-4">
				<h1 className="text-2xl font-bold">Leaderboard</h1>
			</div>
			<div>
				<Tabs defaultValue="today" className="w-full">
					<TabsList className="w-full py-6 bg-gray-100 dark:bg-stone-800">
						<TabsTrigger
							value="today"
							className="flex-1 py-4 data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-white"
						>
							Hari Ini
						</TabsTrigger>
						<TabsTrigger
							value="all-time"
							className="flex-1 py-4 data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-white"
						>
							Sepanjang Waktu
						</TabsTrigger>
					</TabsList>
					<TabsContent value="today" className="mt-14">
						<LeaderboardTable
							users={todayData as LeaderboardUser[]}
							page={1}
							totalPages={1}
							currentUser={currentUserRankToday as LeaderboardUser | null}
						/>
					</TabsContent>
					<TabsContent value="all-time" className="mt-14">
						<LeaderboardTable
							users={allTimeData.leaderboard as LeaderboardUser[]}
							page={currentPage}
							totalPages={allTimeData.totalPages}
							currentUser={currentUserRank as LeaderboardUser | null}
						/>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
