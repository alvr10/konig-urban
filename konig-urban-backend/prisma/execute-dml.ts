/**
 * execute-dml.ts
 *
 * Ejecuta todos los archivos DML numerados (01-*.sql … NN-*.sql)
 * de `prisma/DML` en orden, usando el PrismaClient para conectarse
 * a Supabase.
 *
 * Uso:
 *   npm run db:seed
 *
 * Requisito: DATABASE_URL definida en .env (Supabase pooler port 5432).
 *
 * Cada archivo es idempotente (ON CONFLICT DO NOTHING), por lo que
 * puede ejecutarse múltiples veces sin efectos secundarios.
 *
 * Nota: Prisma v7 usa Query Compiler (sin binario Rust) y requiere
 * un driver adapter explícito. Usamos @prisma/adapter-pg con pg.
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌  DATABASE_URL no está definida en el fichero .env');
  process.exit(1);
}

// Prisma v7 requiere un driver adapter (Query Compiler, sin binario Rust)
const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/** Elimina comentarios de línea (--) de un bloque SQL. */
function stripLineComments(sql: string): string {
  return sql
    .split('\n')
    .map((line) => {
      const idx = line.indexOf('--');
      return idx >= 0 ? line.slice(0, idx) : line;
    })
    .join('\n');
}

/** Separa un bloque SQL en sentencias individuales (respeta strings). */
function splitStatements(sql: string): string[] {
  const clean = stripLineComments(sql);
  return clean
    .split(/;(?=(?:[^']*'[^']*')*[^']*$)/gm)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

async function main(): Promise<void> {
  const dmlDir = path.join(__dirname, 'DML');

  if (!fs.existsSync(dmlDir)) {
    console.error(`❌  El directorio DML no existe en: ${dmlDir}`);
    process.exit(1);
  }

  // Solo archivos con prefijo numérico (01-*.sql, 02-*.sql …)
  const files = fs
    .readdirSync(dmlDir)
    .filter((f) => /^\d{2}-.*\.sql$/.test(f))
    .sort();

  if (files.length === 0) {
    console.warn('⚠️  No se encontraron archivos DML numerados (NN-*.sql).');
    process.exit(0);
  }

  console.log('🚀  Iniciando carga DML en Supabase…');
  console.log(`📂  Directorio : ${dmlDir}`);
  console.log(`📄  Archivos   : ${files.join(', ')}\n`);

  let totalErr = 0;

  for (const file of files) {
    const filePath = path.join(dmlDir, file);
    const rawSql = fs.readFileSync(filePath, 'utf-8');
    const stmts = splitStatements(rawSql);

    console.log(`🔹  [${file}] — ${stmts.length} sentencias`);

    for (let i = 0; i < stmts.length; i++) {
      try {
        await prisma.$executeRawUnsafe(stmts[i]);
      } catch (err: unknown) {
        totalErr++;
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`  ❌  Sentencia ${i + 1}/${stmts.length} falló:`);
        console.error(`     ${msg.slice(0, 400)}`);
      }
    }

    console.log(`  ✅  [${file}] completado.`);
  }

  console.log('\n──────────────────────────────────────────');
  console.log('🏁  Proceso finalizado.');
  if (totalErr > 0) {
    console.warn(`⚠️  ${totalErr} sentencia(s) fallaron. Revisa los mensajes anteriores.`);
  } else {
    console.log('🎉  Todos los INSERTs ejecutados sin errores.');
  }
}

main()
  .catch((e: unknown) => {
    console.error('❌  Error fatal:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
