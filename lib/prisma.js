// lib/prisma.js
import { PrismaClient } from "../app/generated/prisma/client";

const globalForPrisma = globalThis;

/**
 * Create or reuse a Prisma client singleton.
 * This prevents "PrismaClient is already running" during HMR in dev.
 */
const prisma =
  globalForPrisma.__prisma_client__ ||
  new PrismaClient({
    // adjust logging if desired
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma_client__ = prisma;
}

export default prisma;
