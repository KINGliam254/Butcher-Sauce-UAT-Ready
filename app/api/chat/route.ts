import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

// 1. Hard Topic Boundaries (Backend-level)
const FORBIDDEN_TOPICS = [
    /politics/i, /election/i, /government/i,
    /crypto/i, /bitcoin/i, /ethereum/i, /stock market/i,
    /gambling/i, /casino/i, /betting/i,
    /explicit/i, /porn/i, /nsfw/i,
    /hacking/i, /exploit/i, /malware/i,
    /competitor/i, /walmart/i, /carrefour/i, /jumia/i // Example competitors
];

const CANNED_REFUSAL = "I am the Artisanal Assistant for Butcher & Sauce. My expertise is exclusively in premium cuts, sauces, and culinary pairings. I cannot assist with that topic. How may I help you discover the perfect cut today?";

export async function POST(req: Request) {
    try {
        const { messages, pageInfo } = await req.json();
        const apiKey = process.env.DEEPSEEK_API_KEY;

        console.log("DEEPSEEK_API_KEY present:", !!apiKey);

        if (!apiKey) {
            return NextResponse.json(
                { error: "DeepSeek API Key not configured" },
                { status: 500 }
            );
        }

        // Initialize DeepSeek Client (OpenAI compatible)
        const client = new OpenAI({
            apiKey: apiKey,
            baseURL: "https://api.deepseek.com",
        });

        // 2. Intent Check / Guardrails
        const lastUserMessage = messages[messages.length - 1]?.text || "";
        const isForbidden = FORBIDDEN_TOPICS.some(regex => regex.test(lastUserMessage));

        if (isForbidden) {
            return NextResponse.json({ text: CANNED_REFUSAL });
        }

        // 3. Context Discipline: Fetch products with metadata
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);
        const { data: products } = await supabase
            .from("products")
            .select("slug, name, price_display, numeric_price, category, description, image_url")
            .order("name", { ascending: true })
            .limit(100);

        const productContext = products && products.length > 0
            ? `Available Products (Orderable ONLY using these slugs):\n${products.map(p => `- ${p.name}: ${p.price_display}. Slug: ${p.slug}. Numeric Price: ${p.numeric_price}. Image: ${p.image_url || 'No Image'}. Description: ${p.description}`).join("\n")}`
            : "Product catalog is temporarily unavailable.";

        // 4. Constitution (System Prompt)
        const systemPrompt = `ROLE: You are the "Artisanal Assistant" for Butcher & Sauce.
SCOPE: Assist with culinary questions and take orders for our premium products.
TONE: Clear, concise, confident, and sophisticated.
CONTEXT: User is currently on ${pageInfo?.pathname || "our store"}.
REFUSAL: If a question is outside our scope, politely decline and steer back to our artisanal selection.

PRICING POLICY: All meat products are charged PER KILOGRAM (kg). Remind customers of this when they ask about prices.

ORDERING CHECKLIST:
Before placing an order, you MUST confirm:
1. The exact PRODUCT.
2. The WEIGHT in kilograms (e.g., 1.5kg, 2kg).
3. The PREPARATION: 
   - For Steaks: Ask for DONENESS (Rare, Medium-Rare, Medium, Well-Done).
   - For all meats: Ask if they want it RAW or COOKED/CHOMA.

ORDERING ENGINE:
1. If all checklist items (Product, Kilos, Preparation/Doneness) are confirmed, you MUST respond with a sophisticated confirmation and include a hidden command at the end.
2. The command format is: [ORDER: {"slug": "product-slug", "quantity": number_of_kilos, "name": "Product Name", "price": "Price Display", "numericPrice": number, "image": "Image URL from context", "category": "Category", "doneness": "Doneness preference", "preparation": "Raw or Cooked"}]
3. Use the EXACT product data (slugs, generic prices, and image URLs) provided in the context below.
4. FINANCIAL INTEGRITY: The "numericPrice" field MUST be the unit price for 1kg from the context. DO NOT set it to the quantity or any other value. For example, if Aged Beef is 1050, "numericPrice" MUST be 1050, even if the user orders 0.5kg or 2kg.
5. Keep the command on its own line at the very end.

${productContext}

CONVERSATION RULES:
- Never disclose you are an AI.
- Keep responses under 3 sentences.
- Use an elegant tone, e.g., "An excellent choice, I've added that to your collection."
- If the product isn't in the list, steer them to what's available or suggest the Pepper Sauce.`;

        // 5. Context Discipline: Limit history
        const conversationHistory = messages.slice(-5).map((m: any) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
        }));

        // 6. DeepSeek Call (Low Temp for Stability)
        const completion = await client.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: systemPrompt },
                ...conversationHistory
            ],
            temperature: 0.3,
            max_tokens: 300,
        });

        let responseText = completion.choices[0].message.content || "";

        // 7. Output Shaping
        responseText = responseText.trim();
        responseText = responseText.replace(/[\*\#]/g, ""); // Remove bold/headers for a cleaner text-only look

        if (!responseText) {
            throw new Error("Empty response from model");
        }

        return NextResponse.json({ text: responseText, products }); // Send products back for easy matching if needed

    } catch (error: any) {
        console.error("DeepSeek Wrapper Error:", error);

        return NextResponse.json({
            text: "My apologies. I'm currently refining my knowledge in the cellar. How else can I assist your culinary journey?"
        });
    }
}
