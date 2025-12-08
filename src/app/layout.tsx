// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import AuthProvider from '@/components/auth/AuthProvider'; // Importamos el proveedor

const inter = Inter({ subsets: ['latin'] });

// Metadatos de la aplicación
export const metadata = {
  title: 'MTX Orders - Logistics',
  description: 'Sistema de gestión de órdenes para empresas de logística.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // La clase "dark" debe activarse y desactivarse con el toggle si implementas uno.
    // La dejamos fija por ahora para que el sistema use la preferencia del navegador.
    <html lang="es" className="dark"> 
      <head>
        {/* IMPORTANTE: El bloque <style> con variables CSS ha sido eliminado. 
            Las variables se definen en globals.css.
        */}
      </head>
      {/* CORRECCIÓN: Usando la sintaxis correcta bg-(--color-bg-main) y la variable correcta */}
      <body className={`${inter.className} antialiased text-(--color-text-main) bg-(--color-bg-main) transition-colors duration-200`}>
        {/* Envolvemos toda la aplicación en el AuthProvider */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}