"use client"

import { SigninSchema, type SigninSchemaType } from "@/schemas/SigninSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Image from "next/image"
import Link from "next/link"

export default function SigninForm() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const [isGoogleLoading, setIsGoogleLoading] = useState(false)

	useEffect(() => {
		if (status === "authenticated") {
			router.replace("/dashboard")
		}
	}, [status, router])

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SigninSchemaType>({
		resolver: zodResolver(SigninSchema),
	})

	const mutation = useMutation({
		mutationFn: async (data: SigninSchemaType) => {
			const result = await signIn("credentials", {
				email: data.email,
				password: data.password,
				redirect: false,
			})

			if (result?.error) throw new Error(result.error)
			return result
		},
		onSuccess: () => {
			toast.success("Signed in successfully!")
			router.replace("/dashboard")
		},
		onError: (error: Error) => {
			toast.error(error.message)
		},
	})

	const handleGoogleSignin = async () => {
		setIsGoogleLoading(true)
		await signIn("google", {
			callbackUrl: "/dashboard",
		})
	}

	if (status === "loading") return null

	return (
		<div className="min-h-screen flex flex-col lg:flex-row bg-background overflow-hidden">
			<div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden bg-linear-to-br from-black/10 via-black/80 to-black">
				<Image
					src="/assets/images/sign-in.jpg"
					alt="Login Illustration"
					className="absolute inset-0 w-full h-full object-cover opacity-30"
					width={800}
					height={600}
				/>
				<div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>

				<Link href="/" aria-label="Kembali ke Beranda" className="absolute top-4 left-4 z-30">
					<Image src="/assets/images/logo-eduvoka.png" alt="Eduvoka Logo" width={48} height={48} className="object-contain bg-white p-1 rounded-md" />
				</Link>

				<div className="absolute bottom-16 left-8 right-8 text-white text-4xl font-semibold text-left fade-in z-10">
					<h2 className="text-balance">
						Selamat datang di <span className="text-primary font-bold">Eduvoka</span>
					</h2>
				</div>
			</div>

			<div className="flex w-full lg:w-1/2 items-center justify-center p-6 lg:p-8 min-h-screen lg:min-h-0 bg-background">
				<div className="w-full max-w-md fade-in">
					<div className="mb-8">
						<h1 className="text-4xl font-bold text-foreground mb-2">Selamat Datang</h1>
						<p className="text-muted-foreground text-sm">Masuk ke akun Anda untuk melanjutkan</p>
					</div>

					<Button
						type="button"
						onClick={handleGoogleSignin}
						disabled={isGoogleLoading}
						className={`w-full h-12 flex items-center justify-center gap-3 bg-background border-2 border-border text-foreground rounded-lg py-3 mb-6 shadow-sm hover:shadow-md hover:bg-muted/50 transition-all duration-200 font-medium cursor-pointer ${isGoogleLoading ? "opacity-50 cursor-not-allowed" : ""}`}
					>
						<span className="flex items-center justify-center w-5 h-5">
							<Image src="/assets/google.webp" alt="Google Logo" width={20} height={20} />
						</span>
						<span className="text-sm">{isGoogleLoading ? "Signing in..." : "Continue with Google"}</span>
					</Button>

					<div className="flex items-center my-7">
						<div className="grow h-px bg-border" />
						<span className="mx-4 text-muted-foreground text-xs font-medium">ATAU</span>
						<div className="grow h-px bg-border" />
					</div>

					<form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
						<div className="space-y-2">
							<label htmlFor="email" className="text-sm font-medium text-foreground">
								Alamat Email
							</label>
							<Input
								id="email"
								type="email"
								placeholder="Email Anda"
								{...register("email")}
								className={`w-full h-11 px-4 rounded-lg border-2 transition-colors duration-200 bg-background text-foreground placeholder:text-muted-foreground input-focus-ring ${errors.email ? "border-destructive" : "border-border hover:border-primary/50"}`}
							/>
							{errors.email && <p className="text-destructive text-xs font-medium mt-1">{errors.email.message}</p>}
						</div>

						<div className="space-y-2">
							<label htmlFor="password" className="text-sm font-medium text-foreground">
								Kata Sandi
							</label>
							<Input
								id="password"
								type="password"
								placeholder="Kata Sandi Anda"
								{...register("password")}
								className={`w-full h-11 px-4 rounded-lg border-2 transition-colors duration-200 bg-background text-foreground placeholder:text-muted-foreground input-focus-ring ${errors.password ? "border-destructive" : "border-border hover:border-primary/50"}`}
							/>
							{errors.password && (
								<p className="text-destructive text-xs font-medium mt-1">{errors.password.message}</p>
							)}
						</div>

						<Button
							type="submit"
							disabled={mutation.isPending}
							className={`w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${mutation.isPending ? "opacity-70 cursor-not-allowed" : ""}`}
						>
							{mutation.isPending ? (
								<span className="flex items-center gap-2">
									<span className="inline-block w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
									Masuk...
								</span>
							) : (
								"Masuk"
							)}
						</Button>
					</form>

					<Link href="/" className="md:hidden block mt-4 text-sm text-primary hover:text-primary/90 transition-colors duration-200 text-center">
						Kembali ke beranda
					</Link>

					<div className="mt-8 text-center">
						<p className="text-sm text-muted-foreground">
							Belum punya akun?{" "}
							<Link
								href="/auth/sign-up"
								className="font-semibold text-primary hover:text-primary/90 transition-colors duration-200 underline"
							>
								Daftar
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}