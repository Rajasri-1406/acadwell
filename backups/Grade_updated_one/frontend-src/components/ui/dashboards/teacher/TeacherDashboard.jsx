// src/components/ui/dashboards/teacher/TeacherDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Home,
  Upload,
  BarChart2,
  BookOpen,
  Settings,
  Bell,
  Search,
  UserCircle,
  Users,
  MessageCircle,
} from "lucide-react";
import { Link, useLocation, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import TeacherGradeUpload from "./TeacherGradeUpload";
import TeacherProgressMonitor from "./TeacherProgressMonitor";
import TeacherStudentGroups from "./TeacherStudentGroups";
import TeacherSettings from "./TeacherSettings";
import TeacherProfile from "./TeacherProfile"; // ✅ New profile component

import ChatRoom from "../../chat/ChatRoom";
import { teacherAPI } from "../../../../services/api"; // ✅ API for teacher profile

const TeacherDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.split("/").pop() || "";

  const [teacher, setTeacher] = useState(null);

  // ✅ Fetch teacher profile on load
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await teacherAPI.getProfile();
        if (res.data.success) {
          setTeacher(res.data.user);
        }
      } catch (err) {
        console.error("Teacher profile fetch error:", err);
      }
    };
    fetchTeacher();
  }, []);

  const Sidebar = () => (
    <aside className="teacher-sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-logo">AcadWell</h2>
        <div className="teacher-badge">Teacher Portal</div>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className={`nav-item ${activeTab === "teacher" || activeTab === "" ? "active" : ""}`}>
            <Link to="/dashboard/teacher" className="flex items-center space-x-3 w-full">
              <Home className="nav-icon" /> <span>Dashboard</span>
            </Link>
          </li>
          <li className={`nav-item ${activeTab === "grades" ? "active" : ""}`}>
            <Link to="/dashboard/teacher/grades" className="flex items-center space-x-3 w-full">
              <Upload className="nav-icon" /> <span>Grade Upload</span>
            </Link>
          </li>
          <li className={`nav-item ${activeTab === "monitor" ? "active" : ""}`}>
            <Link to="/dashboard/teacher/monitor" className="flex items-center space-x-3 w-full">
              <BarChart2 className="nav-icon" /> <span>Progress Trends</span>
            </Link>
          </li>
          <li className={`nav-item ${activeTab === "groups" ? "active" : ""}`}>
            <Link to="/dashboard/teacher/groups" className="flex items-center space-x-3 w-full">
              <Users className="nav-icon" /> <span>Student Groups</span>
            </Link>
          </li>
          <li className={`nav-item ${activeTab === "settings" ? "active" : ""}`}>
            <Link to="/dashboard/teacher/settings" className="flex items-center space-x-3 w-full">
              <Settings className="nav-icon" /> <span>Settings</span>
            </Link>
          </li>
          
        </ul>
      </nav>
    </aside>
  );

  const Topbar = () => (
    <header className="teacher-topbar">
      <div className="topbar-left">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search students, groups, resources..."
            className="search-input"
          />
        </div>
      </div>
      <div className="topbar-right">
        <button className="icon-btn notification-btn" aria-label="Notifications">
          <Bell className="icon" />
          <span className="notification-badge">3</span>
        </button>
        {/* ✅ Show teacher name dynamically, and link to profile */}
        <button className="profile-btn" onClick={() => navigate("/dashboard/teacher/profile")}>
          <UserCircle className="profile-icon" />
          <span className="profile-text">{teacher?.name || "Loading..."}</span>
        </button>
      </div>
    </header>
  );

  const WelcomeCard = () => (
    <div className="dashboard-card welcome-card">
      <div className="welcome-content">
        <h2 className="welcome-title">Welcome Back, {teacher?.name || "Teacher"} 👋</h2>
        <p className="welcome-subtitle">Here's a quick overview of your tasks.</p>
      </div>
      <div className="quick-actions">
        <Link to="/dashboard/teacher/grades">
          <button className="quick-action-btn upload-grades">
            <Upload className="action-icon" />
            <span>Upload Grades</span>
          </button>
        </Link>
        <Link to="/dashboard/teacher/monitor">
          <button className="quick-action-btn view-trends">
            <BarChart2 className="action-icon" />
            <span>View Trends</span>
          </button>
        </Link>
        <Link to="/dashboard/teacher/groups">
          <button className="quick-action-btn add-resources">
            <BookOpen className="action-icon" />
            <span>Student Groups</span>
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="teacher-dashboard-wrapper">
      <Sidebar />
      <div className="teacher-dashboard-main">
        <Topbar />
        <div className="teacher-dashboard-content">
          <Routes>
            <Route path="/" element={<WelcomeCard />} />
            <Route path="grades" element={<TeacherGradeUpload />} />
            <Route path="monitor" element={<TeacherProgressMonitor />} />
            <Route path="groups" element={<TeacherStudentGroups />} />
            <Route path="chat" element={<ChatRoom userType="Teacher" />} />
            <Route path="settings" element={<TeacherSettings />} />
            <Route path="profile" element={<TeacherProfile />} /> {/* ✅ Profile route */}
            <Route path="*" element={<Navigate to="/dashboard/teacher" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
