import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

async function listModels() {
    try {
        const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy call to trigger init
        console.log("Attempting to list models...");
        // The listModels method is on the genAI object in newer versions
        // Note: This might require specific permissions or might not be in the simple SDK
        // Alternative: try a few common ones
        const list = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];

        for (const m of list) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                await model.generateContent("test");
                console.log(`✅ Model ${m} is available`);
            } catch (e: any) {
                console.log(`❌ Model ${m} failed: ${e.message}`);
            }
        }
    } catch (error: any) {
        console.error("List Models Error:", error);
    }
}

listModels();
