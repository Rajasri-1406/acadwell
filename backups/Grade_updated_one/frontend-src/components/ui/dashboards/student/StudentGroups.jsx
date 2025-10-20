import React, { useEffect, useState } from "react";
import { chatAPI } from "../../../../services/api";
import ChatWindow from "../../chat/ChatWindow";

const StudentGroups = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    await fetchSuggestions();
    await fetchPending();
    await fetchConnections();
  };

  // ---------------- SUGGESTIONS ----------------
  const fetchSuggestions = async () => {
    try {
      const res = await chatAPI.getSuggestions();
      if (res.data.success) {
        const updated = res.data.users.map((u) => ({
          anon_id: u.id, // normalize
          name: u.name,
          status: "not_followed",
        }));
        setSuggestions(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollow = async (userId) => {
    setSuggestions((prev) =>
      prev.map((u) =>
        u.anon_id === userId ? { ...u, status: "requested" } : u
      )
    );
    try {
      const res = await chatAPI.sendFollow(userId);
      if (!res.data.success) {
        alert(res.data.message);
        setSuggestions((prev) =>
          prev.map((u) =>
            u.anon_id === userId ? { ...u, status: "not_followed" } : u
          )
        );
      } else {
        fetchPending();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- PENDING ----------------
  const fetchPending = async () => {
    try {
      const res = await chatAPI.getPending();
      if (res.data.success) {
        const normalized = res.data.requests.map((r) => ({
          anon_id: r.id,
          name: r.name,
        }));
        setRequests(normalized);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = async (followerId) => {
    try {
      const res = await chatAPI.acceptFollow(followerId);
      if (res.data.success) fetchAll();
      else alert(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- CONNECTIONS ----------------
  const fetchConnections = async () => {
    try {
      const res = await chatAPI.getConnections();
      if (res.data.success) {
        const normalized = res.data.connections.map((c) => ({
          anon_id: c.id, // normalize so ChatWindow works
          name: c.name,
        }));
        setConnections(normalized);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-80 p-6 border-r border-white/10 bg-black/30 overflow-y-auto">
        {/* Pending */}
        <h2 className="text-xl font-bold mb-4">Pending Requests</h2>
        <ul className="space-y-2">
          {requests.length > 0 ? (
            requests.map((r) => (
              <li
                key={r.anon_id}
                className="flex justify-between items-center p-3 border rounded-lg"
              >
                <span className="text-white">{r.name}</span>
                <button
                  onClick={() => handleAccept(r.anon_id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Follow Back
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-400">No pending requests</p>
          )}
        </ul>

        {/* Connections */}
        <h2 className="text-xl font-bold mt-6 mb-4">My Connections</h2>
        <ul className="space-y-2">
          {connections.length > 0 ? (
            connections.map((c) => (
              <li
                key={c.anon_id}
                onClick={() => setActiveChat(c)}
                className={`p-3 border rounded-lg cursor-pointer ${
                  activeChat?.anon_id === c.anon_id
                    ? "bg-green-600 text-white"
                    : "bg-green-50 hover:bg-green-100 text-black"
                }`}
              >
                {c.name}
              </li>
            ))
          ) : (
            <p className="text-gray-400">No connections yet</p>
          )}
        </ul>

        {/* Suggestions */}
        <h2 className="text-xl font-bold mt-6 mb-4">Suggestions</h2>
        <ul className="space-y-2">
          {suggestions.length > 0 ? (
            suggestions.map((s) => (
              <li
                key={s.anon_id}
                className="flex justify-between items-center p-3 border rounded-lg"
              >
                <span className="text-white">{s.name}</span>
                <button
                  onClick={() => handleFollow(s.anon_id)}
                  disabled={s.status !== "not_followed"}
                  className={`px-3 py-1 rounded ${
                    s.status === "not_followed"
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-500 text-white cursor-not-allowed"
                  }`}
                >
                  {s.status === "not_followed" ? "Follow" : "Requested"}
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-400">No suggestions</p>
          )}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        <ChatWindow partner={activeChat} />
      </div>
    </div>
  );
};

export default StudentGroups;
