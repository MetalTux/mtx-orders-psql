// src/app/api/clients/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ClientFormData } from '@/types/clientTypes';

// Deshabilitar cache para asegurar datos actualizados
export const dynamic = 'force-dynamic';

/**
 * Función de utilidad para obtener la sesión y la companyId
 */
async function getAuthAndCompanyId() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.companyId) {
    return {
      errorResponse: NextResponse.json({ message: 'No autenticado o sin Company ID' }, { status: 401 }),
      companyId: null,
    };
  }

  return { errorResponse: null, companyId: session.user.companyId };
}

/**
 * Manejador GET: Lista todos los clientes de la compañía del usuario autenticado.
 * URL: /api/clients
 */
export async function GET() {
  const { errorResponse, companyId } = await getAuthAndCompanyId();
  if (errorResponse) return errorResponse;

  try {
    const clients = await prisma.clients.findMany({
      where: { company_id: companyId as string },
      orderBy: { client_name: 'asc' },
      // Select puede optimizarse para solo traer los campos necesarios para la tabla
      select: {
        client_id: true,
        company_id: true,
        client_name: true,
        client_rut: true,
        client_type: true,
        billing_email: true,
        is_active: true,
        created_at: true,
        commune_id: true,
        address_line1: true,
        address_line2: true,
        postal_code: true,
        billing_phone_number: true,
        notes: true,
      }
    });

    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return NextResponse.json({ message: 'Error interno del servidor al listar clientes.' }, { status: 500 });
  }
}

/**
 * Manejador POST: Crea un nuevo cliente para la compañía del usuario autenticado.
 * URL: /api/clients
 */
export async function POST(request: Request) {
  const { errorResponse, companyId } = await getAuthAndCompanyId();
  if (errorResponse) return errorResponse;

  try {
    const body: ClientFormData = await request.json();
    
    // Validaciones básicas (pueden ser más robustas)
    if (!body.client_name) {
      return NextResponse.json({ message: 'El nombre del cliente es obligatorio.' }, { status: 400 });
    }

    const newClient = await prisma.clients.create({
      data: {
        ...body,
        company_id: companyId as string, // Aseguramos que pertenece a la compañía
        // Los campos con valores nulos deben ser manejados por Prisma si son opcionales
        is_active: true, // Por defecto activo
      },
    });

    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    return NextResponse.json({ message: 'Error interno del servidor al crear cliente.' }, { status: 500 });
  }
}