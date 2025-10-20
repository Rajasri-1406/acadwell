// src/components/ui/dashboards/teacher/TeacherStudentGroups.jsx
import React, { useEffect, useState } from "react";
import { chatAPI } from "../../../../services/api";
import ChatWindow from "../../chat/ChatWindow";
import '../../../css/dashboards/teacher/TeacherDashboard.css';
const TeacherStudentGroups = () => {
  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    fetchPending();
    fetchConnections();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await chatAPI.getPending();
      if (res.data.success) setRequests(res.data.requests);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const fetchConnections = async () => {
    try {
      const res = await chatAPI.getConnections();
      if (res.data.success) setConnections(res.data.connections);
    } catch (err) {
      console.error("Error fetching connections:", err);
    }
  };

  const handleAccept = async (followerId) => {
    try {
      const res = await chatAPI.acceptFollow(followerId);
      alert(res.data.message);
      fetchPending();
      fetchConnections();
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]"> 
      {/* Left Sidebar */}
      <div className="w-80 p-6 border-r border-white/10 bg-black/30">
        <h2 className="text-xl font-bold mb-4">Pending Requests</h2>
        <ul className="space-y-2">
          {requests.map((r) => (
            <li
              key={r.anon_id}
              className="flex justify-between items-center p-3 border rounded-lg"
            >
              <span className="text-white">{r.name}</span>
              <button
                onClick={() => handleAccept(r.anon_id)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Accept
              </button>
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-bold mt-6 mb-4">My Connections</h2>
        <ul className="space-y-2">
          {connections.map((c) => (
            <li
              key={c.anon_id}
              onClick={() => setActiveChat(c)}
              className="p-3 border rounded-lg bg-blue-50 cursor-pointer hover:bg-blue-100 text-black"
            >
              {c.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Chat Window */}
      <div className="dashboard-card col-span-1 lg:col-span-2 h-full">
  <ChatWindow partner={activeChat} />
</div>

    </div>
  );
};

export default TeacherStudentGroups;
