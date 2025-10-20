import React, { useEffect, useState } from "react";
import { Send, MessageCircle, UserCircle, ArrowLeft, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentQuestions = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("questions");
  const [grades, setGrades] = useState([]);

  // Fetch grades when switching to "grades" tab
  useEffect(() => {
    if (tab === "grades") {
      fetch("http://localhost:5000/api/student/my_grades", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setGrades(data.grades);
        })
        .catch((err) => console.error("Grades fetch error:", err));
    }
  }, [tab]);

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white rounded-2xl overflow-hidden shadow-xl">
      {/* LEFT SIDEBAR */}
      <div className="w-1/3 border-r border-white/10 bg-black/30 backdrop-blur-lg p-4 flex flex-col">
        <button
          onClick={() => navigate("/dashboard/student")}
          className="mb-4 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition px-3 py-2 rounded-lg shadow-md text-sm font-medium w-fit"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab("questions")}
            className={`px-3 py-2 rounded-lg text-sm ${
              tab === "questions" ? "bg-purple-600" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            <MessageCircle size={16} className="inline mr-1" />
            Questions
          </button>
          <button
            onClick={() => setTab("grades")}
            className={`px-3 py-2 rounded-lg text-sm ${
              tab === "grades" ? "bg-purple-600" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            <BarChart2 size={16} className="inline mr-1" />
            Grades
          </button>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="w-2/3 flex flex-col">
        {tab === "questions" ? (
          <div className="p-6 text-gray-300"> {/* existing Q&A UI here */} </div>
        ) : (
          <div className="p-6 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">📊 My Performance</h2>
            {grades.length === 0 ? (
              <p className="text-gray-400">No grades uploaded yet.</p>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-purple-600/40">
                    <th className="p-2 text-left">Subject</th>
                    <th className="p-2 text-left">Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((g, idx) => (
                    <tr key={idx} className="hover:bg-white/5">
                      <td className="p-2">{g.subject}</td>
                      <td className="p-2">{g.marks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentQuestions;
