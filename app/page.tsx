import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false });

  return (
    <div className="bg-white min-h-screen">
      <Hero />

      {/* Featured Cuts Section */}
      <section className="section-padding max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-xl">
            <span className="text-gold text-[10px] uppercase tracking-[0.4em] font-medium mb-4 block">Selection</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-black leading-tight">
              Featured Prime Cuts <br />
              <span className="italic font-light text-zinc-500">Direct From The Butcher.</span>
            </h2>
          </div>
          <button className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 hover:text-gold transition-colors pb-2 border-b border-zinc-100 hover:border-gold">
            View Seasonal Collection
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 lg:gap-12">
          {products?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
          {!products?.length && <p className="text-zinc-400 text-sm font-light">Loading artisanal selection...</p>}
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="bg-neutral-soft section-padding">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-sm shadow-2xl">
            <div
              className="absolute inset-0 bg-cover bg-center grayscale opacity-80"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1547496502-affa22d38842?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/90 to-transparent" />
            <div className="absolute bottom-12 left-12">
              <span className="text-gold text-6xl font-serif italic">1984</span>
              <p className="text-xs uppercase tracking-widest text-zinc-500 mt-2 font-bold">Established Tradition</p>
            </div>
          </div>

          <div className="space-y-8">
            <span className="text-gold text-[10px] uppercase tracking-[0.4em] font-medium block">Our Heritage</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-black leading-tight">
              A Legacy of <br />
              <span className="italic font-light text-zinc-400 font-serif">Purity & Precision.</span>
            </h2>
            <p className="text-zinc-600 text-lg font-light leading-relaxed">
              At Butcher & Sauce, we believe that the finest meals start with the finest ingredients. Our journey began with a simple mission: to provide the Kenyan table with meats of unparalleled quality, sourced from ethically raised livestock and prepared with master craftsmanship.
            </p>
            <div className="grid grid-cols-2 gap-12 pt-8 border-t border-black/5">
              <div>
                <h4 className="text-black font-serif text-2xl mb-2 italic">Grass-Fed</h4>
                <p className="text-zinc-500 text-[10px] leading-relaxed uppercase tracking-wider font-bold">Lush pastures of the Rift Valley</p>
              </div>
              <div>
                <h4 className="text-black font-serif text-2xl mb-2 italic">30 Days</h4>
                <p className="text-zinc-500 text-[10px] leading-relaxed uppercase tracking-wider font-bold">Expert dry-aging process</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Placeholder for completeness */}
      <footer className="py-24 border-t border-black/5 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-serif font-bold tracking-widest uppercase text-black">
              Butcher <span className="text-gold">&</span> Sauce
            </h2>
            <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 font-bold">The Artisanal Standard</p>
          </div>

          <div className="flex flex-wrap justify-center gap-12">
            {[
              { name: "Instagram", href: "https://www.instagram.com/butcherandsauce?igsh=NTc4MTIwNjQ2YQ==" },
              { name: "Contact", href: "/contact" },
            ].map(social => (
              <Link
                key={social.name}
                href={social.href}
                className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-gold transition-colors font-bold"
              >
                {social.name}
              </Link>
            ))}
          </div>

          <div className="pt-12 border-t border-black/5">
            <p className="text-[10px] tracking-widest text-zinc-400 uppercase font-bold">© 2026 Butcher & Sauce. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
