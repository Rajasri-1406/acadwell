// src/components/ui/dashboards/teacher/TeacherGradeUpload.jsx
import React, { useState, useEffect } from "react";
import "../../../css/dashboards/teacher/TeacherDashboard.css";

const TeacherGradeUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [history, setHistory] = useState([]);

  // Fetch upload history from backend
  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/teacher/my_uploads", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("teacherToken")}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setHistory(data.files);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error("❌ Error fetching history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Handle file change
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadStatus("");
  };

  // Handle grade upload
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return setUploadStatus("⚠️ Please select a file");

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(
        "http://localhost:5000/api/teacher/upload_grades",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("teacherToken")}`,
          },
          body: formData,
        }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setUploadStatus("✅ Uploaded successfully!");
        setSelectedFile(null);
        fetchHistory(); // refresh after upload
      } else {
        setUploadStatus(data.message || "❌ Upload failed");
      }
    } catch (err) {
      console.error(err);
      setUploadStatus("❌ Upload error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="dashboard-card grade-upload-card">
      <h2 className="card-title">📤 Upload Grades</h2>

      <form onSubmit={handleUploadSubmit}>
        <input
          type="file"
          accept=".csv, .xlsx"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <button type="submit" disabled={isUploading || !selectedFile}>
          {isUploading ? "⏳ Uploading..." : "Upload Grades"}
        </button>
      </form>

      {uploadStatus && <p>{uploadStatus}</p>}

      <h3 className="mt-6">📄 Upload History</h3>
      <table className="w-full text-sm border-collapse mt-2">
        <thead>
          <tr className="bg-purple-600/40 text-left">
            <th className="p-2">📂 File Name</th>
            <th className="p-2">📅 Uploaded On</th>
          </tr>
        </thead>
        <tbody>
          {history.length > 0 ? (
            history.map((h, idx) => (
              <tr key={idx} className="hover:bg-white/5">
                <td className="p-2">{h.fileName || "Unknown File"}</td>
                <td className="p-2">
                  {h.uploadedAt
                    ? new Date(h.uploadedAt).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-2" colSpan="2">
                No uploads found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherGradeUpload;
