import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

export interface DatabaseConfig {
  connectionString: string;
}

export function createPrismaClient(config: DatabaseConfig): PrismaClient {
  const pool = new pg.Pool({ connectionString: config.connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

// Export everything from @prisma/client for consuming packages
export * from '@prisma/client';
