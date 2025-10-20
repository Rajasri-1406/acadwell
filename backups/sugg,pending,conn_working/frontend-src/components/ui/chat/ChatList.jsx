import React, { useEffect, useState } from "react";
import { chatAPI } from "../../../services/api";
import ChatWindow from "./ChatWindow";

const ChatList = ({ currentUser }) => {
  const [connections, setConnections] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    chatAPI.getConnections().then((res) => {
      if (res.data.success) {
        setConnections(res.data.connections);
      }
    });
  }, []);

  if (selectedUser) {
    return (
      <ChatWindow
        currentUser={currentUser}
        selectedUser={selectedUser}
        onBack={() => setSelectedUser(null)}
      />
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md h-full">
      <h2 className="text-xl font-semibold mb-4">Chats</h2>
      <ul className="space-y-3">
        {connections.map((user) => (
          <li
            key={user.anon_id}
            className="p-3 border rounded-lg cursor-pointer hover:bg-gray-100"
            onClick={() => setSelectedUser(user)}
          >
            {user.name} ({user.role})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;