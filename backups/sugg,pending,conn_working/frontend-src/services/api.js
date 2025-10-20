import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Attach JWT token automatically to all requests (per-tab)
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token"); // per-tab storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------- AUTH ----------------
export const authAPI = {
  login: async (data) => {
    const res = await api.post("/auth/login", data);
    if (res.data.success) {
      sessionStorage.setItem("token", res.data.token);
    }
    return res;
  },
  logout: async () => {
    sessionStorage.removeItem("token");
    return api.post("/auth/logout");
  },
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
};

// ---------------- GROUPS ----------------
export const groupsAPI = {
  create: (data) => api.post("/groups/create", data),
  getAll: () => api.get("/groups"),
  getBySubject: (subject) => api.get(`/groups?subject=${subject}`),
  joinGroup: (groupId) => api.post(`/groups/join/${groupId}`),
  leaveGroup: (groupId) => api.post(`/groups/leave/${groupId}`),
};

// ---------------- STUDENT ----------------
export const studentAPI = {
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
  getAnalytics: () => api.get("/analytics/student"),
  getWellness: () => api.get("/wellness/student"),
};

// ---------------- TEACHER ----------------
export const teacherAPI = {
  getProfile: () => api.get("/teacher/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
  getAnalytics: () => api.get("/analytics/teacher"),
  getGroups: () => api.get("/groups/teacher"),
  manageStudent: (studentId, data) =>
    api.put(`/teacher/students/${studentId}`, data),
};

// ---------------- CHAT ----------------
export const chatAPI = {
  // Suggestions (other users)
  getSuggestions: () => api.get("/chat/suggestions"),

  // ✅ Pending requests (where current user is receiver)
  getPending: () => api.get("/chat/pending"),

  // ✅ Accepted connections
  getConnections: () => api.get("/chat/connections"),

  // ✅ Send follow request (send ID as string)
  sendFollow: (targetId) => api.post(`/chat/follow/${targetId}`, {}),

  // ✅ Accept follow request
  acceptFollow: (requestId) => api.post(`/chat/accept/${requestId}`, {}),
};

// ---------------- ANALYTICS ----------------
export const analyticsAPI = {
  getStudentAnalytics: () => api.get("/analytics/student"),
  getTeacherAnalytics: () => api.get("/analytics/teacher"),
};

// ---------------- WELLNESS ----------------
export const wellnessAPI = {
  getStudentWellness: () => api.get("/wellness/student"),
  getTeacherWellness: () => api.get("/wellness/teacher"),
};

export default api;
