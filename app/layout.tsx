import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Chatbot from "@/components/Chatbot";
import { Inter } from "next/font/google";

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
          <Header />
          <CartDrawer />
          <main>{children}</main>
          <Chatbot />
        </CartProvider>
      </body>
    </html>
  );
}
