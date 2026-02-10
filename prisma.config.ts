import "dotenv/config";
import { defineConfig, env } from "prisma/config";

function buildDatabaseUrl(): string {
	const baseUrl = env("DATABASE_URL");
	const url = new URL(baseUrl);

	const params = {
		connection_limit: process.env.DB_CONNECTION_LIMIT || "8",
		pool_timeout: process.env.DB_POOL_TIMEOUT || "15",
		connect_timeout: process.env.DB_CONNECT_TIMEOUT || "10",
		sslaccept: "accept_invalid_certs", // Accept self-signed certificates
	};

	Object.entries(params).forEach(([k, v]) => {
		if (!url.searchParams.has(k)) url.searchParams.set(k, v);
	});

	return url.toString();
}

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
		seed: "tsx prisma/seed.ts",
	},
	datasource: { url: buildDatabaseUrl() },
});
