"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import Chatbot from "@/components/Chatbot";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const isAdmin = pathname?.startsWith("/admin");

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            {isMounted && (
                <>
                    <Header />
                    <CartDrawer />
                    <Chatbot />
                </>
            )}
            <main>{children}</main>
        </>
    );
}
