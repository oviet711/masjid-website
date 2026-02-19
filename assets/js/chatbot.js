async function sendMessage() {

    const input = document.getElementById("chat-input").value;
    const chatWindow = document.getElementById("chat-window");

    chatWindow.innerHTML += "<p><b>Anda:</b> " + input + "</p>";

    const response = await fetch("https://masjid-chatbot-proxy.oviet711.workers.dev", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer API_KEY",
            "HTTP-Referer": "https://oviet711.github.io",
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


