// src/lib/ClientAPI.ts
import { Client, ClientFormData } from '@/types/clientTypes';

const API_ROUTE = '/api/clients'; // Ruta del Route Handler de Next.js

/**
 * Servicio de API para la gestión de clientes.
 * NOTA: Esta capa asume que el Route Handler (backend) maneja la autenticación y la company_id.
 */

// Función de utilidad para manejar la respuesta
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Error en la operación: ${response.statusText}`);
  }
  return response.json();
};

export const ClientAPI = {
  // OBTENER TODOS LOS CLIENTES
  getAll: async (): Promise<Client[]> => {
    const response = await fetch(API_ROUTE, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // cache: 'no-store' para evitar caché de datos dinámicos
      cache: 'no-store', 
    });
    return handleResponse(response);
  },

  // CREAR UN NUEVO CLIENTE
  create: async (data: ClientFormData): Promise<Client> => {
    const response = await fetch(API_ROUTE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // ACTUALIZAR UN CLIENTE EXISTENTE
  update: async (clientId: string, data: Partial<ClientFormData>): Promise<Client> => {
    const response = await fetch(`${API_ROUTE}/${clientId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // ELIMINAR UN CLIENTE
  remove: async (clientId: string): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_ROUTE}/${clientId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};