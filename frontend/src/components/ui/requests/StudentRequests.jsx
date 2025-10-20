// src/components/ui/requests/StudentRequests.jsx
import React, { useEffect, useState } from "react";
import api from "../../../services/api"; // adjust relative path if needed

export default function StudentRequests() {
  const [requests, setRequests] = useState([]);

  async function load() {
    try {
      const res = await api.getSentRequests();
      setRequests(res);
    } catch (err) {
      console.error(err);
      alert("Failed to load sent requests");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-3">Requests You Sent</h3>
      {requests.length === 0 && <div>No requests yet.</div>}
      <div className="space-y-3">
        {requests.map((r) => (
          <div key={r._id} className="p-3 border rounded flex justify-between">
            <div>
              <div className="font-semibold">
                To: {r.recipient_name || r.recipient_id}
              </div>
              <div className="text-sm text-gray-600">{r.message}</div>
            </div>
            <div className="text-right">
              <div className="text-sm">{r.status}</div>
              <div className="text-xs text-gray-500">
                {new Date(r.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
