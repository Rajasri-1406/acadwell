import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { chatAPI } from "../../../services/api";

const socket = io("http://localhost:5000"); // backend server

const ChatBox = ({ currentUser, partner }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // Join socket room
  useEffect(() => {
    if (currentUser) {
      socket.emit("join", { user_id: currentUser });
    }
  }, [currentUser]);

  // Fetch chat history
  useEffect(() => {
    const fetchHistory = async () => {
      if (partner) {
        const res = await chatAPI.getHistory(partner, currentUser);
        if (res.data.success) setMessages(res.data.messages);
      }
    };
    fetchHistory();
  }, [partner, currentUser]);

  // Listen for new messages
  useEffect(() => {
    socket.on("receive_message", (msg) => {
      if (
        (msg.sender === partner && msg.receiver === currentUser) ||
        (msg.sender === currentUser && msg.receiver === partner)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => socket.off("receive_message");
  }, [partner, currentUser]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const res = await chatAPI.sendMessage(currentUser, partner, text);
    if (res.data.success) {
      setText("");
    }
  };

  return (
    <div className="border rounded-lg p-4 w-full max-w-md">
      <h3 className="font-bold mb-2">Chat with {partner}</h3>
      <div className="h-64 overflow-y-auto border p-2 mb-3 bg-gray-50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 mb-1 rounded ${
              m.sender === currentUser
                ? "bg-blue-500 text-white text-right"
                : "bg-gray-200 text-left"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border flex-grow px-2 py-1 rounded"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
