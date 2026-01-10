export interface LeaderboardProps {
	users: any[];
	page: number;
	totalPages: number;
	currentUser?: {
		rank: number;
		userId: string;
		score: number;
		user: any;
	} | null;
}
