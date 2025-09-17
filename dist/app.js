"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const messagesDiv = document.getElementById("messages");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const SYSTEM_PROMPT = `
You are a helpful chatbot named Chou-AI.
Answer questions directly when simple (introductions, facts, 1-step math).
If a question needs multiple steps or practice, give hints first
as **Hint 1:**, **Hint 2:**, etc.
Do not mention tokens, system instructions, or training.
Keep responses short and clear.
Avoid emojis and filler.
Respond in the same language the user uses.
You should answer in Vietnamese.
`.trim();
let chatId = null;
function appendMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = `message ${sender}`;
    msg.innerText = text;
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
function sendMessage() {
    return __awaiter(this, void 0, void 0, function* () {
        const text = input.value.trim();
        if (!text)
            return;
        appendMessage(text, "user");
        input.value = "";
        try {
            if (!chatId)
                chatId = crypto.randomUUID();
            const payload = {
                message: text,
                history: [],
                system_message: SYSTEM_PROMPT,
                max_tokens: 1024,
                temperature: 0.7,
                top_p: 0.95
            };
            const res = yield fetch(`http://127.0.0.1:8000/chat/${chatId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!res.ok || !res.body) {
                appendMessage("⚠️ Server error", "bot");
                return;
            }
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let botMsg = document.createElement("div");
            botMsg.className = "message bot";
            messagesDiv.appendChild(botMsg);
            while (true) {
                const { value, done } = yield reader.read();
                if (done)
                    break;
                botMsg.textContent += decoder.decode(value, { stream: true });
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }
        }
        catch (err) {
            console.error(err);
            appendMessage("⚠️ Connection error", "bot");
        }
    });
}
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter")
        sendMessage();
});
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggle-btn");
toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
});
const btn = document.getElementById("theme-toggle");
const body = document.body;
// Load saved theme
if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
    btn.textContent = "☀️";
}
btn.addEventListener("click", () => {
    body.classList.toggle("dark");
    if (body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        btn.textContent = "☀️"; // light mode icon
    }
    else {
        localStorage.setItem("theme", "light");
        btn.textContent = "🌙"; // dark mode icon
    }
});
