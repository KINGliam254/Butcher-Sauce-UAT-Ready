const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

async function listModels() {
    console.log("Testing with API Key:", process.env.GOOGLE_GENERATIVE_AI_API_KEY ? "Present" : "Missing");

    // Some regions/keys only have access to 1.5-flash or pro. 
    // The exact string is important.
    const candidates = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];

    for (const m of candidates) {
        try {
            console.log(`Checking model: ${m}...`);
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("hi");
            const text = await result.response.text();
            console.log(`✅ ${m} is available.`);
        } catch (e) {
            console.log(`❌ ${m} failed: ${e.message}`);
        }
    }
}

listModels();
