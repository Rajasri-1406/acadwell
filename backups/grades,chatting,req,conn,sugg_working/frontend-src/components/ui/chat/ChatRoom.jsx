// src/components/ui/chat/ChatRoom.jsx
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { chatAPI } from "../../../services/api";

const SOCKET_URL = "http://localhost:5000";

const ChatRoom = () => {
  const [connections, setConnections] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = String(user?.anon_id || "");
  const token = localStorage.getItem("token") || "";

  // ✅ Connect socket once
  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.emit("join", { token });

    socket.on("online_users", (list) => {
      setOnlineUsers(list);
    });

    socket.on("receive_message", (msg) => {
      if (
        msg.sender_id === userId ||
        msg.receiver_id === userId ||
        msg.sender_id === selectedUser?.anon_id ||
        msg.receiver_id === selectedUser?.anon_id
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.disconnect();
  }, [token, userId, selectedUser?.anon_id]);

  // ✅ Fetch connections
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await chatAPI.getConnections();
        if (res.data.success) {
          setConnections(res.data.connections);
        }
      } catch (err) {
        console.error("Error fetching connections:", err);
      }
    };
    fetchConnections();
  }, []);

  // ✅ Fetch history with selected user
  const loadMessages = async (partnerId) => {
    try {
      const res = await chatAPI.getMessages(partnerId);
      if (res.data.success) {
        const normalized = res.data.messages.map((m) => ({
          ...m,
          sender_id: String(m.sender_id),
          receiver_id: String(m.receiver_id),
        }));
        setMessages(normalized);
      }
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  // ✅ Send message
  const sendMessage = async () => {
    const text = newMsg.trim();
    if (!text || !selectedUser) return;

    const payload = { receiver_id: selectedUser.anon_id, text };

    try {
      const res = await chatAPI.sendMessage(payload);
      if (res.data.success) {
        const msgObj = {
          sender_id: userId,
          receiver_id: selectedUser.anon_id,
          text,
          timestamp: new Date().toISOString(),
        };

        socketRef.current?.emit("send_message", msgObj);
        setMessages((prev) => [...prev, msgObj]);
        setNewMsg("");
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // ✅ Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-[85vh] border rounded-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 border-r bg-gray-50 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Chats</h2>
        <ul className="space-y-2">
          {connections.map((c) => (
            <li
              key={c.anon_id}
              onClick={() => {
                setSelectedUser(c);
                loadMessages(c.anon_id);
              }}
              className={`p-3 rounded-lg cursor-pointer ${
                selectedUser?.anon_id === c.anon_id
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{c.name}</span>
                <span
                  className={`h-2 w-2 rounded-full ${
                    onlineUsers.includes(c.anon_id)
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                ></span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="h-14 px-4 flex items-center border-b bg-white shadow-sm">
              <span className="font-semibold">{selectedUser.name}</span>
              <span
                className={`ml-2 text-sm ${
                  onlineUsers.includes(selectedUser.anon_id)
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {onlineUsers.includes(selectedUser.anon_id)
                  ? "Online"
                  : "Offline"}
              </span>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-3"
            >
              {messages.map((m, i) => {
                const isMe = m.sender_id === userId;
                return (
                  <div
                    key={i}
                    className={`flex ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl max-w-[70%] shadow ${
                        isMe
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none"
                          : "bg-gray-300 text-black rounded-bl-none"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-3 border-t bg-white flex items-center gap-2">
              <input
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 rounded-lg border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
