import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider"
import { CartProvider } from "@/contexts/CartContext"
import CartHydrator from "@/components/providers/CartHydrator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MiTienda — Apoya a los emprendedores de tu ciudad",
  description: "Descubre tiendas locales, productos únicos y emprendedores de tu ciudad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
          <SessionProvider><CartProvider><CartHydrator />{children}</CartProvider></SessionProvider>
        </body>
    </html>
  );
}
