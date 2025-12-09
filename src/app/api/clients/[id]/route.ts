// src/app/api/clients/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // <--- CORREGIDO: Usar '@/lib/auth'
import { prisma } from '@/lib/prisma';
import { ClientFormData } from '@/types/clientTypes';

export const dynamic = 'force-dynamic';

// Tipo robusto para el contexto de rutas dinámicas en Next.js
type RouteContext = { 
    params: { id: string }; 
};

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
 * Manejador GET: Recupera un cliente, incluyendo sus sucursales y contactos.
 * URL: /api/clients/[id]
 */
export async function GET(request: NextRequest, { params }: RouteContext) {
    const { errorResponse, companyId } = await getAuthAndCompanyId();
    if (errorResponse) return errorResponse;
    
    // Acceso directo y seguro al ID
    const clientId = params.id;

    try {
        if (!clientId || typeof clientId !== 'string') {
             return NextResponse.json({ message: 'ID de cliente inválido en la URL.' }, { status: 400 });
        }

        const clientData = await prisma.clients.findFirst({
            where: {
                client_id: clientId,
                company_id: companyId as string,
            },
            include: {
                client_branches: {
                    include: {
                        client_contacts: true, 
                    },
                    orderBy: {
                        created_at: 'asc',
                    }
                },
                communes: true, 
            },
        });

        if (!clientData) {
            return NextResponse.json({ message: 'Cliente no encontrado.' }, { status: 404 });
        }

        return NextResponse.json(clientData, { status: 200 });
    } catch (error) {
        console.error('Error al obtener cliente:', error);
        return NextResponse.json({ message: 'Error interno del servidor al obtener cliente.' }, { status: 500 });
    }
}


/**
 * Manejador PUT: Actualiza un cliente específico.
 * URL: /api/clients/[id]
 */
export async function PUT(request: NextRequest, { params }: RouteContext) {
    const { errorResponse, companyId } = await getAuthAndCompanyId();
    if (errorResponse) return errorResponse;
    
    const clientId = params.id;

    try {
        if (!clientId || typeof clientId !== 'string') {
             return NextResponse.json({ message: 'ID de cliente inválido en la URL.' }, { status: 400 });
        }
        
        const body: Partial<ClientFormData> = await request.json();
        
        const existingClient = await prisma.clients.findFirst({
            where: {
                client_id: clientId,
                company_id: companyId as string,
            },
        });

        if (!existingClient) {
            return NextResponse.json({ message: 'Cliente no encontrado o no pertenece a tu compañía.' }, { status: 404 });
        }
        
        const updatedClient = await prisma.clients.update({
            where: { client_id: clientId },
            data: { 
                ...body,
                updated_at: new Date(),
            },
        });

        return NextResponse.json(updatedClient, { status: 200 });
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        return NextResponse.json({ message: 'Error interno del servidor al actualizar cliente.' }, { status: 500 });
    }
}

/**
 * Manejador DELETE: Elimina un cliente específico.
 * URL: /api/clients/[id]
 */
export async function DELETE(request: NextRequest, { params }: RouteContext) {
    const { errorResponse, companyId } = await getAuthAndCompanyId();
    if (errorResponse) return errorResponse;
    
    const clientId = params.id;

    try {
        if (!clientId || typeof clientId !== 'string') {
             return NextResponse.json({ message: 'ID de cliente inválido en la URL.' }, { status: 400 });
        }

        const existingClient = await prisma.clients.findFirst({
            where: {
                client_id: clientId,
                company_id: companyId as string,
            },
        });

        if (!existingClient) {
            return NextResponse.json({ message: 'Cliente no encontrado o no pertenece a tu compañía.' }, { status: 404 });
        }
        
        await prisma.clients.delete({
            where: { client_id: clientId },
        });

        return NextResponse.json({ success: true, message: 'Cliente eliminado exitosamente.' }, { status: 200 });
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        return NextResponse.json({ message: 'Error interno del servidor al eliminar cliente.' }, { status: 500 });
    }
}

// // src/app/api/clients/[id]/route.ts
// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import { prisma } from '@/lib/prisma';
// import { ClientFormData } from '@/types/clientTypes';

// // Deshabilitar cache para asegurar datos actualizados
// export const dynamic = 'force-dynamic';

// interface Context {
//     params: { id: string | Promise<string> }; // Ajustamos el tipo para reflejar la posible Promise
// }

// /**
//  * Función de utilidad para obtener la sesión y la company_id
//  */
// async function getAuthAndCompanyId() {
//   const session = await getServerSession(authOptions);

//   if (!session || !session.user || !session.user.companyId) {
//     return {
//       errorResponse: NextResponse.json({ message: 'No autenticado o sin Company ID' }, { status: 401 }),
//       companyId: null,
//     };
//   }

//   return { errorResponse: null, companyId: session.user.companyId };
// }

// /**
//  * Manejador PUT: Actualiza un cliente específico, asegurando pertenencia a la compañía.
//  * URL: /api/clients/[id]
//  */
// // CAMBIO CLAVE: Desestructuramos { params } para acceder al contexto.
// export async function PUT(request: Request, { params }: Context) {
//     const { errorResponse, companyId } = await getAuthAndCompanyId();
//     if (errorResponse) return errorResponse;
    
//     const xParams = await params;
//     const clientId = await xParams.id.toString();

//     try {
//         // Se valida que el clientId sea una cadena válida antes de proceder
//         if (!clientId || typeof clientId !== 'string') {
//              return NextResponse.json({ message: 'ID de cliente inválido en la URL.' }, { status: 400 });
//         }
        
//         const body: Partial<ClientFormData> = await request.json();
        
//         // El cliente debe existir y pertenecer a la compañía
//         const existingClient = await prisma.clients.findFirst({
//             where: {
//                 client_id: clientId,
//                 company_id: companyId as string,
//             },
//         });

//         if (!existingClient) {
//             return NextResponse.json({ message: 'Cliente no encontrado o no pertenece a tu compañía.' }, { status: 404 });
//         }
        
//         // Actualizar el cliente
//         const updatedClient = await prisma.clients.update({
//             where: { client_id: clientId },
//             data: { 
//                 ...body,
//                 updated_at: new Date(),
//             },
//         });

//         return NextResponse.json(updatedClient, { status: 200 });
//     } catch (error) {
//         console.error('Error al actualizar cliente:', error);
//         return NextResponse.json({ message: 'Error interno del servidor al actualizar cliente.' }, { status: 500 });
//     }
// }

// /**
//  * Manejador DELETE: Elimina un cliente específico, asegurando pertenencia a la compañía.
//  * URL: /api/clients/[id]
//  */
// // Aplicamos el mismo patrón de desestructuración a DELETE por consistencia
// export async function DELETE(request: Request, { params }: Context) {
//     const { errorResponse, companyId } = await getAuthAndCompanyId();
//     if (errorResponse) return errorResponse;
    
//     // Aplicamos 'await' también en DELETE
//     const xParams = await params;
//     const clientId = await xParams.id.toString();

//     try {
//         if (!clientId || typeof clientId !== 'string') {
//              return NextResponse.json({ message: 'ID de cliente inválido en la URL.' }, { status: 400 });
//         }

//         // Verificar que el cliente exista y pertenezca a la compañía
//         const existingClient = await prisma.clients.findFirst({
//             where: {
//                 client_id: clientId,
//                 company_id: companyId as string,
//             },
//         });

//         if (!existingClient) {
//             return NextResponse.json({ message: 'Cliente no encontrado o no pertenece a tu compañía.' }, { status: 404 });
//         }
        
//         // Eliminar el cliente
//         await prisma.clients.delete({
//             where: { client_id: clientId },
//         });

//         return NextResponse.json({ success: true, message: 'Cliente eliminado exitosamente.' }, { status: 200 });
//     } catch (error) {
//         console.error('Error al eliminar cliente:', error);
//         return NextResponse.json({ message: 'Error interno del servidor al eliminar cliente.' }, { status: 500 });
//     }
// }