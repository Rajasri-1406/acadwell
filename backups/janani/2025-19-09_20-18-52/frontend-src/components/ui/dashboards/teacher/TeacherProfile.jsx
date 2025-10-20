// TeacherProfile.jsx - Teacher Profile Page with Tabbed Layout
import React, { useState } from 'react';
import { 
  ArrowLeft,
  Edit3,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  BookOpen,
  Users,
  MessageSquare,
  TrendingUp,
  Award,
  Settings,
  Bell,
  Eye,
  EyeOff,
  Camera,
  Save,
  X,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  FileText,
  Star,
  Trophy,
  Activity,
  Briefcase,
  Shield,
  User,
  Building,
  HelpCircle,
  Send,
  PlusCircle,
  Upload,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import '../../../css/dashboards/teacher/TeacherProfile.css';
import { useNavigate } from 'react-router-dom';
const TeacherProfile = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const navigate = useNavigate();
  const onBackToDashboard  =()=>{
  navigate("/dashboard/teacher");
  }
  // Mock teacher data
  const teacherData = {
    // Basic Information
    fullName: 'Dr. Sarah Smith',
    employeeId: 'FAC2021045',
    designation: 'Associate Professor',
    department: 'Computer Science',
    email: 'sarah.smith@university.edu',
    phone: '+1 (555) 987-6543',
    officeLocation: 'CS Building, Room 314',
    joinDate: 'August 2018',
    profilePicture: null, // Will use initials
    
    // Academic & Teaching Details
    coursesTaught: [
      { id: 1, code: 'CS101', name: 'Introduction to AI', students: 45, semester: 'Fall 2024', status: 'active' },
      { id: 2, code: 'CS201', name: 'Machine Learning', students: 32, semester: 'Fall 2024', status: 'active' },
      { id: 3, code: 'CS301', name: 'Deep Learning', students: 28, semester: 'Fall 2024', status: 'active' },
      { id: 4, code: 'CS150', name: 'Data Science Fundamentals', students: 38, semester: 'Spring 2024', status: 'completed' }
    ],
    
    assignmentsManaged: {
      total: 15,
      active: 8,
      graded: 7,
      totalSubmissions: 324
    },
    
    researchPublications: [
      { id: 1, title: 'Deep Learning Applications in Healthcare', journal: 'AI Medical Journal', year: '2024' },
      { id: 2, title: 'Ethical Considerations in Machine Learning', journal: 'Tech Ethics Quarterly', year: '2023' },
      { id: 3, title: 'Student Engagement in Online Learning', journal: 'Educational Technology Review', year: '2023' }
    ],
    
    // Engagement & Student Interaction
    studentInteraction: {
      queriesResponded: 127,
      mentorshipSessions: 23,
      communityContributions: 56,
      averageResponseTime: '2.3 hours'
    },
    
    // Analytics Snapshot
    performanceOverview: {
      averageClassGPA: 3.6,
      studentSatisfactionRate: 92,
      courseCompletionRate: 96,
      participationRate: 85
    },
    
    classParticipation: [
      { course: 'CS101', participation: 78, students: 45 },
      { course: 'CS201', participation: 85, students: 32 },
      { course: 'CS301', participation: 92, students: 28 }
    ],
    
    // Settings
    privacy: {
      showFullName: true,
      showEmail: false,
      showPhone: false,
      showOfficeLocation: true,
      allowStudentContact: true
    },
    
    notifications: {
      assignmentSubmissions: true,
      studentQueries: true,
      peerActivity: true,
      systemUpdates: true,
      gradeReminders: true
    },
    
    // Achievements & Recognition
    teachingAwards: [
      { id: 1, name: 'Excellence in Teaching Award', issuer: 'University Board', year: '2023' },
      { id: 2, name: 'Innovation in Education', issuer: 'Tech Education Council', year: '2022' },
      { id: 3, name: 'Student Choice Award', issuer: 'Student Government', year: '2022' }
    ],
    
    systemBadges: [
      { id: 1, name: 'Most Helpful Teacher', icon: '🌟', description: 'Responded to 100+ student queries', earned: '2024-08-15' },
      { id: 2, name: 'High Engagement Champion', icon: '🚀', description: 'Achieved 90%+ class participation', earned: '2024-07-20' },
      { id: 3, name: 'Quick Responder', icon: '⚡', description: 'Average response time under 3 hours', earned: '2024-06-10' },
      { id: 4, name: 'Research Contributor', icon: '📚', description: 'Published 3+ research papers', earned: '2024-05-01' }
    ]
  };

  const tabs = [
    { id: 'info', label: 'Basic Info', icon: User },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'engagement', label: 'Engagement', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...teacherData });
  };

  const handleSave = () => {
    // In real app, this would update the backend
    setIsEditing(false);
    console.log('Saving changes:', editedData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({});
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Basic Information Tab
  const BasicInfoTab = () => (
    <div className="profile-tab-content">
      {/* Profile Header */}
      <div className="profile-header-card">
        <div className="profile-avatar-section">
          <div className="profile-avatar teacher-avatar">
            {teacherData.profilePicture ? (
              <img src={teacherData.profilePicture} alt="Profile" />
            ) : (
              <span className="avatar-initials">{getInitials(teacherData.fullName)}</span>
            )}
            <button className="avatar-edit-btn">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="profile-header-info">
            <h2 className="profile-name">{teacherData.fullName}</h2>
            <p className="profile-designation">{teacherData.designation}</p>
            <p className="profile-dept">{teacherData.department} Department</p>
            <p className="profile-id">{teacherData.employeeId}</p>
          </div>
        </div>
        
        <div className="profile-actions">
          {!isEditing ? (
            <button onClick={handleEdit} className="edit-profile-btn">
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="edit-actions">
              <button onClick={handleSave} className="save-btn">
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button onClick={handleCancel} className="cancel-btn">
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Personal Details */}
      <div className="profile-section-card">
        <h3 className="section-title">Professional Information</h3>
        
        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">
              <User className="w-4 h-4" />
              <span>Full Name</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editedData.fullName || teacherData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="edit-input"
              />
            ) : (
              <div className="info-value">{teacherData.fullName}</div>
            )}
          </div>

          <div className="info-item">
            <div className="info-label">
              <Shield className="w-4 h-4" />
              <span>Employee ID</span>
            </div>
            <div className="info-value non-editable">{teacherData.employeeId}</div>
          </div>

          <div className="info-item">
            <div className="info-label">
              <Briefcase className="w-4 h-4" />
              <span>Designation</span>
            </div>
            <div className="info-value">{teacherData.designation}</div>
          </div>

          <div className="info-item">
            <div className="info-label">
              <Building className="w-4 h-4" />
              <span>Department</span>
            </div>
            <div className="info-value">{teacherData.department}</div>
          </div>

          <div className="info-item">
            <div className="info-label">
              <Mail className="w-4 h-4" />
              <span>Email Address</span>
            </div>
            {isEditing ? (
              <input
                type="email"
                value={editedData.email || teacherData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="edit-input"
              />
            ) : (
              <div className="info-value">{teacherData.email}</div>
            )}
          </div>

          <div className="info-item">
            <div className="info-label">
              <Phone className="w-4 h-4" />
              <span>Phone Number</span>
            </div>
            {isEditing ? (
              <input
                type="tel"
                value={editedData.phone || teacherData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="edit-input"
              />
            ) : (
              <div className="info-value">{teacherData.phone}</div>
            )}
          </div>

          <div className="info-item">
            <div className="info-label">
              <MapPin className="w-4 h-4" />
              <span>Office Location</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editedData.officeLocation || teacherData.officeLocation}
                onChange={(e) => handleInputChange('officeLocation', e.target.value)}
                className="edit-input"
              />
            ) : (
              <div className="info-value">{teacherData.officeLocation}</div>
            )}
          </div>

          <div className="info-item">
            <div className="info-label">
              <Calendar className="w-4 h-4" />
              <span>Joined</span>
            </div>
            <div className="info-value">{teacherData.joinDate}</div>
          </div>
        </div>
      </div>

      {/* Research Publications */}
      <div className="profile-section-card">
        <h3 className="section-title">Research & Publications</h3>
        <div className="publications-list">
          {teacherData.researchPublications.map(pub => (
            <div key={pub.id} className="publication-item">
              <div className="pub-icon">
                <FileText className="w-5 h-5" />
              </div>
              <div className="pub-info">
                <h4 className="pub-title">{pub.title}</h4>
                <p className="pub-details">{pub.journal} • {pub.year}</p>
              </div>
              <button className="pub-link-btn">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Courses Tab
  const CoursesTab = () => (
    <div className="profile-tab-content">
      {/* Courses Overview */}
      <div className="profile-section-card">
        <h3 className="section-title">Teaching Overview</h3>
        <div className="teaching-stats">
          <div className="stat-card">
            <div className="stat-icon courses">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-number">{teacherData.coursesTaught.filter(c => c.status === 'active').length}</span>
              <span className="stat-label">Active Courses</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon students">
              <Users className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-number">{teacherData.coursesTaught.filter(c => c.status === 'active').reduce((sum, c) => sum + c.students, 0)}</span>
              <span className="stat-label">Total Students</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon assignments">
              <FileText className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-number">{teacherData.assignmentsManaged.total}</span>
              <span className="stat-label">Assignments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Courses */}
      <div className="profile-section-card">
        <h3 className="section-title">Current Courses</h3>
        <div className="courses-list">
          {teacherData.coursesTaught.filter(course => course.status === 'active').map(course => (
            <div key={course.id} className="course-item">
              <div className="course-info">
                <h4 className="course-name">{course.code} - {course.name}</h4>
                <p className="course-details">{course.students} students • {course.semester}</p>
              </div>
              <div className="course-actions">
                <button className="course-action-btn">
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assignment Management */}
      <div className="profile-section-card">
        <h3 className="section-title">Assignment Management</h3>
        <div className="assignment-overview-grid">
          <div className="assignment-stat active">
            <div className="assignment-icon">
              <Clock className="w-6 h-6" />
            </div>
            <div className="assignment-details">
              <span className="assignment-number">{teacherData.assignmentsManaged.active}</span>
              <span className="assignment-label">Active</span>
            </div>
          </div>
          <div className="assignment-stat graded">
            <div className="assignment-icon">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="assignment-details">
              <span className="assignment-number">{teacherData.assignmentsManaged.graded}</span>
              <span className="assignment-label">Graded</span>
            </div>
          </div>
          <div className="assignment-stat submissions">
            <div className="assignment-icon">
              <Upload className="w-6 h-6" />
            </div>
            <div className="assignment-details">
              <span className="assignment-number">{teacherData.assignmentsManaged.totalSubmissions}</span>
              <span className="assignment-label">Submissions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Engagement Tab
  const EngagementTab = () => (
    <div className="profile-tab-content">
      {/* Student Interaction Stats */}
      <div className="profile-section-card">
        <h3 className="section-title">Student Interaction</h3>
        <div className="interaction-stats">
          <div className="interaction-item">
            <div className="interaction-icon queries">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="interaction-info">
              <span className="interaction-number">{teacherData.studentInteraction.queriesResponded}</span>
              <span className="interaction-label">Queries Responded</span>
            </div>
          </div>
          <div className="interaction-item">
            <div className="interaction-icon sessions">
              <Users className="w-6 h-6" />
            </div>
            <div className="interaction-info">
              <span className="interaction-number">{teacherData.studentInteraction.mentorshipSessions}</span>
              <span className="interaction-label">Mentorship Sessions</span>
            </div>
          </div>
          <div className="interaction-item">
            <div className="interaction-icon contributions">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="interaction-info">
              <span className="interaction-number">{teacherData.studentInteraction.communityContributions}</span>
              <span className="interaction-label">Community Posts</span>
            </div>
          </div>
          <div className="interaction-item">
            <div className="interaction-icon response">
              <Send className="w-6 h-6" />
            </div>
            <div className="interaction-info">
              <span className="interaction-number">{teacherData.studentInteraction.averageResponseTime}</span>
              <span className="interaction-label">Avg Response Time</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Badges */}
      <div className="profile-section-card">
        <h3 className="section-title">Achievement Badges</h3>
        <div className="badges-grid">
          {teacherData.systemBadges.map(badge => (
            <div key={badge.id} className="badge-item">
              <div className="badge-icon">{badge.icon}</div>
              <div className="badge-info">
                <h4 className="badge-name">{badge.name}</h4>
                <p className="badge-description">{badge.description}</p>
                <span className="badge-date">Earned: {badge.earned}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Teaching Awards */}
      <div className="profile-section-card">
        <h3 className="section-title">Teaching Awards & Recognition</h3>
        <div className="awards-list">
          {teacherData.teachingAwards.map(award => (
            <div key={award.id} className="award-item">
              <div className="award-icon">
                <Trophy className="w-8 h-8" />
              </div>
              <div className="award-info">
                <h4 className="award-name">{award.name}</h4>
                <p className="award-issuer">Issued by {award.issuer}</p>
                <span className="award-year">{award.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Analytics Tab
  const AnalyticsTab = () => (
    <div className="profile-tab-content">
      {/* Performance Overview */}
      <div className="profile-section-card">
        <h3 className="section-title">Performance Overview</h3>
        <div className="performance-stats">
          <div className="performance-item">
            <div className="performance-label">Average Class GPA</div>
            <div className="performance-value">{teacherData.performanceOverview.averageClassGPA}</div>
          </div>
          <div className="performance-item">
            <div className="performance-label">Student Satisfaction</div>
            <div className="performance-value">{teacherData.performanceOverview.studentSatisfactionRate}%</div>
          </div>
          <div className="performance-item">
            <div className="performance-label">Course Completion</div>
            <div className="performance-value">{teacherData.performanceOverview.courseCompletionRate}%</div>
          </div>
          <div className="performance-item">
            <div className="performance-label">Participation Rate</div>
            <div className="performance-value">{teacherData.performanceOverview.participationRate}%</div>
          </div>
        </div>
      </div>

      {/* Class Participation Stats */}
      <div className="profile-section-card">
        <h3 className="section-title">Class Participation Statistics</h3>
        <div className="participation-analytics">
          {teacherData.classParticipation.map((data) => (
            <div key={data.course} className="participation-item">
              <div className="participation-header">
                <span className="course-name">{data.course}</span>
                <span className="participation-rate">{data.participation}%</span>
              </div>
              <div className="participation-bar">
                <div 
                  className="participation-fill" 
                  style={{ width: `${data.participation}%` }}
                ></div>
              </div>
              <div className="participation-students">{data.students} students</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Settings Tab
  const SettingsTab = () => (
    <div className="profile-tab-content">
      {/* Privacy Settings */}
      <div className="profile-section-card">
        <h3 className="section-title">Privacy Settings</h3>
        <div className="settings-list">
          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Show Full Name</h4>
              <p className="setting-description">Display your full name to students</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={teacherData.privacy.showFullName}
                onChange={() => {}}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Show Email</h4>
              <p className="setting-description">Make email visible to students</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={teacherData.privacy.showEmail}
                onChange={() => {}}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Show Office Location</h4>
              <p className="setting-description">Display office location for students</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={teacherData.privacy.showOfficeLocation}
                onChange={() => {}}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Allow Student Contact</h4>
              <p className="setting-description">Allow students to send direct messages</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={teacherData.privacy.allowStudentContact}
                onChange={() => {}}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="profile-section-card">
        <h3 className="section-title">Notification Preferences</h3>
        <div className="settings-list">
          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Assignment Submissions</h4>
              <p className="setting-description">Get notified about new submissions</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={teacherData.notifications.assignmentSubmissions}
                onChange={() => {}}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Student Queries</h4>
              <p className="setting-description">Notifications for student questions</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={teacherData.notifications.studentQueries}
                onChange={() => {}}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Peer Activity</h4>
              <p className="setting-description">Updates from fellow teachers</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={teacherData.notifications.peerActivity}
                onChange={() => {}}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Grade Reminders</h4>
              <p className="setting-description">Reminders to grade assignments</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={teacherData.notifications.gradeReminders}
                onChange={() => {}}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="teacher-profile-wrapper">
      {/* Profile Header */}
      <div className="profile-topbar">
        <div className="profile-topbar-left">
          <button onClick={onBackToDashboard} className="back-btn">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="profile-title">Teacher Profile</h1>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        {/* Tab Navigation */}
        <div className="profile-tabs">
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="profile-main-content">
          {activeTab === 'info' && <BasicInfoTab />}
          {activeTab === 'courses' && <CoursesTab />}
          {activeTab === 'engagement' && <EngagementTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;