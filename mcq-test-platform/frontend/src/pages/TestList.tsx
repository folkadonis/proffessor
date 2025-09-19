import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Pages.css';

interface TestModule {
  _id: string;
  title: string;
  description?: string;
  duration: number;
  hasAttempted: boolean;
}

const TestList: React.FC = () => {
  const [tests, setTests] = useState<TestModule[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableTests();
  }, []);

  const fetchAvailableTests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/test/available');
      setTests(response.data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async (testId: string) => {
    try {
      const response = await api.post(`/test/start/${testId}`);
      navigate(`/test/${response.data.attemptId}`);
    } catch (error: any) {
      if (error.response?.data?.attemptId) {
        navigate(`/test/${error.response.data.attemptId}`);
      } else {
        alert(error.response?.data?.error || 'Error starting test');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner spinner-lg"></div>
        <p>Loading available tests...</p>
      </div>
    );
  }

  return (
    <div className="test-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Available Tests</h1>
          <p className="page-description">Choose a test to begin your assessment</p>
        </div>
      </div>

      {tests.length === 0 ? (
        <div className="no-data">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2>No Tests Available</h2>
          <p>There are no tests available at the moment. Please check back later.</p>
        </div>
      ) : (
        <div className="tests-grid">
          {tests.map((test) => (
            <div key={test._id} className="test-card">
              <h3>{test.title}</h3>
              <p>{test.description || 'No description available'}</p>

              <div className="test-info">
                <div className="test-duration">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{test.duration} minutes</span>
                </div>
                {test.hasAttempted && (
                  <div className="test-status">
                    <span className="completed-badge">Attempted</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleStartTest(test._id)}
                className="start-test-btn"
                disabled={test.hasAttempted}
              >
                {test.hasAttempted ? 'Already Attempted' : 'Start Test'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestList;