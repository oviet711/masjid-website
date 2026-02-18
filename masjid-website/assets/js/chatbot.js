async function sendMessage() {

    const input = document.getElementById("chat-input").value;
    const chatWindow = document.getElementById("chat-window");

    chatWindow.innerHTML += "<p><b>Anda:</b> " + input + "</p>";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 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",
            "HTTP-Referer": "https://yourwebsite.github.io",
            "X-Title": "Masjid Chatbot"
        },
        body: JSON.stringify({
            model: "mistralai/mistral-7b-instruct",
            messages: [
                {
                    role: "system",
                    content: "Anda adalah AI Chatbot Masjid yang menjawab dengan sopan, berdasarkan Al-Qur'an dan Hadits, serta menggunakan bahasa Indonesia yang santun."
                },
                {
                    role: "user",
                    content: input
                }
            ]
        })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;

    chatWindow.innerHTML += "<p><b>AI:</b> " + reply + "</p>";
}
