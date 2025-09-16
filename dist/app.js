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
            const res = yield fetch(`http://127.0.0.1:8000/chat/${chatId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const data = yield res.json();
                appendMessage(data.response, "bot");
            }
            else {
                appendMessage("⚠️ Server error", "bot");
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
