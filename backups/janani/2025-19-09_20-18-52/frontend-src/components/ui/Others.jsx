// Others.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, User, Hash, Mail, Lock, Briefcase, Globe, BookOpen } from 'lucide-react';
import '../css/Others.css';

const Others = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    regNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
    role: '',
    contribution: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Add API call for others registration
    console.log('Others registration:', formData);
  };

  return (
    <div className="others-wrapper">
      {/* Background */}
      <div className="others-background">
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
      <div className="others-container">
        <div className="others-card">
          <div className="others-header">
            <div className="others-logo">
              <div className="logo-icon">
                <Brain className="logo-brain" />
              </div>
              <span className="logo-text">AcadWell</span>
            </div>
            <h1 className="others-title">Others Registration</h1>
            <p className="others-subtitle">Fill in your details to join the platform</p>
          </div>

          <form onSubmit={handleSubmit} className="others-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" className="form-input" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Registration Number</label>
              <div className="input-wrapper">
                <Hash className="input-icon" />
                <input type="text" name="regNumber" value={formData.regNumber} onChange={handleChange} placeholder="10-digit Registration No." maxLength="10" className="form-input" required />
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
              <label className="form-label">Organization / Institution</label>
              <div className="input-wrapper">
                <Globe className="input-icon" />
                <input type="text" name="organization" value={formData.organization} onChange={handleChange} placeholder="Your Organization" className="form-input" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <div className="input-wrapper">
                <Briefcase className="input-icon" />
                <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="e.g. Mentor, Counselor, Alumni" className="form-input" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Area of Contribution</label>
              <div className="input-wrapper">
                <BookOpen className="input-icon" />
                <input type="text" name="contribution" value={formData.contribution} onChange={handleChange} placeholder="e.g. Career Guidance, Wellness Support" className="form-input" required />
              </div>
            </div>

            <button type="submit" className="others-submit-btn">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Others;
