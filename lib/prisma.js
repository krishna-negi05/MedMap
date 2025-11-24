// lib/prisma.js
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

/**
 * Create or reuse a Prisma client singleton.
 * This prevents "PrismaClient is already running" during HMR in dev.
 */
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Use 'datasources' to override the URL for the datasource named 'db'
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;