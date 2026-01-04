export async function sendTelegramMessage(text: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN || '8366197469:AAF9Rz0sIWEWS_qNyOQcQGAxB5pfcF4nD7k';
    const chatId = process.env.TELEGRAM_CHAT_ID || '8563395245';

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'HTML',
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('Telegram API Error:', data);
        }
        return data;
    } catch (error) {
        console.error('Telegram Fetch Error:', error);
    }
}
