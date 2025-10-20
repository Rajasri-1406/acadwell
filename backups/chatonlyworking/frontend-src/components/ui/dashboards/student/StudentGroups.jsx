// frontend/src/components/ui/dashboards/student/StudentGroups.jsx
import React, { useEffect, useState } from "react";
import { chatAPI } from "../../../../services/api";
import ChatWindow from "../../chat/ChatWindow";

const StudentGroups = () => {
  const [teachers, setTeachers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeChat, setActiveChat] = useState(null); // ✅ selected partner

  useEffect(() => {
    fetchTeachers();
    fetchConnections();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await chatAPI.getUsers();
      if (res.data.success) {
        setTeachers(res.data.users);
      }
    } catch (err) {
      console.error("Error fetching teachers:", err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSendRequest = async (teacherId) => {
    try {
      const res = await chatAPI.sendFollow(teacherId);
      alert(res.data.message);
    } catch (err) {
      console.error("Error sending request:", err);
    }
  };

  return (
    <div className="p-6 grid grid-cols-2 gap-6">
      {/* Left: Connections + Teachers */}
      <div>
        <h2 className="text-xl font-bold mb-4">Available Teachers</h2>
        {loading && <p>Loading...</p>}
        <ul className="space-y-2">
          {teachers.map((t) => (
            <li
              key={t.anon_id}
              className="flex justify-between items-center p-3 border rounded-lg"
            >
              <span>{t.name}</span>
              <button
                onClick={() => handleSendRequest(t.anon_id)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Send Request
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
              className="p-3 border rounded-lg bg-green-50 cursor-pointer hover:bg-green-100"
            >
              {c.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Right: Chat Window */}
      <div>
        <ChatWindow partner={activeChat} />
      </div>
    </div>
  );
};

export default StudentGroups;
