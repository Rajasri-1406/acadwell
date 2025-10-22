import React, { useState, useEffect } from "react";
import {
  Smile,
  Meh,
  Frown,
  TrendingUp,
  Users,
  Activity,
  Heart,
  Award,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import "../../../css/dashboards/student/StudentWellness.css";

const StudentWellness = () => {
  const [moodHistory, setMoodHistory] = useState([
    { date: "Mon", mood: 7 },
    { date: "Tue", mood: 8 },
    { date: "Wed", mood: 5 },
    { date: "Thu", mood: 9 },
    { date: "Fri", mood: 6 },
  ]);

  const [subjects, setSubjects] = useState([
    { subject: "Math", score: 84 },
    { subject: "Science", score: 91 },
    { subject: "English", score: 76 },
    { subject: "History", score: 89 },
    { subject: "Computer", score: 94 },
  ]);

  const avgGrade =
    subjects.reduce((sum, s) => sum + s.score, 0) / subjects.length;
  const wellnessScore =
    moodHistory.reduce((sum, m) => sum + m.mood, 0) / moodHistory.length;

  const peerSessions = 10;
  const peerContributions = 8;

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

      {/* --- Summary Cards --- */}
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

      {/* --- Mood Tracker --- */}
      <div className="section">
        <h2 className="section-title">Mood Tracker & History</h2>
        <div className="mood-card">
          <div className="mood-status">
            {currentMood}
            <h4>
              Current Average Mood:{" "}
              <span>{wellnessScore.toFixed(1)} / 10</span>
            </h4>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={moodHistory}>
              <XAxis dataKey="date" stroke="#ddd6fe" />
              <YAxis domain={[0, 10]} stroke="#ddd6fe" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#c4b5fd"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- Academic Progress --- */}
      <div className="section">
        <h2 className="section-title">Academic Progress & Subject Performance</h2>
        <div className="chart-card">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={subjects}>
              <XAxis dataKey="subject" stroke="#ddd6fe" />
              <YAxis stroke="#ddd6fe" />
              <Tooltip />
              <Bar dataKey="score" fill="#a78bfa" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- Achievements --- */}
      <div className="section">
        <h2 className="section-title">Anonymous Achievements</h2>
        <div className="achievement-grid">
          <div className="achievement-card">
            <Award className="achievement-icon" />
            <h3>Academic Star</h3>
            <p>Maintained top 10% grades this month</p>
          </div>
          <div className="achievement-card">
            <Smile className="achievement-icon" />
            <h3>Wellness Hero</h3>
            <p>Maintained a positive mood streak</p>
          </div>
          <div className="achievement-card">
            <Users className="achievement-icon" />
            <h3>Peer Supporter</h3>
            <p>Helped peers in group study sessions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentWellness;
