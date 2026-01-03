"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

type OrderStatus = "pending" | "processing" | "delivered" | "cancelled";

interface StatusSelectProps {
    orderId: string;
    initialStatus: OrderStatus;
}

const statusOptions: { value: OrderStatus; label: string; color: string }[] = [
    { value: "pending", label: "Pending", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
    { value: "processing", label: "Processing", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    { value: "delivered", label: "Delivered", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    { value: "cancelled", label: "Cancelled", color: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
];

export default function StatusSelect({ orderId, initialStatus }: StatusSelectProps) {
    const [status, setStatus] = useState<OrderStatus>(initialStatus);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleStatusChange = async (newStatus: OrderStatus) => {
        if (newStatus === status) return;

        setIsUpdating(true);
        setIsOpen(false);
        try {
            const response = await fetch("/api/admin/orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, status: newStatus }),
            });

            if (response.ok) {
                setStatus(newStatus);
            } else {
                console.error("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const currentOption = statusOptions.find((o) => o.value === status) || statusOptions[0];

    return (
        <div className="relative">
            <button
                disabled={isUpdating}
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold border transition-all ${currentOption.color
                    } ${isUpdating ? "opacity-50 cursor-not-allowed" : "hover:brightness-125"}`}
            >
                {status}
                <ChevronDown size={10} className={`${isOpen ? "rotate-180" : ""} transition-transform`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-32 bg-zinc-900 border border-zinc-800 rounded-sm shadow-2xl z-50 overflow-hidden backdrop-blur-md">
                    {statusOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleStatusChange(option.value)}
                            className={`w-full flex items-center justify-between px-4 py-3 text-[8px] uppercase tracking-widest font-bold transition-colors hover:bg-zinc-800 text-left ${status === option.value ? "text-ruby" : "text-zinc-500"
                                }`}
                        >
                            {option.label}
                            {status === option.value && <Check size={10} />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
