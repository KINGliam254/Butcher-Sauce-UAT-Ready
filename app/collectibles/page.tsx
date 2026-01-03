import ProductCard from "@/components/ProductCard";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function CollectiblesPage() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'Master Tools')
        .order('created_at', { ascending: false });

    return (
        <div className="bg-white min-h-screen pt-32">
            <section className="section-padding max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <span className="text-ruby text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">
                        The Master's Workshop
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-black mb-8">
                        Collectibles <span className="italic font-light text-zinc-400">&</span> Tools
                    </h1>
                    <p className="text-zinc-500 max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed">
                        Hand-forged tools, industrial-grade aprons, and essentials for the master butcher. Built to last a lifetime of craftsmanship.
                    </p>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-12 md:gap-16">
                    {products?.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                    {!products?.length && <p className="text-zinc-400 text-sm font-light text-center col-span-full">New smithing in progress...</p>}
                </div>
            </section>

            {/* Quality Section */}
            <section className="bg-[#0A0A0A] text-white section-padding border-t border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="relative aspect-video overflow-hidden rounded-sm shadow-2xl">
                        <div
                            className="absolute inset-0 bg-cover bg-center grayscale"
                            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544026315-1a868460599c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                    </div>

                    <div className="space-y-8">
                        <span className="text-ruby text-[10px] uppercase tracking-[0.4em] font-bold block">Forged Integrity</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
                            Tools that <br />
                            <span className="italic font-light text-zinc-500 font-serif text-white">Honor the Meat.</span>
                        </h2>
                        <p className="text-zinc-400 text-lg font-light leading-relaxed">
                            A master butcher's knife is an extension of their hand. Our collectibles are sourced for their durability, balance, and precision, ensuring every cut you make is deliberate and respected.
                        </p>
                        <div className="flex gap-12 pt-8 border-t border-white/10">
                            <div>
                                <h4 className="text-ruby font-serif text-2xl mb-2 italic">Lifetime</h4>
                                <p className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">Durability</p>
                            </div>
                            <div>
                                <h4 className="text-ruby font-serif text-2xl mb-2 italic">Master</h4>
                                <p className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">Precision</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
