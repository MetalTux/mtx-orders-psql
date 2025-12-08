// src/components/auth/AuthProvider.tsx
'use client';

import { SessionProvider } from 'next-auth/react';

/**
 * Componente Wrapper para proporcionar el contexto de sesión de NextAuth a toda la aplicación.
 * Es un componente de cliente que debe ser usado dentro del layout raíz.
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}