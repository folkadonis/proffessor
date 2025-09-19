import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './DashboardProfessional.css';

const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  if (!user || isAdmin()) {
    return null;
  }

  return (
    <div className="dashboard-professional">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome, {user.name}</h1>
          <p className="text-muted">Track your progress and continue your learning journey</p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="text-muted">Loading your statistics...</p>
          </div>
        ) : (
          <>
            {stats && (
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Tests</div>
                  <div className="stat-value">{stats.totalTests || 0}</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">Passed</div>
                  <div className="stat-value text-success">{stats.passedTests || 0}</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">Failed</div>
                  <div className="stat-value text-danger">{stats.failedTests || 0}</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">Average Score</div>
                  <div className="stat-value">{stats.averageScore || 0}%</div>
                </div>
              </div>
            )}

            <div className="dashboard-actions">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Quick Actions</h3>
                </div>
                <div className="action-buttons">
                  <button onClick={() => navigate('/tests')} className="btn btn-primary">
                    Browse Available Tests
                  </button>
                  <button onClick={() => navigate('/history')} className="btn btn-secondary">
                    View Test History
                  </button>
                  <button onClick={() => navigate('/reports')} className="btn btn-secondary">
                    View Reports
                  </button>
                </div>
              </div>

              {stats && stats.recentTests && stats.recentTests.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Recent Activity</h3>
                  </div>
                  <div className="recent-tests">
                    {stats.recentTests.slice(0, 5).map((test: any, index: number) => (
                      <div key={index} className="test-item">
                        <div className="test-info">
                          <h4>{test.moduleName}</h4>
                          <p className="text-muted">
                            {new Date(test.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="test-score">
                          <span className={`badge ${test.passed ? 'badge-success' : 'badge-danger'}`}>
                            {test.score}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {(!stats || stats.totalTests === 0) && (
              <div className="empty-state">
                <h2>No Tests Taken Yet</h2>
                <p className="text-muted">Start your learning journey by taking your first test</p>
                <button onClick={() => navigate('/tests')} className="btn btn-primary btn-lg">
                  Browse Available Tests
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;