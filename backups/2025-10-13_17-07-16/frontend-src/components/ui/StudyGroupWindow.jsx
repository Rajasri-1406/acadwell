import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import "../css/StudyGroupWindow.css";

const StudyGroupWindow = ({
  groupId,
  groupName,
  currentUser,
  removeGroupFromMyGroups,
  onBack, // ✅ added onBack prop for back navigation
}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [groupInfo, setGroupInfo] = useState(null);
  const messageEndRef = useRef(null);

  const API_BASE = "http://localhost:5000/api/groups";

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/${groupId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data.messages || []);
      setLoading(false);
      scrollToBottom();
    } catch (err) {
      console.error("Fetch messages error:", err);
    }
  };

  const fetchGroupInfo = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroupInfo(res.data.group);
    } catch (err) {
      console.error("Fetch group info error:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchGroupInfo();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [groupId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        `${API_BASE}/${groupId}/messages`,
        { message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage("");
      fetchMessages();
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const leaveGroup = async () => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(`${API_BASE}/${groupId}/leave`, {}, { headers: { Authorization: `Bearer ${token}` } });

      if (groupInfo && currentUser) {
        setGroupInfo({
          ...groupInfo,
          membersAnonIds: groupInfo.membersAnonIds.filter((id) => id !== currentUser.anonId),
        });
      }

      setShowGroupInfo(false);
      if (removeGroupFromMyGroups) removeGroupFromMyGroups(groupId);
    } catch (err) {
      console.error("Leave group error:", err);
    }
  };

  return (
    <div className="study-group-page">
     {/* ✅ Back Button Section */}
{/* Sticky Header */}
      <div className="sticky top-0 z-20 w-full bg-slate-800 border-b border-white/10 shadow-md flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition shadow-sm"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <h2
            className="group-name text-xl font-semibold cursor-pointer hover:text-purple-300 transition flex items-center gap-2"
            onClick={() => setShowGroupInfo(true)}
          >
            💬 {groupName || "Group Chat"}
          </h2>
        </div>
      </div>

      {/* Chat Container */}
      <div className="chat-container">
        <div className="chat-messages custom-scroll">
          {loading ? (
            <p className="info-text">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="info-text">No messages yet</p>
          ) : (
            messages.map((msg) => {
              if (msg.system) {
                return (
                  <div
                    key={msg._id}
                    className="system-notification"
                    style={{
                      textAlign: "center",
                      color: "#d1d5db",
                      fontSize: "0.85rem",
                      margin: "8px 0",
                      fontStyle: "italic",
                    }}
                  >
                    {msg.message}
                  </div>
                );
              }

              const isMe = msg.anonId === currentUser?.anonId;
              const senderName = isMe ? "You" : msg.anonId || "Anonymous";

              return (
                <div
                  key={msg._id}
                  className={`message-bubble ${isMe ? "sent" : "received"}`}
                  style={{
                    alignSelf: isMe ? "flex-end" : "flex-start",
                    backgroundColor: isMe ? "#4f46e5" : "#1f2937",
                    color: "white",
                    borderRadius: "16px",
                    padding: "8px 12px",
                    marginBottom: "8px",
                    maxWidth: "70%",
                    wordBreak: "break-word",
                  }}
                >
                  <div
                    className="message-meta"
                    style={{
                      fontSize: "0.75rem",
                      marginBottom: "4px",
                      textAlign: isMe ? "right" : "left",
                      opacity: 0.8,
                    }}
                  >
                    {senderName}
                  </div>
                  <div className="message-text">{msg.message}</div>
                </div>
              );
            })
          )}
          <div ref={messageEndRef} />
        </div>

        {/* Chat Input */}
        <div className="chat-input-section">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="chat-input"
            rows={1}
          />
          <button onClick={sendMessage} className="send-btn">
            Send
          </button>
        </div>
      </div>

      {/* Group Info Modal */}
      {showGroupInfo && groupInfo && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
          onClick={() => setShowGroupInfo(false)}
        >
          <div
            className="bg-slate-900 rounded-2xl p-6 w-full max-w-md relative shadow-2xl border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowGroupInfo(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white font-bold"
            >
              ✖
            </button>

            <div className="flex justify-center mb-4">
              {groupInfo.profilePic ? (
                <img
                  src={groupInfo.profilePic}
                  alt="Group"
                  className="rounded-full w-24 h-24 object-cover border-2 border-purple-600"
                />
              ) : (
                <button
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                  onClick={() => alert("Add group picture")}
                >
                  Add Picture
                </button>
              )}
            </div>

            <h2 className="text-2xl font-semibold text-center mb-2">
              {groupInfo.name}
            </h2>
            <p className="text-gray-300 text-center mb-4">
              {groupInfo.description || "No description available"}
            </p>

            <h3 className="text-lg font-semibold mb-2">Members:</h3>
            <ul className="list-disc list-inside text-gray-200 max-h-48 overflow-y-auto">
              {groupInfo.membersAnonIds &&
                groupInfo.membersAnonIds.map((anonId, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center mb-1"
                  >
                    {anonId || "Anonymous"}
                    {anonId === currentUser?.anonId && (
                      <button
                        className="ml-2 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-sm"
                        onClick={leaveGroup}
                      >
                        Leave
                      </button>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyGroupWindow;
