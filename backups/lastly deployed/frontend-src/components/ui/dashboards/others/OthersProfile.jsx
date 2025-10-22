import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Briefcase,
  Clock,
  LogOut,
} from "lucide-react";
import { authAPI } from "../../../services/api";
import "../../css/dashboards/others/OthersProfile.css";

const OthersProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await authAPI.getProfile();
        if (res.data.success && res.data.user) {
          setProfile(res.data.user);
        } else {
          setError(res.data.message || "Failed to load profile");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Unable to fetch profile. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // ✅ Logout handler
  const handleLogout = async () => {
    await authAPI.logout();
    navigate("/login");
  };

  // 🕒 Loading state
  if (loading) {
    return (
      <div className="others-profile-wrapper">
        <p className="loading-text">Loading profile...</p>
      </div>
    );
  }

  // ⚠️ Error state
  if (error) {
    return (
      <div className="others-profile-wrapper">
        <p className="error-text">{error}</p>
        <button onClick={() => navigate("/login")} className="back-login-btn">
          Go to Login
        </button>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="others-profile-wrapper">
      <div className="others-profile-card">
        {/* Header */}
        <div className="profile-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            <ArrowLeft className="back-icon" /> Back
          </button>
          <h1 className="profile-title">
            {profile.name
              ? `${profile.name.split(" ")[0]}'s Profile`
              : "Profile"}
          </h1>
        </div>

        {/* Profile Info */}
        <div className="profile-content">
          <div className="profile-avatar">
            <User size={64} className="profile-avatar-icon" />
          </div>

          <h2 className="profile-name">{profile.name || "No Name"}</h2>
          <p className="profile-role">
            {profile.role === "others"
              ? profile.userRole || "User"
              : profile.role?.toUpperCase()}
          </p>

          <div className="profile-details">
            <div className="detail-item">
              <Mail className="detail-icon" />
              <span>{profile.email || "No Email"}</span>
            </div>

            {profile.organization && (
              <div className="detail-item">
                <Briefcase className="detail-icon" />
                <span>{profile.organization}</span>
              </div>
            )}

            <div className="detail-item">
              <Clock className="detail-icon" />
              <span>
                Joined on{" "}
                {profile.created_at
                  ? new Date(profile.created_at).toLocaleDateString("en-IN")
                  : "Unknown Date"}
              </span>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut className="logout-icon" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default OthersProfile;
