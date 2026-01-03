const { OpenAI } = require("openai");

async function testDeepSeek() {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    console.log("Testing DeepSeek with Key:", apiKey ? "Present" : "Missing");

    if (!apiKey) return;

    const client = new OpenAI({
        apiKey: apiKey,
        baseURL: "https://api.deepseek.com",
    });

    try {
        console.log("Sending request to DeepSeek...");
        const completion = await client.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Hello, can you hear me?" }
            ],
            temperature: 0.3,
        });

        console.log("✅ Success! Response:", completion.choices[0].message.content);
    } catch (e) {
        console.log("❌ Failed:", e.message);
        if (e.response) {
            console.log("Status:", e.status);
            console.log("Data:", e.data);
        }
    }
}

testDeepSeek();
