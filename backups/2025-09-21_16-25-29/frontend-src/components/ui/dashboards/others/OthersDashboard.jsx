// OthersDashboard.jsx - Complete Others Dashboard for Mentors & Contributors
import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  MessageCircle, 
  Share2, 
  BarChart3, 
  Settings,
  Bell,
  Search,
  UserCircle,
  Calendar,
  Upload,
  Heart,
  Award,
  TrendingUp,
  Clock,
  FileText,
  Send,
  Star,
  Coffee,
  Target,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Headphones,
  Gift
} from 'lucide-react';
import '../../../css/dashboards/others/OthersDashboard.css';
const OthersDashboard = () => {
  // Mock data for demo
  const [userRole] = useState('mentor'); // mentor, contributor, alumni, counselor

  const mentorshipSessions = [
    { id: 1, student: 'Alex K.', topic: 'Career Guidance', date: 'Sep 5, 2025', time: '2:00 PM', status: 'scheduled' },
    { id: 2, student: 'Sarah M.', topic: 'Interview Prep', date: 'Sep 7, 2025', time: '4:00 PM', status: 'confirmed' },
    { id: 3, student: 'Mike R.', topic: 'Resume Review', date: 'Sep 10, 2025', time: '10:00 AM', status: 'pending' },
  ];

  const helpRequests = [
    { id: 1, student: 'Anonymous', request: 'Need guidance on choosing AI specialization track', type: 'career', time: '2h ago', priority: 'medium' },
    { id: 2, student: 'Emma L.', request: 'Help with job interview preparation for tech roles', type: 'career', time: '5h ago', priority: 'high' },
    { id: 3, student: 'Anonymous', request: 'Struggling with work-life balance as a student', type: 'wellness', time: '1d ago', priority: 'medium' },
  ];

  const communityPosts = [
    { id: 1, author: 'Dr. Johnson', title: 'Top 5 AI Trends in 2025', engagement: 24, time: '3h ago', type: 'article' },
    { id: 2, author: 'Sarah Alumni', title: 'My journey from student to Google AI researcher', engagement: 18, time: '6h ago', type: 'experience' },
    { id: 3, author: 'Tech Mentor', title: 'Open discussion: Best practices for remote internships', engagement: 31, time: '12h ago', type: 'discussion' },
  ];

  const impactStats = {
    sessionsCompleted: 47,
    studentsImpacted: 32,
    resourcesShared: 15,
    badgesEarned: 8
  };

  const notifications = [
    { id: 1, text: 'New mentorship request from CS student', time: '30m ago', type: 'request' },
    { id: 2, text: 'Your career guidance session starts in 1 hour', time: '1h ago', type: 'reminder' },
    { id: 3, text: 'Community post got 5 new comments', time: '2h ago', type: 'engagement' },
    { id: 4, text: 'You earned the "Helpful Mentor" badge!', time: '1d ago', type: 'achievement' },
  ];

  const guidanceOpportunities = [
    { id: 1, title: 'Career Workshop: Tech Industry Insights', date: 'Sep 15', participants: 0, maxParticipants: 25 },
    { id: 2, title: 'Resume Review Session', date: 'Sep 18', participants: 12, maxParticipants: 15 },
    { id: 3, title: 'Alumni Talk: Life After Graduation', date: 'Sep 22', participants: 8, maxParticipants: 30 },
  ];

  // Sidebar Component
  const Sidebar = () => (
    <aside className="others-sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-logo">AcadWell</h2>
        <div className="role-badge">
          {userRole === 'mentor' && 'Mentor Portal'}
          {userRole === 'contributor' && 'Contributor Hub'}
          {userRole === 'alumni' && 'Alumni Network'}
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li className="nav-item active">
            <Home className="nav-icon" />
            <span>Dashboard</span>
          </li>
          <li className="nav-item">
            <Users className="nav-icon" />
            <span>Mentorship</span>
          </li>
          <li className="nav-item">
            <MessageCircle className="nav-icon" />
            <span>Community</span>
          </li>
          <li className="nav-item">
            <Share2 className="nav-icon" />
            <span>Contributions</span>
          </li>
          <li className="nav-item">
            <BarChart3 className="nav-icon" />
            <span>Analytics</span>
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
    <header className="others-topbar">
      <div className="topbar-left">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search mentorship, community, resources..."
            className="search-input"
          />
        </div>
      </div>

      <div className="topbar-right">
        <button className="icon-btn notification-btn">
          <Bell className="icon" />
          <span className="notification-badge">4</span>
        </button>
        <button className="profile-btn">
          <UserCircle className="profile-icon" />
          <span className="profile-text">Alex Mentor</span>
        </button>
      </div>
    </header>
  );

  // Welcome & Quick Actions Component
  const WelcomeCard = () => (
    <div className="dashboard-card welcome-card">
      <div className="welcome-content">
        <h2 className="welcome-title">Hello Mentor 👋</h2>
        <p className="welcome-subtitle">Ready to make a difference today?</p>
      </div>
      
      <div className="quick-actions">
        <button className="quick-action-btn start-session">
          <Calendar className="action-icon" />
          <span>Start Session</span>
        </button>
        <button className="quick-action-btn share-resource">
          <Share2 className="action-icon" />
          <span>Share Resource</span>
        </button>
        <button className="quick-action-btn join-discussion">
          <MessageCircle className="action-icon" />
          <span>Join Discussion</span>
        </button>
      </div>
    </div>
  );

  // Mentorship Sessions Component
  const MentorshipSessionsCard = () => (
    <div className="dashboard-card sessions-card">
      <h3 className="card-title">Mentorship Sessions</h3>
      <p className="card-subtitle">Manage your mentoring schedule</p>
      
      <div className="sessions-list">
        {mentorshipSessions.slice(0, 3).map((session) => (
          <div key={session.id} className="session-item">
            <div className="session-info">
              <h4 className="session-student">{session.student}</h4>
              <p className="session-topic">{session.topic}</p>
              <p className="session-time">{session.date} at {session.time}</p>
            </div>
            <span className={`session-status ${session.status}`}>
              {session.status}
            </span>
          </div>
        ))}
      </div>
      
      <button className="manage-sessions-btn">Manage Sessions</button>
    </div>
  );

  // Help Requests Component
  const HelpRequestsCard = () => (
    <div className="dashboard-card requests-card">
      <h3 className="card-title">Student Requests</h3>
      <p className="card-subtitle">Help requests from students</p>
      
      <div className="requests-list">
        {helpRequests.slice(0, 2).map((request) => (
          <div key={request.id} className="request-item">
            <div className="request-header">
              <span className="request-student">{request.student}</span>
              <span className={`priority-badge ${request.priority}`}>
                {request.priority}
              </span>
            </div>
            <p className="request-text">{request.request}</p>
            <div className="request-actions">
              <button className="respond-btn">
                <Send className="w-3 h-3" />
                Respond
              </button>
              <span className="request-time">{request.time}</span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="view-all-requests-btn">View All Requests</button>
    </div>
  );

  // Community Feed Component
  const CommunityFeedCard = () => (
    <div className="dashboard-card community-card">
      <h3 className="card-title">Community Feed</h3>
      <p className="card-subtitle">Latest discussions & posts</p>
      
      <div className="community-list">
        {communityPosts.slice(0, 2).map((post) => (
          <div key={post.id} className="community-item">
            <div className="post-header">
              <span className="post-author">{post.author}</span>
              <span className={`post-type ${post.type}`}>{post.type}</span>
            </div>
            <h4 className="post-title">{post.title}</h4>
            <div className="post-engagement">
              <Heart className="w-4 h-4 text-red-400" />
              <span>{post.engagement} interactions</span>
              <span className="post-time">{post.time}</span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="join-community-btn">Join Discussion</button>
    </div>
  );

  // Impact Analytics Component
  const ImpactAnalyticsCard = () => (
    <div className="dashboard-card impact-card">
      <h3 className="card-title">Impact Analytics</h3>
      <p className="card-subtitle">Your contribution overview</p>
      
      <div className="impact-stats">
        <div className="stat-item">
          <div className="stat-icon sessions">
            <Coffee className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <span className="stat-number">{impactStats.sessionsCompleted}</span>
            <span className="stat-label">Sessions</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon students">
            <Users className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <span className="stat-number">{impactStats.studentsImpacted}</span>
            <span className="stat-label">Students</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon resources">
            <Share2 className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <span className="stat-number">{impactStats.resourcesShared}</span>
            <span className="stat-label">Resources</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon badges">
            <Award className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <span className="stat-number">{impactStats.badgesEarned}</span>
            <span className="stat-label">Badges</span>
          </div>
        </div>
      </div>
      
      <button className="detailed-impact-btn">
        <TrendingUp className="w-4 h-4" />
        Detailed Impact
      </button>
    </div>
  );

  // Guidance Opportunities Component
  const GuidanceOpportunitiesCard = () => (
    <div className="dashboard-card opportunities-card">
      <h3 className="card-title">Guidance Opportunities</h3>
      <p className="card-subtitle">Ways to contribute</p>
      
      <div className="opportunities-list">
        {guidanceOpportunities.slice(0, 2).map((opportunity) => (
          <div key={opportunity.id} className="opportunity-item">
            <div className="opportunity-info">
              <h4 className="opportunity-title">{opportunity.title}</h4>
              <p className="opportunity-date">{opportunity.date}</p>
              <p className="opportunity-participants">
                {opportunity.participants}/{opportunity.maxParticipants} participants
              </p>
            </div>
            <button className="join-opportunity-btn">
              <Target className="w-4 h-4" />
              Join
            </button>
          </div>
        ))}
      </div>
      
      <button className="view-opportunities-btn">View All Opportunities</button>
    </div>
  );

  // Wellness Support Component
  const WellnessSupportCard = () => (
    <div className="dashboard-card wellness-support-card">
      <h3 className="card-title">Wellness Support</h3>
      <p className="card-subtitle">Non-academic student support</p>
      
      <div className="wellness-requests">
        <div className="wellness-item">
          <div className="wellness-info">
            <span className="wellness-student">Anonymous</span>
            <p className="wellness-concern">Feeling overwhelmed with coursework</p>
          </div>
          <button className="support-btn">
            <Heart className="w-4 h-4" />
            Support
          </button>
        </div>
        <div className="wellness-item">
          <div className="wellness-info">
            <span className="wellness-student">Student #247</span>
            <p className="wellness-concern">Need motivation for final exams</p>
          </div>
          <button className="support-btn">
            <Heart className="w-4 h-4" />
            Support
          </button>
        </div>
      </div>
      
      <button className="wellness-center-btn">Wellness Center</button>
    </div>
  );

  // Badges & Recognition Component
  const BadgesRecognitionCard = () => (
    <div className="dashboard-card badges-card">
      <h3 className="card-title">Recognition & Badges</h3>
      <p className="card-subtitle">Your achievements</p>
      
      <div className="badges-grid">
        <div className="badge-item earned">
          <Award className="badge-icon" />
          <span className="badge-name">Helpful Mentor</span>
        </div>
        <div className="badge-item earned">
          <Star className="badge-icon" />
          <span className="badge-name">Top Contributor</span>
        </div>
        <div className="badge-item earned">
          <Users className="badge-icon" />
          <span className="badge-name">Community Builder</span>
        </div>
        <div className="badge-item locked">
          <Gift className="badge-icon" />
          <span className="badge-name">Super Mentor</span>
        </div>
      </div>
      
      <button className="view-achievements-btn">View All Achievements</button>
    </div>
  );

  // Notifications Component
  const NotificationsCard = () => (
    <div className="dashboard-card notifications-card">
      <h3 className="card-title">Notifications</h3>
      <p className="card-subtitle">Latest updates</p>
      
      <div className="notifications-list">
        {notifications.slice(0, 3).map((notification) => (
          <div key={notification.id} className="notification-item">
            <div className={`notification-icon ${notification.type}`}>
              {notification.type === 'request' && <Users className="w-4 h-4" />}
              {notification.type === 'reminder' && <Clock className="w-4 h-4" />}
              {notification.type === 'engagement' && <Heart className="w-4 h-4" />}
              {notification.type === 'achievement' && <Award className="w-4 h-4" />}
            </div>
            <div className="notification-content">
              <p className="notification-text">{notification.text}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="view-all-notifications-btn">View All</button>
    </div>
  );

  return (
    <div className="others-dashboard-wrapper">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="others-dashboard-main">
        {/* Topbar */}
        <Topbar />

        {/* Content Grid */}
        <div className="others-dashboard-content">
          {/* Welcome Card - Full Width */}
          <WelcomeCard />
          
          {/* Main Content Cards - 2 per row */}
          <MentorshipSessionsCard />
          <HelpRequestsCard />
          <CommunityFeedCard />
          <ImpactAnalyticsCard />
          <GuidanceOpportunitiesCard />
          <WellnessSupportCard />
          <BadgesRecognitionCard />
          <NotificationsCard />
        </div>
      </div>
    </div>
  );
};

export default OthersDashboard;