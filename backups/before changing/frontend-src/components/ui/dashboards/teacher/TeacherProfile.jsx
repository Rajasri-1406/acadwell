import React, { useEffect, useState } from "react";
import { teacherAPI } from "../../../../services/api";
import "../../../css/dashboards/student/StudentProfile.css"; // reuse same CSS

const TeacherProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await teacherAPI.getProfile();
        if (res.data.success) {
          const user = res.data.user;
          if (!user.anonId) user.anonId = "anonymous"; // default anonId
          setProfile(user);
          setFormData(user);
        } else {
          setError(res.data.message || "Unable to load profile");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Server error while loading profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // default to "anonymous" if empty
      if (!formData.anonId || formData.anonId.trim() === "") {
        formData.anonId = "anonymous";
      }

      const res = await teacherAPI.updateProfile(formData);
      if (res.data.success) {
        setProfile(res.data.user);
        setEditMode(false);
        alert("Profile updated successfully!");
      } else {
        alert(res.data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Error while saving profile.");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="student-profile-wrapper">
      {/* ===== VIEW MODE ===== */}
      {!editMode && (
        <div className="profile-full-card">
          <div className="profile-avatar-big">
            {profile?.name?.[0]?.toUpperCase()}
          </div>
          <h2 className="profile-name">{profile?.name}</h2>
          <p className="profile-anon">Anonymous ID: {profile?.anonId || "anonymous"}</p>
          {profile?.regNumber && <p className="profile-reg">{profile.regNumber}</p>}
          <p className="profile-dept">
            {profile?.department || profile?.field} • {profile?.year || ""}
          </p>
          <p className="profile-university">{profile?.university}</p>
          <p className="profile-email">{profile?.email}</p>

          <button
            className="edit-profile-btn"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        </div>
      )}

      {/* ===== EDIT MODE ===== */}
      {editMode && (
        <div className="profile-edit-form">
          <h2>Edit Profile</h2>
          <div className="form-grid">
            <div className="form-item">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-item">
              <label>Anonymous ID</label>
              <input
                type="text"
                name="anonId"
                value={formData.anonId || "anonymous"}
                onChange={handleChange}
              />
            </div>
            <div className="form-item">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-item">
              <label>Department</label>
              <input
                type="text"
                name="department"
                value={formData.department || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-item">
              <label>Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-item">
              <label>University</label>
              <input
                type="text"
                name="university"
                value={formData.university || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="profile-actions">
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
            <button
              className="cancel-btn"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherProfile;
