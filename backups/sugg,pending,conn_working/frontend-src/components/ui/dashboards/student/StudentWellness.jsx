import React, { useState, useMemo } from "react";
import {
  Smile,
  Frown,
  Meh,
  Activity,
  Award,
  AlertTriangle,
  Users,
  TrendingUp,
  TrendingDown,
  HeartPulse,
  MessageCircle,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";
import "../../../css/dashboards/student/index.css";

const StudentWellness = () => {
  const navigate = useNavigate();

  // ---------- State ----------
  const [mood, setMood] = useState(null);

  // ---------- Dummy Data ----------
  const moodHistory = [
    { date: "01/01", happy: 7.5, neutral: 1.2, sad: 0.8 },
    { date: "01/08", happy: 7.8, neutral: 1.1, sad: 1.1 },
    { date: "01/15", happy: 8.1, neutral: 0.9, sad: 1.0 },
    { date: "01/22", happy: 8.5, neutral: 0.8, sad: 0.7 },
    { date: "01/29", happy: 8.7, neutral: 0.6, sad: 0.7 },
  ];

  const groupCorrelation = [
    { activity: "Study Group Activity", impact: 82 },
    { activity: "Peer Help Given", impact: 74 },
    { activity: "Answers Received", impact: 68 },
    { activity: "Anonymous Discussions", impact: 64 },
  ];

  const badges = [
    { id: 1, name: "Mindful Learner", progress: 86, icon: "🧘", level: "Gold" },
    { id: 2, name: "Peer Supporter", progress: 72, icon: "🤝", level: "Silver" },
    { id: 3, name: "Wellness Champion", progress: 58, icon: "💚", level: "Bronze" },
  ];

  const crisisAlerts = [
    {
      id: 1,
      type: "Mood Fluctuation",
      desc: "Sharp negative mood patterns detected over the past week.",
    },
    {
      id: 2,
      type: "Low Engagement",
      desc: "Reduced platform activity compared to peers in your group.",
    },
  ];

  // ---------- Derived Metrics ----------
  const metrics = useMemo(() => {
    const avgHappy = moodHistory.reduce((s, d) => s + d.happy, 0) / moodHistory.length;
    const avgSad = moodHistory.reduce((s, d) => s + d.sad, 0) / moodHistory.length;
    const avgNeutral = moodHistory.reduce((s, d) => s + d.neutral, 0) / moodHistory.length;
    return {
      avgHappy: avgHappy.toFixed(1),
      avgSad: avgSad.toFixed(1),
      avgNeutral: avgNeutral.toFixed(1),
    };
  }, [moodHistory]);

  return (
    <div className="student-profile-wrapper">
      {/* Header */}
      <div className="profile-topbar">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard/student")}
            className="back-btn flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition text-sm"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <h1 className="profile-title">Wellness Tracking & Analytics</h1>
        </div>
      </div>

      {/* Introduction */}
      <div className="profile-section-card mb-5">
        <p className="text-gray-300">
          Track your mood, analyze correlations with study activity, earn badges, and get proactive insights.
          Your wellness data is always <strong>private</strong> and <strong>secure</strong>.
        </p>
      </div>

      {/* Mood Tracking */}
      <div className="profile-section-card mb-6">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <HeartPulse size={20} /> Personal Mood Tracking
        </h2>
        <p className="text-gray-400 mb-4">
          How are you feeling today? Your response is <strong>private</strong>.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => setMood("happy")}
            className={`p-4 rounded-xl border transition ${
              mood === "happy"
                ? "bg-green-600 border-green-500"
                : "bg-white/10 border-white/20 hover:bg-green-600/30"
            }`}
          >
            <Smile size={28} className="mx-auto" />
            <p className="text-sm mt-1">Happy</p>
          </button>
          <button
            onClick={() => setMood("neutral")}
            className={`p-4 rounded-xl border transition ${
              mood === "neutral"
                ? "bg-yellow-600 border-yellow-500"
                : "bg-white/10 border-white/20 hover:bg-yellow-600/30"
            }`}
          >
            <Meh size={28} className="mx-auto" />
            <p className="text-sm mt-1">Neutral</p>
          </button>
          <button
            onClick={() => setMood("sad")}
            className={`p-4 rounded-xl border transition ${
              mood === "sad"
                ? "bg-red-600 border-red-500"
                : "bg-white/10 border-white/20 hover:bg-red-600/30"
            }`}
          >
            <Frown size={28} className="mx-auto" />
            <p className="text-sm mt-1">Sad</p>
          </button>
        </div>
        {mood && (
          <p className="mt-4 text-purple-300 font-medium">
            Today's mood saved as <span className="capitalize">{mood}</span> ✅
          </p>
        )}
      </div>

      {/* Mood History Chart */}
      <div className="profile-section-card mb-6">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Activity size={20} /> Mood History
        </h2>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={moodHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis domain={[0, 10]} stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0b1220",
                  border: "1px solid #374151",
                  borderRadius: 8,
                  color: "#fff",
                }}
              />
              <Area type="monotone" dataKey="happy" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Happy" />
              <Area type="monotone" dataKey="neutral" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} name="Neutral" />
              <Area type="monotone" dataKey="sad" stroke="#EF4444" fill="#EF4444" fillOpacity={0.15} name="Sad" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="chart-insight text-sm text-gray-300 mt-3">
          Average mood rating: <strong>{metrics.avgHappy}/10</strong> happy,{" "}
          <strong>{metrics.avgNeutral}/10</strong> neutral,{" "}
          <strong>{metrics.avgSad}/10</strong> sad.
        </p>
      </div>

      {/* Correlation Analytics */}
      <div className="profile-section-card mb-6">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Users size={20} /> Correlation Analytics
        </h2>
        <div className="space-y-3">
          {groupCorrelation.map((item, i) => (
            <div
              key={i}
              className="bg-white/5 p-3 rounded-lg border border-white/10"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{item.activity}</h3>
                <span className="font-bold text-purple-300">{item.impact}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 mt-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-400 to-blue-500"
                  style={{ width: `${item.impact}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badge & Recognition */}
      <div className="profile-section-card mb-6">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Award size={20} /> Badge & Recognition
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="p-4 rounded-lg bg-purple-600/30 border border-purple-500/30 hover:bg-purple-600/50 transition shadow-md"
            >
              <div className="text-3xl">{badge.icon}</div>
              <h3 className="font-semibold text-purple-200 mt-2">{badge.name}</h3>
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-300">
                  <span>{badge.level}</span>
                  <span>{badge.progress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 mt-1">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${badge.progress}%`,
                      background:
                        badge.level === "Gold"
                          ? "#F59E0B"
                          : badge.level === "Silver"
                          ? "#CBD5E1"
                          : "#10B981",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-400 mt-3">
          All badges are awarded based on anonymous activity — your identity is never exposed.
        </p>
      </div>

      {/* Crisis Detection */}
      <div className="profile-section-card mb-6">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <AlertTriangle size={20} /> Crisis Detection Alerts
        </h2>
        {crisisAlerts.length === 0 ? (
          <p className="text-green-400">✅ No unusual activity detected</p>
        ) : (
          <div className="space-y-3">
            {crisisAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 bg-red-600/20 border border-red-600/40 rounded-lg"
              >
                <h3 className="font-semibold text-red-400">{alert.type}</h3>
                <p className="text-gray-300 text-sm">{alert.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Privacy Assurance */}
      <div className="profile-section-card bg-white/5">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={18} className="text-purple-400" />
          <h3 className="font-semibold">Privacy Protection</h3>
        </div>
        <p className="text-gray-300 text-sm">
          We use <strong>anonymous identifiers</strong> and never store personal wellness data.
          Analytics and badges are computed without compromising your privacy.
        </p>
      </div>
    </div>
  );
};

export default StudentWellness;
