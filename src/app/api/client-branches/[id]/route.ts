// src/app/api/client-branches/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; 
import { prisma } from '@/lib/prisma';
import { ClientBranch } from '@/types/clientTypes';

export const dynamic = 'force-dynamic';

// Tipo robusto para el contexto de rutas dinámicas en Next.js
type RouteContext = { 
    params: { id: string }; 
};

/**
 * Tipo para el payload de actualización de una sucursal, excluyendo campos de relación
 * y campos de tiempo/ID que se gestionan automáticamente o por la URL.
 * Usamos Partial<> porque no todos los campos son requeridos en un PUT.
 */
type ClientBranchUpdateInput = Partial<Omit<ClientBranch, 'branch_id' | 'client_contacts' | 'created_at' | 'updated_at'>>;


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
 * Manejador GET: Recupera una sucursal con sus contactos.
 * URL: /api/client-branches/[id]
 */
export async function GET(request: NextRequest, { params }: RouteContext) {
    const { errorResponse, companyId } = await getAuthAndCompanyId();
    if (errorResponse) return errorResponse;
    
    const branchId = params.id;

    try {
        if (!branchId || typeof branchId !== 'string') {
             return NextResponse.json({ message: 'ID de sucursal inválido en la URL.' }, { status: 400 });
        }

        // Buscamos la sucursal, verificando que el cliente padre pertenezca a la compañía del usuario
        const branchData = await prisma.client_branches.findFirst({
            where: {
                branch_id: branchId,
                clients: {
                    company_id: companyId as string,
                }
            },
            include: {
                client_contacts: true, 
                communes: true,
            },
        });

        if (!branchData) {
            return NextResponse.json({ message: 'Sucursal no encontrada.' }, { status: 404 });
        }

        return NextResponse.json(branchData, { status: 200 });
    } catch (error) {
        console.error('Error al obtener sucursal:', error);
        return NextResponse.json({ message: 'Error interno del servidor al obtener sucursal.' }, { status: 500 });
    }
}


/**
 * Manejador PUT: Actualiza una sucursal específica.
 * URL: /api/client-branches/[id]
 */
export async function PUT(request: NextRequest, { params }: RouteContext) {
    const { errorResponse, companyId } = await getAuthAndCompanyId();
    if (errorResponse) return errorResponse;
    
    const branchId = params.id;

    try {
        if (!branchId || typeof branchId !== 'string') {
             return NextResponse.json({ message: 'ID de sucursal inválido en la URL.' }, { status: 400 });
        }
        
        // Usamos el tipo de actualización que solo contiene campos escalares opcionales
        const body: ClientBranchUpdateInput = await request.json();
        
        // 1. Verificación de propiedad (similar a GET)
        const existingBranch = await prisma.client_branches.findFirst({
            where: {
                branch_id: branchId,
                clients: {
                    company_id: companyId as string,
                }
            },
        });

        if (!existingBranch) {
            return NextResponse.json({ message: 'Sucursal no encontrada o no pertenece a tu compañía.' }, { status: 404 });
        }
        
        // 2. Actualización de la sucursal
        const updatedBranch = await prisma.client_branches.update({
            where: { branch_id: branchId },
            data: { 
                // Ahora 'body' solo contiene los campos escalares válidos para la actualización.
                ...body,
                updated_at: new Date(),
            },
        });

        return NextResponse.json(updatedBranch, { status: 200 });
    } catch (error) {
        console.error('Error al actualizar sucursal:', error);
        return NextResponse.json({ message: 'Error interno del servidor al actualizar sucursal.' }, { status: 500 });
    }
}

/**
 * Manejador DELETE: Elimina una sucursal específica.
 * URL: /api/client-branches/[id]
 */
export async function DELETE(request: NextRequest, { params }: RouteContext) {
    const { errorResponse, companyId } = await getAuthAndCompanyId();
    if (errorResponse) return errorResponse;
    
    const branchId = params.id;

    try {
        if (!branchId || typeof branchId !== 'string') {
             return NextResponse.json({ message: 'ID de sucursal inválido en la URL.' }, { status: 400 });
        }

        // 1. Verificación de propiedad
        const existingBranch = await prisma.client_branches.findFirst({
            where: {
                branch_id: branchId,
                clients: {
                    company_id: companyId as string,
                }
            },
        });

        if (!existingBranch) {
            return NextResponse.json({ message: 'Sucursal no encontrada o no pertenece a tu compañía.' }, { status: 404 });
        }
        
        // 2. Eliminación (Prisma maneja eliminaciones en cascada si está configurado en el schema)
        await prisma.client_branches.delete({
            where: { branch_id: branchId },
        });

        return NextResponse.json({ success: true, message: 'Sucursal eliminada exitosamente.' }, { status: 200 });
    } catch (error) {
        console.error('Error al eliminar sucursal:', error);
        return NextResponse.json({ message: 'Error interno del servidor al eliminar sucursal.' }, { status: 500 });
    }
}

// // src/app/api/client-branches/[id]/route.ts
// import { NextResponse, NextRequest } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import { prisma } from '@/lib/prisma';
// import { ClientBranch } from '@/types/clientTypes'; 

// export const dynamic = 'force-dynamic';

// type RouteContext = { 
//     params: { id: string }; 
// };

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
//  * Manejador GET: Recupera una sucursal específica, incluyendo sus contactos.
//  * URL: /api/client-branches/[id]
//  */
// export async function GET(request: NextRequest, { params }: RouteContext) {
//     const { errorResponse, companyId } = await getAuthAndCompanyId();
//     if (errorResponse) return errorResponse;
    
//     const branchId = params.id;

//     try {
//         if (!branchId || typeof branchId !== 'string') {
//              return NextResponse.json({ message: 'ID de sucursal inválido en la URL.' }, { status: 400 });
//         }

//         const branchData = await prisma.client_branches.findFirst({
//             where: {
//                 branch_id: branchId,
//                 clients: {
//                     company_id: companyId as string,
//                 }
//             },
//             include: {
//                 client_contacts: true, // Incluimos los contactos anidados
//             },
//         });

//         if (!branchData) {
//             return NextResponse.json({ message: 'Sucursal no encontrada o no pertenece a tu compañía.' }, { status: 404 });
//         }

//         return NextResponse.json(branchData, { status: 200 });
//     } catch (error) {
//         console.error('Error al obtener sucursal:', error);
//         return NextResponse.json({ message: 'Error interno del servidor al obtener sucursal.' }, { status: 500 });
//     }
// }


// /**
//  * Manejador PUT: Actualiza una sucursal específica.
//  * URL: /api/client-branches/[id]
//  */
// export async function PUT(request: NextRequest, { params }: RouteContext) {
//     const { errorResponse, companyId } = await getAuthAndCompanyId();
//     if (errorResponse) return errorResponse;
    
//     const branchId = params.id;

//     try {
//         if (!branchId || typeof branchId !== 'string') {
//              return NextResponse.json({ message: 'ID de sucursal inválido en la URL.' }, { status: 400 });
//         }
        
//         const body: Partial<ClientBranch> = await request.json();
        
//         const existingBranch = await prisma.client_branches.findFirst({
//             where: {
//                 branch_id: branchId,
//                 clients: {
//                     company_id: companyId as string,
//                 },
//             },
//         });

//         if (!existingBranch) {
//             return NextResponse.json({ message: 'Sucursal no encontrada o no pertenece a tu compañía.' }, { status: 404 });
//         }
        
//         const updatedBranch = await prisma.client_branches.update({
//             where: { branch_id: branchId },
//             data: { 
//                 ...body,
//                 updated_at: new Date(),
//             },
//         });

//         return NextResponse.json(updatedBranch, { status: 200 });
//     } catch (error) {
//         console.error('Error al actualizar sucursal:', error);
//         return NextResponse.json({ message: 'Error interno del servidor al actualizar sucursal.' }, { status: 500 });
//     }
// }

// /**
//  * Manejador DELETE: Elimina una sucursal específica.
//  * URL: /api/client-branches/[id]
//  */
// export async function DELETE(request: NextRequest, { params }: RouteContext) {
//     const { errorResponse, companyId } = await getAuthAndCompanyId();
//     if (errorResponse) return errorResponse;
    
//     const branchId = params.id;

//     try {
//         if (!branchId || typeof branchId !== 'string') {
//              return NextResponse.json({ message: 'ID de sucursal inválido en la URL.' }, { status: 400 });
//         }

//         const existingBranch = await prisma.client_branches.findFirst({
//             where: {
//                 branch_id: branchId,
//                 clients: {
//                     company_id: companyId as string,
//                 },
//             },
//         });

//         if (!existingBranch) {
//             return NextResponse.json({ message: 'Sucursal no encontrada o no pertenece a tu compañía.' }, { status: 404 });
//         }
        
//         await prisma.client_branches.delete({
//             where: { branch_id: branchId },
//         });

//         return NextResponse.json({ success: true, message: 'Sucursal eliminada exitosamente.' }, { status: 200 });
//     } catch (error) {
//         console.error('Error al eliminar sucursal:', error);
//         return NextResponse.json({ message: 'Error interno del servidor al eliminar sucursal.' }, { status: 500 });
//     }
// }