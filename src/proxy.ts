import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
	function middleware(req) {
		const token = req.nextauth.token;
		const pathname = req.nextUrl.pathname;

		if (!token) {
			return NextResponse.next();
		}


		if (token.gayaBelajar && pathname.startsWith("/vak-quiz")) {
			return NextResponse.redirect(new URL("/dashboard", req.url));
		}


		if (!token.gayaBelajar && pathname.startsWith("/dashboard")) {
			return NextResponse.redirect(new URL("/vak-quiz", req.url));
		}

		return NextResponse.next();
	},
	{
		pages: {
			signIn: "/auth/sign-in",
		},
		callbacks: {
			authorized: ({ token }) => !!token,
		},
	}
);

export const config = {
	matcher: [
		"/dashboard/:path*",
		"/vak-quiz",
	],
};