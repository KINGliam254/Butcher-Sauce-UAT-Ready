"use client";

import { useState, useEffect, useRef } from "react";
import { X, Save, Trash2, Loader2, Upload, Plus, Trash } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

interface ProductFormProps {
    product?: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        price_display: "",
        numeric_price: 0,
        category: "Signature Reserve",
        image_url: "",
        is_featured: false,
        is_on_sale: false,
        sale_price: 0,
        has_prep_options: true,
        description: "",
        specs: {} as Record<string, string>
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                slug: product.slug || "",
                price_display: product.price_display || "",
                numeric_price: product.numeric_price || 0,
                category: product.category || "Signature Reserve",
                image_url: product.image_url || "",
                is_featured: product.is_featured || false,
                is_on_sale: product.is_on_sale || false,
                sale_price: product.sale_price || 0,
                has_prep_options: product.has_prep_options ?? true,
                description: product.description || "",
                specs: product.specs || {}
            });
        }
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

        setFormData(prev => {
            const newData = { ...prev, [name]: val };

            // Auto-generate slug
            if (name === "name" && !product) {
                newData.slug = value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]/g, "");
            }

            // Smart sync: If user updates display price, try to extract numeric value if numeric_price is empty or was recently 0
            if (name === "price_display" && (!prev.numeric_price || prev.numeric_price === 0)) {
                const extracted = parseInt(value.replace(/[^\d]/g, '') || "0");
                if (extracted > 0) newData.numeric_price = extracted;
            }

            return newData;
        });
    };

    const handleSpecChange = (key: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            specs: { ...prev.specs, [key]: value }
        }));
    };

    const addSpec = () => {
        const key = prompt("Enter specification details (e.g., Origin, Aging, Cut):");
        if (key) {
            handleSpecChange(key, "");
        }
    };

    const removeSpec = (key: string) => {
        const newSpecs = { ...formData.specs };
        delete newSpecs[key];
        setFormData(prev => ({ ...prev, specs: newSpecs }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);

            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                body: uploadFormData,
            });

            const result = await response.json();
            if (result.success) {
                setFormData(prev => ({ ...prev, image_url: result.url }));
            } else {
                alert(`Upload failed: ${result.error}`);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload image.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const formattedFormData = {
                ...formData,
                numeric_price: Number(formData.numeric_price),
                sale_price: Number(formData.sale_price)
            };

            const method = product ? "PATCH" : "POST";
            const body = product ? { id: product.id, ...formattedFormData } : formattedFormData;

            const response = await fetch("/api/admin/products", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                onSuccess();
                onClose();
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Failed to save product.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-xl h-full bg-[#0A0A0A] border-l border-zinc-800 p-10 overflow-y-auto space-y-10 shadow-2xl animate-in slide-in-from-right duration-500 custom-scrollbar">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
                            {product ? "Edit Product" : "New Entry"} <span className="text-zinc-700 italic">Details.</span>
                        </h2>
                        <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Catalog Management</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-sm text-zinc-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-600">Basic Information</label>
                            <div className="space-y-2">
                                <input
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-900/50 border border-zinc-800 p-4 rounded-sm focus:outline-none focus:border-gold/50 text-sm text-white transition-all"
                                    placeholder="Product Name (e.g. Dry-Aged Ribeye)"
                                />
                                <input
                                    required
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-900/50 border border-zinc-800 p-4 rounded-sm focus:outline-none focus:border-gold/50 text-xs text-zinc-400 font-mono transition-all"
                                    placeholder="slug-url-identifier"
                                />
                            </div>
                        </div>

                        {/* Image Selection */}
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-600">Product Media</label>
                            <div className="flex gap-4">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex-1 border-2 border-dashed border-zinc-800 rounded-sm p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-gold/30 hover:bg-gold/[0.02] transition-all group"
                                >
                                    {isUploading ? (
                                        <Loader2 size={24} className="text-gold animate-spin" />
                                    ) : (
                                        <Upload size={24} className="text-zinc-500 group-hover:text-gold transition-colors" />
                                    )}
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 group-hover:text-white transition-colors">
                                        {isUploading ? "Uploading..." : "Upload Local Media"}
                                    </span>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                    />
                                </div>
                                {formData.image_url && (
                                    <div className="w-32 aspect-square bg-zinc-900 rounded-sm border border-zinc-800 overflow-hidden relative group">
                                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                                                className="text-red-500 hover:text-red-400 p-2"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <input
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleChange}
                                className="w-full bg-zinc-900/50 border border-zinc-800 p-3 rounded-sm focus:outline-none focus:border-gold/50 text-[10px] text-zinc-500 transition-all font-mono"
                                placeholder="Or paste external URL..."
                            />
                        </div>

                        {/* Pricing */}
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-600">Pricing & Inventory</label>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    required
                                    name="price_display"
                                    value={formData.price_display}
                                    onChange={handleChange}
                                    className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-sm focus:outline-none focus:border-gold/50 text-sm text-white transition-all"
                                    placeholder="Price Display (Ksh 4,500 / kg)"
                                />
                                <input
                                    required
                                    type="number"
                                    name="numeric_price"
                                    value={formData.numeric_price}
                                    onChange={handleChange}
                                    className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-sm focus:outline-none focus:border-gold/50 text-sm text-white transition-all"
                                    placeholder="Numeric Value (4500)"
                                />
                            </div>

                            {/* Discount Toggle */}
                            <div className="flex flex-col gap-4 p-4 bg-zinc-900/30 border border-zinc-800 rounded-sm">
                                <div className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        name="is_on_sale"
                                        checked={formData.is_on_sale}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-gold focus:ring-gold"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-white">Active Discount</span>
                                        <span className="text-[8px] text-zinc-500 uppercase tracking-widest">Apply a sale price that overrides the display price</span>
                                    </div>
                                </div>
                                {formData.is_on_sale && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="pt-2"
                                    >
                                        <input
                                            type="number"
                                            name="sale_price"
                                            value={formData.sale_price}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-zinc-800 p-3 rounded-sm focus:outline-none focus:border-gold/50 text-sm text-gold font-bold transition-all"
                                            placeholder="Sale Price (e.g. 3800)"
                                        />
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Category & Featured */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-600">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-900/50 border border-zinc-800 p-4 rounded-sm focus:outline-none focus:border-gold/50 text-sm text-white appearance-none cursor-pointer"
                                >
                                    <option value="Beef">Beef</option>
                                    <option value="Lamb">Lamb</option>
                                    <option value="Poultry">Poultry</option>
                                    <option value="Pork">Pork</option>
                                    <option value="Seafood">Seafood</option>
                                    <option value="Exotic Meats">Exotic Meats</option>
                                    <option value="Sauces & Marinades">Sauces & Marinades</option>
                                    <option value="Vegetables & Sides">Vegetables & Sides</option>
                                    <option value="Signature Reserve">Signature Reserve</option>
                                    <option value="Mountain Range">Mountain Range</option>
                                    <option value="Master Tools">Master Tools</option>
                                    <option value="Drinks">Drinks</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        name="is_featured"
                                        checked={formData.is_featured}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-gold focus:ring-gold"
                                    />
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-white">Featured Item</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        name="has_prep_options"
                                        checked={formData.has_prep_options}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-gold focus:ring-gold"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-white">Cooking Options</span>
                                        <span className="text-[7px] text-zinc-500 uppercase tracking-widest">Enable Raw/Nyama Choma toggle</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-600">Butcher's Story (Description)</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full bg-zinc-900/50 border border-zinc-800 p-4 rounded-sm focus:outline-none focus:border-gold/50 text-sm text-white transition-all resize-none"
                                placeholder="Describe the cut, origin, and flavor profile..."
                            />
                        </div>

                        {/* Specs Editor */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-600">Technical Specifications</label>
                                <button
                                    type="button"
                                    onClick={addSpec}
                                    className="text-[9px] uppercase tracking-widest font-bold text-gold hover:text-white flex items-center gap-1 transition-colors"
                                >
                                    <Plus size={10} /> Add Property
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {Object.entries(formData.specs).map(([key, value]) => (
                                    <div key={key} className="flex gap-2 items-center group">
                                        <div className="w-24 shrink-0 text-[10px] uppercase tracking-widest font-bold text-zinc-500 italic">{key}:</div>
                                        <input
                                            value={value}
                                            onChange={(e) => handleSpecChange(key, e.target.value)}
                                            className="flex-1 bg-zinc-900/30 border border-zinc-800 p-2 rounded-sm text-xs text-white focus:outline-none focus:border-gold/30"
                                            placeholder="..."
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeSpec(key)}
                                            className="opacity-0 group-hover:opacity-100 text-zinc-700 hover:text-red-500 transition-all p-1"
                                        >
                                            <Trash size={14} />
                                        </button>
                                    </div>
                                ))}
                                {Object.keys(formData.specs).length === 0 && (
                                    <p className="text-[10px] text-zinc-700 italic">No custom specs added yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-zinc-800 flex gap-4">
                        <button
                            type="submit"
                            disabled={isSaving || isUploading}
                            className="flex-1 bg-gold text-black py-5 rounded-sm text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white transition-all shadow-xl shadow-gold/10 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {product ? "Update Master Catalog" : "Publish to Selection"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
