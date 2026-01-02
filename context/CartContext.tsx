"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    slug: string;
    name: string;
    price: string;
    numericPrice: number;
    category: string;
    image: string;
    quantity: number;
    preparation?: string;
    doneness?: string;
}

interface CartContextType {
    cart: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (slug: string, preparation?: string, doneness?: string) => void;
    updateQuantity: (slug: string, quantity: number, preparation?: string, doneness?: string) => void;
    clearCart: () => void;
    totalItems: number;
    subtotal: number;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('butcher_bag');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart storage", e);
            }
        }
    }, []);

    // Save cart to localStorage on change
    useEffect(() => {
        localStorage.setItem('butcher_bag', JSON.stringify(cart));
    }, [cart]);

    const addItem = (newItem: CartItem) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(item =>
                item.slug === newItem.slug &&
                item.preparation === newItem.preparation &&
                item.doneness === newItem.doneness
            );

            if (existingItemIndex > -1) {
                const updatedCart = [...prevCart];
                const existingItem = updatedCart[existingItemIndex];
                // Update quantity AND refresh other details (like latest price)
                updatedCart[existingItemIndex] = {
                    ...newItem,
                    quantity: existingItem.quantity + newItem.quantity
                };
                return updatedCart;
            }
            return [...prevCart, newItem];
        });
        setIsCartOpen(true); // Open cart automatically when item added
    };

    const removeItem = (slug: string, preparation?: string, doneness?: string) => {
        setCart(prevCart => prevCart.filter(item =>
            !(item.slug === slug && item.preparation === preparation && item.doneness === doneness)
        ));
    };

    const updateQuantity = (slug: string, quantity: number, preparation?: string, doneness?: string) => {
        if (quantity < 1) return;
        setCart(prevCart => prevCart.map(item =>
            (item.slug === slug && item.preparation === preparation && item.doneness === doneness)
                ? { ...item, quantity }
                : item
        ));
    };

    const clearCart = () => setCart([]);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.numericPrice * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cart, addItem, removeItem, updateQuantity, clearCart,
            totalItems, subtotal, isCartOpen, setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
