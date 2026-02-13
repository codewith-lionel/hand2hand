import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminNavbar from './components/common/AdminNavbar';
import AdminPrivateRoute from './components/common/AdminPrivateRoute';
import AdminLogin from './components/auth/AdminLogin';
import Dashboard from './components/dashboard/Dashboard';
import UserManagement from './components/users/UserManagement';
import VolunteerVerification from './components/volunteers/VolunteerVerification';
import RequestReports from './components/reports/RequestReports';

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', backgroundColor: '#ecf0f1' }}>
          <AdminNavbar />
          <Routes>
            <Route path="/" element={<Navigate to="/admin/login" />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminPrivateRoute>
                  <Navigate to="/admin/dashboard" />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <AdminPrivateRoute>
                  <Dashboard />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminPrivateRoute>
                  <UserManagement />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/admin/volunteers"
              element={
                <AdminPrivateRoute>
                  <VolunteerVerification />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/admin/requests"
              element={
                <AdminPrivateRoute>
                  <RequestReports />
                </AdminPrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AdminAuthProvider>
  );
}

export default App;
