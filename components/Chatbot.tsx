"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, ChevronRight, Utensils, Info, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";

interface Message {
    id: string;
    text: string;
    sender: "bot" | "user";
    timestamp: Date;
    options?: string[];
}

const INITIAL_MESSAGE: Message = {
    id: "1",
    text: "Welcome to Butcher & Sauce. I am your Artisanal Assistant. How may I help you discover the perfect cut today?",
    sender: "bot",
    timestamp: new Date(),
    options: ["Recommend a Cut", "Sourcing & Aging", "Pairing Suggestions", "Care Instructions", "Message on WhatsApp"]
};

const KNOWLEDGE_BASE: Record<string, { response: string, options?: string[] }> = {
    "Recommend a Cut": {
        response: "To give you the best recommendation, what is the occasion? Are you looking for a slow-cook masterpiece, a quick premium sear, or something for a large gathering?",
        options: ["Quick Premium Sear", "Slow-Cook Masterpiece", "Large Gathering", "Back"]
    },
    "Quick Premium Sear": {
        response: "For a high-heat sear, I highly recommend our Wagyu Sirloin (Grade A5) or the Dry-Aged Ribeye. Would you like to see these selections?",
        options: ["Show Ribeye", "Show Wagyu", "Back"]
    },
    "Slow-Cook Masterpiece": {
        response: "For slow cooking, nothing beats our Short Ribs or the Brisket. They develop incredible depth when braised. Should I show you our signature Brisket?",
        options: ["Show Brisket", "Back"]
    },
    "Large Gathering": {
        response: "For crowds, a Whole Poussin or a large T-Bone works wonders. It makes for an impressive center-piece. Would you like to view our T-Bone collection?",
        options: ["Show T-Bone", "Back"]
    },
    "Sourcing & Aging": {
        response: "Our beef is exclusively sourced from the high plains of Laikipia and the Rift Valley. We dry-age our Signature Reserve for 30-45 days in custom salt-brick rooms to concentrate flavor and maximize tenderness.",
        options: ["Our Ranched Partners", "Aging Process Details", "Back"]
    },
    "Pairing Suggestions": {
        response: "A great cut deserves a great companion. Our Chimichurri Verde works beautifully with lean cuts like Sirloin, while our Signature Pepper Sauce is built for the rich marbling of a Ribeye.",
        options: ["Sauce Pairings", "Drink Pairings", "Back"]
    },
    "Care Instructions": {
        response: "Always temper your meat to room temperature before cooking. Post-cook rest is vital—rest your steak for at least 5-8 minutes to allow juices to redistribute. Never cut immediately!",
        options: ["Thawing Guide", "Resting Times", "Back"]
    },
    "Message on WhatsApp": {
        response: "Connecting you to our master butcher on WhatsApp for personalized service...",
        options: ["Back"]
    },
    "Back": {
        response: "How else can I assist you in your artisanal journey?",
        options: ["Recommend a Cut", "Sourcing & Aging", "Pairing Suggestions", "Care Instructions", "Message on WhatsApp"]
    }
};

export default function Chatbot() {
    const { isCartOpen } = useCart();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    // Close chatbot if cart opens
    useEffect(() => {
        if (isCartOpen) setIsOpen(false);
    }, [isCartOpen]);

    // Hide if in admin or cart open
    if (isCartOpen || pathname?.startsWith('/admin')) return null;

    const handleSend = (text: string) => {
        if (!text.trim()) return;

        if (text === "Message on WhatsApp") {
            window.open("https://wa.me/254795999555", "_blank");
        }

        const newUserMessage: Message = {
            id: Date.now().toString(),
            text,
            sender: "user",
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue("");

        // Simulate Bot thinking
        setTimeout(() => {
            const knowledge = KNOWLEDGE_BASE[text] || {
                response: "That's an excellent question. While I'm still learning the finer points of every cut, I'd recommend speaking with our head butcher directly, or I can help you with recommendations.",
                options: ["Recommend a Cut", "Back"]
            };

            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: knowledge.response,
                sender: "bot",
                timestamp: new Date(),
                options: knowledge.options
            };

            setMessages(prev => [...prev, botResponse]);
        }, 600);
    };

    return (
        <div className="fixed bottom-8 right-8 z-[300] flex flex-col items-end gap-4">
            {/* WhatsApp Float Button */}
            {!isOpen && (
                <motion.a
                    href="https://wa.me/254795999555"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-[#25D366] text-white rounded-full shadow-xl flex items-center justify-center border border-white/20 transition-transform"
                >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-white border-2 border-[#25D366] rounded-full animate-pulse" />
                </motion.a>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[550px] bg-white border border-black/5 rounded-sm shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-black p-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                                    <Bot className="text-gold" size={20} />
                                </div>
                                <div>
                                    <h3 className="text-white text-xs font-serif font-bold tracking-widest uppercase">Artisanal Assistant</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">In the Cellar</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-neutral-soft/30">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                    <div className={`max-w-[85%] p-4 rounded-sm text-sm leading-relaxed ${msg.sender === "user"
                                        ? "bg-black text-white"
                                        : "bg-white border border-black/5 text-zinc-700 shadow-sm font-light"
                                        }`}>
                                        {msg.text}
                                    </div>

                                    {msg.options && (
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {msg.options.map((opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => handleSend(opt)}
                                                    className="text-[9px] uppercase tracking-widest font-bold px-3 py-2 bg-white border border-black/10 text-zinc-500 hover:border-gold hover:text-gold transition-all rounded-sm flex items-center gap-2"
                                                >
                                                    {opt === "Message on WhatsApp" && <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />}
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-black/5 bg-white">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSend(inputValue);
                                }}
                                className="relative"
                            >
                                <input
                                    type="text"
                                    placeholder="Ask about our cuts, aging, or pairings..."
                                    className="w-full pl-4 pr-12 py-4 bg-neutral-soft/50 border border-transparent rounded-sm text-xs focus:outline-none focus:border-gold/30 transition-all font-light"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gold hover:text-black transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                            <p className="text-[8px] text-center text-zinc-400 mt-3 uppercase tracking-widest font-bold flex items-center justify-center gap-1.5">
                                <ShieldCheck size={10} className="text-gold" /> Secure & Hand-Forged Intelligence
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Float Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-black text-gold rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden group border border-white/10"
            >
                <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <div className="relative z-10">
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                className="group-hover:text-black transition-colors"
                            >
                                <X size={24} strokeWidth={1.5} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="msg"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                className="group-hover:text-black transition-colors"
                            >
                                <MessageSquare size={24} strokeWidth={1.5} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {!isOpen && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-gold border-2 border-black rounded-full"
                    />
                )}
            </motion.button>
        </div>
    );
}
