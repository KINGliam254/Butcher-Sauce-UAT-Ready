"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { ChevronRight, MapPin, CreditCard, ChevronLeft, ShieldCheck, ShoppingBag, Smartphone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatCurrency } from "@/utils/format";

type Step = "delivery" | "payment" | "review";

export default function CheckoutPage() {
    const { cart, subtotal, clearCart, totalItems } = useCart();
    const [step, setStep] = useState<Step>("delivery");
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);
    const router = useRouter();

    // Form States
    const [deliveryInfo, setDeliveryInfo] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        instructions: ""
    });

    const [fulfillmentMethod, setFulfillmentMethod] = useState<"delivery" | "pickup">("delivery");
    const [pickupLocation, setPickupLocation] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "card" | "cash">("mpesa");
    const [paymentDetails, setPaymentDetails] = useState({
        mpesaNumber: "",
        mpesaTransactionId: "",
        cardNumber: "",
        cardType: "unknown" as "visa" | "mastercard" | "unknown",
        expiry: "",
        cvv: ""
    });

    const deliveryFee = fulfillmentMethod === "delivery" ? 350 : 0;
    const total = subtotal + deliveryFee;

    const pickupLocations = [
        "OiLibya South B (Partner)",
        "OiLibya Westlands (Partner)",
        "OiLibya Ngong Road (Partner)",
        "Butcher & Sauce Flagship (Evergreen Square)"
    ];

    const validateDelivery = () => {
        const { name, email, phone, address } = deliveryInfo;
        if (!name || !email || !phone) {
            alert("Please fill in your contact details.");
            return false;
        }
        if (fulfillmentMethod === "delivery" && !address) {
            alert("Please provide a delivery address.");
            return false;
        }
        if (fulfillmentMethod === "pickup" && !pickupLocation) {
            alert("Please select a pickup point.");
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (step === "delivery" && validateDelivery()) setStep("payment");
        else if (step === "payment") setStep("review");
    };

    const handleBack = () => {
        if (step === "payment") setStep("delivery");
        else if (step === "review") setStep("payment");
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        setOrderError(null);
        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customer: {
                        ...deliveryInfo,
                        fulfillment: fulfillmentMethod,
                        pickup_location: pickupLocation
                    },
                    items: cart,
                    payment: {
                        method: paymentMethod,
                        details: {
                            ...paymentDetails,
                            transactionId: paymentMethod === 'mpesa'
                                ? paymentDetails.mpesaTransactionId
                                : `BS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
                        }
                    },
                    total: total
                }),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || "Submission failed");
            }

            // If M-Pesa, start polling
            if (paymentMethod === 'mpesa') {
                const orderId = result.orderId;
                let attempts = 0;
                const maxAttempts = 20; // 1 minute of polling (3s intervals)

                const pollStatus = setInterval(async () => {
                    attempts++;
                    try {
                        const statusRes = await fetch(`/api/orders/${orderId}/status`);
                        const statusData = await statusRes.json();

                        if (statusData.isPaid) {
                            clearInterval(pollStatus);
                            clearCart();
                            router.push(`/checkout/success?id=${orderId}`);
                        } else if (attempts >= maxAttempts) {
                            clearInterval(pollStatus);
                            setIsProcessing(false);
                            setOrderError("Payment timeout. Please check your phone or try again.");
                        }
                    } catch (e) {
                        console.error("Polling error:", e);
                    }
                }, 3000);
            } else {
                // Non M-Pesa flow (Cash/Card)
                clearCart();
                router.push(`/checkout/success?id=${result.orderId}`);
            }

        } catch (error: any) {
            console.error("Checkout error:", error);
            setOrderError(error.message);
            setIsProcessing(false);
        }
    };

    if (cart.length === 0 && !isProcessing) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-white">
                <ShoppingBag size={48} className="text-zinc-200 mb-6" />
                <h2 className="text-2xl font-serif font-bold text-black mb-2">Your Bag is Empty</h2>
                <p className="text-zinc-500 mb-8 max-w-xs">You need to add some artisanal cuts before checking out.</p>
                <Link href="/prime-cuts" className="px-8 py-4 bg-black text-white text-[10px] uppercase tracking-widest font-bold rounded-sm">
                    Return to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pt-56 pb-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

                    {/* Main Checkout Flow */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Stepper Header */}
                        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400">
                            <span className={step === "delivery" ? "text-black" : ""}>Delivery</span>
                            <ChevronRight size={12} />
                            <span className={step === "payment" ? "text-black" : ""}>Payment</span>
                            <ChevronRight size={12} />
                            <span className={step === "review" ? "text-black" : ""}>Review</span>
                        </div>

                        <AnimatePresence mode="wait">
                            {step === "delivery" && (
                                <motion.div
                                    key="delivery"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-10"
                                >
                                    <div className="space-y-4">
                                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-black leading-tight">Order <span className="italic font-light text-zinc-400">Fulfillment.</span></h1>
                                        <p className="text-zinc-500 font-light">Tell us how you'd like to receive your master-cut selection.</p>
                                    </div>

                                    {/* Fulfillment Toggle */}
                                    <div className="flex p-1 bg-neutral-soft rounded-sm w-full md:w-[400px]">
                                        <button
                                            onClick={() => setFulfillmentMethod("delivery")}
                                            className={`flex-1 py-3 text-[10px] uppercase tracking-widest font-bold rounded-sm transition-all ${fulfillmentMethod === "delivery" ? "bg-black text-white shadow-lg" : "text-zinc-400 hover:text-black"}`}
                                        >
                                            Doorstep Delivery
                                        </button>
                                        <button
                                            onClick={() => setFulfillmentMethod("pickup")}
                                            className={`flex-1 py-3 text-[10px] uppercase tracking-widest font-bold rounded-sm transition-all ${fulfillmentMethod === "pickup" ? "bg-black text-white shadow-lg" : "text-zinc-400 hover:text-black"}`}
                                        >
                                            Click & Collect
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Full Name</label>
                                            <input
                                                type="text"
                                                className="w-full bg-neutral-soft border border-black/5 px-4 py-4 rounded-sm focus:bg-white focus:outline-none focus:border-ruby transition-all font-serif"
                                                placeholder="Adrian Saitoti"
                                                value={deliveryInfo.name}
                                                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Email Address</label>
                                            <input
                                                type="email"
                                                className="w-full bg-neutral-soft border border-black/5 px-4 py-4 rounded-sm focus:bg-white focus:outline-none focus:border-ruby transition-all font-serif"
                                                placeholder="adrian@example.com"
                                                value={deliveryInfo.email}
                                                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Phone Number</label>
                                            <input
                                                type="tel"
                                                className="w-full bg-neutral-soft border border-black/5 px-4 py-4 rounded-sm focus:bg-white focus:outline-none focus:border-ruby transition-all font-serif"
                                                placeholder="+254 700 000 000"
                                                value={deliveryInfo.phone}
                                                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            {fulfillmentMethod === "delivery" ? (
                                                <>
                                                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Delivery Address</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-neutral-soft border border-black/5 px-4 py-4 rounded-sm focus:bg-white focus:outline-none focus:border-ruby transition-all font-serif"
                                                        placeholder="Street Name, Apartment, House No."
                                                        value={deliveryInfo.address}
                                                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Pick-up Location</label>
                                                    <select
                                                        className="w-full bg-neutral-soft border border-black/5 px-4 py-4 rounded-sm focus:bg-white focus:outline-none focus:border-ruby transition-all font-serif appearance-none cursor-pointer"
                                                        value={pickupLocation}
                                                        onChange={(e) => setPickupLocation(e.target.value)}
                                                    >
                                                        <option value="">Select a pickup point...</option>
                                                        {pickupLocations.map(loc => (
                                                            <option key={loc} value={loc}>{loc}</option>
                                                        ))}
                                                    </select>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleNext}
                                        className="w-full md:w-auto px-12 py-5 bg-black text-white text-[10px] uppercase tracking-widest font-bold hover:bg-ruby hover:text-black transition-all duration-500 rounded-sm shadow-xl"
                                    >
                                        Proceed to Payment
                                    </button>
                                </motion.div>
                            )}

                            {step === "payment" && (
                                <motion.div
                                    key="payment"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-10"
                                >
                                    <div className="space-y-4">
                                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-black leading-tight">Secure <span className="italic font-light text-zinc-400">Payment.</span></h1>
                                        <p className="text-zinc-500 font-light">Select your preferred method of settlement.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { id: "mpesa", name: "M-Pesa", icon: Smartphone },
                                            { id: "card", name: "Credit Card", icon: CreditCard },
                                            { id: "cash", name: "On Delivery", icon: MapPin }
                                        ].map((method) => (
                                            <div
                                                key={method.id}
                                                onClick={() => setPaymentMethod(method.id as any)}
                                                className={`p-8 border rounded-sm cursor-pointer transition-all duration-500 flex flex-col items-center gap-4 text-center ${paymentMethod === method.id
                                                    ? "bg-black text-white border-black shadow-xl"
                                                    : "bg-neutral-soft border-black/5 text-zinc-400 hover:border-black/20"
                                                    }`}
                                            >
                                                <method.icon size={24} />
                                                <span className="text-[10px] uppercase tracking-widest font-bold">{method.name}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Conditional Payment Fields */}
                                    <AnimatePresence mode="wait">
                                        {paymentMethod === "mpesa" && (
                                            <motion.div
                                                key="mpesa-fields"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="space-y-6"
                                            >
                                                <div className="p-8 bg-black text-white rounded-sm space-y-4">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-8 h-8 bg-ruby rounded-full flex items-center justify-center text-black font-black text-xs">1</div>
                                                        <p className="text-[10px] uppercase tracking-widest font-bold">Payment Instructions</p>
                                                    </div>
                                                    <p className="text-sm font-serif italic text-zinc-400">
                                                        Go to M-Pesa &gt; Lipa na M-Pesa &gt; <span className="text-ruby font-bold">Buy Goods & Services</span>
                                                    </p>
                                                    <div className="flex justify-between items-center py-4 border-y border-white/10">
                                                        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Till Number</span>
                                                        <span className="text-2xl font-serif font-bold text-ruby">594 2201</span>
                                                    </div>
                                                    <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold text-center">Amount: {formatCurrency(total)}</p>
                                                </div>

                                                <div className="p-8 bg-neutral-soft rounded-sm space-y-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-black text-xs">2</div>
                                                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Verification</p>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">M-Pesa Number</p>
                                                            <input
                                                                type="tel"
                                                                className="w-full bg-white border border-black/5 px-4 py-4 rounded-sm focus:outline-none focus:border-ruby transition-all font-serif"
                                                                placeholder="07XX XXX XXX"
                                                                value={paymentDetails.mpesaNumber}
                                                                onChange={(e) => setPaymentDetails({ ...paymentDetails, mpesaNumber: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Transaction ID</p>
                                                            <input
                                                                type="text"
                                                                className="w-full bg-white border border-black/5 px-4 py-4 rounded-sm focus:outline-none focus:border-ruby transition-all font-serif uppercase"
                                                                placeholder="SKX8..."
                                                                value={paymentDetails.mpesaTransactionId}
                                                                onChange={(e) => setPaymentDetails({ ...paymentDetails, mpesaTransactionId: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <p className="text-[9px] text-zinc-400 italic">Enter the transaction code from your M-Pesa message for instant verification.</p>
                                                </div>
                                            </motion.div>
                                        )}

                                        {paymentMethod === "card" && (
                                            <motion.div
                                                key="card-fields"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="p-8 bg-neutral-soft rounded-sm space-y-6"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Card Details</p>
                                                    <div className="flex gap-2">
                                                        <div className={`px-2 py-1 rounded-xs border text-[8px] font-bold tracking-tighter transition-all ${paymentDetails.cardType === 'visa' ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-110' : 'bg-white border-zinc-200 text-zinc-300'}`}>VISA</div>
                                                        <div className={`px-2 py-1 rounded-xs border text-[8px] font-bold tracking-tighter transition-all ${paymentDetails.cardType === 'mastercard' ? 'bg-orange-600 border-orange-600 text-white shadow-lg scale-110' : 'bg-white border-zinc-200 text-zinc-300'}`}>MASTERCARD</div>
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        className="w-full bg-white border border-black/5 px-4 py-4 rounded-sm focus:outline-none focus:border-ruby transition-all font-serif tracking-widest"
                                                        placeholder="XXXX XXXX XXXX XXXX"
                                                        value={paymentDetails.cardNumber}
                                                        onChange={(e) => {
                                                            const val = e.target.value.replace(/\D/g, '').substring(0, 16);
                                                            const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
                                                            let type: "visa" | "mastercard" | "unknown" = "unknown";
                                                            if (val.startsWith('4')) type = 'visa';
                                                            else if (val.startsWith('5')) type = 'mastercard';

                                                            setPaymentDetails({ ...paymentDetails, cardNumber: formatted, cardType: type });
                                                        }}
                                                    />
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                        {paymentDetails.cardType === 'visa' && <span className="text-blue-600 font-bold italic text-xs">VISA</span>}
                                                        {paymentDetails.cardType === 'mastercard' && <span className="text-orange-600 font-bold italic text-xs">M/C</span>}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Expiry</label>
                                                        <input
                                                            type="text"
                                                            className="w-full bg-white border border-black/5 px-4 py-4 rounded-sm focus:outline-none focus:border-ruby transition-all font-serif"
                                                            placeholder="MM/YY"
                                                            value={paymentDetails.expiry}
                                                            onChange={(e) => {
                                                                let val = e.target.value.replace(/\D/g, '').substring(0, 4);
                                                                if (val.length >= 3) {
                                                                    val = val.substring(0, 2) + '/' + val.substring(2);
                                                                }
                                                                setPaymentDetails({ ...paymentDetails, expiry: val });
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">CVV</label>
                                                        <input
                                                            type="password"
                                                            maxLength={3}
                                                            className="w-full bg-white border border-black/5 px-4 py-4 rounded-sm focus:outline-none focus:border-ruby transition-all font-serif"
                                                            placeholder="***"
                                                            value={paymentDetails.cvv}
                                                            onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value.replace(/\D/g, '') })}
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {paymentMethod === "cash" && (
                                            <motion.div
                                                key="cash-fields"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="p-8 bg-neutral-soft rounded-sm border border-ruby/10"
                                            >
                                                <p className="text-black font-serif italic text-lg">Cash on Delivery selected.</p>
                                                <p className="text-zinc-500 text-sm mt-2 font-light">Please ensure someone is available at the delivery address to make the payment upon arrival of your artisanal selection.</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="flex flex-col md:flex-row gap-4">
                                        <button
                                            onClick={handleBack}
                                            className="px-12 py-5 bg-neutral-soft text-black text-[10px] uppercase tracking-widest font-bold hover:bg-zinc-200 transition-all rounded-sm flex items-center justify-center gap-2"
                                        >
                                            <ChevronLeft size={14} /> Back
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            className="flex-1 px-12 py-5 bg-black text-white text-[10px] uppercase tracking-widest font-bold hover:bg-ruby hover:text-black transition-all duration-500 rounded-sm shadow-xl"
                                        >
                                            Review My Order
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === "review" && (
                                <motion.div
                                    key="review"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-10"
                                >
                                    <div className="space-y-4">
                                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-black leading-tight">Order <span className="italic font-light text-zinc-400">Review.</span></h1>
                                        <p className="text-zinc-500 font-light">Final check before we prepare your selection.</p>
                                    </div>

                                    <div className="bg-neutral-soft p-10 rounded-sm space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div className="space-y-4">
                                                <p className="text-[10px] uppercase tracking-widest text-ruby font-bold">{fulfillmentMethod === "delivery" ? "Delivery To" : "Pickup From"}</p>
                                                <div>
                                                    <p className="text-black font-serif italic text-lg">{deliveryInfo.name}</p>
                                                    <p className="text-zinc-500 text-sm font-light mt-1">
                                                        {fulfillmentMethod === "delivery" ? deliveryInfo.address : pickupLocation}
                                                    </p>
                                                    <p className="text-zinc-500 text-sm font-light">{deliveryInfo.phone}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <CreditCard size={18} className="text-black" />
                                                <p className="text-black font-serif italic text-lg capitalize">
                                                    {paymentMethod === 'card'
                                                        ? (paymentDetails.cardType === 'unknown' ? 'Credit Card' : paymentDetails.cardType)
                                                        : paymentMethod}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {isProcessing && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="fixed inset-0 z-[500] bg-white/90 backdrop-blur-sm flex items-center justify-center p-6 text-center"
                                        >
                                            <div className="space-y-8 max-w-sm">
                                                <div className="w-20 h-20 bg-black rounded-full mx-auto flex items-center justify-center relative">
                                                    <motion.div
                                                        animate={{ scale: [1, 1.2, 1] }}
                                                        transition={{ repeat: Infinity, duration: 2 }}
                                                        className="absolute inset-0 border-2 border-ruby rounded-full"
                                                    />
                                                    <ShieldCheck className="text-ruby" size={32} />
                                                </div>
                                                <div className="space-y-3">
                                                    <h3 className="text-2xl font-serif font-bold">
                                                        {orderError ? "Payment Issue" : "Processing Order..."}
                                                    </h3>
                                                    <p className={`text-sm leading-relaxed ${orderError ? "text-rose-500 font-bold" : "text-zinc-500"}`}>
                                                        {orderError || (paymentMethod === 'mpesa'
                                                            ? "Please check your phone for the M-Pesa STK push to authorize payment."
                                                            : "Verifying your secure payment details with our bank partners.")
                                                        }
                                                    </p>
                                                    {orderError && (
                                                        <button
                                                            onClick={() => {
                                                                setIsProcessing(false);
                                                                setOrderError(null);
                                                            }}
                                                            className="mt-6 px-8 py-3 bg-black text-white text-[10px] uppercase tracking-widest font-bold rounded-sm border border-white/10 hover:bg-zinc-900 transition-all"
                                                        >
                                                            Try Again
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    <div className="flex flex-col md:flex-row gap-4">
                                        <button
                                            onClick={handleBack}
                                            disabled={isProcessing}
                                            className="px-12 py-5 bg-neutral-soft text-black text-[10px] uppercase tracking-widest font-bold hover:bg-zinc-200 transition-all rounded-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <ChevronLeft size={14} /> Back
                                        </button>
                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={isProcessing}
                                            className="flex-1 px-12 py-5 bg-black text-white text-[10px] uppercase tracking-widest font-bold hover:bg-ruby hover:text-black transition-all duration-500 rounded-sm shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {isProcessing ? "Processing..." : (
                                                <>
                                                    <ShieldCheck size={16} /> Place Final Order
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-neutral-soft p-10 rounded-sm space-y-10 sticky top-32">
                            <h2 className="text-2xl font-serif font-bold text-black">Summary <span className="text-zinc-400 italic">({totalItems})</span></h2>

                            <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item, idx) => (
                                    <div key={`${item.slug}-${idx}`} className="flex gap-4">
                                        <div className="relative w-16 aspect-[4/5] bg-white rounded-sm overflow-hidden shrink-0">
                                            {(() => {
                                                let isValid = false;
                                                if (item.image && typeof item.image === 'string') {
                                                    try {
                                                        if (item.image.startsWith('/')) {
                                                            isValid = true;
                                                        } else {
                                                            new URL(item.image);
                                                            isValid = true;
                                                        }
                                                    } catch (e) {
                                                        isValid = false;
                                                    }
                                                }

                                                return isValid ? (
                                                    <Image src={item.image} alt={item.name} fill className="object-cover grayscale" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-zinc-100">
                                                        <ShoppingBag size={16} className="text-zinc-300" />
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[9px] uppercase tracking-widest text-ruby font-bold">{item.category}</p>
                                            <h3 className="text-xs font-serif font-bold text-black truncate">{item.name}</h3>
                                            <p className="text-[10px] text-zinc-400 mt-1">{item.quantity}x {formatCurrency(item.price)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-8 border-t border-black/5">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-500">Subtotal</span>
                                    <span className="font-serif">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-500">Delivery Fee</span>
                                    <span className="font-serif">{formatCurrency(deliveryFee)}</span>
                                </div>
                                <div className="flex justify-between items-center text-lg pt-4">
                                    <span className="font-serif font-bold">Total</span>
                                    <span className="font-serif font-bold text-black underline underline-offset-8 decoration-ruby/30">
                                        {formatCurrency(total)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-white/50 rounded-sm">
                                <ShieldCheck size={16} className="text-ruby" />
                                <p className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">Encrypted Secure Transaction</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
