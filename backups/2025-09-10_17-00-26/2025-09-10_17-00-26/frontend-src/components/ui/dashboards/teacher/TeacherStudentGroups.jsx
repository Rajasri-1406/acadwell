import React, { useState, useEffect } from "react";
import { groupsAPI } from "../../../../services/api";
import { Send, Users, UserCircle, ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const TeacherGroups = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [message, setMessage] = useState("");
  const [newGroup, setNewGroup] = useState({
    name: "",
    subject: "",
    description: "",
  });

  // ✅ Fetch all groups created by teacher
  useEffect(() => {
    fetchGroups();
  }, []);

  // ✅ Listen for real-time incoming messages
  useEffect(() => {
    socket.on("group_message", (data) => {
      if (selectedGroup && data.group_id === selectedGroup.id) {
        const updatedMessages = [...(selectedGroup.messages || []), data.message];
        setSelectedGroup({ ...selectedGroup, messages: updatedMessages });
      }
    });

    socket.on("group_created", (data) => {
      setGroups((prev) => [...prev, data.group]);
    });

    return () => {
      socket.off("group_message");
      socket.off("group_created");
    };
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      const res = await groupsAPI.getAll();
      if (res.data.success) {
        setGroups(res.data.groups);
        if (!selectedGroup && res.data.groups.length > 0) {
          setSelectedGroup(res.data.groups[0]);
        }
      }
    } catch (err) {
      console.error("❌ Error fetching teacher groups:", err);
    }
  };

  const handleSend = () => {
    if (message.trim() === "") return;

    const msgData = {
      groupId: selectedGroup.id,
      sender: "Teacher",
      text: message,
    };

    socket.emit("send_message", msgData);
    const updatedMessages = [...(selectedGroup.messages || []), msgData];
    setSelectedGroup({ ...selectedGroup, messages: updatedMessages });
    setMessage("");
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const res = await groupsAPI.create(newGroup);
      if (res.data.success) {
        setGroups((prev) => [...prev, res.data.group]);
        setNewGroup({ name: "", subject: "", description: "" });
        alert("✅ Group created successfully!");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("❌ Error creating group:", err);
      alert(err.response?.data?.message || "Group creation failed");
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white rounded-2xl overflow-hidden shadow-xl">
      {/* LEFT SIDEBAR */}
      <div className="w-1/3 border-r border-white/10 bg-black/30 backdrop-blur-lg p-4 flex flex-col">
        <button
          onClick={() => navigate("/dashboard/teacher")}
          className="mb-4 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition px-3 py-2 rounded-lg shadow-md text-sm font-medium w-fit"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Users size={20} /> My Groups
        </h2>

        {/* Group List */}
        <ul className="space-y-3 overflow-y-auto mb-4">
          {groups.map((group) => (
            <li
              key={group.id}
              onClick={() => setSelectedGroup(group)}
              className={`p-3 rounded-xl cursor-pointer transition ${
                selectedGroup?.id === group.id
                  ? "bg-purple-700/40"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <UserCircle size={36} className="text-purple-300" />
                <div>
                  <h4 className="font-semibold">{group.name}</h4>
                  <p className="text-sm text-gray-300 truncate w-44">
                    {group.description || "No description"}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Create New Group */}
        <form onSubmit={handleCreateGroup} className="bg-white/10 rounded-xl p-4 space-y-3">
          <h3 className="text-md font-semibold flex items-center gap-2">
            <Plus size={18} /> Create New Group
          </h3>
          <input
            type="text"
            placeholder="Group Name"
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
            required
            className="w-full bg-white/10 rounded-lg px-3 py-2 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Subject"
            value={newGroup.subject}
            onChange={(e) => setNewGroup({ ...newGroup, subject: e.target.value })}
            required
            className="w-full bg-white/10 rounded-lg px-3 py-2 focus:outline-none"
          />
          <textarea
            placeholder="Description"
            value={newGroup.description}
            onChange={(e) =>
              setNewGroup({ ...newGroup, description: e.target.value })
            }
            required
            className="w-full bg-white/10 rounded-lg px-3 py-2 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition px-3 py-2 rounded-lg shadow-md text-sm font-medium"
          >
            Create Group
          </button>
        </form>
      </div>

      {/* RIGHT CHAT AREA */}
      <div className="w-2/3 flex flex-col">
        {selectedGroup ? (
          <>
            {/* Group Header */}
            <div className="p-4 bg-black/30 backdrop-blur-lg border-b border-white/10 flex items-center gap-3">
              <UserCircle size={36} className="text-purple-300" />
              <div>
                <h3 className="text-lg font-semibold">{selectedGroup.name}</h3>
                <p className="text-gray-300 text-sm">
                  Subject: {selectedGroup.subject}
                </p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/20">
              {selectedGroup.messages?.length > 0 ? (
                selectedGroup.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`max-w-xs px-4 py-2 rounded-xl text-sm ${
                      msg.sender === "Teacher"
                        ? "bg-purple-600 text-white ml-auto"
                        : "bg-white/10 text-gray-200 mr-auto"
                    }`}
                  >
                    <span className="block font-semibold">{msg.sender}</span>
                    {msg.text}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 mt-10">
                  💬 No messages yet. Start the conversation!
                </p>
              )}
            </div>

            {/* Input Box */}
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
          </>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <p className="text-gray-400">Select a group to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherGroups;
