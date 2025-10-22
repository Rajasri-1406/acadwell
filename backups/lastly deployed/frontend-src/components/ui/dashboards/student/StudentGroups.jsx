import React, { useEffect, useState } from "react";
import { chatAPI } from "../../../../services/api";
import ChatWindow from "../../chat/ChatWindow";
import "./StudentGroups.css";

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
          anon_id: u.id,
          anonId: u.anonId,
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
          anonId: r.anonId,
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
          anon_id: c.id,
          anonId: c.anonId,
        }));
        setConnections(normalized);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="groups-wrapper flex h-[calc(100vh-4rem)] gap-4">
      {/* ===== Sidebar ===== */}
      <div className="sidebar w-80 p-6 border-r border-white/10 bg-black/30 flex flex-col backdrop-blur-xl rounded-xl shadow-lg overflow-hidden">
        {/* Pending Requests */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Pending Requests</h2>
          <ul className="space-y-2 custom-scrollbar overflow-y-auto max-h-40 pr-2">
            {requests.length > 0 ? (
              requests.map((r) => (
                <li
                  key={r.anon_id}
                  className="flex justify-between items-center p-3 border rounded-lg bg-black/30"
                >
                  <span className="text-white">{r.anonId}</span>
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
        </div>

        {/* Connections */}
        <div className="flex-1 mb-6 overflow-y-auto custom-scrollbar pr-2">
          <h2 className="text-xl font-bold mb-4">My Connections</h2>
          <ul className="space-y-2">
            {connections.length > 0 ? (
              connections.map((c) => (
                <li
                  key={c.anon_id}
                  onClick={() => setActiveChat(c)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                    activeChat?.anon_id === c.anon_id
                      ? "bg-purple-700 text-white"
                      : "bg-black/20 hover:bg-purple-500/30 text-white"
                  }`}
                >
                  {c.anonId}
                </li>
              ))
            ) : (
              <p className="text-gray-400">No connections yet</p>
            )}
          </ul>
        </div>

        {/* Suggestions */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <h2 className="text-xl font-bold mb-4">Suggestions</h2>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <ul className="space-y-2">
              {suggestions.length > 0 ? (
                suggestions.map((s) => (
                  <li
                    key={s.anon_id}
                    className="flex justify-between items-center p-3 border rounded-lg bg-black/30"
                  >
                    <span className="text-white">{s.anonId}</span>
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
        </div>
      </div>

      {/* ===== Chat Window ===== */}
      <div className="chat-section flex-1 bg-black/30 rounded-xl border border-white/10 shadow-lg p-4 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <ChatWindow partner={activeChat} />
        </div>
      </div>
    </div>
  );
};

export default StudentGroups;
