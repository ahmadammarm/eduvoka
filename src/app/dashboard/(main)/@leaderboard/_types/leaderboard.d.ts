export interface LeaderboardUser {
	userId: string;
	rank: number;
	score: number;
	user: {
		name: string;
		profileImage: string | null;
	};
}

export interface LeaderboardProps {
	users: LeaderboardUser[];
	page: number;
	totalPages: number;
	currentUser?: LeaderboardUser | null;
}
