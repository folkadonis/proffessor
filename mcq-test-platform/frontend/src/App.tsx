import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Questions from './pages/Questions';
import TestModules from './pages/TestModules';
import PendingUsers from './pages/PendingUsers';
import TestList from './pages/TestList';
import TakeTest from './pages/TakeTest';
import TestResult from './pages/TestResult';
import TestHistory from './pages/TestHistory';
import UserManagement from './pages/UserManagement';
import Reports from './pages/Reports';
import './styles/globals.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              <Route path="/admin/questions" element={
                <ProtectedRoute adminOnly>
                  <Questions />
                </ProtectedRoute>
              } />

              <Route path="/admin/test-modules" element={
                <ProtectedRoute adminOnly>
                  <TestModules />
                </ProtectedRoute>
              } />

              <Route path="/admin/pending-users" element={
                <ProtectedRoute adminOnly>
                  <PendingUsers />
                </ProtectedRoute>
              } />

              <Route path="/admin/users" element={
                <ProtectedRoute adminOnly>
                  <UserManagement />
                </ProtectedRoute>
              } />

              <Route path="/admin/reports" element={
                <ProtectedRoute adminOnly>
                  <Reports />
                </ProtectedRoute>
              } />

              <Route path="/reports" element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } />

              <Route path="/tests" element={
                <ProtectedRoute>
                  <TestList />
                </ProtectedRoute>
              } />

              <Route path="/test/:attemptId" element={
                <ProtectedRoute>
                  <TakeTest />
                </ProtectedRoute>
              } />

              <Route path="/result/:attemptId" element={
                <ProtectedRoute>
                  <TestResult />
                </ProtectedRoute>
              } />

              <Route path="/history" element={
                <ProtectedRoute>
                  <TestHistory />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
