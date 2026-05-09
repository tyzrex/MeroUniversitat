import { PrismaClient } from "@/generated/prisma/client";
import { adapter } from "../../prisma.config";
// import { PrismaNeon } from "@prisma/adapter-neon";

// Prisma 7 requires adapters for connection.
// In dev with Docker we use the standard TCP adapter via DATABASE_URL.
// In prod with Neon, swap to PrismaNeon adapter.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");

  // Neon (serverless) — detected via neon.tech in URL
  // if (databaseUrl.includes("neon.tech")) {
  //   const { neon } = require("@neondatabase/serverless");
  //   const sql = neon(databaseUrl);
  //   const adapter = new PrismaNeon(sql);
  //   return new PrismaClient({ adapter, log: ["error"] } as any);
  // }

  // Standard PostgreSQL (Docker)
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
