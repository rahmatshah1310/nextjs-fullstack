// app/db.server.ts
import { PrismaClient } from "@prisma/client";

declare global {
  var __prisma: PrismaClient;
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: ["query", "error"],
  });

if (process.env.NODE_ENV !== "production") global.__prisma = prisma;
