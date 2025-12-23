import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client";

declare global {
    var prismaGlobal: PrismaClient | undefined;
}

const prisma = globalThis.prismaGlobal ?? new PrismaClient({
    log: ["query", "warn", "error"],
    accelerateUrl: process.env.DATABASE_URL!,
});

if (process.env.NODE_ENV !== "production") {
    globalThis.prismaGlobal = prisma;
}

export default prisma;
