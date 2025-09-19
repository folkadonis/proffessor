import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './TestHistoryPremium.css';

interface TestHistory {
  _id: string;
  test: {
    title: string;
    description?: string;
  };
  score: number;
  percentage: number;
  isPassed: boolean;
  completedAt: string;
}

const TestHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<TestHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestHistory();
  }, []);

  const fetchTestHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching test history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading test history...</div>;
  }

  return (
    <div className="test-history-page">
      <h1>My Test History</h1>

      {history.length === 0 ? (
        <div className="no-data">
          <p>You haven't taken any tests yet</p>
          <button onClick={() => navigate('/tests')} className="primary-btn">
            Browse Available Tests
          </button>
        </div>
      ) : (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Test Title</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="test-title">
                      <strong>{item.test.title}</strong>
                      {item.test.description && (
                        <small>{item.test.description}</small>
                      )}
                    </div>
                  </td>
                  <td>{item.score}</td>
                  <td>{item.percentage}%</td>
                  <td>
                    <span className={`status-badge ${item.isPassed ? 'passed' : 'failed'}`}>
                      {item.isPassed ? 'Passed' : 'Failed'}
                    </span>
                  </td>
                  <td>{new Date(item.completedAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => navigate(`/result/${item._id}`)}
                      className="view-result-btn"
                    >
                      View Result
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TestHistoryPage;