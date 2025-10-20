// Student.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, User, Hash, Mail, Lock, School, BookOpen } from 'lucide-react';
import '../css/Student.css';

const Student = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    regNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    year: '',
    field: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const response = await fetch("http://10.231.41.76:5000/api/auth/register/student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        regNumber: formData.regNumber,
        email: formData.email,
        password: formData.password,
        university: formData.university,
        year: formData.year,
        field: formData.field,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ Registration successful! You can now log in.");
      navigate("/login"); // redirect to login page
    } else {
      alert("❌ Error: " + data.error);
    }
  } catch (error) {
    console.error("Registration failed:", error);
    alert("Something went wrong. Please try again.");
  }
};


  return (
    <div className="student-wrapper">
      {/* Background */}
      <div className="student-background">
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
      <div className="student-container">
        <div className="student-card">
          <div className="student-header">
            <div className="student-logo">
              <div className="logo-icon">
                <Brain className="logo-brain" />
              </div>
              <span className="logo-text">AcadWell</span>
            </div>
            <h1 className="student-title">Student Registration</h1>
            <p className="student-subtitle">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="student-form">
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
              <label className="form-label">University</label>
              <div className="input-wrapper">
                <School className="input-icon" />
                <input type="text" name="university" value={formData.university} onChange={handleChange} placeholder="Your University" className="form-input" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Year of Study</label>
              <div className="input-wrapper">
                <BookOpen className="input-icon" />
                <input type="text" name="year" value={formData.year} onChange={handleChange} placeholder="e.g. 2nd Year" className="form-input" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Field of Study</label>
              <div className="input-wrapper">
                <BookOpen className="input-icon" />
                <input type="text" name="field" value={formData.field} onChange={handleChange} placeholder="e.g. Computer Science" className="form-input" required />
              </div>
            </div>

            <button type="submit" className="student-submit-btn">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Student;
