import React, { useState, useEffect } from "react";
import api, { groupsAPI } from "../../../../services/api";
 // ✅ We'll integrate backend API later

const TeacherStudentGroups = () => {
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState({
    name: "",
    subject: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Fetch existing groups from backend
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.get("/groups", token);

      if (res.status === 200 && res.data.success) {
        setGroups(res.data.groups || []);
      } else {
        setError(res.data.message || "Failed to fetch groups");
      }
    } catch (err) {
      setError("Server error while fetching groups");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create a new group
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newGroup.name || !newGroup.subject || !newGroup.description) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.post("/groups/create", newGroup, token);

      if (res.status === 201 && res.data.success) {
        setSuccess("Group created successfully!");
        setNewGroup({ name: "", subject: "", description: "" });
        fetchGroups(); // Refresh groups list
      } else {
        setError(res.data.message || "Failed to create group");
      }
    } catch (err) {
      setError("Server error while creating group");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load groups on mount
  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="dashboard-card p-6 bg-black/30 rounded-2xl shadow-md w-full max-w-4xl mx-auto text-white">
      <h1 className="text-2xl font-semibold mb-6">Student Groups</h1>

      {/* Group Creation Form */}
      <form onSubmit={handleCreateGroup} className="mb-8 bg-white/10 p-5 rounded-lg border border-white/20">
        <h2 className="text-xl font-medium mb-4">Create a New Group</h2>
        <input
          type="text"
          placeholder="Group Name"
          value={newGroup.name}
          onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
          className="w-full mb-3 p-2 rounded bg-black/20 border border-white/30"
        />
        <input
          type="text"
          placeholder="Subject"
          value={newGroup.subject}
          onChange={(e) => setNewGroup({ ...newGroup, subject: e.target.value })}
          className="w-full mb-3 p-2 rounded bg-black/20 border border-white/30"
        />
        <textarea
          placeholder="Description"
          value={newGroup.description}
          onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
          className="w-full mb-3 p-2 rounded bg-black/20 border border-white/30"
        />
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-400 text-sm mb-2">{success}</p>}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-medium"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Group"}
        </button>
      </form>

      {/* Groups List */}
      {loading ? (
        <p>Loading groups...</p>
      ) : (
        <ul className="space-y-4">
          {groups.length === 0 ? (
            <p className="text-gray-400">No groups created yet.</p>
          ) : (
            groups.map((group) => (
              <li
                key={group._id}
                className="p-4 rounded-lg bg-white/10 border border-white/20 flex flex-col"
              >
                <span className="font-medium text-lg">{group.name}</span>
                <span className="text-gray-300 text-sm">Subject: {group.subject}</span>
                <span className="text-gray-400 text-xs mt-1">{group.description}</span>
                <span className="text-green-400 text-sm mt-2">
                  {group.studentCount || 0} students
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default TeacherStudentGroups;
