import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Componente contenedor de tarjeta reutilizable para el Dashboard.
 * Aplica estilos base de fondo, borde y sombra, y respeta el modo oscuro
 * utilizando las variables CSS definidas en globals.css.
 */
export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`p-6 rounded-xl shadow-lg transition-colors duration-200 
        bg-[--color-bg-secondary] text-[--color-text-main] 
        border border-gray-100 dark:border-gray-800 ${className}`}
    >
      {children}
    </div>
  );
}
