import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  School,
  Users,
  GraduationCap,
  BookOpen,
  Heart,
  CheckCircle,
  Star,
  LogOut
} from 'lucide-react';
import '../css/DashboardLanding.css';

const DashboardLanding = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);

    // ✅ Get logged-in user data from localStorage
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token || !storedUser) {
      // If no token, redirect to login
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  // ✅ Role-based dashboards
  const roles = [
    {
      id: 'student',
      title: 'Student Dashboard',
      description: 'Access Q&A system, peer matching, wellness tracking, and progress analytics',
      icon: <School className="role-icon" />,
      color: 'from-blue-500 to-indigo-600',
      features: [
        'Smart Q&A System',
        'Peer Matching & Study Groups',
        'Personal Wellness Tracking',
        'Academic Progress Analytics'
      ],
      route: '/dashboard/student'
    },
    {
      id: 'teacher',
      title: 'Teacher Dashboard',
      description: 'Monitor student progress, provide guidance, and create a supportive learning environment',
      icon: <GraduationCap className="role-icon" />,
      color: 'from-green-500 to-emerald-600',
      features: [
        'Student Progress Monitoring',
        'Q&A Moderation Tools',
        'Wellness Insights Overview',
        'Resource Management'
      ],
      route: '/dashboard/teacher'
    },
    {
      id: 'others',
      title: 'General Dashboard',
      description: 'Explore features and connect with the academic community',
      icon: <Users className="role-icon" />,
      color: 'from-purple-500 to-pink-600',
      features: [
        'Community Access',
        'Resource Library',
        'Support Network',
        'General Wellness Tools'
      ],
      route: '/dashboard/others'
    }
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role.id);
    setTimeout(() => {
      navigate(role.route);
    }, 300);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="dashboard-landing-wrapper">
      {/* Animated Background */}
      <div className="background-blobs"></div>

      {/* Navigation Bar */}
      <nav className="nav-bar">
        <div className="nav-logo">
          <div className="logo-icon">
            <Brain className="logo-brain" />
          </div>
          <span className="logo-text">AcadWell</span>
        </div>

        <div className="nav-actions">
          <span className="welcome-text">Hi, {user.name || 'User'} 👋</span>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <section className="dashboard-landing-section">
        <div className={`dashboard-landing-content ${isVisible ? 'fade-in' : 'fade-out'}`}>
          {/* Header */}
          <div className="dashboard-landing-header">
            <div className="header-badge">
              <Star className="header-badge-icon" />
              <span>Welcome to Your Dashboard</span>
            </div>

            <h1 className="dashboard-landing-heading">
              Choose Your <span className="gradient-text">Dashboard Experience</span>
            </h1>

            <p className="dashboard-landing-subtext">
              Select your role to access personalized features designed for your academic journey and wellness needs.
            </p>
          </div>

          {/* Role Selection Grid */}
          <div className="roles-grid">
            {roles.map((role) => (
              <div
                key={role.id}
                className={`role-card ${selectedRole === role.id ? 'role-selected' : ''}`}
                onClick={() => handleRoleSelect(role)}
              >
                <div className="role-card-header">
                  <div className={`role-icon-wrapper bg-gradient-to-br ${role.color}`}>
                    {role.icon}
                  </div>
                  <div className="role-card-content">
                    <h3 className="role-title">{role.title}</h3>
                    <p className="role-description">{role.description}</p>
                  </div>
                </div>

                <div className="role-features">
                  {role.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="role-feature">
                      <CheckCircle className="feature-check-icon" />
                      <span className="feature-text">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="role-card-footer">
                  <button className="role-select-btn">
                    <span>Select Dashboard</span>
                    <ArrowRight className="btn-icon" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info Section */}
          <div className="dashboard-info-section">
            <div className="info-card">
              <div className="info-icon-wrapper">
                <Heart className="info-icon" />
              </div>
              <div className="info-content">
                <h4 className="info-title">Safe & Anonymous Environment</h4>
                <p className="info-description">
                  All dashboards maintain complete privacy and provide a judgment-free space for your academic wellness journey.
                </p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon-wrapper">
                <BookOpen className="info-icon" />
              </div>
              <div className="info-content">
                <h4 className="info-title">Comprehensive Support</h4>
                <p className="info-description">
                  Access 24/7 support, crisis detection, and a community of peers ready to help you succeed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardLanding;
