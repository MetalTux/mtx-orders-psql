import { PrismaClient } from '../generated/prisma';

// Extender el objeto global para Next.js HMR (Hot Module Replacement)
// Esto evita crear múltiples instancias de PrismaClient en desarrollo.
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Crea o usa la instancia global de Prisma Client
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

// En modo de producción, la instancia no se guarda en el global.
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Ahora puedes importar 'prisma' desde este archivo en cualquier Server Component o API Route.
