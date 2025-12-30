import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Masuk - Eduvoka",
	description: "Masuk ke akun Eduvoka Anda untuk melanjutkan pembelajaran.",
}

export default function SigninLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>
}