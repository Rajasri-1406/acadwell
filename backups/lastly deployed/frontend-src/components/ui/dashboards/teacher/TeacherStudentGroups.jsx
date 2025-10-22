// src/components/ui/teacher/TeacherStudentGroups.jsx
import React, { useEffect, useState } from "react";
import { chatAPI } from "../../../../services/api";
import ChatWindow from "../../chat/ChatWindow";
import "../../../css/dashboards/teacher/TeacherStudentGroups.css";

const TeacherStudentGroups = () => {
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

  // ---------- Suggestions ----------
  const fetchSuggestions = async () => {
    try {
      const res = await chatAPI.getSuggestions();
      if (res.data.success) {
        const normalized = res.data.users.map((u) => ({
          anon_id: u.id,
          name: u.name || u.anonId || u.id,
          status: "not_followed",
        }));
        setSuggestions(normalized);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollow = async (anonId) => {
    setSuggestions((prev) =>
      prev.map((u) =>
        u.anon_id === anonId ? { ...u, status: "requested" } : u
      )
    );
    try {
      const res = await chatAPI.sendFollow(anonId);
      if (!res.data.success) {
        alert(res.data.message);
        setSuggestions((prev) =>
          prev.map((u) =>
            u.anon_id === anonId ? { ...u, status: "not_followed" } : u
          )
        );
      } else {
        fetchPending();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ---------- Pending ----------
  const fetchPending = async () => {
    try {
      const res = await chatAPI.getPending();
      if (res.data.success) {
        const normalized = res.data.requests.map((r) => ({
          anon_id: r.id,
          name: r.name || r.anonId || r.id,
        }));
        setRequests(normalized);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = async (anonId) => {
    try {
      const res = await chatAPI.acceptFollow(anonId);
      if (res.data.success) fetchAll();
      else alert(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------- Connections ----------
  const fetchConnections = async () => {
    try {
      const res = await chatAPI.getConnections();
      if (res.data.success) {
        const normalized = res.data.connections.map((c) => ({
          anon_id: c.id,
          name: c.name || c.anonId || c.id,
        }));
        setConnections(normalized);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="groups-wrapper flex">
      {/* Sidebar */}
      <div className="sidebar w-80 flex flex-col border-r border-white/10 bg-black/40 rounded-xl p-4">
        {/* Pending Requests */}
        <div className="section-wrapper">
          <h2 className="section-title">Pending Requests</h2>
          <div className="section-scroll custom-scrollbar">
            {requests.length > 0 ? (
              requests.map((r) => (
                <div
                  key={r.anon_id}
                  className="flex justify-between items-center p-3 border rounded-lg mb-2"
                >
                  <span className="text-white">{r.name}</span>
                  <button
                    onClick={() => handleAccept(r.anon_id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Follow Back
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No pending requests</p>
            )}
          </div>
        </div>

        {/* Connections */}
        <div className="section-wrapper">
          <h2 className="section-title">My Connections</h2>
          <div className="section-scroll custom-scrollbar">
            {connections.length > 0 ? (
              connections.map((c) => (
                <div
                  key={c.anon_id}
                  onClick={() => setActiveChat(c)}
                  className={`group-card ${
                    activeChat?.anon_id === c.anon_id
                      ? "bg-green-600 text-white"
                      : "hover:bg-green-100 text-white"
                  }`}
                >
                  {c.name}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No connections yet</p>
            )}
          </div>
        </div>

        {/* Suggestions */}
        <div className="section-wrapper">
          <h2 className="section-title">Suggestions</h2>
          <div className="section-scroll custom-scrollbar">
            {suggestions.length > 0 ? (
              suggestions.map((s) => (
                <div
                  key={s.anon_id}
                  className="flex justify-between items-center p-3 border rounded-lg mb-2"
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
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No suggestions</p>
            )}
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="chat-section flex-1 flex flex-col bg-black/20 rounded-xl ml-4 p-4">
        {activeChat ? (
          <ChatWindow partner={activeChat} />
        ) : (
          <div className="text-center text-gray-400 flex items-center justify-center h-full">
            Select a connection to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherStudentGroups;
