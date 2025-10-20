import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/ui/Homepage';
import Login from './components/ui/Login';
import Register from './components/ui/Register';
import Student from './components/ui/Student';
import Teacher from './components/ui/Teacher';
import Others from './components/ui/Others';
import DashboardLanding from './components/ui/DashboardLanding';
import StudentDashboard from './components/ui/dashboards/student/StudentDashboard';
import TeacherDashboard from './components/ui/dashboards/teacher/TeacherDashboard';
import OthersDashboard from './components/ui/dashboards/others/OthersDashboard';
import StudentProfile from './components/ui/dashboards/student/StudentProfile';
import TeacherProfile from './components/ui/dashboards/teacher/TeacherProfile';
import CommunityFeed from './components/ui/community/CommunityFeed';
import AskQuestion from './components/ui/community/AskQuestion';
import PostDetial from './components/ui/community/PostDetial';

import MessagesPage from './components/ui/messages/MessagesPage';
import ChatRoom from './components/ui/messages/ChatRoom';

import './App.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/student" element={<Student />} />
          <Route path="/register/teacher" element={<Teacher />} />
          <Route path="/register/others" element={<Others />} />
          <Route path="/dashboard" element={<DashboardLanding />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
          <Route path="/dashboard/others" element={<OthersDashboard />} />
          <Route path="/dashboard/profile" element={<StudentProfile/>} />
          <Route path="/dashboard/tprofile" element={<TeacherProfile/>} />
          <Route path="/community" element={<CommunityFeed/>} />
          <Route path="/community/askquestion" element={<AskQuestion/>} />
          <Route path="/community/postdetial" element={<PostDetial/>} />


          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/messages/:convId" element={<ChatRoom />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;