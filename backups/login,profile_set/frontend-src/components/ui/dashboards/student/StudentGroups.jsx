// src/components/ui/dashboards/student/StudentGroups.jsx
import React, { useState } from "react";
import { Send, Users, UserCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentGroups = () => {
  const navigate = useNavigate();

  // Dummy static data (replace with API later)
  const groups = [
    {
      id: 1,
      name: "AI & ML Enthusiasts",
      members: ["Rahul", "Priya", "Alex", "Me"],
      messages: [
        { sender: "Rahul", text: "Hey! Did anyone finish the CNN assignment?" },
        { sender: "Me", text: "Yes! I’ll share my notes after class 😄" },
        { sender: "Priya", text: "I’m stuck on backpropagation 😅" },
      ],
    },
    {
      id: 2,
      name: "Web Dev Wizards",
      members: ["Neha", "Me", "Karan", "Riya"],
      messages: [
        { sender: "Neha", text: "React Router is confusing at first 😓" },
        { sender: "Me", text: "I can explain routes & protected routes 😎" },
      ],
    },
    {
      id: 3,
      name: "Data Science Gang",
      members: ["Arjun", "Sneha", "Me", "Prakash"],
      messages: [],
    },
  ];

  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() === "") return;

    const updatedMessages = [
      ...selectedGroup.messages,
      { sender: "Me", text: message },
    ];
    const updatedGroup = { ...selectedGroup, messages: updatedMessages };

    // Update state with new messages
    const updatedGroups = groups.map((g) =>
      g.id === selectedGroup.id ? updatedGroup : g
    );
    setSelectedGroup(updatedGroup);
    setMessage("");
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white rounded-2xl overflow-hidden shadow-xl">
      {/* LEFT SIDEBAR */}
      <div className="w-1/3 border-r border-white/10 bg-black/30 backdrop-blur-lg p-4 flex flex-col">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard/student")}
          className="mb-4 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition px-3 py-2 rounded-lg shadow-md text-sm font-medium w-fit"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        {/* Sidebar Title */}
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Users size={20} /> Study Groups
        </h2>

        {/* Groups List */}
        <ul className="space-y-3 overflow-y-auto">
          {groups.map((group) => (
            <li
              key={group.id}
              onClick={() => setSelectedGroup(group)}
              className={`p-3 rounded-xl cursor-pointer transition ${
                selectedGroup.id === group.id
                  ? "bg-purple-700/40"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <UserCircle size={36} className="text-purple-300" />
                <div>
                  <h4 className="font-semibold">{group.name}</h4>
                  <p className="text-sm text-gray-300 truncate w-44">
                    {group.messages.length > 0
                      ? group.messages[group.messages.length - 1].text.slice(0, 30) +
                        "..."
                      : "No messages yet"}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT CHAT AREA */}
      <div className="w-2/3 flex flex-col">
        {/* HEADER */}
        <div className="p-4 bg-black/30 backdrop-blur-lg border-b border-white/10 flex items-center gap-3">
          <UserCircle size={36} className="text-purple-300" />
          <div>
            <h3 className="text-lg font-semibold">{selectedGroup.name}</h3>
            <p className="text-gray-300 text-sm">
              Members: {selectedGroup.members.join(", ")}
            </p>
          </div>
        </div>

        {/* CHAT MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/20">
          {selectedGroup.messages.length === 0 ? (
            <p className="text-center text-gray-400 mt-10">
              💬 No messages yet. Start the conversation!
            </p>
          ) : (
            selectedGroup.messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-xs px-4 py-2 rounded-xl text-sm ${
                  msg.sender === "Me"
                    ? "bg-purple-600 text-white ml-auto"
                    : "bg-white/10 text-gray-200 mr-auto"
                }`}
              >
                <span className="block font-semibold">{msg.sender}</span>
                {msg.text}
              </div>
            ))
          )}
        </div>

        {/* INPUT BOX */}
        <div className="p-4 bg-black/30 backdrop-blur-lg border-t border-white/10 flex items-center gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSend}
            className="bg-purple-600 hover:bg-purple-700 rounded-xl px-4 py-2 flex items-center gap-2 transition text-sm font-medium"
          >
            <Send size={18} /> Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentGroups;
