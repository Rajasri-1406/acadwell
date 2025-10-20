// StudentProfile.jsx - Student Profile Page with Tabbed Layout
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
  Heart,
  MessageSquare,
  HelpCircle,
  Shield,
  Lock,
  User,
  Star,
  Trophy,
  Flame,
  FileText,
  BarChart3,
  Activity
} from 'lucide-react';
import '../../../css/dashboards/student/StudentProfile.css';
import { useNavigate } from 'react-router-dom';
const StudentProfile = () => {
    const [activeTab, setActiveTab] = useState('info');
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const navigate = useNavigate();
    const onBackToDashboard  =()=>{
    navigate("/dashboard/student");
}// Mock student data
  const studentData = {
    // Basic Information
    fullName: 'Alex Johnson',
    registrationNumber: 'STU2023001',
    department: 'Computer Science',
    yearOfStudy: '3rd Year',
    email: 'alex.johnson@university.edu',
    phone: '+1 (555) 123-4567',
    location: 'Boston, MA',
    joinDate: 'September 2021',
    profilePicture: null, // Will use initials
    
    // Academic Details
    enrolledCourses: [
      { id: 1, code: 'CS301', name: 'Machine Learning', credits: 4, progress: 85 },
      { id: 2, code: 'MATH201', name: 'Statistics', credits: 3, progress: 92 },
      { id: 3, code: 'CS250', name: 'Data Structures', credits: 4, progress: 78 },
      { id: 4, code: 'PHIL201', name: 'Ethics in AI', credits: 2, progress: 88 }
    ],
    
    assignments: {
      total: 24,
      completed: 18,
      pending: 6,
      overdue: 0
    },
    
    grades: {
      gpa: 3.7,
      lastSemesterGPA: 3.8,
      totalCredits: 84,
      completedCredits: 78
    },
    
    // Wellness & Activity
    recentMoods: [
      { date: '2024-09-01', mood: '😊', note: 'Great study session!' },
      { date: '2024-08-31', mood: '😐', note: 'Feeling neutral' },
      { date: '2024-08-30', mood: '😊', note: 'Productive day' },
      { date: '2024-08-29', mood: '😔', note: 'Exam stress' },
      { date: '2024-08-28', mood: '😊', note: 'Good mood' }
    ],
    
    communityActivity: {
      questionsAsked: 23,
      answersGiven: 47,
      helpfulVotes: 156,
      studyGroupsJoined: 5
    },
    
    badges: [
      { id: 1, name: 'Helpful Helper', icon: '🤝', description: 'Answered 25+ questions', earned: '2024-08-15' },
      { id: 2, name: 'Consistent Learner', icon: '🔥', description: '30-day study streak', earned: '2024-08-01' },
      { id: 3, name: 'Mood Tracker', icon: '❤️', description: 'Logged mood 14 days straight', earned: '2024-07-20' },
      { id: 4, name: 'Early Bird', icon: '🌅', description: 'Completed assignments early', earned: '2024-07-10' }
    ],
    
    // Settings
    privacy: {
      showFullName: true,
      showEmail: false,
      showPhone: false,
      anonymousMode: false
    },
    
    notifications: {
      assignmentReminders: true,
      wellnessNudges: true,
      peerMessages: true,
      groupInvitations: true,
      gradeUpdates: true
    },
    
    // Achievements
    certificates: [
      { id: 1, name: 'Python Fundamentals', issuer: 'CodeAcademy', date: '2024-06-15' },
      { id: 2, name: 'Data Analysis with R', issuer: 'Coursera', date: '2024-05-20' }
    ],
    
    milestones: [
      { id: 1, title: 'Completed 20 assignments', icon: '📚', date: '2024-08-25' },
      { id: 2, title: 'Maintained 3.5+ GPA', icon: '🎯', date: '2024-08-20' },
      { id: 3, title: '7-day mood logging streak', icon: '💝', date: '2024-08-18' },
      { id: 4, title: 'Joined 5 study groups', icon: '👥', date: '2024-08-10' }
    ]
  };

  const tabs = [
    { id: 'info', label: 'Basic Info', icon: User },
    { id: 'academics', label: 'Academics', icon: GraduationCap },
    { id: 'wellness', label: 'Wellness', icon: Heart },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...studentData });
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
          <div className="profile-avatar">
            {studentData.profilePicture ? (
              <img src={studentData.profilePicture} alt="Profile" />
            ) : (
              <span className="avatar-initials">{getInitials(studentData.fullName)}</span>
            )}
            <button className="avatar-edit-btn">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="profile-header-info">
            <h2 className="profile-name">{studentData.fullName}</h2>
            <p className="profile-reg">{studentData.registrationNumber}</p>
            <p className="profile-dept">{studentData.department} • {studentData.yearOfStudy}</p>
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
        <h3 className="section-title">Personal Information</h3>
        
        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">
              <User className="w-4 h-4" />
              <span>Full Name</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editedData.fullName || studentData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="edit-input"
              />
            ) : (
              <div className="info-value">{studentData.fullName}</div>
            )}
          </div>

          <div className="info-item">
            <div className="info-label">
              <Shield className="w-4 h-4" />
              <span>Registration Number</span>
            </div>
            <div className="info-value non-editable">{studentData.registrationNumber}</div>
          </div>

          <div className="info-item">
            <div className="info-label">
              <Mail className="w-4 h-4" />
              <span>Email Address</span>
            </div>
            {isEditing ? (
              <input
                type="email"
                value={editedData.email || studentData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="edit-input"
              />
            ) : (
              <div className="info-value">{studentData.email}</div>
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
                value={editedData.phone || studentData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="edit-input"
              />
            ) : (
              <div className="info-value">{studentData.phone}</div>
            )}
          </div>

          <div className="info-item">
            <div className="info-label">
              <GraduationCap className="w-4 h-4" />
              <span>Department</span>
            </div>
            <div className="info-value">{studentData.department}</div>
          </div>

          <div className="info-item">
            <div className="info-label">
              <Calendar className="w-4 h-4" />
              <span>Year of Study</span>
            </div>
            <div className="info-value">{studentData.yearOfStudy}</div>
          </div>

          <div className="info-item">
            <div className="info-label">
              <MapPin className="w-4 h-4" />
              <span>Location</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editedData.location || studentData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="edit-input"
              />
            ) : (
              <div className="info-value">{studentData.location}</div>
            )}
          </div>

          <div className="info-item">
            <div className="info-label">
              <Calendar className="w-4 h-4" />
              <span>Joined</span>
            </div>
            <div className="info-value">{studentData.joinDate}</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Academics Tab
  const AcademicsTab = () => (
    <div className="profile-tab-content">
      {/* Academic Overview */}
      <div className="profile-section-card">
        <h3 className="section-title">Academic Overview</h3>
        <div className="academic-stats">
          <div className="stat-card">
            <div className="stat-icon gpa">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-number">{studentData.grades.gpa}</span>
              <span className="stat-label">Current GPA</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon credits">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-number">{studentData.grades.completedCredits}</span>
              <span className="stat-label">Credits Completed</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon assignments">
              <FileText className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-number">{studentData.assignments.completed}</span>
              <span className="stat-label">Assignments Done</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div className="profile-section-card">
        <h3 className="section-title">Enrolled Courses</h3>
        <div className="courses-list">
          {studentData.enrolledCourses.map(course => (
            <div key={course.id} className="course-item">
              <div className="course-info">
                <h4 className="course-name">{course.name}</h4>
                <p className="course-code">{course.code} • {course.credits} Credits</p>
              </div>
              <div className="course-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{course.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assignment Status */}
      <div className="profile-section-card">
        <h3 className="section-title">Assignment Overview</h3>
        <div className="assignment-grid">
          <div className="assignment-stat completed">
            <CheckCircle className="w-8 h-8" />
            <div>
              <span className="assignment-number">{studentData.assignments.completed}</span>
              <span className="assignment-label">Completed</span>
            </div>
          </div>
          <div className="assignment-stat pending">
            <Clock className="w-8 h-8" />
            <div>
              <span className="assignment-number">{studentData.assignments.pending}</span>
              <span className="assignment-label">Pending</span>
            </div>
          </div>
          <div className="assignment-stat total">
            <FileText className="w-8 h-8" />
            <div>
              <span className="assignment-number">{studentData.assignments.total}</span>
              <span className="assignment-label">Total</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Wellness Tab
  const WellnessTab = () => (
    <div className="profile-tab-content">
      {/* Recent Mood Logs */}
      <div className="profile-section-card">
        <h3 className="section-title">Recent Mood Logs</h3>
        <div className="mood-timeline">
          {studentData.recentMoods.map((mood, index) => (
            <div key={index} className="mood-entry">
              <div className="mood-date">{mood.date}</div>
              <div className="mood-indicator">{mood.mood}</div>
              <div className="mood-note">{mood.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Activity */}
      <div className="profile-section-card">
        <h3 className="section-title">Community Participation</h3>
        <div className="activity-stats">
          <div className="activity-item">
            <div className="activity-icon questions">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="activity-info">
              <span className="activity-number">{studentData.communityActivity.questionsAsked}</span>
              <span className="activity-label">Questions Asked</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon answers">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="activity-info">
              <span className="activity-number">{studentData.communityActivity.answersGiven}</span>
              <span className="activity-label">Answers Given</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon votes">
              <Star className="w-6 h-6" />
            </div>
            <div className="activity-info">
              <span className="activity-number">{studentData.communityActivity.helpfulVotes}</span>
              <span className="activity-label">Helpful Votes</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon groups">
              <Target className="w-6 h-6" />
            </div>
            <div className="activity-info">
              <span className="activity-number">{studentData.communityActivity.studyGroupsJoined}</span>
              <span className="activity-label">Study Groups</span>
            </div>
          </div>
        </div>
      </div>

      {/* Earned Badges */}
      <div className="profile-section-card">
        <h3 className="section-title">Earned Badges</h3>
        <div className="badges-grid">
          {studentData.badges.map(badge => (
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
    </div>
  );

  // Achievements Tab
  const AchievementsTab = () => (
    <div className="profile-tab-content">
      {/* Certificates */}
      <div className="profile-section-card">
        <h3 className="section-title">Certificates & Recognition</h3>
        <div className="certificates-list">
          {studentData.certificates.map(cert => (
            <div key={cert.id} className="certificate-item">
              <div className="cert-icon">
                <Award className="w-8 h-8" />
              </div>
              <div className="cert-info">
                <h4 className="cert-name">{cert.name}</h4>
                <p className="cert-issuer">Issued by {cert.issuer}</p>
                <span className="cert-date">{cert.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="profile-section-card">
        <h3 className="section-title">Milestones Achieved</h3>
        <div className="milestones-list">
          {studentData.milestones.map(milestone => (
            <div key={milestone.id} className="milestone-item">
              <div className="milestone-icon">{milestone.icon}</div>
              <div className="milestone-info">
                <h4 className="milestone-title">{milestone.title}</h4>
                <span className="milestone-date">{milestone.date}</span>
              </div>
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
              <p className="setting-description">Display your full name in community</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={studentData.privacy.showFullName}
                onChange={() => {}}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Show Email</h4>
              <p className="setting-description">Make email visible to other students</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={studentData.privacy.showEmail}
                onChange={() => {}}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Anonymous Mode</h4>
              <p className="setting-description">Show as "Anonymous Learner" in community</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={studentData.privacy.anonymousMode}
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
              <h4 className="setting-name">Assignment Reminders</h4>
              <p className="setting-description">Get notified about upcoming deadlines</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={studentData.notifications.assignmentReminders}
                onChange={() => {}}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Wellness Nudges</h4>
              <p className="setting-description">Daily mood logging reminders</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={studentData.notifications.wellnessNudges}
                onChange={() => {}}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Peer Messages</h4>
              <p className="setting-description">Notifications from study group members</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={studentData.notifications.peerMessages}
                onChange={() => {}}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4 className="setting-name">Grade Updates</h4>
              <p className="setting-description">Get notified when grades are posted</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={studentData.notifications.gradeUpdates}
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
    <div className="student-profile-wrapper">
      {/* Profile Header */}
      <div className="profile-topbar">
        <div className="profile-topbar-left">
          <button onClick={onBackToDashboard} className="back-btn">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="profile-title">Student Profile</h1>
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
          {activeTab === 'academics' && <AcademicsTab />}
          {activeTab === 'wellness' && <WellnessTab />}
          {activeTab === 'achievements' && <AchievementsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;