import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['200', '400', '500', '700', '900'], // Puedes agregar los pesos que necesites
  variable: '--font-roboto',     // Opcional: para usar como variable CSS
});

export const metadata: Metadata = {
  title: "Ordenes de Trabajo",
  description: "Aplicación para mantener un orden de los Flujos de Trabajo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
