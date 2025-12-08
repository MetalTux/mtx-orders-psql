import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Importamos la configuración centralizada

// Se exportan los handlers GET y POST con las opciones de configuración
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };