// frontend/src/components/ui/chat/ChatWindow.jsx
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { chatAPI } from "../../../services/api";

const SOCKET_URL = "http://localhost:5000";

const ChatWindow = ({ partner }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const userId = String(localStorage.getItem("user_id") || "");
  const token = localStorage.getItem("token") || "";
  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  // connect socket whenever partner changes
  useEffect(() => {
    if (!partner || !token) return;

    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.emit("join", { token });

    socket.on("receive_message", (msg) => {
      const s = String(msg.sender_id);
      const r = String(msg.receiver_id);
      if (
        (s === userId && r === String(partner.anon_id)) ||
        (r === userId && s === String(partner.anon_id))
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    // load history
    (async () => {
      try {
        const res = await chatAPI.getMessages(partner.anon_id);
        if (res.data.success) {
          const normalized = (res.data.messages || []).map((m) => ({
            ...m,
            sender_id: String(m.sender_id),
            receiver_id: String(m.receiver_id),
          }));
          setMessages(normalized);
        }
      } catch (err) {
        console.error("Error loading history:", err);
      }
    })();

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [partner?.anon_id, token, userId]);

  // auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const text = newMessage.trim();
    if (!text || !partner) return;

    const payload = {
      receiver_id: partner.anon_id,
      text,
    };

    try {
      const res = await chatAPI.sendMessage(payload);
      if (res.data?.success) {
        const msgObj = {
          sender_id: userId,
          receiver_id: String(partner.anon_id),
          text,
          timestamp: new Date().toISOString(),
        };

        if (socketRef.current?.connected) {
          socketRef.current.emit("send_message", msgObj);
        }

        setMessages((prev) => [...prev, msgObj]);
        setNewMessage("");
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
      <div className="h-16 flex items-center px-4 border-b border-white/10 bg-black/30">
        <div>
          <div className="text-xs text-gray-400">Chatting with</div>
          <div className="text-base font-semibold text-white">
            {partner.name}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 bg-transparent min-h-0"
      >
        <div className="flex flex-col space-y-3">
          {messages.map((m, i) => {
            const me = String(m.sender_id) === userId;
            return (
              <div
                key={i}
                className={`flex ${me ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl break-words shadow 
                    ${
                      me
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none"
                        : "bg-gray-800 text-gray-100 rounded-bl-none"
                    }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-black/30 flex items-center gap-3">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
