// src/components/ui/chat/ChatRoom.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // 🔴 change if backend runs elsewhere

const ChatRoom = ({ userId }) => {
  const [users, setUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  // ✅ 1. Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE}/users/`);
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  // ✅ 2. Fetch connections for logged-in user
  useEffect(() => {
    if (!userId) return;
    const fetchConnections = async () => {
      try {
        const res = await axios.get(`${API_BASE}/users/connections/${userId}`);
        setConnections(res.data);
      } catch (err) {
        console.error("Error fetching connections:", err);
      }
    };
    fetchConnections();
  }, [userId]);

  // ✅ 3. Fetch chat history with selected user
  const fetchMessages = async (otherId) => {
    try {
      const res = await axios.get(`${API_BASE}/chat/history/${userId}/${otherId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // ✅ Send follow request
  const sendFollow = async (toId) => {
    try {
      await axios.post(`${API_BASE}/users/follow`, {
        from_id: userId,
        to_id: toId,
      });
      alert("Follow request sent!");
    } catch (err) {
      console.error("Error sending follow:", err);
    }
  };

  // ✅ Accept follow request
  const acceptFollow = async (fromId) => {
    try {
      await axios.post(`${API_BASE}/users/accept`, {
        from_id: fromId,
        to_id: userId,
      });
      alert("Follow request accepted!");
    } catch (err) {
      console.error("Error accepting follow:", err);
    }
  };

  // ✅ Send message
  const sendMessage = async () => {
    if (!newMsg.trim() || !selectedChat) return;
    try {
      await axios.post(`${API_BASE}/chat/send`, {
        from_id: userId,
        to_id: selectedChat.id,
        message: newMsg,
      });
      setNewMsg("");
      fetchMessages(selectedChat.id);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="chatroom-wrapper" style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {/* Sidebar with users */}
      <div className="user-list" style={{ width: "30%", borderRight: "1px solid #ddd", padding: "10px" }}>
        <h3>Users</h3>
        {users
          .filter((u) => u.id !== userId) // remove self
          .map((u) => {
            const isConnected = connections.some((c) => c.id === u.id);
            return (
              <div
                key={u.id}
                style={{
                  padding: "10px",
                  marginBottom: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              >
                <strong>
                  {isConnected
                    ? u.role === "student"
                      ? "Anonymous Student"
                      : "Anonymous Teacher"
                    : u.name}
                </strong>
                <br />
                <small>{u.role}</small>
                <div style={{ marginTop: "5px" }}>
                  {isConnected ? (
                    <button
                      onClick={() => {
                        setSelectedChat(u);
                        fetchMessages(u.id);
                      }}
                      style={{ padding: "5px 10px" }}
                    >
                      Chat
                    </button>
                  ) : (
                    <button
                      onClick={() => sendFollow(u.id)}
                      style={{ padding: "5px 10px" }}
                    >
                      Follow
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Chat window */}
      <div className="chat-window" style={{ flex: 1, padding: "10px" }}>
        {selectedChat ? (
          <>
            <h3>
              Chat with{" "}
              {selectedChat.role === "student" ? "Anonymous Student" : "Anonymous Teacher"}
            </h3>
            <div
              className="messages"
              style={{
                height: "300px",
                overflowY: "auto",
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              {messages.map((msg) => (
                <div key={msg._id} style={{ marginBottom: "8px" }}>
                  <strong>{msg.from_id === userId ? "You" : "Them"}:</strong>{" "}
                  {msg.message}
                </div>
              ))}
            </div>
            <div>
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Type a message..."
                style={{ width: "80%", padding: "8px" }}
              />
              <button onClick={sendMessage} style={{ padding: "8px 15px" }}>
                Send
              </button>
            </div>
          </>
        ) : (
          <h4>Select a user to start chatting</h4>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
