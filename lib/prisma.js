// lib/prisma.js
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

/**
 * Create or reuse a Prisma client singleton.
 * This prevents "PrismaClient is already running" during HMR in dev.
 */
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // optional: adjust log levels during dev
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
