// src/app/(main)/dashboard/clients/ClientTable.tsx
'use client';

import React from 'react';
import { Client } from '@/types/clientTypes';
import { Edit, Trash2, Building2 } from 'lucide-react';

interface ClientTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onBranches: (client: Client) => void;
  onDelete: (clientId: string, clientName: string) => void;
}

/**
 * Componente de presentación para la lista de clientes.
 * Muestra los datos principales y los botones de acción.
 */
export default function ClientTable({ clients, onEdit, onBranches, onDelete }: ClientTableProps) {
  if (clients.length === 0) {
    return (
      <div className="text-center p-10 text-(--color-text-secondary)">
        <p>Aún no hay clientes registrados para esta compañía.</p>
        <p>Usa el botón &quot;Crear Nuevo Cliente&quot; para comenzar.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-(--color-bg-secondary)">
          <tr className="text-(--color-text-secondary) text-sm uppercase tracking-wider">
            <th className="px-6 py-3 text-left font-bold">Nombre</th>
            <th className="px-6 py-3 text-left font-bold hidden sm:table-cell">RUT</th>
            <th className="px-6 py-3 text-left font-bold hidden lg:table-cell">Email Facturación</th>
            <th className="px-6 py-3 text-center font-bold">Activo</th>
            <th className="px-6 py-3 text-center font-bold">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-(--color-bg-secondary)">
          {clients.map((client) => (
            <tr 
              key={client.client_id} 
              className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-(--color-text-main)">
                {client.client_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-(--color-text-secondary) hidden sm:table-cell">
                {client.client_rut || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-(--color-text-secondary) hidden lg:table-cell">
                {client.billing_email || 'Sin Correo'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  client.is_active 
                    ? 'bg-(--color-accent)/20 text-(--color-accent)' 
                    : 'bg-(--color-danger)/20 text-(--color-danger)'
                }`}>
                  {client.is_active ? 'Sí' : 'No'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                <button
                  onClick={() => onEdit(client)}
                  title="Editar Cliente"
                  className="text-(--color-primary) hover:text-(--color-primary-light) p-1 rounded-full transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onEdit(client)}
                  title="Sucursales Cliente"
                  className="text-(--color-accent) hover:text-green-400 p-1 rounded-full transition-colors"
                >
                  <Building2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(client.client_id, client.client_name)}
                  title="Eliminar Cliente"
                  className="text-(--color-danger) hover:text-red-400 p-1 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}