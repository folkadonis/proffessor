import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (isAdmin()) {
      navigate('/admin');
    } else {
      fetchUserStats();
    }
  }, [isAdmin, navigate]);

  const fetchUserStats = async () => {
    try {
      const response = await api.get('/user/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (!user || isAdmin()) {
    return null;
  }

  return (
    <div className="dashboard">
      <h1>Welcome, {user.name}!</h1>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Tests Taken</h3>
            <p className="stat-number">{stats.totalTests}</p>
          </div>

          <div className="stat-card">
            <h3>Tests Passed</h3>
            <p className="stat-number">{stats.passedTests}</p>
          </div>

          <div className="stat-card">
            <h3>Tests Failed</h3>
            <p className="stat-number">{stats.failedTests}</p>
          </div>

          <div className="stat-card">
            <h3>Average Score</h3>
            <p className="stat-number">{stats.averageScore}%</p>
          </div>
        </div>
      )}

      <div className="action-buttons">
        <button onClick={() => navigate('/tests')} className="primary-btn">
          Take a Test
        </button>
        <button onClick={() => navigate('/history')} className="secondary-btn">
          View History
        </button>
      </div>
    </div>
  );
};

export default Dashboard;