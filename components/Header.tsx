"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import SearchModal from "./SearchModal";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { setIsCartOpen, totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Prime Cuts", href: "/prime-cuts" },
    { name: "Artisanal Sauces", href: "/artisanal-sauces" },
    { name: "Drinks", href: "/drinks" },
    { name: "The Butchery", href: "/the-butchery" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 px-6 md:px-12 py-6 ${scrolled ? "bg-white/80 backdrop-blur-md border-b border-black/5 py-4" : "bg-transparent"
      }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-12">
          {navLinks.slice(0, 2).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-600 hover:text-gold transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Brand Logo */}
        <Link href="/" className="text-2xl md:text-3xl font-serif font-bold tracking-[0.2em] uppercase text-black flex items-center">
          Butcher <span className="text-gold mx-1">&</span> Sauce
        </Link>

        {/* Icons & Actions */}
        <div className="flex items-center gap-6 md:gap-8">
          <div className="hidden lg:flex items-center gap-12 mr-8">
            {navLinks.slice(2).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-600 hover:text-gold transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-zinc-600 hover:text-gold transition-colors"
          >
            <Search size={20} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-zinc-600 hover:text-gold transition-colors relative group"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-colors">
                {totalItems}
              </span>
            )}
          </button>
          <button
            className="lg:hidden text-black"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-b border-black/5 p-8 lg:hidden flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-600"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
}
