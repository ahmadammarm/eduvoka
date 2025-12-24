"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { SignupSchema, type SignupSchemaType } from "@/schemas/SignupSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { SignupAction } from "@/actions/SignupAction"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"

export default function SignupForm() {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupSchemaType>({
        resolver: zodResolver(SignupSchema),
    })

    const mutation = useMutation({
        mutationFn: ({ email, name, password, confirmPassword }: SignupSchemaType) =>
            SignupAction(email, name, password, confirmPassword),
        onSuccess: () => {
            toast.success("User signup successfully!")
            router.push("/auth/sign-in")
        },
        onError: (error: Error) => {
            toast.error(`Registration failed: ${error.message}`)
        },
    })

    const onSubmit = (data: SignupSchemaType) => {
        mutation.mutate(data)
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden bg-gradient-to-br from-secondary to-tertiary">
                <Image
                    src="/assets/images/sign-up.jpg"
                    alt="Signup banner"
                    className="absolute inset-0 w-full h-full object-cover"
                    width={800}
                    height={600}
                />

                <div className="absolute inset-0 bg-black/50"></div>

                <div className="absolute bottom-10 left-8 right-8 text-white text-3xl font-bold text-left leading-tight">
                    Mari belajar sekarang dengan <span className="text-primary font-bold">Eduvoka</span>
                </div>
            </div>

            <div className="flex w-full lg:w-1/2 items-center justify-center p-6 min-h-screen lg:min-h-0">
                <div className="w-full max-w-md">
                    <div className="fade-in">
                        <h1 className="text-4xl font-bold text-foreground mb-2">Daftar Akun</h1>
                        <p className="text-muted-foreground mb-8 text-sm">
                            Buat akun Anda untuk memulai perjalanan belajar Anda bersama kami.
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-foreground">
                                    Nama Lengkap
                                </label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Masukkan nama lengkap Anda"
                                    {...register("name")}
                                    className={`w-full h-11 rounded-lg border-2 px-4 py-2.5 transition-all duration-200 ${errors.name
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-border hover:border-primary/50 input-focus-ring"
                                        }`}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-foreground">
                                    Alamat Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Masukkan alamat email Anda"
                                    {...register("email")}
                                    className={`w-full h-11 rounded-lg border-2 px-4 py-2.5 transition-all duration-200 ${errors.email
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-border hover:border-primary/50 input-focus-ring"
                                        }`}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-foreground">
                                    Kata Sandi
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Buat kata sandi yang kuat"
                                    {...register("password")}
                                    className={`w-full h-11 rounded-lg border-2 px-4 py-2.5 transition-all duration-200 ${errors.password
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-border hover:border-primary/50 input-focus-ring"
                                        }`}
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                                    Konfirmasi Kata Sandi
                                </label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Konfirmasi kata sandi Anda"
                                    {...register("confirmPassword")}
                                    className={`w-full h-11 rounded-lg border-2 px-4 py-2.5 transition-all duration-200 ${errors.confirmPassword
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-border hover:border-primary/50 input-focus-ring"
                                        }`}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={mutation.isPending}
                                className="w-full btn-primary-gradient text-white font-semibold h-11 rounded-lg mt-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
                            >
                                {mutation.isPending ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                                        Mendaftar...
                                    </div>
                                ) : (
                                    "Buat Akun"
                                )}
                            </Button>

                            <div className="text-center mt-6">
                                <p className="text-muted-foreground text-sm">
                                    Sudah punya akun?{" "}
                                    <Link
                                        href="/auth/sign-in"
                                        className="font-semibold text-primary hover:text-primary/90 transition-colors duration-200"
                                    >
                                        Masuk di sini
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
