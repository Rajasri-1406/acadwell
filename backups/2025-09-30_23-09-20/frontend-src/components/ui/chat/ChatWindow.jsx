// frontend/src/components/ui/chat/ChatWindow.jsx
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { chatAPI } from "../../services/api";

const SOCKET_URL = "http://localhost:5000";

const ChatWindow = ({ partner }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const userId = String(sessionStorage.getItem("user_id") || "");
  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!partner) return;

    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.emit("join", { user_id: userId });

    socket.on("receive_message", (msg) => {
      const s = String(msg.sender_id);
      const r = String(msg.receiver_id);
      if ((s === userId && r === String(partner.id)) || (r === userId && s === String(partner.id))) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    // load message history
    (async () => {
      try {
        const res = await chatAPI.getMessages(partner.id);
        if (res.data.success) {
          setMessages(res.data.messages.map((m) => ({
            ...m,
            sender_id: String(m.sender_id),
            receiver_id: String(m.receiver_id),
          })));
        }
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    })();

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [partner, userId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !partner) return;

    const payload = { receiver_id: partner.id, text: newMessage };

    try {
      const res = await chatAPI.sendMessage(payload);
      if (res.data.success) {
        const msgObj = { sender_id: userId, receiver_id: String(partner.id), text: newMessage };
        socketRef.current?.emit("send_message", msgObj);
        setMessages((prev) => [...prev, msgObj]);
        setNewMessage("");
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (!partner) return <div className="flex items-center justify-center h-full text-gray-400">Select a connection to chat</div>;

  return (
    <div className="flex flex-col h-full border rounded-lg bg-gray-900">
      <div className="h-16 flex items-center px-4 border-b border-gray-700 text-white font-semibold">
        Chat with {partner.name}
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m, i) => {
          const me = String(m.sender_id) === userId;
          return (
            <div key={i} className={`flex ${me ? "justify-end" : "justify-start"}`}>
              <div className={`p-2 rounded-lg ${me ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-100"}`}>
                {m.text}
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-2 border-t border-gray-700 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-2 py-1 rounded bg-gray-800 text-white focus:outline-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className="px-3 py-1 bg-blue-500 text-white rounded">Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
