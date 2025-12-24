/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

declare global {
    var prisma: PrismaClient | undefined;
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaMariaDb({
    url: DATABASE_URL,
    ssl: {
        rejectUnauthorized: true,
    },
} as any);

export const prisma =
    global.prisma ??
    new PrismaClient({
        adapter,
        log:
            process.env.NODE_ENV === "development"
                ? ["query", "warn", "error"]
                : ["error"],
        errorFormat: "pretty",
    });

if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
}
