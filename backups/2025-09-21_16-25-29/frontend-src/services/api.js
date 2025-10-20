import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Attach JWT token automatically to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------- AUTH ----------------
export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  registerStudent: (data) => api.post("/auth/register/student", data),
  registerTeacher: (data) => api.post("/auth/register/teacher", data),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
  logout: () => api.post("/auth/logout"),
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
  getProfile: () => api.get("/auth/profile"), // alias
  updateProfile: (data) => api.put("/auth/profile", data),
  getAnalytics: () => api.get("/analytics/student"),
  getWellness: () => api.get("/wellness/student"),
};

// ---------------- TEACHER ----------------
export const teacherAPI = {
  getAnalytics: () => api.get("/analytics/teacher"),
  getGroups: () => api.get("/groups/teacher"),
  manageStudent: (studentId, data) => api.put(`/teacher/students/${studentId}`, data),
};

// ---------------- CHAT ----------------
export const chatAPI = {
  // 🔹 User discovery (students ↔ teachers)
  getUsers: () => api.get("/chat/users"),

  // 🔹 Follow / connection requests
  sendFollow: (targetId) => api.post(`/chat/follow/${targetId}`),
  acceptFollow: (followerId) => api.post(`/chat/accept/${followerId}`),
  rejectFollow: (followerId) => api.post(`/chat/reject/${followerId}`),
  getPending: () => api.get("/chat/pending"),       // pending requests
  getConnections: () => api.get("/chat/connections"), // accepted requests

  // 🔹 Messaging
  sendMessage: (data) => api.post("/chat/send", data),
  getMessages: (receiverId) => api.get(`/chat/messages/${receiverId}`),
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
