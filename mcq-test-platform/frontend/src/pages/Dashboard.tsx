import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './Dashboard.css';

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
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1 className="dashboard-title">
            Welcome back, <span className="user-name-highlight">{user.name}</span>!
          </h1>
          <p className="dashboard-subtitle">Track your progress and continue learning</p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/tests')} className="btn btn-primary">
            <svg className="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Take New Test
          </button>
        </div>
      </div>

      {loading ? (
        <div className="stats-loading">
          <div className="spinner spinner-lg"></div>
          <p>Loading your statistics...</p>
        </div>
      ) : stats ? (
        <>
          <div className="stats-overview">
            <div className="stat-card-professional total">
              <div className="stat-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="stat-content">
                <h3 className="stat-label">Total Tests</h3>
                <p className="stat-value">{stats.totalTests || 0}</p>
                <div className="stat-trend">
                  <span className="trend-text">All time</span>
                </div>
              </div>
            </div>

            <div className="stat-card-professional success">
              <div className="stat-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-content">
                <h3 className="stat-label">Tests Passed</h3>
                <p className="stat-value">{stats.passedTests || 0}</p>
                <div className="stat-trend positive">
                  <svg className="trend-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="trend-text">Success rate: {stats.totalTests ? Math.round((stats.passedTests / stats.totalTests) * 100) : 0}%</span>
                </div>
              </div>
            </div>

            <div className="stat-card-professional warning">
              <div className="stat-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-content">
                <h3 className="stat-label">Tests Failed</h3>
                <p className="stat-value">{stats.failedTests || 0}</p>
                <div className="stat-trend">
                  <span className="trend-text">Keep practicing!</span>
                </div>
              </div>
            </div>

            <div className="stat-card-professional info">
              <div className="stat-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="stat-content">
                <h3 className="stat-label">Average Score</h3>
                <p className="stat-value">{stats.averageScore || 0}%</p>
                <div className="stat-progress">
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: `${stats.averageScore || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-sections">
            <div className="recent-activity card">
              <div className="card-header">
                <h2>Recent Activity</h2>
                <button onClick={() => navigate('/history')} className="btn btn-secondary btn-sm">
                  View All
                </button>
              </div>
              <div className="activity-list">
                {stats.recentTests && stats.recentTests.length > 0 ? (
                  stats.recentTests.slice(0, 3).map((test: any, index: number) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">
                        {test.passed ? (
                          <svg className="success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <div className="activity-content">
                        <h4>{test.moduleName}</h4>
                        <p>Score: {test.score}% • {new Date(test.completedAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`badge ${test.passed ? 'badge-success' : 'badge-danger'}`}>
                        {test.passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="no-activity">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No recent activity</p>
                    <button onClick={() => navigate('/tests')} className="btn btn-primary btn-sm">
                      Start Your First Test
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="quick-actions card">
              <div className="card-header">
                <h2>Quick Actions</h2>
              </div>
              <div className="actions-grid">
                <button
                  onClick={() => navigate('/tests')}
                  className="action-card"
                >
                  <div className="action-icon primary">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span>Browse Tests</span>
                </button>

                <button
                  onClick={() => navigate('/history')}
                  className="action-card"
                >
                  <div className="action-icon success">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>Test History</span>
                </button>

                <button
                  onClick={() => navigate('/reports')}
                  className="action-card"
                >
                  <div className="action-icon info">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span>View Reports</span>
                </button>

                <button
                  onClick={() => window.location.href = '/profile'}
                  className="action-card"
                >
                  <div className="action-icon warning">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span>My Profile</span>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="no-stats">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2>No Data Available</h2>
          <p>Start taking tests to see your statistics here</p>
          <button onClick={() => navigate('/tests')} className="btn btn-primary">
            Browse Available Tests
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;