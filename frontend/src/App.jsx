import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Public UI pages
import Homepage from "./components/ui/Homepage";
import Login from "./components/ui/Login";
import Register from "./components/ui/Register";
import Student from "./components/ui/Student";
import Teacher from "./components/ui/Teacher";
import Others from "./components/ui/Others";
import DashboardLanding from "./components/ui/DashboardLanding";

// Student dashboard + subpages
import StudentDashboard from "./components/ui/dashboards/student/StudentDashboard";
import StudentProfile from "./components/ui/dashboards/student/StudentProfile";
import StudentQuestions from "./components/ui/dashboards/student/StudentQuestions";
import StudentGroups from "./components/ui/dashboards/student/StudentGroups";
import StudentWellness from "./components/ui/dashboards/student/StudentWellness";
import StudentAnalytics from "./components/ui/dashboards/student/StudentAnalytics";
import StudentSettings from "./components/ui/dashboards/student/StudentSettings";

// Teacher & Others dashboards
import TeacherDashboard from "./components/ui/dashboards/teacher/TeacherDashboard";
import OthersDashboard from "./components/ui/dashboards/others/OthersDashboard";

// Chat Room Component
import ChatRoom from "./components/ui/chat/ChatRoom";

import "./App.css";

// ✅ ProtectedRoute Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  useEffect(() => {
    console.log("🚀 App Loaded Successfully");
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 🌍 Public Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/student" element={<Student />} />
          <Route path="/register/teacher" element={<Teacher />} />
          <Route path="/register/others" element={<Others />} />

          {/* 🏠 Dashboard Landing */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLanding />
              </ProtectedRoute>
            }
          />

          {/* 🎓 Student Dashboard Routes */}
          <Route
            path="/dashboard/student"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/dashboard/student/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
          <Route path="/dashboard/student/questions" element={<ProtectedRoute><StudentQuestions /></ProtectedRoute>} />
          <Route path="/dashboard/student/groups" element={<ProtectedRoute><StudentGroups /></ProtectedRoute>} />
          <Route path="/dashboard/student/wellness" element={<ProtectedRoute><StudentWellness /></ProtectedRoute>} />
          <Route path="/dashboard/student/analytics" element={<ProtectedRoute><StudentAnalytics /></ProtectedRoute>} />
          <Route path="/dashboard/student/settings" element={<ProtectedRoute><StudentSettings /></ProtectedRoute>} />

          {/* 👩‍🏫 Teacher Dashboard */}
          <Route path="/dashboard/teacher/*" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />

          {/* 🧩 Others Dashboard */}
          <Route path="/dashboard/others" element={<ProtectedRoute><OthersDashboard /></ProtectedRoute>} />

          {/* 💬 Chat Route (standalone full screen) */}
          <Route path="/chat" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />

          {/* 404 Fallback */}
          <Route path="*" element={<h1 style={{ padding: 20 }}>404 — Page not found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
