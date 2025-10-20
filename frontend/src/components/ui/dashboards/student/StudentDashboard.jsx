import React, { useState, useEffect } from "react";
import {
  Home,
  Users,
  Activity,
  BarChart,
  Settings,
  Bell,
  Search,
  UserCircle,
  Rocket,
  FileText,
  CheckCircle,
  Clock,
  HeartPulse,
  BarChart2,
  TrendingUp,
  Target,
  MessageCircle,
  MessageSquare,
} from "lucide-react";
import { studentAPI } from "../../../../services/api";
import "../../../css/dashboards/student/StudentDashboard.css";

import StudentProfile from "./StudentProfile";
import StudentGrades from "./StudentGrades";
import StudentGroups from "./StudentGroups";
import Community from "../../Community";
import StudyGroup from "../../StudyGroup";
import StudentWellness from "./StudentWellness"; // ✅ Added

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await studentAPI.getProfile();
        if (res.data.success) setProfile(res.data.user);
        else setError(res.data.message || "Unable to load profile");
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Server error while loading profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ---------- Mock Data ----------
  const weeklyMoods = ["😊", "😌", "😐", "😁", "🙂", "😎", "🙂"];
  const moodToday = "😌";
  const progress = 68;
  const studyStats = {
    hoursThisWeek: 12,
    studyStreak: 5,
    assignmentsCompleted: 4,
    averageScore: 87,
  };
  const studyGroups = [
    { id: 1, name: "AI Enthusiasts", members: 5, subject: "AI", nextSession: "Tomorrow" },
    { id: 2, name: "Math Wizards", members: 3, subject: "Maths", nextSession: "Friday" },
  ];
  const notifications = [
    { id: 1, text: "Your post in community got 2 new replies", time: "2h ago", type: "reply" },
    { id: 2, text: "Daily wellness reminder", time: "5h ago", type: "reminder" },
    { id: 3, text: "New study group suggestion: ML Boosters", time: "1d ago", type: "group" },
  ];

  // ---------------------- SIDEBAR ----------------------
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

          {/* ✅ Chats */}
          <li className={`nav-item ${activeSection === "groups" ? "active" : ""}`}>
            <button onClick={() => setActiveSection("groups")}>
              <MessageSquare className="nav-icon" /> <span>Chats</span>
            </button>
          </li>

          {/* ✅ Study Group */}
          <li className={`nav-item ${activeSection === "studygroup" ? "active" : ""}`}>
            <button onClick={() => setActiveSection("studygroup")}>
              <Users className="nav-icon" /> <span>Study Group</span>
            </button>
          </li>

          {/* ✅ Wellness (Fixed Navigation) */}
          <li className={`nav-item ${activeSection === "wellness" ? "active" : ""}`}>
            <button onClick={() => setActiveSection("wellness")}>
              <Activity className="nav-icon" /> <span>Wellness</span>
            </button>
          </li>

          {/* ✅ Analytics */}
          <li className={`nav-item ${activeSection === "analytics" ? "active" : ""}`}>
            <button onClick={() => setActiveSection("analytics")}>
              <BarChart className="nav-icon" /> <span>Analytics</span>
            </button>
          </li>

          {/* ✅ Grades */}
          <li className={`nav-item ${activeSection === "grades" ? "active" : ""}`}>
            <button onClick={() => setActiveSection("grades")}>
              <FileText className="nav-icon" /> <span>Grades</span>
            </button>
          </li>

          {/* ✅ Community */}
          <li className={`nav-item ${activeSection === "community" ? "active" : ""}`}>
            <button onClick={() => setActiveSection("community")}>
              <MessageCircle className="nav-icon" /> <span>Community</span>
            </button>
          </li>

          <li className={`nav-item ${activeSection === "settings" ? "active" : ""}`}>
            <button onClick={() => setActiveSection("settings")}>
              <Settings className="nav-icon" /> <span>Settings</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );

  // ---------------------- TOPBAR ----------------------
  const Topbar = () => (
    <header className="student-topbar">
      <div className="topbar-left">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search resources, groups, or discussions..."
            className="search-input"
          />
        </div>
      </div>

      <div className="topbar-right">
        <button className="icon-btn notification-btn">
          <Bell className="icon" />
          <span className="notification-badge">{notifications.length}</span>
        </button>

        <button className="profile-btn" onClick={() => setActiveSection("profile")}>
          <UserCircle className="profile-icon" />
          <span className="profile-text">
            {loading ? "Loading..." : error ? "Student" : profile?.name || "Student"}
          </span>
        </button>
      </div>
    </header>
  );

  // ---------------------- DASHBOARD CARDS ----------------------
  const WelcomeCard = () => (
    <div className="dashboard-card welcome-card">
      <div className="welcome-content">
        <h2 className="welcome-title">Welcome Back 👋 {profile?.name || "Student"}</h2>
        <p className="welcome-subtitle">Ready to continue your learning journey?</p>
      </div>
      <div className="quick-actions">
        <button
          className="quick-action-btn join-group"
          onClick={() => setActiveSection("studygroup")}
        >
          <Users className="action-icon" /> <span>Join Study Group</span>
        </button>
        <button className="quick-action-btn start-study">
          <Rocket className="action-icon" /> <span>Start Study</span>
        </button>
      </div>
    </div>
  );

  const WellnessCard = () => (
    <div className="dashboard-card wellness-card">
      <h3 className="card-title">Wellness Snapshot</h3>
      <p className="card-subtitle">Track your daily well-being</p>
      <div className="wellness-today">
        <HeartPulse className="wellness-icon" />
        <span className="today-mood">Today: {moodToday}</span>
      </div>
      <div className="weekly-moods">
        <span className="moods-label">This Week:</span>
        <div className="moods-display">
          {weeklyMoods.map((mood, idx) => (
            <div key={idx} className="mood-circle">{mood}</div>
          ))}
        </div>
      </div>
      <button
        className="checkin-btn"
        onClick={() => setActiveSection("wellness")}
      >
        Log Today's Mood
      </button>
    </div>
  );

  const ProgressCard = () => (
    <div className="dashboard-card progress-card">
      <h3 className="card-title">Learning Progress</h3>
      <p className="card-subtitle">Your academic journey overview</p>
      <div className="progress-wrapper">
        <div className="progress-info">
          <span className="progress-label">Overall Progress</span>
          <span className="progress-percentage">{progress}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );

  const StudyGroupsCard = () => (
    <div className="dashboard-card study-groups-card">
      <h3 className="card-title">Study Groups</h3>
      <p className="card-subtitle">Collaborate with peers</p>
      {studyGroups.map((g) => (
        <div key={g.id} className="group-item">
          <div>
            <h4>{g.name}</h4>
            <p>{g.members} members • {g.subject}</p>
            <p>Next: {g.nextSession}</p>
          </div>
          <button
            className="join-group-btn"
            onClick={() => setActiveSection("studygroup")}
          >
            <Users className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );

  const NotificationsCard = () => (
    <div className="dashboard-card notifications-card">
      <h3 className="card-title">Notifications</h3>
      <p className="card-subtitle">Stay updated</p>
      {notifications.map((n) => (
        <div key={n.id} className="notification-item">
          <div className={`notification-icon ${n.type}`}>
            {n.type === "reply" && <MessageSquare className="w-4 h-4" />}
            {n.type === "reminder" && <Bell className="w-4 h-4" />}
            {n.type === "group" && <Users className="w-4 h-4" />}
          </div>
          <div className="notification-content">
            <p>{n.text}</p>
            <span>{n.time}</span>
          </div>
        </div>
      ))}
    </div>
  );

  // ---------------------- RETURN ----------------------
  return (
    <div className="student-dashboard-wrapper">
      <Sidebar />
      <div className="student-dashboard-main">
        <Topbar />

        {/* ✅ Scrollbar only for Dashboard section */}
        <div
          className={`student-dashboard-content ${
            activeSection === "dashboard" ? "scrollable-content" : ""
          }`}
        >
          {activeSection === "dashboard" && (
            <div className="dashboard-grid">
              <WelcomeCard />
              <WellnessCard />
              <ProgressCard />
              <StudyGroupsCard />
              <NotificationsCard />
            </div>
          )}
          {activeSection === "profile" && <StudentProfile />}
          {activeSection === "grades" && <StudentGrades />}
          {activeSection === "groups" && <StudentGroups />}
          {activeSection === "community" && <Community />}
          {activeSection === "studygroup" && <StudyGroup />}
          {activeSection === "wellness" && <StudentWellness />}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
