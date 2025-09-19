import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

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

  const getProgressColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="dashboard-premium">
      <div className="container" style={{ maxWidth: '1400px' }}>
        <div className="dashboard-header-premium">
          <h1>Welcome back, {user.name}!</h1>
          <p className="dashboard-subtitle">Track your learning progress and achievements</p>
        </div>

        {loading ? (
          <div className="loading-premium">
            <div className="spinner-premium"></div>
            <p className="text-muted">Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {stats && (
              <>
                <div className="stats-grid-premium">
                  <div className="stat-card-premium">
                    <div className="stat-icon-premium">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 11H3v10h6V11zm5-7h-4v17h4V4zm5 3h-4v14h4V7z" />
                      </svg>
                    </div>
                    <div className="stat-content">
                      <div className="stat-value-premium">{stats.totalTests || 0}</div>
                      <div className="stat-label-premium">Total Tests Taken</div>
                      <div className="stat-trend">
                        <span className="trend-badge">All Time</span>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card-premium success">
                    <div className="stat-icon-premium">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <div className="stat-content">
                      <div className="stat-value-premium">{stats.passedTests || 0}</div>
                      <div className="stat-label-premium">Tests Passed</div>
                      <div className="stat-trend">
                        <span className="trend-badge success">
                          {stats.totalTests ? Math.round((stats.passedTests / stats.totalTests) * 100) : 0}% Success
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card-premium warning">
                    <div className="stat-icon-premium">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                    </div>
                    <div className="stat-content">
                      <div className="stat-value-premium">{stats.failedTests || 0}</div>
                      <div className="stat-label-premium">Tests Failed</div>
                      <div className="stat-trend">
                        <span className="trend-badge warning">Keep Improving</span>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card-premium info">
                    <div className="stat-icon-premium">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="20" x2="12" y2="10" />
                        <line x1="18" y1="20" x2="18" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="16" />
                      </svg>
                    </div>
                    <div className="stat-content">
                      <div className="stat-value-premium">{stats.averageScore || 0}%</div>
                      <div className="stat-label-premium">Average Score</div>
                      <div className="progress-bar-premium">
                        <div
                          className="progress-fill-premium"
                          style={{
                            width: `${stats.averageScore || 0}%`,
                            background: getProgressColor(stats.averageScore || 0)
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dashboard-content-grid">
                  <div className="premium-card">
                    <div className="card-header-premium">
                      <h3>Quick Actions</h3>
                      <span className="card-badge">Get Started</span>
                    </div>
                    <div className="quick-actions-grid">
                      <button onClick={() => navigate('/tests')} className="action-card-premium">
                        <div className="action-icon-premium">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                          </svg>
                        </div>
                        <span>Browse Tests</span>
                      </button>

                      <button onClick={() => navigate('/history')} className="action-card-premium">
                        <div className="action-icon-premium">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        </div>
                        <span>Test History</span>
                      </button>

                      <button onClick={() => navigate('/reports')} className="action-card-premium">
                        <div className="action-icon-premium">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                            <path d="M22 12A10 10 0 0 0 12 2v10z" />
                          </svg>
                        </div>
                        <span>View Reports</span>
                      </button>

                      <button className="action-card-premium">
                        <div className="action-icon-premium">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24m-4.24 4.24l4.24 4.24M20 12h-6m-6 0H2m13.22 4.22l-4.24 4.24m-4.24-4.24l-4.24 4.24" />
                          </svg>
                        </div>
                        <span>Settings</span>
                      </button>
                    </div>
                  </div>

                  <div className="premium-card">
                    <div className="card-header-premium">
                      <h3>Recent Activity</h3>
                      <button onClick={() => navigate('/history')} className="view-all-btn">
                        View All →
                      </button>
                    </div>
                    <div className="activity-list-premium">
                      {stats.recentTests && stats.recentTests.length > 0 ? (
                        stats.recentTests.slice(0, 5).map((test: any, index: number) => (
                          <div key={index} className="activity-item-premium">
                            <div className={`activity-icon ${test.passed ? 'success' : 'danger'}`}>
                              {test.passed ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              )}
                            </div>
                            <div className="activity-content">
                              <h4>{test.moduleName}</h4>
                              <p className="activity-meta">
                                Score: {test.score}% • {new Date(test.completedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className={`activity-badge ${test.passed ? 'success' : 'danger'}`}>
                              {test.passed ? 'Passed' : 'Failed'}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="empty-activity">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" opacity="0.3">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <line x1="9" y1="9" x2="15" y2="9" />
                            <line x1="9" y1="13" x2="15" y2="13" />
                          </svg>
                          <p>No recent activity</p>
                          <button onClick={() => navigate('/tests')} className="btn-premium btn-premium-primary">
                            Start Your First Test
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {stats.totalTests > 0 && (
                  <div className="premium-card achievement-card">
                    <div className="card-header-premium">
                      <h3>Your Achievements</h3>
                      <span className="card-badge">Level {Math.floor(stats.totalTests / 5) + 1}</span>
                    </div>
                    <div className="achievements-grid">
                      <div className="achievement-item">
                        <div className="achievement-icon gold">🏆</div>
                        <span>First Test</span>
                      </div>
                      {stats.totalTests >= 5 && (
                        <div className="achievement-item">
                          <div className="achievement-icon silver">🥈</div>
                          <span>5 Tests</span>
                        </div>
                      )}
                      {stats.totalTests >= 10 && (
                        <div className="achievement-item">
                          <div className="achievement-icon bronze">🥉</div>
                          <span>10 Tests</span>
                        </div>
                      )}
                      {stats.averageScore >= 80 && (
                        <div className="achievement-item">
                          <div className="achievement-icon special">⭐</div>
                          <span>High Scorer</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {(!stats || stats.totalTests === 0) && (
              <div className="premium-card welcome-card">
                <div className="welcome-content">
                  <div className="welcome-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <h2>Ready to Start Your Journey?</h2>
                  <p>Take your first test and track your progress</p>
                  <button onClick={() => navigate('/tests')} className="btn-premium btn-premium-primary">
                    Browse Available Tests
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;