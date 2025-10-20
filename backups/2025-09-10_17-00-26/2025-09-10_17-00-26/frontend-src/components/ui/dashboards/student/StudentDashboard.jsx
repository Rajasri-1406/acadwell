// src/components/ui/dashboards/student/StudentDashboard.jsx
import React, { useState } from 'react';
import {
  Home, HelpCircle, Users, Activity, BarChart,
  Settings, Bell, Search, UserCircle, Rocket, Send
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import '../../../css/dashboards/student/StudentDashboard.css';

const StudentDashboard = () => {
  // ---------------------- MOCK DATA ----------------------
  const notifications = [
    { id: 1, text: 'Your question on exam prep got 2 new replies', time: '2h ago', type: 'reply' },
    { id: 2, text: "Don't forget to log your daily mood today", time: '5h ago', type: 'reminder' },
    { id: 3, text: 'New study group formed for Calculus', time: '1d ago', type: 'group' },
  ];

  // ---------------------- STATE ----------------------
  const [showChat, setShowChat] = useState(false);
  const [chatSession, setChatSession] = useState([
    { id: 1, sender: 'system', text: '👋 Hey! Ask me anything related to your studies.' }
  ]);

  const location = useLocation();

  // ---------------------- CHAT HANDLER ----------------------
  const sendUserMessage = (text) => {
    if (!text || !text.trim()) return;
    setChatSession(prev => [...prev, { id: prev.length + 1, sender: 'user', text }]);

    // simulated system reply
    setTimeout(() => {
      setChatSession(prev => [...prev, { id: prev.length + 1, sender: 'system', text: '✅ Got it — someone will reply soon.' }]);
    }, 900);
  };

  // ---------------------- SMALL SUB-COMPONENTS ----------------------
  const Sidebar = () => (
    <aside className="student-sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-logo">AcadWell</h2>
        <div className="student-badge">Student Portal</div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li className={`nav-item ${location.pathname === '/dashboard/student' ? 'active' : ''}`}>
            <Link to="/dashboard/student"><Home className="nav-icon" /> <span>Dashboard</span></Link>
          </li>
          <li className={`nav-item ${location.pathname === '/dashboard/student/questions' ? 'active' : ''}`}>
            <Link to="/dashboard/student/questions"><HelpCircle className="nav-icon" /> <span>Questions</span></Link>
          </li>
          <li className={`nav-item ${location.pathname === '/dashboard/student/groups' ? 'active' : ''}`}>
            <Link to="/dashboard/student/groups"><Users className="nav-icon" /> <span>Study Groups</span></Link>
          </li>
          <li className={`nav-item ${location.pathname === '/dashboard/student/wellness' ? 'active' : ''}`}>
            <Link to="/dashboard/student/wellness"><Activity className="nav-icon" /> <span>Wellness</span></Link>
          </li>
          <li className={`nav-item ${location.pathname === '/dashboard/student/analytics' ? 'active' : ''}`}>
            <Link to="/dashboard/student/analytics"><BarChart className="nav-icon" /> <span>Analytics</span></Link>
          </li>
          <li className={`nav-item ${location.pathname === '/dashboard/student/settings' ? 'active' : ''}`}>
            <Link to="/dashboard/student/settings"><Settings className="nav-icon" /> <span>Settings</span></Link>
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
          <input type="text" placeholder="Search questions, resources, study groups..." className="search-input" />
        </div>
      </div>

      <div className="topbar-right">
        <button className="icon-btn notification-btn">
          <Bell className="icon" />
          <span className="notification-badge">{notifications.length}</span>
        </button>

        <Link to="/dashboard/student/profile">
          <button className="profile-btn">
            <UserCircle className="profile-icon" />
            <span className="profile-text">Alex Student</span>
          </button>
        </Link>
      </div>
    </header>
  );

  const WelcomeCard = () => (
    <div className="dashboard-card welcome-card">
      <div className="welcome-content">
        <h2 className="welcome-title">Welcome Back 👋</h2>
        <p className="welcome-subtitle">Ready to continue your learning journey?</p>
      </div>

      <div className="quick-actions">
        <button className="quick-action-btn ask-question" onClick={() => setShowChat(true)}>
          <HelpCircle className="action-icon" />
          <span>Ask Question</span>
        </button>
        <Link to="/dashboard/student/groups"><button className="quick-action-btn join-group">
          <Users className="action-icon" /><span>Join Group</span>
        </button></Link>
        <button className="quick-action-btn start-study">
          <Rocket className="action-icon" /><span>Start Study</span>
        </button>
      </div>
    </div>
  );

  // ChatModal nested component (has access to parent setShowChat)
  const ChatModal = () => {
    const [draft, setDraft] = useState('');
    return (
      <div className="chat-modal-backdrop">
        <div className="chat-modal">
          <div className="chat-header">
            <h3>Ask a Question 💬</h3>
            <button className="close-btn" onClick={() => setShowChat(false)}>✖</button>
          </div>

          <div className="chat-session" id="chat-session">
            {chatSession.map(msg => (
              <div key={msg.id} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              placeholder="Type your question..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { sendUserMessage(draft); setDraft(''); } }}
            />
            <button onClick={() => { sendUserMessage(draft); setDraft(''); }}><Send size={18} /></button>
          </div>
        </div>
      </div>
    );
  };

  // ---------------------- RETURN ----------------------
  return (
    <div className="student-dashboard-wrapper">
      <Sidebar />
      <div className="student-dashboard-main">
        <Topbar />
        <div className="student-dashboard-content">
          <WelcomeCard />
          {/* You can add the other cards here (questions feed, analytics card etc.) */}
        </div>
      </div>

      {showChat && <ChatModal />}
    </div>
  );
};

export default StudentDashboard;
