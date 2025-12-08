import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extendemos la interfaz 'Session' para incluir nuestros campos personalizados
   * en session.user.
   */
  interface Session {
    user: {
      id: string;
      companyId: string;
      companyName?: string;
      role?: string;
      isAdmin?: boolean;
    } & DefaultSession["user"];
  }

  /**
   * Extendemos la interfaz 'User'. Este es el tipo del objeto que retornas
   * en la función 'authorize' dentro de src/lib/auth.ts.
   */
  interface User extends DefaultUser {
    companyId: string;
    companyName?: string;
    role?: string;
    isAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extendemos el token JWT para guardar nuestros campos personalizados
   * cuando se usan estrategias de sesión JWT.
   */
  interface JWT extends DefaultJWT {
    id: string;
    companyId: string;
    companyName?: string;
    role?: string;
    isAdmin?: boolean;
  }
}