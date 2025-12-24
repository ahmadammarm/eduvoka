import { PrismaClient } from "../../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import mariadb from "mariadb";

declare global {
    var prisma: PrismaClient | undefined;
    var mariadbPool: mariadb.Pool | undefined;
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
}

const url = new URL(DATABASE_URL);

const poolConfig: mariadb.PoolConfig = {
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    connectionLimit: 10,
    connectTimeout: 10000,
    ssl: {
        rejectUnauthorized: true,
    },
};

const pool = global.mariadbPool ?? mariadb.createPool(poolConfig);

if (process.env.NODE_ENV !== "production") {
    global.mariadbPool = pool;
}

const adapter = new PrismaMariaDb(poolConfig);

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