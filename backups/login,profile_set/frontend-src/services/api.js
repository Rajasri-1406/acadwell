import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Auth APIs
export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  registerStudent: (data) => api.post("/auth/register/student", data),
  registerTeacher: (data) => api.post("/auth/register/teacher", data),
};

// ✅ Groups APIs
export const groupsAPI = {
  create: (data) => api.post("/groups/create", data),
  getAll: () => api.get("/groups"),
  getBySubject: (subject) => api.get(`/groups?subject=${subject}`),
};

// ✅ Student APIs
export const studentAPI = {
  getProfile: () => api.get("/auth/profile"),          // fixed ✅
  updateProfile: (data) => api.put("/auth/profile", data), // added ✅
};

export default api;
