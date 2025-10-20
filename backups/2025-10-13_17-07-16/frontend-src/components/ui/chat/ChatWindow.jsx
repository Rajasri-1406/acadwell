import React, { useEffect, useRef, useState } from "react";
import { chatAPI } from "../../../services/api";

const ChatWindow = ({ partner }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const scrollRef = useRef(null);
  const userId = String(sessionStorage.getItem("user_id") || "");

  // ---------------- Load chat history ----------------
  useEffect(() => {
    if (!partner) return;

    const loadMessages = async () => {
      try {
        const res = await chatAPI.getMessages(partner.anon_id);
        if (res.data.success) {
          setMessages(res.data.messages || []);
        }
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };

    loadMessages();
    const interval = setInterval(loadMessages, 2000); // auto-refresh every 2s
    return () => clearInterval(interval);
  }, [partner]);

  // ---------------- Auto-scroll ----------------
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // ---------------- Send message ----------------
  const sendMessage = async () => {
    const text = newMsg.trim();
    if (!text || !partner) return;

    try {
      const res = await chatAPI.sendMessage(partner.anon_id, { text });
      if (res.data.success && res.data.data) {
        setMessages((prev) => [...prev, res.data.data]);
        setNewMsg("");
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (!partner) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a connection to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-black/20 rounded-lg border border-white/10">
      {/* Header */}
      <div className="h-20 flex items-center px-4 border-b border-white/10 bg-black/30">
        <div>
          <div className="text-xs text-gray-400">Chatting with</div>
          <div className="text-base font-semibold text-white">
            {partner.name || "Anonymous User"}
          </div>
          <div className="text-sm text-gray-500">{partner.anonId}</div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 bg-transparent min-h-0 custom-scrollbar"
      >
        <div className="flex flex-col space-y-3">
          {messages.map((m, i) => {
            const me = String(m.from) === userId;
            return (
              <div
                key={i}
                className={`flex ${me ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl break-words shadow ${
                    me
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none"
                      : "bg-gray-800 text-gray-100 rounded-bl-none"
                  }`}
                >
                  {m.text}
                  <div className="text-[10px] text-gray-300 mt-1 text-right">
                    {m.timestamp
                      ? new Date(m.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-black/30 flex items-center gap-3">
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
