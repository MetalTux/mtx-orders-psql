import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client'; // Importar Prisma para tipos de utilidad

// ----------------------------------------------------
// Tipos de datos para el Dashboard
// ----------------------------------------------------

type WorkOrderWithClient = {
  id: string;
  status: string;
  // Usamos 'number' si en la DB es un entero, 'Decimal' si el tipo es Decimal de Prisma
  total_amount_cents: number; 
  created_at: Date | null;
  // La propiedad 'clients' es la relación que incluimos en la consulta
  clients: {
    client_name: string;
  };
};

/** Tipo para la desestructuración del resultado de Promise.all */
export type DashboardQueryResult = [number, number, number, WorkOrderWithClient[]];

/**
 * Obtiene todos los datos necesarios para la página principal del Dashboard 
 * en una sola consulta Promise.all.
 * @returns [totalClients, totalQuotes, totalWorkOrders, recentWorkOrders]
 */
export async function getDashboardData(): Promise<DashboardQueryResult> {
  // Configuración de la consulta de Órdenes Recientes
  const recentWorkOrdersQuery = prisma.work_orders.findMany({
    take: 5,
    orderBy: { created_at: 'desc' },
    include: {
      clients: { 
        select: { client_name: true }
      }
    }
  });

  // Ejecución de todas las consultas en paralelo
  const results = await Promise.all([
    prisma.clients.count(),
    prisma.quotes.count(),
    prisma.work_orders.count(),
    recentWorkOrdersQuery,
  ]).catch(error => {
    console.error("Error al obtener datos del dashboard:", error);
    // Retorna 0 y un array vacío en caso de error, asegurando la consistencia del tipo
    return [0, 0, 0, [] as WorkOrderWithClient[]]; 
  });

  // El resultado cumple con el tipo DashboardQueryResult
  return results as DashboardQueryResult; 
}
