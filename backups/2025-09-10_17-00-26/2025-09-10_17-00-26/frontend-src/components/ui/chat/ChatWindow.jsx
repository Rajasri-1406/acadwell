// src/components/ui/chat/ChatWindow.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebase";

const ChatWindow = () => {
  const { teacherId, studentId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // ✅ Chat Room ID (teacher + student combination)
  const chatRoomId =
    teacherId < studentId
      ? `${teacherId}_${studentId}`
      : `${studentId}_${teacherId}`;

  // ✅ Fetch messages in real-time
  useEffect(() => {
    const messagesRef = collection(db, "chats", chatRoomId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [chatRoomId]);

  // ✅ Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send new message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const messagesRef = collection(db, "chats", chatRoomId, "messages");
    await addDoc(messagesRef, {
      sender: localStorage.getItem("role") || "unknown",
      message: newMessage,
      timestamp: serverTimestamp(),
    });

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 shadow">
        <h2 className="text-lg font-semibold">Chat Room</h2>
        <p className="text-sm">
          Teacher: {teacherId} | Student: {studentId}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`my-2 flex ${
              msg.sender === localStorage.getItem("role")
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                msg.sender === localStorage.getItem("role")
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              <p>{msg.message}</p>
              <span className="block text-xs text-right opacity-70 mt-1">
                {msg.timestamp
                  ? new Date(msg.timestamp.toDate()).toLocaleTimeString()
                  : "..."}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="flex items-center bg-white border-t px-4 py-3"
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring focus:ring-blue-300"
        />
        <button
          type="submit"
          className="ml-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
