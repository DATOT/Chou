const messagesDiv = document.getElementById("messages") as HTMLDivElement;
const input = document.getElementById("user-input") as HTMLInputElement;
const sendBtn = document.getElementById("send-btn") as HTMLButtonElement;

let chatId: string | null = null;

function appendMessage(text: string, sender: "user" | "bot") {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerText = text;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;
  appendMessage(text, "user");
  input.value = "";

  try {
    if (!chatId) {
      // first message → generate id
      chatId = crypto.randomUUID();
    }

    const payload = {
      message: text,
      history: [],
      system_message: "You are a friendly chatbot named Chou-AI.",
      max_tokens: 1024,
      temperature: 0.7,
      top_p: 0.95
    };

    const res = await fetch(`http://127.0.0.1:8000/chat/${chatId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      appendMessage(data.response, "bot");
    } else {
      appendMessage("⚠️ Server error", "bot");
    }
  } catch (err) {
    console.error(err);
    appendMessage("⚠️ Connection error", "bot");
  }
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
