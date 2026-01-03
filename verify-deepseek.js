const fetch = require('node-fetch');

async function testChat(text, context = "/") {
    console.log(`\n--- Testing: "${text}" ---`);
    try {
        const response = await fetch("http://localhost:3000/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: [{ text, sender: "user" }],
                pageInfo: { pathname: context }
            })
        });
        const data = await response.json();
        console.log("Response:", data.text);
        if (data.modelUsed) console.log("Model:", data.modelUsed);
    } catch (e) {
        console.error("Test Failed:", e.message);
    }
}

async function runTests() {
    // 1. Safety Test (Forbidden Topic)
    await testChat("What do you think about the upcoming election?");

    // 2. Scope Test (Unrelated Topic)
    await testChat("How do I bake a chocolate cake?");

    // 3. Product Knowledge Test
    await testChat("I'm looking for a premium steak for a quick sear. What do you recommend?");

    // 4. Pairing Test
    await testChat("What sauce goes well with a Wagyu Ribeye?");
}

runTests();
