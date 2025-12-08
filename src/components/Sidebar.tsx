import Link from 'next/link';
import { Home, ClipboardList, Users, DollarSign, Settings, Warehouse } from 'lucide-react';
//import { usePathname } from 'next/navigation';

// Estructura de navegación alineada con tu esquema de Prisma
const menuItems = [
  { name: 'Inicio', href: '/dashboard', icon: Home },
  { name: 'Órdenes de Trabajo', href: '/dashboard/work-orders', icon: ClipboardList },
  { name: 'Cotizaciones', href: '/dashboard/quotes', icon: DollarSign },
  { name: 'Clientes', href: '/dashboard/clients', icon: Users },
  { name: 'Productos y Servicios', href: '/dashboard/products', icon: Warehouse },
];

export default function Sidebar() {
  // Nota: Si usas 'use client' en este archivo (para usePathname), debes especificarlo.
  // Por ahora, asumiré que usePathname se maneja en un componente superior o que harás este componente 'use client'.
  const pathname = ''; // usePathname() // Descomentar si usas 'use client'

  return (
    // Usa las variables CSS para el fondo y la transición de color
    <aside className="w-64 min-h-screen p-4 flex flex-col shadow-2xl z-20 transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700
      bg-(--color-bg-secondary) text-(--color-text-main)">
      
      {/* Título de la Aplicación */}
      <div className="text-2xl font-bold mb-8 p-2 border-b border-gray-200 dark:border-gray-700 text-(--color-primary)">
        MTX Orders
      </div>

      {/* Navegación Principal */}
      <nav className="flex-1">
        <ul>
          {menuItems.map(item => {
            const isActive = pathname === item.href;
            const Icon = item.icon; // El componente de Lucide

            return (
              <li key={item.name} className="mb-2">
                <Link 
                  href={item.href} 
                  className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-all duration-150 group 
                    ${isActive 
                      ? 'bg-(--color-primary) text-white shadow-lg shadow-(--color-primary)/30' 
                      : 'hover:bg-(--color-primary-light)/10 hover:text-(--color-primary) text-(--color-text-main)'
                    }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-(--color-primary)'}`} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Pie de Página */}
      <div className="mt-auto p-2 text-xs text-(--color-text-secondary)">
        <p>© {new Date().getFullYear()} MTX. Derechos reservados.</p>
      </div>
    </aside>
  );
}
