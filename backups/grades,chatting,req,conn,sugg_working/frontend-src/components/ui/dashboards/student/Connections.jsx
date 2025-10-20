import React, { useEffect, useState } from "react";
import axios from "axios";

const Connections = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    if (!currentUser?.id) return;
    axios
      .get("http://localhost:5000/api/users/")
      .then((res) => {
        // filter self out
        setUsers(res.data.filter((u) => u.id !== currentUser.id));
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, [currentUser]);

  // ✅ Check status of follow between two users
  const checkStatus = async (userId) => {
    const res = await axios.get(
      `http://localhost:5000/api/users/status/${currentUser.id}/${userId}`
    );
    return res.data.status;
  };

  // ✅ Send follow request
  const sendFollow = async (toId) => {
    await axios.post("http://localhost:5000/api/users/follow", {
      from_id: currentUser.id,
      to_id: toId,
    });
    alert("Follow request sent!");
  };

  // ✅ Accept follow request
  const acceptFollow = async (fromId) => {
    await axios.post("http://localhost:5000/api/users/accept", {
      from_id: fromId,
      to_id: currentUser.id,
    });
    alert("Follow request accepted!");
  };

  // ✅ Open chat
  const openChat = async (user) => {
    setSelectedChat(user);
    const res = await axios.get(
      `http://localhost:5000/api/chat/history/${currentUser.id}/${user.id}`
    );
    setMessages(res.data);
  };

  // ✅ Send message
  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    await axios.post("http://localhost:5000/api/chat/send", {
      from_id: currentUser.id,
      to_id: selectedChat.id,
      message: newMsg,
    });
    setNewMsg("");
    openChat(selectedChat);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar Users */}
      <div className="w-1/3 border-r border-gray-300 p-4">
        <h2 className="text-lg font-bold mb-3">Users</h2>
        {users.map((u) => (
          <div key={u.id} className="mb-3 p-2 border rounded">
            <div className="font-semibold">
              {u.name} ({u.role})
            </div>
            <div className="mt-2 flex gap-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={async () => {
                  const status = await checkStatus(u.id);
                  if (status === "none") sendFollow(u.id);
                  else if (
                    status === "pending" &&
                    u.id !== currentUser.id
                  )
                    acceptFollow(u.id);
                  else if (status === "accepted") openChat(u);
                }}
              >
                {/* Dynamic Button */}
                {(() => {
                  // 👇 decide button label
                  const [label, setLabel] = useState("Follow");
                  useEffect(() => {
                    (async () => {
                      const status = await checkStatus(u.id);
                      if (status === "none") setLabel("Follow");
                      else if (status === "pending") setLabel("Requested");
                      else if (status === "accepted") setLabel("Chat");
                    })();
                  }, []);
                  return label;
                })()}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b bg-gray-100 font-bold">
              Chat with {selectedChat.name}
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-white">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-2 ${
                    msg.from_id === currentUser.id
                      ? "text-right"
                      : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block px-3 py-2 rounded-lg ${
                      msg.from_id === currentUser.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {msg.message}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-3 border-t flex">
              <input
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded p-2 mr-2"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a user to start
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
