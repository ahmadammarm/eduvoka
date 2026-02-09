export interface UserNavProps {
	session: {
		user?: {
			name?: string | null;
			email?: string | null;
			image?: string | null;
		} | null;
	};
}
