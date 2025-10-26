import React from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';
// El componente Navbar debería ser 'use client' si necesitas interactividad,
// pero por ahora, lo mantendremos como Server Component, asumiendo que la lógica interactiva
// se manejará en otro componente o hook.

export default function Navbar() {
  return (
    // Usa las variables CSS para el fondo y el color de texto
    <header className="sticky top-0 z-10 p-4 bg-[--color-bg-secondary] shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex justify-between items-center max-w-full mx-auto">
        
        {/* Título de la Sección (Debe ser dinámico según la ruta, placeholder por ahora) */}
        <h2 className="text-xl font-semibold text-[--color-text-main]">
          Dashboard
        </h2>

        {/* Elementos de Interacción (Búsqueda, Notificaciones, Perfil) */}
        <div className="flex items-center space-x-4">
          
          {/* Barra de Búsqueda */}
          {/* Implementación sencilla y responsiva de la búsqueda */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 w-48 lg:w-64 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-[--color-primary] focus:border-[--color-primary] bg-[--color-bg-main] text-[--color-text-main] transition-colors duration-200 text-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[--color-text-secondary]" />
          </div>

          {/* Notificaciones */}
          <button 
            title="Notificaciones"
            className="p-2 rounded-full hover:bg-[--color-primary-light]/10 transition-colors duration-150 text-[--color-text-main] hover:text-[--color-primary]"
          >
            <Bell className="w-6 h-6" />
          </button>

          {/* Perfil de Usuario */}
          <div className="flex items-center space-x-2 cursor-pointer p-2 rounded-full hover:bg-[--color-primary-light]/10 transition-colors duration-150">
            {/* Avatar Placeholder */}
            <div className="bg-[--color-primary] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
              AD
            </div>
            
            <span className="hidden md:block font-medium text-[--color-text-main] text-sm">
              Administrador
            </span>
            
            <ChevronDown className="w-4 h-4 text-[--color-text-secondary] hidden md:block" />
          </div>

        </div>
      </div>
    </header>
  );
}


// // src/components/Navbar.tsx
// export default function Navbar() {
//   return (
//     <header className="bg-white dark:bg-secondary border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
//       <div className="text-lg font-semibold text-primary dark:text-accent">Dashboard</div>
//       <div className="flex items-center gap-4">
//         <span className="text-gray-500 dark:text-gray-300">Usuario</span>
//         /avatar.svg
//       </div>
//     </header>
//   );
// }