import React, { useState, useEffect } from "react";
import {
  Home,
  HelpCircle,
  Users,
  Activity,
  BarChart,
  Settings,
  Bell,
  Search,
  UserCircle,
  Rocket,
  MessageCircle,
  FileText,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { studentAPI } from "../../../../services/api";
import "../../../css/dashboards/student/StudentDashboard.css";

// Sub-pages
import StudentProfile from "./StudentProfile";
import StudentGrades from "./StudentGrades"; // ✅ new page for grades

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();

  // ---------------------- FETCH PROFILE ----------------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await studentAPI.getProfile();
        if (res.data.success) {
          setProfile(res.data.user);
        } else {
          setError(res.data.message || "Unable to load profile");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Server error while loading profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ---------------------- NOTIFICATIONS ----------------------
  const notifications = [
    { id: 1, text: "Your question on exam prep got 2 new replies", time: "2h ago", type: "reply" },
    { id: 2, text: "Don't forget to log your daily mood today", time: "5h ago", type: "reminder" },
    { id: 3, text: "New study group formed for Calculus", time: "1d ago", type: "group" },
  ];

  // ---------------------- SMALL SUB-COMPONENTS ----------------------
  const Sidebar = () => (
    <aside className="student-sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-logo">AcadWell</h2>
        <div className="student-badge">Student Portal</div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li className={`nav-item ${activeSection === "dashboard" ? "active" : ""}`}>
            <button onClick={() => setActiveSection("dashboard")}>
              <Home className="nav-icon" /> <span>Dashboard</span>
            </button>
          </li>
          <li className="nav-item">
            <Link to="/dashboard/student/questions">
              <HelpCircle className="nav-icon" /> <span>Questions</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/dashboard/student/groups">
              <Users className="nav-icon" /> <span>Study Groups</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/dashboard/student/wellness">
              <Activity className="nav-icon" /> <span>Wellness</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/dashboard/student/analytics">
              <BarChart className="nav-icon" /> <span>Analytics</span>
            </Link>
          </li>
          {/* ✅ Grades section */}
          <li className={`nav-item ${activeSection === "grades" ? "active" : ""}`}>
            <button onClick={() => setActiveSection("grades")}>
              <FileText className="nav-icon" /> <span>Grades</span>
            </button>
          </li>
          {/* ✅ Chat now navigates to standalone route */}
          <li className="nav-item">
            <button onClick={() => navigate("/chat")}>
              <MessageCircle className="nav-icon" /> <span>Chat</span>
            </button>
          </li>
          <li className="nav-item">
            <Link to="/dashboard/student/settings">
              <Settings className="nav-icon" /> <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );

  const Topbar = () => (
    <header className="student-topbar">
      <div className="topbar-left">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search questions, resources, study groups..."
            className="search-input"
          />
        </div>
      </div>

      <div className="topbar-right">
        <button className="icon-btn notification-btn">
          <Bell className="icon" />
          <span className="notification-badge">{notifications.length}</span>
        </button>

        {/* ✅ Profile opens in dashboard */}
        <button className="profile-btn" onClick={() => setActiveSection("profile")}>
          <UserCircle className="profile-icon" />
          <span className="profile-text">
            {loading ? "Loading..." : error ? "Student" : profile?.name || "Student"}
          </span>
        </button>
      </div>
    </header>
  );

  const WelcomeCard = () => (
    <div className="dashboard-card welcome-card">
      <div className="welcome-content">
        <h2 className="welcome-title">
          Welcome Back 👋 {profile?.name ? profile.name : "Student"}
        </h2>
        <p className="welcome-subtitle">Ready to continue your learning journey?</p>
      </div>

      <div className="quick-actions">
        <Link to="/dashboard/student/questions">
          <button className="quick-action-btn ask-question">
            <HelpCircle className="action-icon" />
            <span>Ask Question</span>
          </button>
        </Link>
        <Link to="/dashboard/student/groups">
          <button className="quick-action-btn join-group">
            <Users className="action-icon" /> <span>Join Group</span>
          </button>
        </Link>
        <button className="quick-action-btn start-study">
          <Rocket className="action-icon" /> <span>Start Study</span>
        </button>
      </div>
    </div>
  );

  // ---------------------- RETURN ----------------------
  return (
    <div className="student-dashboard-wrapper">
      <Sidebar />
      <div className="student-dashboard-main">
        <Topbar />
        <div className="student-dashboard-content">
          {activeSection === "dashboard" && <WelcomeCard />}
          {activeSection === "profile" && <StudentProfile />}
          {activeSection === "grades" && <StudentGrades />}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
