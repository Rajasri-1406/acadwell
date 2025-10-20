import React, { useEffect, useState } from "react";
import "../../../css/dashboards/student/StudentDashboard.css";

const StudentGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/student/my_grades", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.success) setGrades(data.grades);
        else setError(data.message || "Failed to load grades.");
      } catch (err) {
        console.error(err);
        setError("Server error while loading grades.");
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

  if (loading) return <p>⏳ Loading your grades...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="dashboard-card">
      <h2 className="card-title">📊 My Grades</h2>
      <table className="w-full text-sm border-collapse mt-4">
        <thead>
          <tr className="bg-purple-600/40 text-left">
            <th className="p-2">Subject</th>
            <th className="p-2">Marks</th>
            <th className="p-2">Teacher</th>
            <th className="p-2">Uploaded On</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((g, idx) => (
            <tr key={idx} className="hover:bg-white/5">
              <td className="p-2">{g.subject}</td>
              <td className="p-2">{g.marks}</td>
              <td className="p-2">{g.teacherName}</td>
              <td className="p-2">
                {g.uploadedAt ? new Date(g.uploadedAt).toLocaleString() : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentGrades;
