"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export default function DashboardPage() {

    const handleSignout = () => {
        signOut({ callbackUrl: "/auth/sign-in" })
    }
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p>Welcome to your dashboard!</p>
            <Button className="mt-4" onClick={handleSignout}>Sign Out</Button>
        </div>
    )
}