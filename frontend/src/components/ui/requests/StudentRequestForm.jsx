// src/components/ui/requests/StudentRequestForm.jsx
import React, { useEffect, useState } from "react";
import api from "../../../services/api"; // adjust relative path if needed

export default function StudentRequestForm() {
  const [teachers, setTeachers] = useState([]);
  const [recipientId, setRecipientId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadTeachers() {
      try {
        const list = await api.getUsers("teacher");
        setTeachers(list);
        if (list.length) setRecipientId(list[0]._id);
      } catch (err) {
        console.error(err);
        alert("Failed to load teachers");
      }
    }
    loadTeachers();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (!recipientId || !message.trim()) {
      alert("Select a teacher and write a message");
      return;
    }
    setLoading(true);
    try {
      await api.sendRequest({ recipient_id: recipientId, message });
      setMessage("");
      alert("Request sent ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to send request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm max-w-xl">
      <h3 className="text-lg font-semibold mb-3">Send Request to Teacher</h3>

      <form onSubmit={onSubmit}>
        <label className="block mb-2 text-sm">Teacher</label>
        <select
          className="w-full border rounded p-2 mb-3"
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
        >
          {teachers.map((t) => (
            <option key={t._id} value={t._id}>
              {t.full_name || t.username}
            </option>
          ))}
        </select>

        <label className="block mb-2 text-sm">Message</label>
        <textarea
          className="w-full border rounded p-2 mb-3"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your request..."
        />

        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Request"}
        </button>
      </form>
    </div>
  );
}
