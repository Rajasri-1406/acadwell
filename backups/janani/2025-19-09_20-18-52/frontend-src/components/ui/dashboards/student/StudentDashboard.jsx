// StudentDashboard.jsx - Clean Professional Layout Aligned with Teacher & Others
import React, { useState, useEffect } from 'react';
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
  HeartPulse,
  BarChart2,
  BookOpen,
  Calendar,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Award,
  Coffee,
  Brain,
  Lightbulb,
  Send,
  Eye,
  FileText,
  MessagesSquare,
  MessagesSquareIcon
} from 'lucide-react';
import '../../../css/dashboards/student/StudentDashboard.css';
import { Link } from 'react-router-dom';
const StudentDashboard = () => {
    // 🔹 Add state for user name
    const [userName, setUserName] = useState("");

    useEffect(() => {
      const storedName = localStorage.getItem("name");
      if (storedName) {
        setUserName(storedName);
      } else {
        setUserName("Student"); // fallback if no name found
      }
    }, []);

  // Mock data
  const notifications = [
    { id: 1, text: 'Your question on exam prep got 2 new replies', time: '2h ago', type: 'reply' },
    { id: 2, text: 'Don\'t forget to log your daily mood today', time: '5h ago', type: 'reminder' },
    { id: 3, text: 'New study group formed for Calculus', time: '1d ago', type: 'group' },
  ];

  const questions = [
    { id: 1, text: 'What is the difference between supervised and unsupervised learning?', replies: 5, status: 'answered' },
    { id: 2, text: 'Any tips for managing exam stress?', replies: 3, status: 'active' },
    { id: 3, text: 'How do I find study resources for calculus?', replies: 7, status: 'answered' },
  ];

  const progress = 72;
  const moodToday = '😊 Happy';
  const weeklyMoods = ["😊", "😐", "😢", "😊", "😊", "😐", "😊"];

  const studyStats = {
    hoursThisWeek: 28,
    assignmentsCompleted: 12,
    studyStreak: 5,
    averageScore: 87
  };

  const upcomingDeadlines = [
    { id: 1, title: 'Machine Learning Assignment', subject: 'CS201', dueDate: 'Sep 8', priority: 'high' },
    { id: 2, title: 'Calculus Problem Set', subject: 'MATH101', dueDate: 'Sep 12', priority: 'medium' },
    { id: 3, title: 'Ethics Essay', subject: 'PHIL201', dueDate: 'Sep 15', priority: 'low' },
  ];

  const studyGroups = [
    { id: 1, name: 'AI Study Circle', members: 8, subject: 'CS301', nextSession: 'Today 4:00 PM' },
    { id: 2, name: 'Calculus Help Group', members: 12, subject: 'MATH101', nextSession: 'Tomorrow 2:00 PM' },
  ];

  // Sidebar Component
  const Sidebar = () => (
    <aside className="student-sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-logo">AcadWell</h2>
        <div className="student-badge">Student Portal</div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li className="nav-item active">
            <Home className="nav-icon" />
            <span>Dashboard</span>
          </li>
          <li className="nav-item">
            <HelpCircle className="nav-icon" />
            <span>Questions</span>
          </li>
          <li className="nav-item">
            <Users className="nav-icon" />
            <span>Study Groups</span>
          </li>
          <li className="nav-item">
            <Activity className="nav-icon" />
            <span>Wellness</span>
          </li>
          <li className="nav-item">
            <BarChart className="nav-icon" />
            <span>Analytics</span>
          </li>
          <li className="nav-item">
            <Link to="/community" className="flex items-center space-x-3 w-full">
              <MessagesSquare className="nav-icon" />
              <span>Community</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/messages" className="flex items-center space-x-2 w-full">
              <MessagesSquare className="nav-icon" />
              <span>Messages</span>
            </Link>
          </li>

          <li className="nav-item">
            <Settings className="nav-icon" />
            <span>Settings</span>
          </li>
        </ul>
      </nav>
    </aside>
  );

  // Topbar Component
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
          <span className="notification-badge">3</span>
        </button>
        <button className="profile-btn">
          <UserCircle className="profile-icon" />
          {/* ⬇ dynamically render user name */}
          <span className="profile-text">{userName}</span>
        </button>
      </div>
    </header>
  );


  // Welcome Card Component
 const WelcomeCard = () => (
    <div className="dashboard-card welcome-card">
      <div className="welcome-content">
        {/* ⬇ inject user name dynamically */}
        <h2 className="welcome-title">Welcome Back, {userName} 👋</h2>
        <p className="welcome-subtitle">Ready to continue your learning journey?</p>
      </div>
      
      <div className="quick-actions">
        <button className="quick-action-btn ask-question">
          <HelpCircle className="action-icon" />
          <span>Ask Question</span>
        </button>
        <button className="quick-action-btn join-group">
          <Users className="action-icon" />
          <span>Join Group</span>
        </button>
        <button className="quick-action-btn start-study">
          <Rocket className="action-icon" />
          <span>Start Study</span>
        </button>
      </div>
    </div>
  );

  // Questions Feed Component
  const QuestionsFeedCard = () => (
    <div className="dashboard-card questions-card">
      <h3 className="card-title">Recent Questions</h3>
      <p className="card-subtitle">See what your peers are asking</p>

      <div className="questions-list">
        {questions.slice(0, 2).map((q) => (
          <div key={q.id} className="question-item">
            <div className="question-content">
              <MessageSquare className="question-icon" />
              <span className="question-text">{q.text}</span>
            </div>
            <div className="question-meta">
              <span className="question-replies">{q.replies} replies</span>
              <span className={`question-status ${q.status}`}>
                {q.status === 'answered' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="view-more-btn">View All Questions</button>
    </div>
  );

  // Wellness Card Component
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

  // Progress Card Component
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

  // Study Statistics Component
  const StudyStatsCard = () => (
    <div className="dashboard-card study-stats-card">
      <h3 className="card-title">Study Statistics</h3>
      <p className="card-subtitle">Your learning metrics</p>
      
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-icon hours">
            <Clock className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <span className="stat-number">{studyStats.hoursThisWeek}</span>
            <span className="stat-label">Hours This Week</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon assignments">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <span className="stat-number">{studyStats.assignmentsCompleted}</span>
            <span className="stat-label">Assignments Done</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon score">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <span className="stat-number">{studyStats.averageScore}%</span>
            <span className="stat-label">Average Score</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon streak">
            <Target className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <span className="stat-number">{studyStats.studyStreak}</span>
            <span className="stat-label">Day Streak</span>
          </div>
        </div>
      </div>
      
      <button className="detailed-stats-btn">
        <BarChart className="w-4 h-4" />
        Detailed Statistics
      </button>
    </div>
  );

  // Deadlines Component
  const DeadlinesCard = () => (
    <div className="dashboard-card deadlines-card">
      <h3 className="card-title">Upcoming Deadlines</h3>
      <p className="card-subtitle">Stay on top of your assignments</p>
      
      <div className="deadlines-list">
        {upcomingDeadlines.slice(0, 2).map((deadline) => (
          <div key={deadline.id} className="deadline-item">
            <div className="deadline-info">
              <h4 className="deadline-title">{deadline.title}</h4>
              <p className="deadline-subject">{deadline.subject} • Due: {deadline.dueDate}</p>
            </div>
            <span className={`priority-badge ${deadline.priority}`}>
              {deadline.priority}
            </span>
          </div>
        ))}
      </div>
      
      <button className="view-all-deadlines-btn">View All Deadlines</button>
    </div>
  );

  // Study Groups Component
  const StudyGroupsCard = () => (
    <div className="dashboard-card study-groups-card">
      <h3 className="card-title">Study Groups</h3>
      <p className="card-subtitle">Collaborate with peers</p>
      
      <div className="groups-list">
        {studyGroups.map((group) => (
          <div key={group.id} className="group-item">
            <div className="group-info">
              <h4 className="group-name">{group.name}</h4>
              <p className="group-members">{group.members} members • {group.subject}</p>
              <p className="group-session">Next: {group.nextSession}</p>
            </div>
            <button className="join-group-btn">
              <Users className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
      <button className="explore-groups-btn">Explore Groups</button>
    </div>
  );

  // Notifications Component
  const NotificationsCard = () => (
    <div className="dashboard-card notifications-card">
      <h3 className="card-title">Notifications</h3>
      <p className="card-subtitle">Stay updated with activities</p>

      <div className="notifications-list">
        {notifications.map((n) => (
          <div key={n.id} className="notification-item">
            <div className={`notification-icon ${n.type}`}>
              {n.type === 'reply' && <MessageSquare className="w-4 h-4" />}
              {n.type === 'reminder' && <Bell className="w-4 h-4" />}
              {n.type === 'group' && <Users className="w-4 h-4" />}
            </div>
            <div className="notification-content">
              <p className="notification-text">{n.text}</p>
              <span className="notification-time">{n.time}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="view-all-notifications-btn">View All</button>
    </div>
  );

  return (
    <div className="student-dashboard-wrapper">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="student-dashboard-main">
        {/* Topbar */}
        <Topbar />

        {/* Content Grid */}
        <div className="student-dashboard-content">
          {/* Welcome Card - Full Width */}
          <WelcomeCard />
          
          {/* Main Content Cards - 2 per row */}
          <QuestionsFeedCard />
          <WellnessCard />
          <ProgressCard />
          <StudyStatsCard />
          <DeadlinesCard />
          <StudyGroupsCard />
          <NotificationsCard />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;