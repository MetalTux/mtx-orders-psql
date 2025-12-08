import { withAuth } from "next-auth/middleware";

// El middleware de NextAuth.js envuelve todas las rutas coincidentes en el config.matcher
export default withAuth({
  // En caso de que el usuario no esté autenticado, será redirigido a la página de inicio de sesión (/login)
  pages: {
    signIn: "/login",
  },
});

// Define qué rutas deben ser protegidas por este middleware
export const config = {
  // Protege todas las rutas que comiencen con /dashboard
  matcher: [
    "/dashboard/:path*", 
  ],
};