import type { Metadata } from "next";
import "./globals.css";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import { Inter } from "next/font/google";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Butcher & Sauce | The Artisanal Standard",
  description: "Premium meat selections and handcrafted sauces, ethically sourced and masterfully aged in Nairobi, Kenya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-black antialiased selection:bg-ruby selection:text-black overflow-x-hidden`}>
        <CartProvider>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
