import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
            gayaBelajar: string | null;
            paketUser: string;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
    }
}