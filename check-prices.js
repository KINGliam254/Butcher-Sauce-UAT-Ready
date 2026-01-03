const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('name, price_display, numeric_price, slug');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    console.log('--- Product Pricing Diagnosis ---');
    data.forEach(p => {
        console.log(`- ${p.name}: Label=${p.price_display}, Numeric=${p.numeric_price}, Slug=${p.slug}`);
    });
}

checkProducts();
