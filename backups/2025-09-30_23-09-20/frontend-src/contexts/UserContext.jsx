import React, { createContext, useContext, useState, useEffect } from "react";

// Create UserContext
const UserContext = createContext();

// Custom hook to access the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// UserProvider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user data from localStorage when app starts
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem("userProfile");
      const storedStudentData = localStorage.getItem("studentData");
      const token = localStorage.getItem("token");

      if (storedProfile && token) {
        setUser(JSON.parse(storedProfile));
      }
      if (storedStudentData && token) {
        setStudentData(JSON.parse(storedStudentData));
      }
    } catch (error) {
      console.error("Error loading user data from localStorage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save user data on login
  const login = (userProfile, studentData, token) => {
    setUser(userProfile);
    setStudentData(studentData);
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    localStorage.setItem("studentData", JSON.stringify(studentData));
    localStorage.setItem("token", token);
  };

  // Clear everything on logout
  const logout = () => {
    setUser(null);
    setStudentData(null);
    localStorage.clear();
  };

  return (
    <UserContext.Provider
      value={{ user, studentData, login, logout, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};
