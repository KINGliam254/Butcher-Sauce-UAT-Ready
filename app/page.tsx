import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import Image from "next/image";
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
            <span className="text-ruby text-[10px] uppercase tracking-[0.4em] font-medium mb-4 block">Selection</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-black leading-tight">
              Featured Prime Cuts <br />
              <span className="italic font-light text-zinc-500">Direct From The Butcher.</span>
            </h2>
          </div>
          <button className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 hover:text-ruby transition-colors pb-2 border-b border-zinc-100 hover:border-ruby">
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
              className="absolute inset-0 bg-cover bg-center opacity-80"
              style={{ backgroundImage: "url('/heritage-standard.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/90 to-transparent" />
            <div className="absolute bottom-12 left-12">
              <span className="text-ruby text-6xl font-serif italic">1999</span>
              <p className="text-xs uppercase tracking-widest text-zinc-500 mt-2 font-bold">Established Tradition</p>
            </div>
          </div>

          <div className="space-y-8">
            <span className="text-ruby text-[10px] uppercase tracking-[0.4em] font-medium block">Our Heritage</span>
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
      <footer className="py-24 border-t border-black/5 bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            {/* Branding Column */}
            <div className="space-y-8">
              <div className="relative w-20 h-20 grayscale opacity-80 hover:opacity-100 transition-opacity">
                <Image
                  src="/logo.png"
                  alt="Butcher & Sauce"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold tracking-widest uppercase text-black mb-2">
                  Butcher <span className="text-ruby">&</span> Sauce
                </h2>
                <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 font-bold">The Artisanal Mission</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-8">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-black border-b border-black/5 pb-4">Curation</h4>
              <div className="flex flex-col gap-4">
                {[
                  { name: "Prime Cuts", href: "/prime-cuts" },
                  { name: "Sauces & Marinades", href: "/artisanal-sauces" },
                  { name: "Collectibles", href: "/collectibles" },
                  { name: "The Butchery", href: "/the-butchery" },
                ].map(link => (
                  <Link key={link.name} href={link.href} className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-ruby transition-colors font-bold">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Support */}
            <div className="space-y-8">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-black border-b border-black/5 pb-4">Assistance</h4>
              <div className="flex flex-col gap-4">
                {[
                  { name: "Contact Hub", href: "/contact" },
                  { name: "Corporate Sales", href: "/corporate" },
                  { name: "Instagram", href: "https://www.instagram.com/butcherandsauce?igsh=NTc4MTIwNjQ2YQ==" },
                ].map(link => (
                  <Link key={link.name} href={link.href} className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-ruby transition-colors font-bold">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-black border-b border-black/5 pb-4">Coordinates</h4>
              <div className="space-y-2 text-[10px] tracking-widest text-zinc-400 uppercase font-bold leading-relaxed">
                <p>Nairobi, Kenya</p>
                <p>Artisanal Preparation Center</p>
                <p className="text-zinc-600 mt-4">Est. 1999</p>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <p className="text-[10px] tracking-widest text-zinc-400 uppercase font-bold italic">Honoring the Standard since 1999</p>
            <p className="text-[10px] tracking-widest text-zinc-400 uppercase font-bold">© 2026 Butcher & Sauce. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
