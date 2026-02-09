import LeaderboardContent from "./_components/LeaderboardContent";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	const params = await searchParams;
	const currentPage = Number(params.page) || 1;

	return <LeaderboardContent currentPage={currentPage} />;
}
