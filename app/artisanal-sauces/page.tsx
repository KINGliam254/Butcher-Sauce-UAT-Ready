import ProductCard from "@/components/ProductCard";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function ArtisanalSelectionPage() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: products } = await supabase
        .from('products')
        .select('*')
        .in('category', ['Sauces & Marinades', 'Signature Reserve', 'Dry Rubs', 'Small Batch'])
        .order('category', { ascending: true });

    return (
        <div className="bg-white min-h-screen pt-56">
            <section className="section-padding max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <span className="text-ruby text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">
                        Master Selection
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-black mb-8">
                        Sauces <span className="italic font-light text-zinc-400">&</span> Marinades
                    </h1>
                    <p className="text-zinc-500 max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed">
                        Elevate your craft. Our selection of artisanal sauces and marinades are balanced to perfection to elevate every cut.
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
                    {!products?.length && <p className="text-zinc-400 text-sm font-light text-center col-span-full">Awaiting the next small batch...</p>}
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="bg-neutral-soft section-padding border-t border-black/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="space-y-8">
                        <span className="text-ruby text-[10px] uppercase tracking-[0.4em] font-bold block">The Craft</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-black leading-tight">
                            Small Batches, <br />
                            <span className="italic font-light text-zinc-400 font-serif">Big Flavor Profiles.</span>
                        </h2>
                        <p className="text-zinc-600 text-lg font-light leading-relaxed">
                            We believe a great sauce shouldn't mask the flavor of the meat, but elevate it. Every one of our artisanal offerings is balanced to perfection, providing the right amount of acidity, heat, and depth.
                        </p>
                        <div className="flex gap-12 pt-8 border-t border-black/5">
                            <div>
                                <h4 className="text-black font-serif text-2xl mb-2 italic">100%</h4>
                                <p className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">Natural Ingredients</p>
                            </div>
                            <div>
                                <h4 className="text-black font-serif text-2xl mb-2 italic">Zero</h4>
                                <p className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">Preservatives</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative aspect-video overflow-hidden rounded-sm shadow-2xl">
                        <div
                            className="absolute inset-0 bg-cover bg-center grayscale opacity-80"
                            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544026315-1a868460599c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-white/20 to-transparent" />
                    </div>
                </div>
            </section>
        </div>
    );
}
