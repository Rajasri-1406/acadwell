// src/components/ui/dashboards/student/StudentAnalytics.jsx
import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  MessageCircle,
  Award,
  BookOpen,
  Target,
  Calendar,
  Shield,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../../css/dashboards/student/index.css";

/**
 * StudentAnalytics.jsx
 * - SRS-aligned analytics view
 * - Privacy-first (anonymous contributions)
 * - Correlates academic + wellness + peer-support activity
 *
 * NOTE: All data below is mock/static — replace with API calls later.
 */

const StudentAnalytics = () => {
  const navigate = useNavigate();

  // UI state
  const [timeRange, setTimeRange] = useState("month"); // week / month / semester

  // ---------- MOCK DATA (replace with backend data) ----------
  const weeklyAcademic = [
    { label: "W1", grade: 78, helpSought: 3, helpGiven: 1, wellness: 6.2 },
    { label: "W2", grade: 82, helpSought: 5, helpGiven: 2, wellness: 7.1 },
    { label: "W3", grade: 85, helpSought: 4, helpGiven: 4, wellness: 7.8 },
    { label: "W4", grade: 88, helpSought: 2, helpGiven: 6, wellness: 8.2 },
    { label: "W5", grade: 91, helpSought: 3, helpGiven: 8, wellness: 8.7 },
    { label: "W6", grade: 89, helpSought: 1, helpGiven: 7, wellness: 8.5 },
  ];

  const moodTrend = [
    { date: "01/01", mood: 6.5, stress: 7.2, confidence: 6.8 },
    { date: "01/08", mood: 7.1, stress: 6.8, confidence: 7.2 },
    { date: "01/15", mood: 7.8, stress: 6.2, confidence: 7.9 },
    { date: "01/22", mood: 8.2, stress: 5.8, confidence: 8.3 },
    { date: "01/29", mood: 8.5, stress: 5.4, confidence: 8.7 },
  ];

  const anonymousContributionData = [
    { name: "Questions Asked", value: 15, color: "#3B82F6" },
    { name: "Answers Given", value: 23, color: "#10B981" },
    { name: "Discussions Started", value: 8, color: "#F59E0B" },
    { name: "Support Provided", value: 31, color: "#8B5CF6" },
  ];

  const subjectPerformance = [
    { subject: "Math", current: 88, previous: 82, improvement: 6 },
    { subject: "Physics", current: 85, previous: 79, improvement: 6 },
    { subject: "Chemistry", current: 91, previous: 87, improvement: 4 },
    { subject: "Biology", current: 87, previous: 89, improvement: -2 },
  ];

  const wellnessCorrelation = [
    { activity: "Helping Others", impact: 85, sessions: 23 },
    { activity: "Seeking Help", impact: 78, sessions: 15 },
    { activity: "Anonymous Sharing", impact: 72, sessions: 8 },
    { activity: "Peer Discussions", impact: 68, sessions: 12 },
  ];

  const badgeData = [
    { name: "Helpful Helper", level: "Gold", progress: 85, icon: "🏆" },
    { name: "Question Master", level: "Silver", progress: 67, icon: "🎯" },
    { name: "Wellness Warrior", level: "Bronze", progress: 43, icon: "💚" },
    { name: "Peer Supporter", level: "Gold", progress: 92, icon: "🤝" },
  ];

  // Simulated key metrics derived from the sample data
  const metrics = useMemo(() => {
    const avgGrade =
      weeklyAcademic.reduce((s, d) => s + d.grade, 0) / weeklyAcademic.length;
    const avgWellness =
      weeklyAcademic.reduce((s, d) => s + d.wellness, 0) / weeklyAcademic.length;
    const sessions =
      anonymousContributionData.reduce((s, d) => s + d.value, 0);
    const peerContrib = anonymousContributionData.find((d) => d.name === "Answers Given")?.value || 0;
    return {
      avgGrade: Math.round(avgGrade * 10) / 10,
      avgWellness: Math.round(avgWellness * 10) / 10,
      sessions,
      peerContrib,
    };
  }, [weeklyAcademic, anonymousContributionData]);

  // ---------- UI helpers ----------
  const formatRangeLabel = (r) =>
    r === "week" ? "This Week" : r === "month" ? "This Month" : "This Semester";

  // ---------- Render ----------
  return (
    <div className="student-profile-wrapper">
      {/* Header / Controls */}
      <div className="profile-topbar">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard/student")}
            className="back-btn flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition text-sm"
            aria-label="Back to dashboard"
          >
            ← Back
          </button>
          <h1 className="profile-title">Analytics Dashboard</h1>
        </div>

        <div className="profile-topbar-controls flex items-center gap-3">
          <span className="text-sm text-gray-300">View:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="analytics-time-select bg-white/5 border border-white/10 rounded-md px-3 py-1 text-white"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="semester">This Semester</option>
          </select>
        </div>
      </div>

      {/* Intro */}
      <div className="profile-main-content">
        <div className="profile-section-card mb-4">
          <p className="analytics-description text-gray-300">
            Track your academic progress, wellness correlation, and anonymous peer contributions while
            maintaining complete privacy. Range: <strong>{formatRangeLabel(timeRange)}</strong>
          </p>
        </div>

        {/* Key Metric Cards */}
        <div className="analytics-metrics-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="metric-card profile-section-card">
            <div className="metric-header flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="metric-icon bg-blue rounded-full p-2">
                  <Target size={18} />
                </div>
                <div className="text-xs text-gray-400">Average Grade</div>
              </div>
              <div className="metric-change positive flex items-center gap-1 text-green-400">
                <TrendingUp size={14} /> 5.8%
              </div>
            </div>
            <h3 className="metric-value text-2xl font-bold mt-3">{metrics.avgGrade}</h3>
            <p className="metric-label text-sm text-gray-300">Overall performance</p>
          </div>

          <div className="metric-card profile-section-card">
            <div className="metric-header flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="metric-icon bg-green rounded-full p-2">
                  <BarChart3 size={18} />
                </div>
                <div className="text-xs text-gray-400">Wellness Score</div>
              </div>
              <div className="metric-change positive flex items-center gap-1 text-green-400">
                <TrendingUp size={14} /> 12.3%
              </div>
            </div>
            <h3 className="metric-value text-2xl font-bold mt-3">{metrics.avgWellness}/10</h3>
            <p className="metric-label text-sm text-gray-300">Health & focus index</p>
          </div>

          <div className="metric-card profile-section-card">
            <div className="metric-header flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="metric-icon bg-purple rounded-full p-2">
                  <Users size={18} />
                </div>
                <div className="text-xs text-gray-400">Peer Sessions</div>
              </div>
              <div className="metric-change negative flex items-center gap-1 text-red-400">
                <TrendingDown size={14} /> 2.1%
              </div>
            </div>
            <h3 className="metric-value text-2xl font-bold mt-3">{metrics.sessions}</h3>
            <p className="metric-label text-sm text-gray-300">Anonymous support activity</p>
          </div>

          <div className="metric-card profile-section-card">
            <div className="metric-header flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="metric-icon bg-orange rounded-full p-2">
                  <MessageCircle size={18} />
                </div>
                <div className="text-xs text-gray-400">Peer Contributions</div>
              </div>
              <div className="metric-change positive flex items-center gap-1 text-green-400">
                <TrendingUp size={14} /> 8.7%
              </div>
            </div>
            <h3 className="metric-value text-2xl font-bold mt-3">{metrics.peerContrib}</h3>
            <p className="metric-label text-sm text-gray-300">Answers & support</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="analytics-charts-grid grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Academic Progress + Wellness correlation (line) */}
          <div className="profile-section-card chart-card">
            <div className="chart-header flex items-center gap-3 mb-3">
              <BookOpen className="chart-icon" />
              <h2 className="text-lg font-semibold">Academic Progress & Wellness</h2>
            </div>
            <div className="chart-container" style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyAcademic}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="label" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0b1220",
                      border: "1px solid #374151",
                      borderRadius: 8,
                      color: "#fff",
                    }}
                  />
                  <Line type="monotone" dataKey="grade" stroke="#3B82F6" strokeWidth={3} name="Grade (%)" />
                  <Line type="monotone" dataKey="wellness" stroke="#10B981" strokeWidth={2} name="Wellness" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="chart-insight text-sm text-gray-300 mt-3">
              Grades tend to improve when peer-support (help given) increases and wellness improves.
            </p>
          </div>

          {/* Mood trend (area) */}
          <div className="profile-section-card chart-card">
            <div className="chart-header flex items-center gap-3 mb-3">
              <BookOpen className="chart-icon" />
              <h2 className="text-lg font-semibold">Mood & Stress Trend</h2>
            </div>
            <div className="chart-container" style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={moodTrend}>
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
                  <Area type="monotone" dataKey="mood" stroke="#10B981" fill="#10B981" fillOpacity={0.2} name="Mood" />
                  <Area type="monotone" dataKey="confidence" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.12} name="Confidence" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="chart-insight text-sm text-gray-300 mt-3">
              Monitoring mood alongside stress helps identify when to suggest wellness nudges or peer outreach.
            </p>
          </div>
        </div>

        {/* Bottom Grids: Anonymous contributions & subject performance */}
        <div className="analytics-bottom-grid grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Anonymous contributions (pie) */}
          <div className="profile-section-card">
            <div className="chart-header flex items-center gap-3 mb-3">
              <Award className="chart-icon" />
              <h2 className="text-lg font-semibold">Anonymous Contributions</h2>
            </div>
            <div className="chart-container small" style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={anonymousContributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                    fill="#8884d8"
                  >
                    {anonymousContributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="chart-insight text-sm text-gray-300 mt-3">
              Contributions are anonymous by design — your identity is not linked to these metrics.
            </p>
          </div>

          {/* Subject performance list */}
          <div className="profile-section-card subject-performance col-span-1 lg:col-span-2">
            <div className="chart-header flex items-center gap-3 mb-3">
              <Target className="chart-icon" />
              <h2 className="text-lg font-semibold">Subject Performance</h2>
            </div>
            <div className="subject-list space-y-3">
              {subjectPerformance.map((s, idx) => (
                <div key={idx} className="subject-item flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div className="subject-info flex items-center gap-3">
                    <div className="subject-icon bg-white/6 rounded-md p-2">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{s.subject}</h4>
                      <p className="text-sm text-gray-300">Current: {s.current}% | Previous: {s.previous}%</p>
                    </div>
                  </div>
                  <div className={`subject-improvement flex items-center gap-2 ${s.improvement >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {s.improvement >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {Math.abs(s.improvement)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wellness Correlation & Badges */}
        <div className="analytics-correlation-grid grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="profile-section-card">
            <div className="chart-header flex items-center gap-3 mb-3">
              <Users className="chart-icon" />
              <h2 className="text-lg font-semibold">Wellness Correlation Insights</h2>
            </div>

            <div className="correlation-list space-y-3">
              {wellnessCorrelation.map((item, i) => (
                <div key={i} className="correlation-item bg-white/5 p-3 rounded-lg border border-white/8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{item.activity}</h4>
                      <p className="text-sm text-gray-300">{item.sessions} sessions</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-300">Impact</div>
                      <div className="text-lg font-bold">{item.impact}%</div>
                    </div>
                  </div>

                  <div className="progress-bar mt-3 bg-white/10 rounded-full h-3 overflow-hidden">
                    <div className="progress-fill h-full" style={{ width: `${item.impact}%`, background: "linear-gradient(90deg,#34d399,#60a5fa)" }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="insight-card mt-4 bg-white/5 p-3 rounded-lg">
              <p className="text-sm text-gray-300">
                <strong>Key Insight:</strong> Helping others (answers & support) strongly correlates with improved wellness and academic gains.
                We keep activity anonymous — identification information is never linked to analytics.
              </p>
            </div>
          </div>

          <div className="profile-section-card">
            <div className="chart-header flex items-center gap-3 mb-3">
              <Award className="chart-icon" />
              <h2 className="text-lg font-semibold">Anonymous Achievement System</h2>
            </div>

            <div className="badges-grid grid grid-cols-1 sm:grid-cols-2 gap-3">
              {badgeData.map((badge, idx) => (
                <div key={idx} className="badge-item bg-white/5 p-3 rounded-lg">
                  <div className="badge-header flex items-center gap-3">
                    <div className="text-2xl">{badge.icon}</div>
                    <div>
                      <h4 className="font-semibold">{badge.name}</h4>
                      <div className="text-xs text-gray-400">{badge.level}</div>
                    </div>
                  </div>

                  <div className="badge-progress mt-3">
                    <div className="progress-info flex justify-between text-xs text-gray-300">
                      <span>Progress</span>
                      <span>{badge.progress}%</span>
                    </div>
                    <div className="progress-bar bg-white/10 h-3 rounded-full mt-1 overflow-hidden">
                      <div className="progress-fill h-full" style={{ width: `${badge.progress}%`, background: badge.level === "Gold" ? "#f59e0b" : badge.level === "Silver" ? "#cbd5e1" : "#34d399" }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="privacy-notice mt-4 text-sm text-gray-300">
              <strong>Privacy:</strong> Achievements are awarded based on anonymous actions only. No personally identifiable data is required or stored for badges.
            </div>
          </div>
        </div>

        {/* Monitoring status & crisis hint */}
        <div className="profile-section-card wellness-status">
          <div className="status-indicator flex items-center gap-3 mb-3">
            <div className="status-dot w-3 h-3 rounded-full bg-green-400" />
            <h3 className="text-lg font-semibold">Wellness Monitoring Status</h3>
          </div>

          <p className="text-gray-300 mb-3">
            Your wellness trends currently look <strong>positive</strong>. Our privacy-first monitoring flags patterns only when required and does not reveal identities.
          </p>

          <div className="status-footer flex items-center gap-3 text-sm text-gray-300">
            <Calendar size={16} />
            <span>Last check: Today • Next automated check: Tomorrow</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAnalytics;
