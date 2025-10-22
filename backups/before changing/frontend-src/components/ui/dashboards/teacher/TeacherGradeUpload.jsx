import React, { useState, useEffect } from "react";
import "../../../css/dashboards/teacher/TeacherDashboard.css";

/**
 * TeacherGradeUpload.jsx
 * - Uses flexible token lookup (sessionStorage/localStorage)
 * - Posts form-data with file + metadata to /api/teacher/upload_grades
 * - Fetches teacher's own history from /api/teacher/my_uploads
 */

const getAuthToken = () =>
  sessionStorage.getItem("token") ||
  localStorage.getItem("token") ||
  sessionStorage.getItem("teacherToken") ||
  localStorage.getItem("teacherToken") ||
  "";

const TeacherGradeUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [history, setHistory] = useState([]);

  const [date, setDate] = useState("");
  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");
  const [testType, setTestType] = useState("");

  const fetchHistory = async () => {
    const token = getAuthToken();
    if (!token) {
      setHistory([]);
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/teacher/my_uploads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) setHistory(data.files || []);
      else setHistory([]);
    } catch (err) {
      console.error("Error fetching history:", err);
      setHistory([]);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0] || null);
    setUploadStatus("");
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploadStatus("");
    if (!selectedFile) {
      setUploadStatus("⚠️ Please select a file (CSV or Excel).");
      return;
    }
    if (!date || !semester || !department || !testType) {
      setUploadStatus("⚠️ Please fill date, semester, department and test type.");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setUploadStatus("⚠️ Not authenticated. Please login.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("date", date);
      formData.append("semester", semester);
      formData.append("department", department);
      formData.append("testType", testType);

      const res = await fetch("http://localhost:5000/api/teacher/upload_grades", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUploadStatus("✅ Uploaded successfully!");
        setSelectedFile(null);
        setDate("");
        setSemester("");
        setDepartment("");
        setTestType("");
        // Refresh teacher's history
        fetchHistory();
      } else {
        // show server message when available
        setUploadStatus(data.message || "❌ Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadStatus("❌ Server error while uploading");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="dashboard-card grade-upload-card">
      <h2 className="card-title">📤 Upload Grades</h2>

      <form onSubmit={handleUploadSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">📅 Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isUploading}
              className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">📚 Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              disabled={isUploading}
              className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
              required
            >
              <option value="">Select Semester</option>
              {[...Array(8)].map((_, i) => (
                <option key={i} value={String(i + 1)}>
                  Semester {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">🏢 Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              disabled={isUploading}
              className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
              required
            >
              <option value="">Select Department</option>
              <option value="CSE">Computer Science</option>
              <option value="ECE">Electronics & Communication</option>
              <option value="EEE">Electrical & Electronics</option>
              <option value="MECH">Mechanical</option>
              <option value="CIVIL">Civil</option>
              <option value="IT">Information Technology</option>
              <option value="AI&DS">AI & Data Science</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">📝 Test Type</label>
            <select
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
              disabled={isUploading}
              className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
              required
            >
              <option value="">Select Test Type</option>
              <option value="CAT-1">CAT 1</option>
              <option value="CAT-2">CAT 2</option>
              <option value="CAT-3">CAT 3</option>
              <option value="Mid-Semester">Mid Semester</option>
              <option value="End-Semester">End Semester</option>
              <option value="Arrear">Arrear</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">📂 Upload File (CSV / XLSX)</label>
          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={handleFileChange}
            disabled={isUploading}
            className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="w-full p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded"
        >
          {isUploading ? "⏳ Uploading..." : "Upload Grades"}
        </button>
      </form>

      {uploadStatus && (
        <p className={`mt-4 p-2 rounded ${uploadStatus.includes("✅") ? "bg-green-600/20" : "bg-red-600/20"}`}>
          {uploadStatus}
        </p>
      )}

      <h3 className="mt-6 text-xl font-semibold">📄 Upload History</h3>
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-purple-600/40 text-left">
              <th className="p-2">File</th>
              <th className="p-2">Date</th>
              <th className="p-2">Semester</th>
              <th className="p-2">Dept</th>
              <th className="p-2">Test</th>
              <th className="p-2">Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((h, i) => (
                <tr key={i} className="hover:bg-white/5 border-b border-white/10">
                  <td className="p-2">{h.fileName}</td>
                  <td className="p-2">{h.date || "-"}</td>
                  <td className="p-2">Sem {h.semester || "-"}</td>
                  <td className="p-2">{h.department || "-"}</td>
                  <td className="p-2">{h.testType || "-"}</td>
                  <td className="p-2">{h.uploadedAt ? new Date(h.uploadedAt).toLocaleString() : "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-2 text-center text-gray-400" colSpan="6">No uploads found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherGradeUpload;
