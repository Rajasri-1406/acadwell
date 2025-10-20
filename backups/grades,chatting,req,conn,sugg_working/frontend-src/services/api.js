import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Attach JWT token automatically to all requests
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
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
      sessionStorage.setItem("user_id", res.data.user?.id || ""); // ✅ Save user_id too
    }
    return res;
  },
  logout: async () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user_id");
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
  getSuggestions: () => api.get("/chat/suggestions"),
  getPending: () => api.get("/chat/pending"),
  getConnections: () => api.get("/chat/connections"),
  sendFollow: (targetId) => api.post(`/chat/follow/${targetId}`, {}),
  acceptFollow: (requestId) => api.post(`/chat/accept/${requestId}`, {}),

  // ✅ Messaging
  sendMessage: (receiverId, { text }) =>
    api.post(`/chat/messages/${receiverId}`, { text }),

  getMessages: (partnerId) => api.get(`/chat/messages/${partnerId}`),
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
