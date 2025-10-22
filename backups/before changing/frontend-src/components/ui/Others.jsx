import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, User, Mail, Lock, Briefcase } from 'lucide-react';
import { authAPI } from '../../services/api'; // ✅ Correct import
import '../css/Others.css';

const Others = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
    role: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.registerOthers({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        organization: formData.organization,
        role: formData.role
      });

      if (response.data.success) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
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
            <p className="others-subtitle">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="others-form">
            {/* Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Organization */}
            <div className="form-group">
              <label className="form-label">Organization</label>
              <div className="input-wrapper">
                <Briefcase className="input-icon" />
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Your Organization"
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Role */}
            <div className="form-group">
              <label className="form-label">Role</label>
              <div className="input-wrapper">
                <Briefcase className="input-icon" />
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. External Examiner"
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && <p className="error-text">{error}</p>}

            {/* Success Message */}
            {success && <p className="success-text">{success}</p>}

            {/* Submit Button */}
            <button type="submit" className="others-submit-btn" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Others;
