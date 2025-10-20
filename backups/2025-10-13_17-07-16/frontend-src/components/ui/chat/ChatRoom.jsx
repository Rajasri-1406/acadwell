import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { chatAPI } from "../../../services/api";
import { SendHorizonal, Users } from "lucide-react";

const SOCKET_URL = "http://localhost:5000";

const ChatRoom = ({ userType = "Teacher" }) => {
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

  // ✅ Load messages
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
    <div className="flex h-[85vh] bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 rounded-xl border border-white/10 overflow-hidden shadow-lg">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-white/10 bg-black/30 backdrop-blur-md p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Users size={18} /> {userType} Chats
          </h2>
          <span className="text-xs text-gray-400">{connections.length} users</span>
        </div>
        <ul className="space-y-2">
          {connections.map((c) => (
            <li
              key={c.anon_id}
              onClick={() => {
                setSelectedUser(c);
                loadMessages(c.anon_id);
              }}
              className={`p-3 rounded-lg cursor-pointer transition ${
                selectedUser?.anon_id === c.anon_id
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                  : "bg-white/5 hover:bg-white/10 text-gray-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {c.name || `Anonymous (${c.anon_id})`}
                </span>
                <span
                  className={`h-2 w-2 rounded-full ${
                    onlineUsers.includes(c.anon_id)
                      ? "bg-green-400"
                      : "bg-gray-500"
                  }`}
                ></span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-black/20 backdrop-blur-md">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="h-14 px-4 flex items-center justify-between border-b border-white/10 bg-black/30">
              <div>
                <div className="text-xs text-gray-400">Chatting with</div>
                <div className="font-semibold text-white">
                  {selectedUser.name || `Anonymous (${selectedUser.anon_id})`}
                </div>
              </div>
              <div
                className={`text-xs ${
                  onlineUsers.includes(selectedUser.anon_id)
                    ? "text-green-400"
                    : "text-gray-500"
                }`}
              >
                {onlineUsers.includes(selectedUser.anon_id)
                  ? "Online"
                  : "Offline"}
              </div>
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
                    className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fadeIn`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl max-w-[70%] shadow text-sm break-words ${
                        isMe
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-none"
                          : "bg-white/10 text-gray-100 rounded-bl-none"
                      }`}
                    >
                      {m.text}
                      <div className="text-[10px] text-gray-400 mt-1 text-right">
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

            {/* Input */}
            <div className="p-3 border-t border-white/10 bg-black/30 flex items-center gap-2">
              <input
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your anonymous message..."
                className="flex-1 px-4 py-2 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={sendMessage}
                className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-105 transition"
              >
                <SendHorizonal size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-400 text-center p-6">
            Select a connection or community member to start chatting 💬
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
