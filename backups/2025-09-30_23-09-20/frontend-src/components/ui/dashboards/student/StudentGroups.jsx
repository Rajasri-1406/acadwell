// frontend/src/components/ui/dashboards/student/StudentGroups.jsx
import React, { useEffect, useState } from "react";
import { chatAPI } from "../../../../services/api";
import ChatWindow from "../../chat/ChatWindow";

const StudentGroups = () => {
  const [teachers, setTeachers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    fetchTeachers();
    fetchConnections();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await chatAPI.getUsers(); // should return teachers
      if (res.data.success) {
        setTeachers(res.data.users);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchConnections = async () => {
    try {
      const res = await chatAPI.getConnections();
      if (res.data.success) {
        setConnections(res.data.connections);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendRequest = async (teacherId) => {
    try {
      const res = await chatAPI.sendFollow(teacherId);
      alert(res.data.message);
      fetchConnections();
      fetchTeachers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 grid grid-cols-2 gap-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Available Teachers</h2>
        <ul className="space-y-2">
          {teachers.map((t) => (
            <li
              key={t.id}
              className="flex justify-between items-center p-3 border rounded-lg"
            >
              <span>{t.name}</span>
              <button
                onClick={() => handleSendRequest(t.id)}
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
              key={c.id}
              onClick={() => setActiveChat(c)}
              className="p-3 border rounded-lg bg-green-50 cursor-pointer hover:bg-green-100"
            >
              {c.name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <ChatWindow partner={activeChat} />
      </div>
    </div>
  );
};

export default StudentGroups;
