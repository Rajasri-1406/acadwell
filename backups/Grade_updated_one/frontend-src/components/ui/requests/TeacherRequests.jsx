// src/components/ui/requests/TeacherRequests.jsx
import React, { useEffect, useState } from "react";
import api from "../../../services/api"; // adjust relative path if needed

export default function TeacherRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await api.getReceivedRequests();
      setRequests(res);
    } catch (err) {
      console.error(err);
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function respond(reqId, action) {
    try {
      await api.respondRequest(reqId, action);
      // optimistic: reload list
      await load();
    } catch (err) {
      console.error(err);
      alert("Failed to update request");
    }
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-3">Requests Received</h3>
      {loading && <div>Loading...</div>}
      {!loading && requests.length === 0 && <div>No requests yet.</div>}
      <div className="space-y-3">
        {requests.map((r) => (
          <div key={r._id} className="p-3 border rounded">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">
                  From: {r.sender_name || r.sender_id}
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

            {r.status === "pending" && (
              <div className="mt-3 space-x-2">
                <button
                  onClick={() => respond(r._id, "accept")}
                  className="px-3 py-1 rounded bg-green-600 text-white"
                >
                  Accept
                </button>
                <button
                  onClick={() => respond(r._id, "reject")}
                  className="px-3 py-1 rounded bg-red-600 text-white"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
