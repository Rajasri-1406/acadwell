// Teacher.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, User, Hash, Mail, Lock, Briefcase, BookOpen } from 'lucide-react';
import '../css/Teacher.css';

const Teacher = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    empNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    designation: '',
    expertise: '',
    experience: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Add API call for teacher registration
    console.log('Teacher registration:', formData);
  };

  return (
    <div className="teacher-wrapper">
      {/* Background */}
      <div className="teacher-background">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        <div className="bg-blob bg-blob-3"></div>
      </div>

      {/* Back Button */}
      <button onClick={() => navigate('/register')} className="back-button">
        <ArrowLeft className="back-icon" />
        <span>Back</span>
      </button>

      {/* Main Content */}
      <div className="teacher-container">
        <div className="teacher-card">
          <div className="teacher-header">
            <div className="teacher-logo">
              <div className="logo-icon">
                <Brain className="logo-brain" />
              </div>
              <span className="logo-text">AcadWell</span>
            </div>
            <h1 className="teacher-title">Teacher Registration</h1>
            <p className="teacher-subtitle">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="teacher-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" className="form-input" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Employee Number</label>
              <div className="input-wrapper">
                <Hash className="input-icon" />
                <input type="text" name="empNumber" value={formData.empNumber} onChange={handleChange} placeholder="Emplyee number" maxLength="10" className="form-input" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className="form-input" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter password" className="form-input" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter password" className="form-input" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <div className="input-wrapper">
                <BookOpen className="input-icon" />
                <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="e.g. Computer Science" className="form-input" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Designation</label>
              <div className="input-wrapper">
                <Briefcase className="input-icon" />
                <input type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="e.g. Assistant Professor" className="form-input" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Expertise</label>
              <div className="input-wrapper">
                <BookOpen className="input-icon" />
                <input type="text" name="expertise" value={formData.expertise} onChange={handleChange} placeholder="e.g. AI, Chemistry" className="form-input" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Years of Experience</label>
              <div className="input-wrapper">
                <Briefcase className="input-icon" />
                <input type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 5" className="form-input" required />
              </div>
            </div>

            <button type="submit" className="teacher-submit-btn">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Teacher;
