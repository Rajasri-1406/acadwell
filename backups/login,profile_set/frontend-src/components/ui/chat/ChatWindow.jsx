import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:5000");

const ChatWindow = () => {
  const { teacherId, studentId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const room = [teacherId, studentId].sort().join("-");

  useEffect(() => {
    socket.emit("join_room", { room, sid: socket.id });

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.disconnect();
  }, [room]);

  const sendMessage = () => {
    if (!input) return;
    const sender = JSON.parse(localStorage.getItem("user")).name;
    socket.emit("send_message", { room, message: input, sender });
    setMessages((prev) => [...prev, { sender, message: input }]);
    setInput("");
  };

  return (
    <div>
      <h2>Chat</h2>
      <div style={{ height: 300, overflowY: "scroll", border: "1px solid #ccc", padding: 5 }}>
        {messages.map((m, i) => (
          <div key={i}><b>{m.sender}</b>: {m.message}</div>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type message..." />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatWindow;
