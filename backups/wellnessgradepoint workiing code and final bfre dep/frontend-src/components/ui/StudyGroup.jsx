import React, { useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle, Users, Lock, Globe, MessageCircle, X } from "lucide-react";
import StudyGroupWindow from "./StudyGroupWindow";

const API_BASE = "http://localhost:5000/api/groups";

const StudyGroup = () => {
  const [view, setView] = useState("mine"); // mine | suggestions
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);

  // Create group form
  const [newGroup, setNewGroup] = useState({ name: "", description: "", isPrivate: false });

  // ---------------- LOAD USER PROFILE ----------------
  useEffect(() => {
    const tkn = sessionStorage.getItem("token");
    if (!tkn) return;
    setToken(tkn);

    axios
      .get("http://localhost:5000/api/auth/profile", { headers: { Authorization: `Bearer ${tkn}` } })
      .then((res) => setCurrentUser(res.data.user))
      .catch((err) => console.error("Profile fetch failed:", err));
  }, []);

  // ---------------- FETCH GROUPS ----------------
  const fetchGroups = async (type) => {
    if (!token) return;
    try {
      let url = `${API_BASE}/my`;
      if (type === "suggestions") url = `${API_BASE}/suggestions`;
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setGroups(res.data.groups || []);
    } catch (err) {
      console.error("Fetch groups error:", err);
    }
  };

  useEffect(() => {
    if (token) fetchGroups(view);
  }, [token, view]);

  // ---------------- CREATE GROUP ----------------
  const createGroup = async () => {
    if (!newGroup.name.trim()) return alert("Please enter group name");
    try {
      await axios.post(`${API_BASE}/create`, newGroup, { headers: { Authorization: `Bearer ${token}` } });
      setShowCreateModal(false);
      setNewGroup({ name: "", description: "", isPrivate: false });
      fetchGroups("mine");
      setView("mine");
    } catch (err) {
      console.error("Create group error:", err);
      alert("Failed to create group");
    }
  };

  // ---------------- JOIN GROUP ----------------
  const joinGroup = async (groupId) => {
    try {
      await axios.post(`${API_BASE}/${groupId}/join`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setShowJoinModal(false);
      fetchGroups("mine");
      setView("mine");
    } catch (err) {
      console.error("Join group error:", err);
      alert("Failed to join group");
    }
  };

  // ---------------- RENDER GROUP CHAT ----------------
  if (selectedGroup)
    return (
      <StudyGroupWindow
        groupId={selectedGroup._id}
        groupName={selectedGroup.name}
        currentUser={currentUser}
        onBack={() => setSelectedGroup(null)}
      />
    );

  // ---------------- MAIN RENDER ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users /> Anonymous Study Groups
          </h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            <PlusCircle size={18} /> Add Group
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {["mine", "suggestions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`px-4 py-2 rounded-xl text-sm transition ${
                view === tab ? "bg-purple-600" : "bg-white/10 hover:bg-purple-700/30"
              }`}
            >
              {tab === "mine" && "📚 My Groups"}
              {tab === "suggestions" && "🌐 Suggestions"}
            </button>
          ))}
        </div>

        {/* My Groups */}
        {view === "mine" && (
          <div>
            {groups.length === 0 ? (
              <p className="text-gray-400">You haven’t joined or created any groups yet.</p>
            ) : (
              groups.map((grp) => (
                <div
                  key={grp._id}
                  onClick={() => setSelectedGroup(grp)}
                  className="bg-slate-800 p-4 rounded-xl mb-3 flex justify-between items-center cursor-pointer hover:bg-slate-700 transition border border-white/10"
                >
                  <div>
                    <p className="font-medium">{grp.name}</p>
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                      {grp.isPrivate ? <Lock size={14} /> : <Globe size={14} />}{" "}
                      {grp.isPrivate ? "Private" : "Public"} group
                    </p>
                  </div>
                  <MessageCircle size={18} />
                </div>
              ))
            )}
          </div>
        )}

        {/* Suggested Groups */}
        {view === "suggestions" && (
          <div>
            {groups.length === 0 ? (
              <p className="text-gray-400">No suggested groups available</p>
            ) : (
              groups.map((grp) => (
                <div
                  key={grp._id}
                  onClick={() => {
                    setActiveGroup(grp);
                    setShowJoinModal(true);
                  }}
                  className="bg-slate-800 p-4 rounded-xl mb-3 flex items-center gap-4 border border-white/10 cursor-pointer hover:bg-slate-700 transition"
                >
                  <span className="text-2xl">{grp.isPrivate ? "🔒" : "🌐"}</span>
                  <div>
                    <p className="font-medium">{grp.name}</p>
                    <p className="text-gray-400 text-sm">
                      {grp.description || "No description available"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* CREATE GROUP MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-slate-800 p-6 rounded-2xl w-full max-w-md relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">➕ Create New Group</h2>

            <input
              type="text"
              placeholder="Group Name"
              value={newGroup.name}
              onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              className="w-full bg-slate-700 p-3 rounded-lg mb-3"
            />

            <textarea
              placeholder="Description"
              value={newGroup.description}
              onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
              className="w-full bg-slate-700 p-3 rounded-lg mb-3 h-24 resize-none"
            />

            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                checked={newGroup.isPrivate}
                onChange={(e) => setNewGroup({ ...newGroup, isPrivate: e.target.checked })}
              />
              <label>Make group private</label>
            </div>

            <button
              onClick={createGroup}
              className="w-full bg-indigo-600 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Create Group
            </button>
          </div>
        </div>
      )}

      {/* JOIN GROUP MODAL */}
      {showJoinModal && activeGroup && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-slate-800 p-6 rounded-2xl w-full max-w-md relative text-center">
            <button
              onClick={() => setShowJoinModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <div className="text-5xl mb-3">{activeGroup.isPrivate ? "🔒" : "🌐"}</div>
            <h2 className="text-xl font-semibold mb-2">{activeGroup.name}</h2>
            <p className="text-gray-300 mb-4">{activeGroup.description || "No description available"}</p>
            <button
              onClick={() => joinGroup(activeGroup._id)}
              className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Join Group
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyGroup;
