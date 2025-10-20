import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Brain } from "lucide-react";
import { authAPI } from "../../services/api";
import "../css/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      const res = await authAPI.login(formData);
      const data = res.data;

      if (data.success) {
        // ✅ Save token + user details
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ Save role-based token
        if (data.user.role === "teacher") {
          localStorage.setItem("teacherToken", data.token);
        } else if (data.user.role === "student") {
          localStorage.setItem("studentToken", data.token);
        }

        setSuccess("Login successful! Redirecting...");

        setTimeout(() => {
          if (data.user.role === "teacher") navigate("/dashboard/teacher");
          else if (data.user.role === "student") navigate("/dashboard/student");
          else navigate("/dashboard/others");
        }, 1000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <Brain className="logo-brain" />
              <span className="logo-text">AcadWell</span>
            </div>
            <h1>Welcome Back</h1>
            <p>Login to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <Mail className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <Lock className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* ✅ Register link */}
          <div className="register-link">
            <p>Don't have an account?</p>
            <button
              className="register-btn"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
