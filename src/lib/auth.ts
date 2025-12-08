import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcryptjs';

// Inicializamos Prisma
const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  // Estrategia de sesión basada en JWT
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      // Lógica de validación contra tu BD
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 1. Buscar usuario en la tabla 'users' usando 'user_email'
        const user = await prisma.users.findFirst({
          where: { user_email: credentials.email },
          include: {
            companies: { // Relación definida en tu schema
              select: {
                company_id: true,
                company_name: true
              }
            }
          }
        });

        // Validar si existe, si está activo Y si tiene company_id (requerido por User type)
        if (!user || !user.is_active || !user.company_id) {
          return null;
        }

        // 2. Verificar contraseña con bcrypt contra 'user_password'
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.user_password
        );

        // --- Bloque para compatibilidad con el Seed de Prueba (borrar en prod) ---
        if (user.user_password.startsWith('hashed_pw_for_')) {
             const expectedHash = `hashed_pw_for_${credentials.password}`;
             if (user.user_password !== expectedHash) return null;
        } else if (!isPasswordValid) {
             return null;
        }
        // ------------------------------------------------------------------------

        // 3. Retornar objeto de usuario normalizado para NextAuth
        // Usamos el 'user.company_id' que ya validamos que no es null.
        return {
          id: user.user_id,
          email: user.user_email,
          name: user.user_name,
          companyId: user.company_id, // <-- Aquí ya es seguro que es string
          companyName: user.companies?.company_name, 
          role: user.role,
          isAdmin: user.role === 'ADMIN',
        };
      },
    }),
  ],
  
  // Callbacks para persistir los datos personalizados en la sesión
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        // Estos campos ya son de tipo string (no null) gracias a la validación en authorize
        token.companyId = user.companyId; 
        token.companyName = user.companyName;
        token.role = user.role;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.companyId = token.companyId;
        session.user.companyName = token.companyName;
        session.user.role = token.role;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // Ruta personalizada de login
  },
  secret: process.env.NEXTAUTH_SECRET, // Asegúrate de tener esto en tu .env
};