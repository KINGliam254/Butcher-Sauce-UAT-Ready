import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

// Historical static data for specs (to supplement DB if not present in specs column)
const historicalSpecs: Record<string, any> = {
    "dry-aged-ribeye": {
        origin: "Laikipia High Plains",
        aging: "30 Days Salt-Aged",
        cut: "Center-cut Bone-in",
        diet: "Grass-fed, Grain-finished"
    },
    "artisanal-lamb-chops": {
        origin: "Mt. Kenya Foothills",
        aging: "7 Days Wet-Aged",
        cut: "Double Rib Chop",
        diet: "Wild Herb Graze"
    },
    "wagyu-sirloin": {
        origin: "Naivasha Estate",
        aging: "21 Days Dry-Aged",
        cut: "Striploin Steak",
        diet: "Beer-mash & Olives"
    },
    "signature-pepper-sauce": {
        base: "Red Wine Reduction",
        heat: "Sophisticated Spice",
        volume: "250ml Jar",
        shelf_life: "14 Days Chilled"
    }
};

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!product) {
        notFound();
    }

    // Merge in specs - prioritized DB column, then historical, then defaults
    const specs = product.specs || historicalSpecs[slug] || {
        origin: "Premium Kenyan Highlands",
        aging: "Master Butchery Aged",
        cut: "Artisanal Butcher Cut",
        diet: "Naturally Reared"
    };

    return <ProductDetailClient product={{ ...product, specs }} />;
}

