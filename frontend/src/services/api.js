// src/services/api.js
import axios from "axios";

// ---------------- BASE CONFIG ----------------
const API_BASE_URL = "https://acadwell-backend-7ufj.onrender.com/api";


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Automatically attach JWT token for all requests
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========================================================
//                      AUTH API
// ========================================================
export const authAPI = {
  // 🧍‍♀️ Register Student
  registerStudent: (data) => api.post("/auth/register/student", data),

  // 👩‍🏫 Register Teacher
  registerTeacher: (data) => api.post("/auth/register/teacher", data),

  // 🔐 Login
  login: async (data) => {
    const res = await api.post("/auth/login", data);
    if (res.data.success) {
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user_id", res.data.user?.id || "");
    }
    return res;
  },

  // 🚪 Logout
  logout: async () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user_id");
    return api.post("/auth/logout");
  },

  // 👤 Profile Management
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
};

// ========================================================
//                      GROUPS API
// ========================================================
export const groupsAPI = {
  create: (data) => api.post("/groups/create", data),
  getAll: () => api.get("/groups"),
  getBySubject: (subject) => api.get(`/groups?subject=${subject}`),
  joinGroup: (groupId) => api.post(`/groups/join/${groupId}`),
  leaveGroup: (groupId) => api.post(`/groups/leave/${groupId}`),
  getGroupDetails: (groupId) => api.get(`/groups/${groupId}`),
};

// ========================================================
//                      STUDENT API
// ========================================================
export const studentAPI = {
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
  getAnalytics: () => api.get("/analytics/student"),
  getWellnessSummary: () => api.get("/wellness/summary"), // ✅ updated
  getMoodHistory: () => api.get("/wellness/history"), // ✅ new
  saveMood: (mood) => api.post("/wellness/mood", { mood }), // ✅ new
};

// ========================================================
//                      TEACHER API
// ========================================================
export const teacherAPI = {
  getProfile: () => api.get("/teacher/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
  getAnalytics: () => api.get("/analytics/teacher"),
  getGroups: () => api.get("/groups/teacher"),
  manageStudent: (studentId, data) =>
    api.put(`/teacher/students/${studentId}`, data),
};

// ========================================================
//                      CHAT API
// ========================================================
export const chatAPI = {
  // Suggestions & Requests
  getSuggestions: () => api.get("/chat/suggestions"),
  getPending: () => api.get("/chat/pending"),
  getConnections: () => api.get("/chat/connections"),

  // Follow actions
  sendFollow: (targetId) => api.post(`/chat/follow/${targetId}`),
  acceptFollow: (requestId) => api.post(`/chat/accept/${requestId}`),

  // ✅ Messaging
  sendMessage: (receiverId, { text }) =>
    api.post(`/chat/messages/${receiverId}`, { text }),
  getMessages: (partnerId) => api.get(`/chat/messages/${partnerId}`),
};

// ========================================================
//                      ANALYTICS API
// ========================================================
export const analyticsAPI = {
  getStudentAnalytics: () => api.get("/analytics/student"),
  getTeacherAnalytics: () => api.get("/analytics/teacher"),
};

// ========================================================
//                      WELLNESS API
// ========================================================
// Centralized wellness routes for clarity
export const wellnessAPI = {
  // Save mood entries
  saveMood: (mood) => api.post("/wellness/mood", { mood }),

  // Get mood history (30 latest)
  getMoodHistory: () => api.get("/wellness/history"),

  // Correlation analytics
  getCorrelation: () => api.get("/wellness/correlation"),

  // Wellness summary (🔹 new analytics-based route)
  getSummary: () => api.get("/wellness/summary"),
};

export default api;
