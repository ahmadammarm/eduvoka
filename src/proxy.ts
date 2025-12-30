import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
	function middleware(req) {
		const token = req.nextauth.token;
		const pathname = req.nextUrl.pathname;

		if (!token) {
			return NextResponse.next();
		}

		console.log("Middleware - Path:", pathname);
		console.log("Middleware - gayaBelajar:", token.gayaBelajar);


		if (token.gayaBelajar && pathname.startsWith("/vak-quiz")) {
			console.log("Redirecting to dashboard - user has gayaBelajar");
			return NextResponse.redirect(new URL("/dashboard", req.url));
		}


		if (!token.gayaBelajar && pathname.startsWith("/dashboard")) {
			console.log("Redirecting to vak-quiz - user needs to complete quiz");
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