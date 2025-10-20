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

  const fetchSuggestions = async () => {
    try {
      const res = await chatAPI.getSuggestions();
      if (res.data.success) {
        const updated = res.data.users.map((u) => ({
          ...u,
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
        u.id === userId ? { ...u, status: "requested" } : u
      )
    );
    try {
      const res = await chatAPI.sendFollow(userId);
      if (!res.data.success) {
        alert(res.data.message);
        setSuggestions((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, status: "not_followed" } : u
          )
        );
      } else {
        fetchPending();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPending = async () => {
    try {
      const res = await chatAPI.getPending();
      if (res.data.success) setRequests(res.data.requests);
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

  const fetchConnections = async () => {
    try {
      const res = await chatAPI.getConnections();
      if (res.data.success) setConnections(res.data.connections);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-80 p-6 border-r border-white/10 bg-black/30 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Pending Requests</h2>
        <ul className="space-y-2">
          {requests.length > 0 ? (
            requests.map((r) => (
              <li
                key={r.id}
                className="flex justify-between items-center p-3 border rounded-lg"
              >
                <span className="text-white">{r.name}</span>
                <button
                  onClick={() => handleAccept(r.id)}
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

        <h2 className="text-xl font-bold mt-6 mb-4">My Connections</h2>
        <ul className="space-y-2">
          {connections.length > 0 ? (
            connections.map((c) => (
              <li
                key={c.id}
                onClick={() => setActiveChat(c)}
                className="p-3 border rounded-lg bg-green-50 cursor-pointer hover:bg-green-100 text-black"
              >
                {c.name}
              </li>
            ))
          ) : (
            <p className="text-gray-400">No connections yet</p>
          )}
        </ul>

        <h2 className="text-xl font-bold mt-6 mb-4">Suggestions</h2>
        <ul className="space-y-2">
          {suggestions.length > 0 ? (
            suggestions.map((s) => (
              <li
                key={s.id}
                className="flex justify-between items-center p-3 border rounded-lg"
              >
                <span className="text-white">{s.name}</span>
                <button
                  onClick={() => handleFollow(s.id)}
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

      <div className="flex-1">
        <ChatWindow partner={activeChat} />
      </div>
    </div>
  );
};

export default StudentGroups;
