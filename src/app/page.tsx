// src/app/page.tsx
import Link from 'next/link';
import { Truck, LockOpen, ArrowRight } from 'lucide-react';

/**
 * Componente de la Landing Page (Página de Inicio)
 * Esta es la página raíz que no requiere autenticación.
 */
export default function LandingPage() {
  return (
    // Aseguramos que la página ocupe toda la altura visible
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      
      <div className="text-center max-w-2xl space-y-8 p-8 md:p-12 rounded-2xl bg-(--color-bg-secondary) shadow-2xl border border-gray-100 dark:border-gray-800 transition-colors duration-300">
        
        {/* Icono Principal */}
        <Truck className="w-16 h-16 mx-auto text-(--color-primary) animate-pulse" />

        {/* Título Principal */}
        <h1 className="text-5xl font-extrabold tracking-tight text-(--color-text-main)">
          MTX Orders
        </h1>

        {/* Subtítulo y Descripción */}
        <p className="text-xl text-(--color-text-secondary) leading-relaxed">
          La solución definitiva para la gestión de Órdenes de Trabajo y logística de tu empresa.
          Optimiza la planificación, ejecución y seguimiento de cada servicio.
        </p>

        {/* Botón de Acción (Iniciar Sesión) */}
        <Link 
          href="/login" 
          className="inline-flex items-center justify-center gap-3 px-8 py-3 rounded-full text-lg font-semibold 
            bg-(--color-primary) text-white transition-all duration-300 transform 
            hover:scale-[1.02] shadow-lg shadow-(--color-primary)/50 
            focus:ring-4 focus:ring-(--color-primary-light) focus:outline-none"
        >
          <LockOpen className="w-5 h-5" />
          Iniciar Sesión
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Pie de página simple */}
      <footer className="mt-8 text-sm text-(--color-text-secondary)">
        &copy; {new Date().getFullYear()} MTX Orders.
      </footer>
    </div>
  );
}