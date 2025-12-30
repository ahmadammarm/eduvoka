import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Daftar - Eduvoka",
	description: "Buat akun Eduvoka Anda untuk memulai perjalanan pembelajaran Anda.",
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>
}