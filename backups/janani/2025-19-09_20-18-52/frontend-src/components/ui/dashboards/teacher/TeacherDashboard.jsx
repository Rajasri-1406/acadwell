// TeacherDashboard.jsx - Clean Professional Layout
import React, { useState } from 'react';
import { 
  Home, 
  BookOpen, 
  ClipboardList, 
  HelpCircle, 
  BarChart3, 
  Settings,
  Bell,
  Search,
  UserCircle,
  Plus,
  Upload,
  MessageSquare,
  Users,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Clock,
  FileText,
  Send,
  Eye,
  CheckCircle,
  Star
} from 'lucide-react';
import '../../../css/dashboards/teacher/TeacherDashboard.css';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
  // Mock data for demo
  const myClasses = [
    { id: 1, name: 'CS101 - AI Basics', students: 45, color: 'blue' },
    { id: 2, name: 'CS201 - Machine Learning', students: 32, color: 'green' },
    { id: 3, name: 'CS301 - Deep Learning', students: 28, color: 'purple' },
  ];

  const assignments = [
    { id: 1, title: 'Neural Networks Project', class: 'CS201', dueDate: 'Sep 5', submissions: 28, total: 32 },
    { id: 2, title: 'AI Ethics Essay', class: 'CS101', dueDate: 'Sep 8', submissions: 40, total: 45 },
    { id: 3, title: 'CNN Implementation', class: 'CS301', dueDate: 'Sep 12', submissions: 15, total: 28 },
  ];

  const studentQueries = [
    { id: 1, student: 'Anonymous', class: 'CS101', question: 'Can you explain supervised vs unsupervised learning?', time: '2h ago', status: 'pending' },
    { id: 2, student: 'Sarah M.', class: 'CS201', question: 'Having trouble with gradient descent optimization.', time: '4h ago', status: 'replied' },
    { id: 3, student: 'Anonymous', class: 'CS301', question: 'Best practices for CNN architecture design?', time: '6h ago', status: 'pending' },
  ];

  const notifications = [
    { id: 1, text: 'New assignment submission from CS201', time: '15m ago' },
    { id: 2, text: 'Student query requires your attention', time: '1h ago' },
    { id: 3, text: 'Class CS101 scheduled in 30 minutes', time: '2h ago' },
    { id: 4, text: '3 new peer review requests', time: '3h ago' },
  ];

  const atRiskStudents = [
    { name: 'John D.', class: 'CS101', issue: 'Low participation', severity: 'medium' },
    { name: 'Anonymous', class: 'CS201', issue: 'Missing assignments', severity: 'high' },
    { name: 'Mike R.', class: 'CS301', issue: 'Declining grades', severity: 'low' },
  ];

  const participationData = [
    { class: 'CS101', participation: 78 },
    { class: 'CS201', participation: 85 },
    { class: 'CS301', participation: 92 },
  ];

  // Sidebar Component
  const Sidebar = () => (
    <aside className="teacher-sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-logo">AcadWell</h2>
        <div className="teacher-badge">Teacher Portal</div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li className="nav-item active">
            <Home className="nav-icon" />
            <span>Dashboard</span>
          </li>
          <li className="nav-item">
            <BookOpen className="nav-icon" />
            <span>My Classes</span>
          </li>
          <li className="nav-item">
            <ClipboardList className="nav-icon" />
            <span>Assignments</span>
          </li>
          <li className="nav-item">
            <HelpCircle className="nav-icon" />
            <span>Student Queries</span>
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
    <header className="teacher-topbar">
      <div className="topbar-left">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search classes, students, assignments..."
            className="search-input"
          />
        </div>
      </div>

      <div className="topbar-right">
        <button className="icon-btn notification-btn">
          <Bell className="icon" />
          <span className="notification-badge">4</span>
        </button>
        <Link to='/dashboard/tprofile'>
        <button className="profile-btn">
          <UserCircle className="profile-icon" />
          <span className="profile-text">Prof. Smith</span>
        </button>
        </Link>
        
      </div>
    </header>
  );

  // Welcome & Quick Actions Component
  const WelcomeCard = () => (
    <div className="dashboard-card welcome-card">
      <div className="welcome-content">
        <h2 className="welcome-title">Hello Professor 👋</h2>
        <p className="welcome-subtitle">Ready to inspire and educate today?</p>
      </div>
      
      <div className="quick-actions">
        <button className="quick-action-btn create-class">
          <Plus className="action-icon" />
          <span>New Class</span>
        </button>
        <button className="quick-action-btn post-assignment">
          <Upload className="action-icon" />
          <span>Post Assignment</span>
        </button>
        <button className="quick-action-btn check-queries">
          <MessageSquare className="action-icon" />
          <span>Check Queries</span>
        </button>
      </div>
    </div>
  );

  // My Classes Component
  const MyClassesCard = () => (
    <div className="dashboard-card classes-card">
      <h3 className="card-title">My Classes</h3>
      <p className="card-subtitle">Manage your course offerings</p>
      
      <div className="classes-list">
        {myClasses.map((classItem) => (
          <div key={classItem.id} className={`class-item class-${classItem.color}`}>
            <div className="class-info">
              <h4 className="class-name">{classItem.name}</h4>
              <p className="class-students">{classItem.students} students</p>
            </div>
            <button className="class-action-btn">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
      <button className="view-all-btn">View All Classes</button>
    </div>
  );

  // Assignments Overview Component
  const AssignmentsCard = () => (
    <div className="dashboard-card assignments-card">
      <h3 className="card-title">Assignments Overview</h3>
      <p className="card-subtitle">Track assignment progress</p>
      
      <div className="assignments-list">
        {assignments.slice(0, 2).map((assignment) => (
          <div key={assignment.id} className="assignment-item">
            <div className="assignment-info">
              <h4 className="assignment-title">{assignment.title}</h4>
              <p className="assignment-meta">{assignment.class} • Due: {assignment.dueDate}</p>
            </div>
            <div className="assignment-progress">
              <div className="progress-circle">
                <span className="progress-text">{assignment.submissions}/{assignment.total}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="manage-btn">Manage Assignments</button>
    </div>
  );

  // Student Queries Component
  const StudentQueriesCard = () => (
    <div className="dashboard-card queries-card">
      <h3 className="card-title">Student Queries</h3>
      <p className="card-subtitle">Recent questions from students</p>
      
      <div className="queries-list">
        {studentQueries.slice(0, 2).map((query) => (
          <div key={query.id} className="query-item">
            <div className="query-header">
              <span className="query-student">{query.student}</span>
              <span className="query-class">{query.class}</span>
            </div>
            <p className="query-text">{query.question}</p>
            <div className="query-actions">
              <button className="reply-btn">
                <Send className="w-3 h-3" />
                Reply
              </button>
              <span className={`status-indicator ${query.status}`}>
                {query.status === 'replied' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="view-all-queries-btn">View All Queries</button>
    </div>
  );

  // Analytics Component
  const AnalyticsCard = () => (
    <div className="dashboard-card analytics-card">
      <h3 className="card-title">Class Participation</h3>
      <p className="card-subtitle">Student engagement overview</p>
      
      <div className="analytics-content">
        {participationData.map((data) => (
          <div key={data.class} className="participation-item">
            <div className="participation-info">
              <span className="class-name">{data.class}</span>
              <span className="participation-rate">{data.participation}%</span>
            </div>
            <div className="participation-bar">
              <div 
                className="participation-fill" 
                style={{ width: `${data.participation}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="detailed-analytics-btn">
        <TrendingUp className="w-4 h-4" />
        Detailed Analytics
      </button>
    </div>
  );

  // At-Risk Students Component
  const AtRiskStudentsCard = () => (
    <div className="dashboard-card at-risk-card">
      <h3 className="card-title">At-Risk Students</h3>
      <p className="card-subtitle">Students needing attention</p>
      
      <div className="at-risk-list">
        {atRiskStudents.map((student, index) => (
          <div key={index} className="at-risk-item">
            <div className="student-info">
              <span className="student-name">{student.name}</span>
              <span className="student-issue">{student.issue}</span>
            </div>
            <span className={`severity-badge ${student.severity}`}>
              <AlertTriangle className="w-3 h-3" />
              {student.severity}
            </span>
          </div>
        ))}
      </div>
      
      <button className="view-all-risk-btn">View All Alerts</button>
    </div>
  );

  // Notifications Component
  const NotificationsCard = () => (
    <div className="dashboard-card notifications-card">
      <h3 className="card-title">Notifications</h3>
      <p className="card-subtitle">Latest activities</p>
      
      <div className="notifications-list">
        {notifications.slice(0, 3).map((notification) => (
          <div key={notification.id} className="notification-item">
            <Bell className="notification-icon" />
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

  // Course Resources Component
  const CourseResourcesCard = () => (
    <div className="dashboard-card resources-card">
      <h3 className="card-title">Course Resources</h3>
      <p className="card-subtitle">Manage materials</p>
      
      <div className="resources-actions">
        <button className="resource-action upload-notes">
          <Upload className="w-4 h-4" />
          Upload
        </button>
        <button className="resource-action manage-resources">
          <FileText className="w-4 h-4" />
          Manage
        </button>
      </div>
      
      <div className="recent-uploads">
        <h4 className="recent-title">Recent Files</h4>
        <div className="uploads-list">
          <div className="upload-item">
            <FileText className="upload-icon" />
            <span className="upload-name">Neural Networks.pdf</span>
          </div>
          <div className="upload-item">
            <FileText className="upload-icon" />
            <span className="upload-name">Guidelines.docx</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="teacher-dashboard-wrapper">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="teacher-dashboard-main">
        {/* Topbar */}
        <Topbar />

        {/* Content Grid */}
        <div className="teacher-dashboard-content">
          {/* Welcome Card - Full Width */}
          <WelcomeCard />
          
          {/* Main Content Cards - 2 per row */}
          <MyClassesCard />
          <AssignmentsCard />
          <StudentQueriesCard />
          <AnalyticsCard />
          <AtRiskStudentsCard />
          <NotificationsCard />
          <CourseResourcesCard />
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;