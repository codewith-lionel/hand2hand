import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import StudentDashboard from './components/student/StudentDashboard';
import StudentProfile from './components/student/StudentProfile';
import ViewVolunteers from './components/student/ViewVolunteers';
import CreateRequest from './components/student/CreateRequest';
import VolunteerDashboard from './components/volunteer/VolunteerDashboard';
import VolunteerProfile from './components/volunteer/VolunteerProfile';
import ViewRequests from './components/volunteer/ViewRequests';
import AssignedExams from './components/volunteer/AssignedExams';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', backgroundColor: '#ecf0f1' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <PrivateRoute role="student">
                  <StudentDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <PrivateRoute role="student">
                  <StudentProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/student/volunteers"
              element={
                <PrivateRoute role="student">
                  <ViewVolunteers />
                </PrivateRoute>
              }
            />
            <Route
              path="/student/create-request"
              element={
                <PrivateRoute role="student">
                  <CreateRequest />
                </PrivateRoute>
              }
            />
            <Route
              path="/student/requests"
              element={
                <PrivateRoute role="student">
                  <StudentDashboard />
                </PrivateRoute>
              }
            />

            {/* Volunteer Routes */}
            <Route
              path="/volunteer/dashboard"
              element={
                <PrivateRoute role="volunteer">
                  <VolunteerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/volunteer/profile"
              element={
                <PrivateRoute role="volunteer">
                  <VolunteerProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/volunteer/requests"
              element={
                <PrivateRoute role="volunteer">
                  <ViewRequests />
                </PrivateRoute>
              }
            />
            <Route
              path="/volunteer/assigned-exams"
              element={
                <PrivateRoute role="volunteer">
                  <AssignedExams />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
