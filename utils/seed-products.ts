import { createAdminClient } from "./supabase/admin";

export const STARTER_PRODUCTS = [
    {
        name: "Dry-Aged Wagyu Ribeye",
        slug: "wagyu-ribeye",
        price_display: "Ksh 4,800 / kg",
        numeric_price: 4800,
        category: "Signature Reserve",
        image_url: "/product images/1767357363246.jpg",
        is_featured: true,
        description: "The crown jewel of our collection. Intensely marbled, 30-day dry-aged Wagyu ribeye from the Rift Valley herds. Unmatched tenderness and rich, buttery flavor.",
        has_prep_options: true,
        specs: {
            "Origin": "Rift Valley, Kenya",
            "Aging": "30 Days Dry-Aged",
            "Grade": "BMS 8-9 (Marbling Score)"
        }
    },
    {
        name: "Heritage T-Bone Steak",
        slug: "heritage-tbone",
        price_display: "Ksh 2,400 / kg",
        numeric_price: 2400,
        category: "Beef",
        image_url: "/product images/1767357393694.jpg",
        is_featured: true,
        description: "A classic cut offering the best of both worlds: the robust flavor of the strip loin and the delicate tenderness of the filet. Perfect for high-heat grilling.",
        has_prep_options: true,
        specs: {
            "Origin": "Laikipia Plateau",
            "Cut": "Classic Bone-In T-Bone",
            "Aging": "21 Days Wet-Aged"
        }
    },
    {
        name: "Mountain Range Lamb Chops",
        slug: "mountain-lamb-chops",
        price_display: "Ksh 1,850 / kg",
        numeric_price: 1850,
        category: "Lamb",
        image_url: "/product images/1767357418743.jpg",
        is_featured: true,
        description: "Succulent lamb chops sourced from the cool highlands. These chops are exceptionally tender with a clean, mild flavor profile.",
        has_prep_options: true,
        specs: {
            "Origin": "Central Highlands",
            "Diet": "Grass-Fed",
            "Preparation": "Frenched"
        }
    },
    {
        name: "Artisanal Pepper Sauce",
        slug: "pepper-sauce",
        price_display: "Ksh 850",
        numeric_price: 850,
        category: "Sauces & Marinades",
        image_url: "/product images/1767357493770.jpg",
        is_featured: false,
        description: "Our signature small-batch pepper sauce. A complex blend of toasted peppercorns and aromatic herbs, designed specifically to complement aged beef.",
        has_prep_options: false,
        specs: {
            "Batch Size": "Small Batch (50 units)",
            "Base": "Red Wine & Cream Reduction",
            "Heat Level": "Mild-Medium"
        }
    },
    {
        name: "Hand-Forged Butcher Knife",
        slug: "butcher-knife-forged",
        price_display: "Ksh 12,500",
        numeric_price: 12500,
        category: "Master Tools",
        image_url: "/product images/1767357506156.jpg",
        is_featured: false,
        description: "Industrial-grade high-carbon steel, hand-forged for perfect balance and lasting edge retention. The essential tool for the home enthusiast.",
        has_prep_options: false,
        specs: {
            "Steel": "High-Carbon 1095",
            "Handle": "Black Walnut",
            "Warranty": "Lifetime"
        }
    }
];

export async function seedDatabase() {
    const supabase = createAdminClient();

    console.log(">>> [SEED] Starting database synchronization...");

    const { data, error } = await supabase
        .from('products')
        .insert(STARTER_PRODUCTS)
        .select();

    if (error) {
        console.error(">>> [SEED] Failed:", error);
        throw error;
    }

    console.log(`>>> [SEED] Successfully synchronized ${data?.length || 0} artisanal entries.`);
    return data;
}
