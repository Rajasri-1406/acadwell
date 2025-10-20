import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Smile,
  Meh,
  Frown,
  TrendingUp,
  Users,
  Activity,
  Heart,
  Award,
  Shield,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import "../../../css/dashboards/student/StudentWellness.css";

const API_BASE = "http://localhost:5000/api/wellness";
const GRADES_API = "http://localhost:5000/api/student/my_grades";

const getAuthToken = () =>
  sessionStorage.getItem("token") ||
  localStorage.getItem("token") ||
  sessionStorage.getItem("studentToken") ||
  localStorage.getItem("studentToken") ||
  "";

const StudentWellness = () => {
  const [mood, setMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [correlationData, setCorrelationData] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [peerSessions, setPeerSessions] = useState(0);
  const [peerContributions, setPeerContributions] = useState(0);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = getAuthToken();
    if (storedToken) setToken(storedToken);
  }, []);

  // ---------------- FETCH GRADES ----------------
  const fetchGrades = async () => {
    if (!token) return;
    try {
      const res = await axios.get(GRADES_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success && Array.isArray(res.data.grades)) {
        setGrades(res.data.grades);
      }
    } catch (err) {
      console.error("❌ Error fetching grades:", err.message);
    }
  };

  // ---------------- FETCH MOOD HISTORY ----------------
  const fetchMoodHistory = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success && Array.isArray(res.data.history)) {
        setMoodHistory(res.data.history);
      }
    } catch (err) {
      console.error("❌ Error fetching mood history:", err.message);
    }
  };

  // ---------------- FETCH CORRELATION ----------------
  const fetchCorrelationData = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE}/correlation`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success && Array.isArray(res.data.correlation)) {
        setCorrelationData(res.data.correlation);
      }
    } catch (err) {
      console.error("❌ Error fetching correlation data:", err.message);
    }
  };

  // ---------------- FETCH PEER STATS ----------------
  const fetchPeerStats = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE}/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setPeerSessions(res.data.peerSessions || 0);
        setPeerContributions(res.data.peerContributions || 0);
      }
    } catch (err) {
      console.error("❌ Error fetching peer stats:", err.message);
    }
  };

  // ---------------- SAVE MOOD ----------------
  const saveMood = async (selectedMood) => {
    if (!token) return alert("Please log in first.");
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE}/mood`,
        { mood: selectedMood },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setMood(selectedMood);
        fetchMoodHistory();
        fetchCorrelationData();
        fetchPeerStats();
        fetchGrades();
      } else {
        alert(res.data.message || "Failed to save mood.");
      }
    } catch (err) {
      console.error("❌ Error saving mood:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchGrades();
      fetchMoodHistory();
      fetchCorrelationData();
      fetchPeerStats();
    }
  }, [token]);

  // ---------------- PREPARE DATA FOR CHARTS ----------------
  const moodChartData = useMemo(() => {
    const moodValueMap = { happy: 9, neutral: 5, sad: 2 };
    return (moodHistory || []).slice().reverse().map((m, i) => ({
      date: m.date ? m.date.slice(5, 10) : `#${i + 1}`,
      moodValue: moodValueMap[m.mood] || 0,
    }));
  }, [moodHistory]);

  const subjectGrades = useMemo(() => {
    return grades
      .filter((g) => g.subject && (g.score !== undefined || g.marks !== undefined))
      .map((g) => ({
        subject: g.subject,
        score: Number(g.score ?? g.marks ?? 0),
      }));
  }, [grades]);

  const avgGrade =
    subjectGrades.reduce((sum, s) => sum + s.score, 0) /
    (subjectGrades.length || 1);

  const wellnessScore =
    moodChartData.reduce((sum, m) => sum + m.moodValue, 0) /
    (moodChartData.length || 1);

  const currentMood =
    wellnessScore > 7 ? (
      <Smile className="mood-icon good" />
    ) : wellnessScore > 5 ? (
      <Meh className="mood-icon average" />
    ) : (
      <Frown className="mood-icon bad" />
    );

  return (
    <div className="student-wellness-page">
      <h1 className="wellness-title">Student Wellness & Analytics Dashboard</h1>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="summary-grid">
        <div className="summary-card">
          <TrendingUp className="summary-icon" />
          <h3>Average Grade</h3>
          <p>{avgGrade.toFixed(1)}%</p>
        </div>
        <div className="summary-card">
          <Heart className="summary-icon" />
          <h3>Wellness Score</h3>
          <p>{wellnessScore.toFixed(1)} / 10</p>
        </div>
        <div className="summary-card">
          <Users className="summary-icon" />
          <h3>Peer Sessions</h3>
          <p>{peerSessions}</p>
        </div>
        <div className="summary-card">
          <Activity className="summary-icon" />
          <h3>Peer Contributions</h3>
          <p>{peerContributions}</p>
        </div>
      </div>

      {/* ===== MOOD TRACKER ===== */}
      <div className="section">
        <h2 className="section-title">Mood Tracker & History</h2>
        <div className="mood-card">
          <div className="mood-status">
            {currentMood}
            <h4>
              Current Average Mood: <span>{wellnessScore.toFixed(1)} / 10</span>
            </h4>
          </div>
          <div className="flex gap-4 justify-center my-4">
            {["happy", "neutral", "sad"].map((m) => (
              <button
                key={m}
                onClick={() => saveMood(m)}
                className={`p-4 rounded-xl border transition ${
                  mood === m
                    ? `bg-${
                        m === "happy"
                          ? "green"
                          : m === "neutral"
                          ? "yellow"
                          : "red"
                      }-600 border-${
                        m === "happy"
                          ? "green"
                          : m === "neutral"
                          ? "yellow"
                          : "red"
                      }-500`
                    : "bg-white/10 border-white/20 hover:bg-white/20"
                }`}
                disabled={loading}
              >
                {m === "happy" ? (
                  <Smile size={28} className="mx-auto" />
                ) : m === "neutral" ? (
                  <Meh size={28} className="mx-auto" />
                ) : (
                  <Frown size={28} className="mx-auto" />
                )}
                <p className="text-sm mt-1 capitalize">{m}</p>
              </button>
            ))}
          </div>

          {moodChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={moodChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="date" stroke="#ddd6fe" />
                <YAxis domain={[0, 10]} stroke="#ddd6fe" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="moodValue"
                  stroke="#a855f7"
                  fill="#a855f7"
                  fillOpacity={0.25}
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 mt-3">
              No mood data available yet.
            </p>
          )}
        </div>
      </div>

      {/* ===== ACADEMIC PROGRESS ===== */}
      <div className="section">
        <h2 className="section-title">Academic Progress</h2>
        {grades.length > 0 ? (
          <div className="chart-card">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={grades.map((g) => ({
                  subject: g.subject || "Unknown",
                  score: Number(g.score ?? g.marks ?? 0),
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="subject" stroke="#ddd6fe" />
                <YAxis stroke="#ddd6fe" />
                <Tooltip />
                <Bar dataKey="score" fill="#a78bfa" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-center text-gray-400">
            No grades available to show chart.
          </p>
        )}
      </div>

      {/* ===== CORRELATION ===== */}
      <div className="section">
        <h2 className="section-title">Wellness Correlation</h2>
        {correlationData.length > 0 ? (
          correlationData.map((item, i) => (
            <div
              key={i}
              className="bg-white/5 p-3 rounded-lg border border-white/10 mb-2"
            >
              <div className="flex justify-between">
                <h3>{item.activity}</h3>
                <span className="text-purple-300 font-bold">{item.impact}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded mt-1">
                <div
                  className="h-2 bg-gradient-to-r from-purple-400 to-blue-500 rounded"
                  style={{ width: `${item.impact}%` }}
                ></div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">
            No correlation data available.
          </p>
        )}
      </div>

      {/* ===== ACHIEVEMENTS ===== */}
      <div className="section">
        <h2 className="section-title">Achievements</h2>
        <div className="achievement-grid">
          <div className="achievement-card">
            <Award className="achievement-icon" />
            <h3>Academic Star</h3>
            <p>Top 10% grades this month</p>
          </div>
          <div className="achievement-card">
            <Smile className="achievement-icon" />
            <h3>Wellness Hero</h3>
            <p>Positive mood streak</p>
          </div>
          <div className="achievement-card">
            <Users className="achievement-icon" />
            <h3>Peer Supporter</h3>
            <p>Helped peers in group studies</p>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default StudentWellness;
