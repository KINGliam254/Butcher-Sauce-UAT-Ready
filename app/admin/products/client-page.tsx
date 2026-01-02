"use client";

import { useEffect, useState, useCallback } from "react";
import {
    Plus,
    Package,
    Edit3,
    Trash2,
    Search,
    Loader2,
    RefreshCw
} from "lucide-react";
import Image from "next/image";
import ProductForm from "@/components/admin/ProductForm";

export default function ProductsClientPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/admin/products/list");
            const resData = await response.json();
            if (resData.data) {
                setProducts(resData.data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleCreate = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

        try {
            const response = await fetch("/api/admin/products", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                fetchProducts();
            } else {
                alert("Failed to delete product.");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-4xl font-serif font-bold text-white tracking-tight">Stock <span className="text-zinc-700 italic">Catalogue.</span></h2>
                    <div className="flex items-center gap-4">
                        <p className="text-zinc-500 text-sm font-light">Curate and manage your artisanal inventory.</p>
                        <button onClick={fetchProducts} className="text-zinc-600 hover:text-gold transition-colors">
                            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                        <input
                            type="text"
                            placeholder="Search stock..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-zinc-900 border border-zinc-800 pl-12 pr-6 py-3 rounded-sm focus:outline-none focus:border-gold/50 text-xs text-white min-w-[300px] transition-all"
                        />
                    </div>
                    <button
                        onClick={handleCreate}
                        className="bg-gold text-black px-8 py-3 rounded-sm text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white transition-all shadow-lg shadow-gold/10 flex items-center gap-2"
                    >
                        <Plus size={16} /> Add New Entry
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                    <Loader2 size={40} className="text-gold animate-spin" />
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Synchronizing Manifest...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-zinc-900/30 border border-zinc-800/50 rounded-sm overflow-hidden group hover:border-gold/30 transition-all duration-500 flex flex-col">
                            <div className="relative aspect-[4/5] bg-zinc-900 overflow-hidden">
                                <Image
                                    src={product.image_url}
                                    alt={product.name}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-100"
                                />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className={`px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold backdrop-blur-md border ${product.is_featured ? 'bg-gold/10 text-gold border-gold/20' : 'bg-black/40 text-zinc-400 border-white/5'
                                        }`}>
                                        {product.is_featured ? 'Featured' : 'Standard'}
                                    </span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
                                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                    <span className="text-[8px] uppercase tracking-[0.2em] text-gold font-bold">{product.category}</span>
                                </div>
                            </div>
                            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-serif font-bold text-white tracking-wide">{product.name}</h3>
                                        <div className="text-right">
                                            <p className="text-sm font-serif text-white italic">{product.price_display}</p>
                                            <p className="text-[9px] text-gold/60 font-mono mt-1">Value: {product.numeric_price}</p>
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-zinc-600 line-clamp-2 uppercase tracking-wider leading-relaxed">{product.description || "No description provided."}</p>
                                </div>
                                <div className="flex items-center gap-2 pt-4 border-t border-zinc-800/50">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="flex-1 bg-zinc-900 border border-zinc-800 py-2.5 rounded-sm text-[8px] uppercase tracking-widest font-bold text-zinc-500 hover:text-white hover:border-zinc-600 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Edit3 size={12} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-sm flex items-center justify-center text-zinc-600 hover:text-rose-500 hover:border-rose-500/30 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {!filteredProducts.length && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800/50 rounded-sm">
                            <Package size={48} className="mx-auto text-zinc-800 mb-4" />
                            <p className="text-zinc-600 text-sm font-light italic">The manifest reflects no entries matching your search.</p>
                        </div>
                    )}
                </div>
            )}

            {isFormOpen && (
                <ProductForm
                    product={editingProduct}
                    onClose={() => setIsFormOpen(false)}
                    onSuccess={fetchProducts}
                />
            )}
        </div>
    );
}
