import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AdminDashboardPremium.css';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/admin/dashboard-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>

          <div className="stat-card">
            <h3>Pending Approvals</h3>
            <p className="stat-number">{stats.pendingUsers}</p>
            {stats.pendingUsers > 0 && (
              <button
                onClick={() => navigate('/admin/pending-users')}
                className="view-btn"
              >
                View
              </button>
            )}
          </div>

          <div className="stat-card">
            <h3>Total Questions</h3>
            <p className="stat-number">{stats.totalQuestions}</p>
          </div>

          <div className="stat-card">
            <h3>Total Test Modules</h3>
            <p className="stat-number">{stats.totalTests}</p>
          </div>

          <div className="stat-card">
            <h3>Total Attempts</h3>
            <p className="stat-number">{stats.totalAttempts}</p>
          </div>
        </div>
      )}

      <div className="admin-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button
            onClick={() => navigate('/admin/questions')}
            className="action-btn"
          >
            Manage Questions
          </button>
          <button
            onClick={() => navigate('/admin/test-modules')}
            className="action-btn"
          >
            Manage Test Modules
          </button>
          <button
            onClick={() => navigate('/admin/pending-users')}
            className="action-btn"
          >
            Approve Users
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;