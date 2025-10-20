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
  MessageSquare,
  FileText,
  CheckCircle,
  Clock,
  HeartPulse,
  BarChart2,
  TrendingUp,
  Target,
  MessageCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { studentAPI } from "../../../../services/api";
import "../../../css/dashboards/student/StudentDashboard.css";

import StudentProfile from "./StudentProfile";
import StudentGrades from "./StudentGrades";
import StudentGroups from "./StudentGroups";
import Community from "../../Community"; // ✅ Newly added

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();

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
  const questions = [
    { id: 1, text: "What’s the best way to prepare for OS viva?", replies: 3, status: "answered" },
    { id: 2, text: "How to solve linked list reversal in Java?", replies: 1, status: "pending" },
  ];

  const weeklyMoods = ["😊", "😌", "😐", "😁", "🙂", "😎", "🙂"];
  const moodToday = "😌";
  const progress = 68;
  const studyStats = {
    hoursThisWeek: 12,
    studyStreak: 5,
    assignmentsCompleted: 4,
    averageScore: 87,
  };
  const upcomingDeadlines = [
    { id: 1, title: "AI Mini Project", subject: "AI", dueDate: "Oct 10", priority: "high" },
    { id: 2, title: "Database Lab", subject: "DBMS", dueDate: "Oct 14", priority: "medium" },
  ];
  const studyGroups = [
    { id: 1, name: "AI Enthusiasts", members: 5, subject: "AI", nextSession: "Tomorrow" },
    { id: 2, name: "Math Wizards", members: 3, subject: "Maths", nextSession: "Friday" },
  ];
  const notifications = [
    { id: 1, text: "Your question on OS got 2 new replies", time: "2h ago", type: "reply" },
    { id: 2, text: "Daily wellness reminder", time: "5h ago", type: "reminder" },
    { id: 3, text: "New group formed for ML", time: "1d ago", type: "group" },
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

          <li className="nav-item">
            <Link to="/dashboard/student/questions">
              <HelpCircle className="nav-icon" /> <span>Questions</span>
            </Link>
          </li>

          <li className={`nav-item ${activeSection === "groups" ? "active" : ""}`}>
            <button onClick={() => setActiveSection("groups")}>
              <Users className="nav-icon" /> <span>Study Groups</span>
            </button>
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

          <li className={`nav-item ${activeSection === "grades" ? "active" : ""}`}>
            <button onClick={() => setActiveSection("grades")}>
              <FileText className="nav-icon" /> <span>Grades</span>
            </button>
          </li>

          {/* ✅ NEW COMMUNITY SECTION */}
          <li className={`nav-item ${activeSection === "community" ? "active" : ""}`}>
            <button onClick={() => setActiveSection("community")}>
              <MessageCircle className="nav-icon" /> <span>Community</span>
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

  // ---------------------- TOPBAR ----------------------
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
        <Link to="/dashboard/student/questions">
          <button className="quick-action-btn ask-question">
            <HelpCircle className="action-icon" />
            <span>Ask Question</span>
          </button>
        </Link>
        <button className="quick-action-btn join-group" onClick={() => setActiveSection("groups")}>
          <Users className="action-icon" /> <span>Join Group</span>
        </button>
        <button className="quick-action-btn start-study">
          <Rocket className="action-icon" /> <span>Start Study</span>
        </button>
      </div>
    </div>
  );

  const QuestionsFeedCard = () => (
    <div className="dashboard-card questions-card">
      <h3 className="card-title">Recent Questions</h3>
      <p className="card-subtitle">See what your peers are asking</p>
      <div className="questions-list">
        {questions.map((q) => (
          <div key={q.id} className="question-item">
            <div className="question-content">
              <MessageSquare className="question-icon" />
              <span className="question-text">{q.text}</span>
            </div>
            <div className="question-meta">
              <span className="question-replies">{q.replies} replies</span>
              <span className={`question-status ${q.status}`}>
                {q.status === "answered" ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              </span>
            </div>
          </div>
        ))}
      </div>
      <button className="view-more-btn">View All Questions</button>
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
      <button className="checkin-btn">Log Today's Mood</button>
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
      <div className="study-stats-mini">
        <div className="mini-stat">
          <span className="mini-stat-number">{studyStats.hoursThisWeek}</span>
          <span className="mini-stat-label">Hours</span>
        </div>
        <div className="mini-stat">
          <span className="mini-stat-number">{studyStats.studyStreak}</span>
          <span className="mini-stat-label">Streak</span>
        </div>
      </div>
      <button className="details-btn">
        <BarChart2 className="btn-icon" />
        <span>View Analytics</span>
      </button>
    </div>
  );

  const StudyStatsCard = () => (
    <div className="dashboard-card study-stats-card">
      <h3 className="card-title">Study Statistics</h3>
      <p className="card-subtitle">Your learning metrics</p>
      <div className="stats-grid">
        <div className="stat-item"><Clock className="w-5 h-5" /><div><span>{studyStats.hoursThisWeek}</span><p>Hours</p></div></div>
        <div className="stat-item"><CheckCircle className="w-5 h-5" /><div><span>{studyStats.assignmentsCompleted}</span><p>Assignments</p></div></div>
        <div className="stat-item"><TrendingUp className="w-5 h-5" /><div><span>{studyStats.averageScore}%</span><p>Avg Score</p></div></div>
        <div className="stat-item"><Target className="w-5 h-5" /><div><span>{studyStats.studyStreak}</span><p>Streak</p></div></div>
      </div>
    </div>
  );

  const DeadlinesCard = () => (
    <div className="dashboard-card deadlines-card">
      <h3 className="card-title">Upcoming Deadlines</h3>
      <p className="card-subtitle">Stay on top of your assignments</p>
      {upcomingDeadlines.map((d) => (
        <div key={d.id} className="deadline-item">
          <div><h4>{d.title}</h4><p>{d.subject} • Due: {d.dueDate}</p></div>
          <span className={`priority-badge ${d.priority}`}>{d.priority}</span>
        </div>
      ))}
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
          <button className="join-group-btn"><Users className="w-4 h-4" /></button>
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
        <div className="student-dashboard-content">
          {activeSection === "dashboard" && (
            <div className="dashboard-grid">
              <WelcomeCard />
              <QuestionsFeedCard />
              <WellnessCard />
              <ProgressCard />
              <StudyStatsCard />
              <DeadlinesCard />
              <StudyGroupsCard />
              <NotificationsCard />
            </div>
          )}
          {activeSection === "profile" && <StudentProfile />}
          {activeSection === "grades" && <StudentGrades />}
          {activeSection === "groups" && <StudentGroups />}
          {/* ✅ COMMUNITY PAGE RENDER */}
          {activeSection === "community" && <Community />}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
