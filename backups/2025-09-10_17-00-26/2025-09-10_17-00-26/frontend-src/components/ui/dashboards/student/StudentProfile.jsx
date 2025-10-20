// StudentProfile.jsx - Student Profile Page with Tabbed Layout
import React, { useState } from "react";
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
  User,
  Star,
  FileText,
} from "lucide-react";
import "../../../css/dashboards/student/StudentProfile.css";
import { useNavigate } from "react-router-dom";

const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const navigate = useNavigate();

  const onBackToDashboard = () => {
    navigate("/dashboard/student");
  };

  // Mock student data
  const studentData = {
    fullName: "Alex Johnson",
    registrationNumber: "STU2023001",
    department: "Computer Science",
    yearOfStudy: "3rd Year",
    email: "alex.johnson@university.edu",
    phone: "+1 (555) 123-4567",
    location: "Boston, MA",
    joinDate: "September 2021",
    profilePicture: null,

    enrolledCourses: [
      { id: 1, code: "CS301", name: "Machine Learning", credits: 4, progress: 85 },
      { id: 2, code: "MATH201", name: "Statistics", credits: 3, progress: 92 },
      { id: 3, code: "CS250", name: "Data Structures", credits: 4, progress: 78 },
    ],

    assignments: {
      total: 24,
      completed: 18,
      pending: 6,
    },

    grades: {
      gpa: 3.7,
      completedCredits: 78,
    },

    recentMoods: [
      { date: "2024-09-01", mood: "😊", note: "Great study session!" },
      { date: "2024-08-31", mood: "😐", note: "Feeling neutral" },
      { date: "2024-08-30", mood: "😊", note: "Productive day" },
    ],

    communityActivity: {
      questionsAsked: 23,
      answersGiven: 47,
      helpfulVotes: 156,
      studyGroupsJoined: 5,
    },

    badges: [
      { id: 1, name: "Helpful Helper", icon: "🤝", description: "Answered 25+ questions" },
      { id: 2, name: "Consistent Learner", icon: "🔥", description: "30-day study streak" },
    ],

    certificates: [
      { id: 1, name: "Python Fundamentals", issuer: "CodeAcademy", date: "2024-06-15" },
    ],
  };

  const tabs = [
    { id: "info", label: "Basic Info", icon: User },
    { id: "academics", label: "Academics", icon: GraduationCap },
    { id: "wellness", label: "Wellness", icon: Heart },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...studentData });
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Saved changes:", editedData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({});
  };

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const getInitials = (name) => name.split(" ").map((n) => n[0]).join("");

  // Basic Info Tab
  const BasicInfoTab = () => (
    <div className="profile-tab-content">
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
            <h2>{studentData.fullName}</h2>
            <p>{studentData.registrationNumber}</p>
            <p>{studentData.department} • {studentData.yearOfStudy}</p>
          </div>
        </div>

        <div className="profile-actions">
          {!isEditing ? (
            <button onClick={handleEdit} className="edit-profile-btn">
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <>
              <button onClick={handleSave} className="save-btn">
                <Save className="w-4 h-4" />
                Save
              </button>
              <button onClick={handleCancel} className="cancel-btn">
                <X className="w-4 h-4" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Academics Tab
  const AcademicsTab = () => (
    <div className="profile-tab-content">
      <div className="profile-section-card">
        <h3 className="section-title">Academic Overview</h3>
        <div className="academic-stats">
          <div className="stat-card">
            <TrendingUp className="stat-icon" />
            <div>
              <span>{studentData.grades.gpa}</span>
              <p>Current GPA</p>
            </div>
          </div>
          <div className="stat-card">
            <BookOpen className="stat-icon" />
            <div>
              <span>{studentData.grades.completedCredits}</span>
              <p>Credits Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="student-profile-wrapper">
      <div className="profile-topbar">
        <button onClick={onBackToDashboard} className="back-btn">
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <h1>Student Profile</h1>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`profile-tab ${activeTab === tab.id ? "active" : ""}`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="profile-main-content">
          {activeTab === "info" && <BasicInfoTab />}
          {activeTab === "academics" && <AcademicsTab />}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
