import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  const DATABASE_URL = process.env.DATABASE_URL;
  const adapter = new PrismaPg({ connectionString: DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  try {
    const clientes = await prisma.$queryRawUnsafe('SELECT count(*) FROM customers.clientes');
    const pedidos = await prisma.$queryRawUnsafe('SELECT count(*) FROM orders.pedidos');
    console.log('Clientes:', clientes);
    console.log('Pedidos:', pedidos);
  } catch (e: any) {
    console.error('ERROR:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
