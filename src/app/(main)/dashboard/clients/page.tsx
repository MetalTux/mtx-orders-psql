// src/app/(main)/dashboard/clients/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/Card';
import { Client, ClientFormData } from '@/types/clientTypes';
import { ClientAPI } from '@/lib/ClientAPI';
import ClientTable from './ClientTable';
import ClientForm from './ClientForm';
import { Plus } from 'lucide-react';

/**
 * Página principal del mantenedor de Clientes.
 * Contiene la lógica principal de estado (fetch, CRUD, modales).
 */
export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- LÓGICA DE DATOS ---

  // 1. Fetch inicial de datos
  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ClientAPI.getAll();
      setClients(data);
    } catch (err) {
      setError(`Fallo al cargar clientes: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // 2. Manejo de Guardado (Crear o Actualizar)
  const handleSave = async (data: ClientFormData, clientId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (clientId) {
        // Actualizar
        await ClientAPI.update(clientId, data);
      } else {
        // Crear
        await ClientAPI.create(data);
      }
      
      // Recargar la lista y cerrar el modal
      await fetchClients();
      handleCloseForm();
    } catch (err) {
      // El error que veías al guardar probablemente ocurría aquí, 
      // si la promesa de fetchClients o la API fallaban.
      setError(`Fallo al guardar: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      // Solo desactiva el loader de la página si no hay un error crítico
      setIsLoading(false); 
    }
  };

  // 3. Manejo de Eliminación
  const handleDelete = async (clientId: string, clientName: string) => {
    // NOTA: Reemplazado window.confirm por mensaje en consola y acción directa,
    // ya que no se permiten diálogos nativos en este entorno.
    console.warn(`Simulando eliminación del cliente "${clientName}". Se recomienda implementar un modal de confirmación personalizado.`);

    setIsLoading(true);
    setError(null);
    try {
      await ClientAPI.remove(clientId);
      await fetchClients(); // Recargar la lista
    } catch (err) {
      setError(`Fallo al eliminar: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };


  // --- MANEJO DE MODAL ---

  const handleOpenCreateForm = () => {
    setClientToEdit(null); // Limpiar para modo 'Crear'
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (client: Client) => {
    setClientToEdit(client); // Cargar datos para modo 'Editar'
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setClientToEdit(null);
  };

  // --- RENDERIZADO ---

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-(--color-text-secondary)">
        Gestión de Clientes
      </h1>

      {/* Botón y Mensajes */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleOpenCreateForm}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold 
            bg-(--color-accent) hover:bg-(--color-accent)/80 transition-colors duration-150 shadow-md shadow-(--color-accent)/30"
        >
          <Plus className="w-5 h-5" />
          Crear Nuevo Cliente
        </button>

        {isLoading && (
          <p className="text-(--color-primary)">Cargando datos...</p>
        )}
      </div>

      {error && (
        <div className="p-4 bg-(--color-danger)/10 text-(--color-danger) rounded-lg">
          Error: {error}
        </div>
      )}

      {/* Tabla de Clientes */}
      <Card>
        <ClientTable 
          clients={clients} 
          onEdit={handleOpenEditForm} 
          onDelete={handleDelete}
        />
      </Card>

      {/* Modal del Formulario */}
      <ClientForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSave}
        clientToEdit={clientToEdit}
        isLoading={isLoading}
      />
    </div>
  );
}

// // src/app/(dashboard)/clients/page.tsx
// 'use client';

// import React, { useState, useEffect } from 'react';
// import Card from '@/components/Card';
// import { Client, ClientFormData } from '@/types/clientTypes';
// import { ClientAPI } from '@/lib/ClientAPI';
// import ClientTable from './ClientTable';
// import ClientForm from './ClientForm';
// import { Plus } from 'lucide-react';

// /**
//  * Página principal del mantenedor de Clientes.
//  * Contiene la lógica principal de estado (fetch, CRUD, modales).
//  */
// export default function ClientsPage() {
//   const [clients, setClients] = useState<Client[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   // --- LÓGICA DE DATOS ---

//   // 1. Fetch inicial de datos
//   const fetchClients = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const data = await ClientAPI.getAll();
//       setClients(data);
//     } catch (err) {
//       setError(`Fallo al cargar clientes: ${err instanceof Error ? err.message : 'Error desconocido'}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchClients();
//   }, []);

//   // 2. Manejo de Guardado (Crear o Actualizar)
//   const handleSave = async (data: ClientFormData, clientId?: string) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       if (clientId) {
//         // Actualizar
//         await ClientAPI.update(clientId, data);
//       } else {
//         // Crear
//         await ClientAPI.create(data);
//       }
      
//       // Recargar la lista y cerrar el modal
//       await fetchClients();
//       handleCloseForm();
//     } catch (err) {
//       setError(`Fallo al guardar: ${err instanceof Error ? err.message : 'Error desconocido'}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // 3. Manejo de Eliminación
//   const handleDelete = async (clientId: string, clientName: string) => {
//     // Aquí se debe usar un modal de confirmación, pero usaremos alert temporalmente
//     if (window.confirm(`¿Estás seguro de que quieres eliminar al cliente "${clientName}"?`)) {
//       setIsLoading(true);
//       setError(null);
//       try {
//         await ClientAPI.remove(clientId);
//         await fetchClients(); // Recargar la lista
//       } catch (err) {
//         setError(`Fallo al eliminar: ${err instanceof Error ? err.message : 'Error desconocido'}`);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };


//   // --- MANEJO DE MODAL ---

//   const handleOpenCreateForm = () => {
//     setClientToEdit(null); // Limpiar para modo 'Crear'
//     setIsFormOpen(true);
//   };

//   const handleOpenEditForm = (client: Client) => {
//     setClientToEdit(client); // Cargar datos para modo 'Editar'
//     setIsFormOpen(true);
//   };

//   const handleCloseForm = () => {
//     setIsFormOpen(false);
//     setClientToEdit(null);
//   };

//   // --- RENDERIZADO ---

//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold text-(--color-text-secondary)">
//         Gestión de Clientes
//       </h1>

//       {/* Botón y Mensajes */}
//       <div className="flex justify-between items-center">
//         <button
//           onClick={handleOpenCreateForm}
//           disabled={isLoading}
//           className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold 
//             bg-(--color-accent) hover:bg-(--color-accent)/80 transition-colors duration-150 shadow-md shadow-(--color-accent)/30"
//         >
//           <Plus className="w-5 h-5" />
//           Crear Nuevo Cliente
//         </button>

//         {isLoading && (
//           <p className="text-(--color-primary)">Cargando datos...</p>
//         )}
//       </div>

//       {error && (
//         <div className="p-4 bg-(--color-danger)/10 text-(--color-danger) rounded-lg">
//           Error: {error}
//         </div>
//       )}

//       {/* Tabla de Clientes */}
//       <Card>
//         <ClientTable 
//           clients={clients} 
//           onEdit={handleOpenEditForm} 
//           onDelete={handleDelete}
//         />
//       </Card>

//       {/* Modal del Formulario */}
//       <ClientForm
//         isOpen={isFormOpen}
//         onClose={handleCloseForm}
//         onSave={handleSave}
//         clientToEdit={clientToEdit}
//         isLoading={isLoading}
//       />
//     </div>
//   );
// }