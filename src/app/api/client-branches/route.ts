// src/app/api/client-branches/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // <--- CORRECCIÓN APLICADA
import { prisma } from '@/lib/prisma';
import { ClientBranch } from '@/types/clientTypes'; 

export const dynamic = 'force-dynamic';

/**
 * Tipo para el payload de creación de una sucursal, excluyendo campos de relación
 * y los campos de tiempo que se añadirán manualmente.
 */
type ClientBranchCreateInput = Omit<ClientBranch, 'branch_id' | 'client_contacts' | 'created_at' | 'updated_at'>;

/**
 * Función de utilidad para obtener la sesión y la company_id
 */
async function getAuthAndCompanyId() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.company_id) {
    return {
      errorResponse: NextResponse.json({ message: 'No autenticado o sin Company ID' }, { status: 401 }),
      companyId: null,
    };
  }

  return { errorResponse: null, companyId: session.user.company_id };
}

/**
 * Manejador POST: Crea una nueva sucursal.
 * URL: /api/client-branches
 */
export async function POST(request: NextRequest) {
    const { errorResponse, companyId } = await getAuthAndCompanyId();
    if (errorResponse) return errorResponse;

    try {
        // Usamos el nuevo tipo que solo contiene campos escalares para la creación
        const body: ClientBranchCreateInput = await request.json();
        const { client_id, branch_name } = body;

        if (!client_id || !branch_name) {
            return NextResponse.json({ message: 'client_id y branch_name son requeridos.' }, { status: 400 });
        }

        // 1. Verificar que el cliente existe y pertenece a la compañía
        const existingClient = await prisma.clients.findFirst({
            where: {
                client_id: client_id,
                company_id: companyId as string,
            }
        });

        if (!existingClient) {
            return NextResponse.json({ message: 'Cliente asociado no encontrado o no pertenece a tu compañía.' }, { status: 404 });
        }

        // 2. Crear la nueva sucursal con los datos escalares del body
        const newBranch = await prisma.client_branches.create({
            data: {
                // Ahora, 'body' solo contiene los campos que coinciden con la tabla de Prisma.
                ...body, 
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        return NextResponse.json(newBranch, { status: 201 });
    } catch (error) {
        console.error('Error al crear sucursal:', error);
        return NextResponse.json({ message: 'Error interno del servidor al crear sucursal.' }, { status: 500 });
    }
}

// // src/app/api/client-branches/route.ts
// import { NextResponse, NextRequest } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import { prisma } from '@/lib/prisma';
// import { ClientBranch } from '@/types/clientTypes'; 

// export const dynamic = 'force-dynamic';

// /**
//  * Función de utilidad para obtener la sesión y la company_id
//  */
// async function getAuthAndCompanyId() {
//   const session = await getServerSession(authOptions);

//   if (!session || !session.user || !session.user.company_id) {
//     return {
//       errorResponse: NextResponse.json({ message: 'No autenticado o sin Company ID' }, { status: 401 }),
//       companyId: null,
//     };
//   }

//   return { errorResponse: null, companyId: session.user.company_id };
// }

// /**
//  * Manejador POST: Crea una nueva sucursal.
//  * URL: /api/client-branches
//  */
// export async function POST(request: NextRequest) {
//     const { errorResponse, companyId } = await getAuthAndCompanyId();
//     if (errorResponse) return errorResponse;

//     try {
//         const body: Omit<ClientBranch, 'branch_id'> = await request.json();
//         const { client_id, branch_name } = body;

//         if (!client_id || !branch_name) {
//             return NextResponse.json({ message: 'client_id y branch_name son requeridos.' }, { status: 400 });
//         }

//         const existingClient = await prisma.clients.findFirst({
//             where: {
//                 client_id: client_id,
//                 company_id: companyId as string,
//             }
//         });

//         if (!existingClient) {
//             return NextResponse.json({ message: 'Cliente asociado no encontrado o no pertenece a tu compañía.' }, { status: 404 });
//         }

//         const newBranch = await prisma.client_branches.create({
//             data: {
//                 ...body,
//                 created_at: new Date(),
//                 updated_at: new Date(),
//             },
//         });

//         return NextResponse.json(newBranch, { status: 201 });
//     } catch (error) {
//         console.error('Error al crear sucursal:', error);
//         return NextResponse.json({ message: 'Error interno del servidor al crear sucursal.' }, { status: 500 });
//     }
// }