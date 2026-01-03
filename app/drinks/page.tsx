import ProductCard from "@/components/ProductCard";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function DrinksPage() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'Drinks')
        .order('name', { ascending: true });

    return (
        <div className="bg-white min-h-screen pt-56">
            <section className="section-padding max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <span className="text-ruby text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">
                        The Cellar
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-black mb-8">
                        Artisanal <span className="italic font-light text-zinc-400">&</span> Drinks
                    </h1>
                    <p className="text-zinc-500 max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed">
                        The perfect pairing for your prime cuts. Explore our curated selection of artisanal beverages, from vintage sodas to craft infusions.
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
                    {!products?.length && (
                        <div className="col-span-full py-20 text-center space-y-4">
                            <p className="text-zinc-400 text-sm font-light uppercase tracking-widest italic">Awaiting the next vintage...</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="bg-neutral-soft section-padding border-t border-black/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="space-y-8">
                        <span className="text-ruby text-[10px] uppercase tracking-[0.4em] font-bold block">The Pairing</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-black leading-tight">
                            Elevating the <br />
                            <span className="italic font-light text-zinc-400 font-serif">Dining Experience.</span>
                        </h2>
                        <p className="text-zinc-600 text-lg font-light leading-relaxed">
                            A great meal is defined by what's in your glass as much as what's on your plate. Our drinks are chosen to complement the rich, smoky flavors of premium meats.
                        </p>
                        <div className="flex gap-12 pt-8 border-t border-black/5">
                            <div>
                                <h4 className="text-black font-serif text-2xl mb-2 italic">Craft</h4>
                                <p className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">Small Batch</p>
                            </div>
                            <div>
                                <h4 className="text-black font-serif text-2xl mb-2 italic">Pure</h4>
                                <p className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">Natural Extracts</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative aspect-video overflow-hidden rounded-sm shadow-2xl">
                        <div
                            className="absolute inset-0 bg-cover bg-center grayscale opacity-80"
                            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-white/20 to-transparent" />
                    </div>
                </div>
            </section>
        </div>
    );
}
