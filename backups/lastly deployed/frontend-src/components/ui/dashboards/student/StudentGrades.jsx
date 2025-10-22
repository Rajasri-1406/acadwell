import React, { useEffect, useState } from "react";
import "../../../css/dashboards/student/StudentDashboard.css";

const getAuthToken = () =>
  sessionStorage.getItem("token") ||
  localStorage.getItem("token") ||
  sessionStorage.getItem("studentToken") ||
  localStorage.getItem("studentToken") ||
  "";

const StudentGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ semester: "", department: "", testType: "" });

  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      setError("");
      try {
        const token = getAuthToken();
        if (!token) {
          setError("You are not logged in.");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:5000/api/student/my_grades", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.success) setGrades(data.grades || []);
        else setError(data.message || "Failed to load grades.");
      } catch (err) {
        console.error("Fetch grades error:", err);
        setError("Server error while loading grades.");
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  const filtered = grades.filter((g) => {
    if (filters.semester && String(g.semester) !== String(filters.semester)) return false;
    if (filters.department && g.department !== filters.department) return false;
    if (filters.testType && g.testType !== filters.testType) return false;
    return true;
  });

  if (loading) return <p>⏳ Loading your grades...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="dashboard-card">
      <h2 className="card-title">📊 My Grades</h2>

      {/* Filters (simple) */}
      <div className="bg-white/5 p-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-3">🔍 Filter Grades</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm mb-1">Semester</label>
            <select
              value={filters.semester}
              onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
              className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
            >
              <option value="">All Semesters</option>
              {[...Array(8)].map((_, i) => <option key={i} value={String(i+1)}>Semester {i+1}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Department</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
            >
              <option value="">All Departments</option>
              <option value="CSE">Computer Science</option>
              <option value="ECE">Electronics & Communication</option>
              <option value="IT">Information Technology</option>
              <option value="AI&DS">AI & Data Science</option>
              <option value="MECH">Mechanical</option>
              <option value="EEE">Electrical & Electronics</option>
              <option value="CIVIL">Civil</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Test Type</label>
            <select
              value={filters.testType}
              onChange={(e) => setFilters({ ...filters, testType: e.target.value })}
              className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
            >
              <option value="">All Tests</option>
              <option value="CAT-1">CAT 1</option>
              <option value="CAT-2">CAT 2</option>
              <option value="CAT-3">CAT 3</option>
              <option value="Mid-Semester">Mid Semester</option>
              <option value="End-Semester">End Semester</option>
              <option value="Arrear">Arrear</option>
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No grades found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-purple-600/40 text-left">
                <th className="p-2">Subject</th>
                <th className="p-2">Marks</th>
                <th className="p-2">Date</th>
                <th className="p-2">Semester</th>
                <th className="p-2">Department</th>
                <th className="p-2">Test Type</th>
                <th className="p-2">Teacher</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g, i) => (
                <tr key={i} className="hover:bg-white/5 border-b border-white/10">
                  <td className="p-2">{g.subject}</td>
                  <td className="p-2">{g.marks}</td>
                  <td className="p-2">{g.date || "-"}</td>
                  <td className="p-2">Sem {g.semester || "-"}</td>
                  <td className="p-2">{g.department || "-"}</td>
                  <td className="p-2">{g.testType || "-"}</td>
                  <td className="p-2">{g.teacherName || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentGrades;
