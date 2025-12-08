'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn } from 'lucide-react';

// Importamos el Card para mantener la consistencia del diseño
import Card from '@/components/Card'; 

// Componente de la Página de Inicio de Sesión
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  /**
   * Maneja el envío del formulario de inicio de sesión.
   * Utiliza signIn() de next-auth para autenticar contra el Route Handler.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Llamada a la API de NextAuth para iniciar sesión
      const result = await signIn('credentials', {
        redirect: false, // Evita la redirección automática
        email,
        password,
      });

      if (result?.error) {
        // La autenticación falló (ej. credenciales inválidas)
        setError('Credenciales inválidas. Por favor, verifica tu email y contraseña.');
      } else if (result?.ok) {
        // La autenticación fue exitosa
        router.push('/dashboard'); // Redirige al dashboard
      }
    } catch (err) {
      console.error('Error durante el proceso de inicio de sesión:', err);
      setError('Ocurrió un error inesperado al intentar iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Contenedor que centra el formulario vertical y horizontalmente
    <div className="min-h-screen flex items-center justify-center p-4 bg-(--color-bg-main) transition-colors duration-200">
      
      {/* Tarjeta de Inicio de Sesión */}
      <Card className="w-full max-w-md p-8 sm:p-10 shadow-2xl space-y-6">
        
        {/* Encabezado */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-(--color-primary)">
            MTX Orders
          </h1>
          <p className="mt-2 text-(--color-text-secondary)">
            Inicia sesión para acceder a tu panel de control
          </p>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 rounded-lg text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Campo Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium block text-(--color-text-main)">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-(--color-text-secondary)" />
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@empresa.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-(--color-primary) bg-(--color-bg-main) text-(--color-text-main) transition-colors duration-200"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div className="space-y-1">
            <label className="text-sm font-medium block text-(--color-text-main)">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-(--color-text-secondary)" />
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-(--color-primary) bg-(--color-bg-main) text-(--color-text-main) transition-colors duration-200"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Botón de Inicio de Sesión */}
          <button
            type="submit"
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white font-semibold transition-all duration-300 shadow-lg 
              ${isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-(--color-primary) hover:bg-(--color-primary-dark) shadow-(--color-primary)/40 hover:shadow-(--color-primary)/60'
              }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                {/* Spinner de carga SVG */}
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Iniciar Sesión
              </>
            )}
          </button>
        </form>

        {/* Enlace de recuperación (Placeholder) */}
        <div className="text-center text-sm">
          <a href="#" className="text-(--color-primary) hover:underline transition-colors duration-150">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </Card>
    </div>
  );
}