import React from 'react';
import '../../../css/dashboards/teacher/TeacherDashboard.css';

const TeacherProgressMonitor = () => {
    const academicTrends = {
        gradeImprovement: '34%', 
        helpSeekingIncrease: '89%', 
        topHelpTopics: ['Calculus', 'Linear Algebra', 'Data Structures']
    };

    return (
        <div className="dashboard-card progress-monitor-card">
            <h2 className="card-title">Academic & Wellness Trends</h2>
            <p className="card-subtitle">View anonymized, aggregated data on student academic progress and help-seeking behaviors across the institution.</p>
            
            <div className="trends-grid">
                <div className="trend-item">
                    <h3 className="trend-label">Overall Grade Improvement</h3>
                    <p className="trend-value">{academicTrends.gradeImprovement}</p>
                    <small className="trend-note">For students using the anonymous help platform.</small>
                </div>

                <div className="trend-item">
                    <h3 className="trend-label">Increase in Help-Seeking</h3>
                    <p className="trend-value">{academicTrends.helpSeekingIncrease}</p>
                    <small className="trend-note">Anonymity encourages more students to seek help.</small>
                </div>
                
                <div className="trend-item">
                    <h3 className="trend-label">Top Academic Help Topics</h3>
                    <ul className="topics-list">
                        {academicTrends.topHelpTopics.map((topic, index) => (
                            <li key={index}>{topic}</li>
                        ))}
                    </ul>
                    <small className="trend-note mt-2 block">Helps faculty understand where students need the most support.</small>
                </div>
            </div>
            
            <p className="note-text">
                <strong>Note:</strong> All data displayed here is completely anonymized and aggregated to protect student privacy. No individual student information is accessible.
            </p>
        </div>
    );
};

export default TeacherProgressMonitor;
