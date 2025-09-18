import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

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
    return <div className="loading">Loading available tests...</div>;
  }

  return (
    <div className="test-list-page">
      <h1>Available Tests</h1>

      {tests.length === 0 ? (
        <div className="no-data">
          <p>No tests available at the moment</p>
        </div>
      ) : (
        <div className="tests-grid">
          {tests.map((test) => (
            <div key={test._id} className="test-card">
              <h3>{test.title}</h3>
              {test.description && <p>{test.description}</p>}

              <div className="test-info">
                <span>Duration: {test.duration} minutes</span>
                {test.hasAttempted && (
                  <span className="completed-badge">Completed</span>
                )}
              </div>

              <button
                onClick={() => handleStartTest(test._id)}
                className={`start-test-btn ${test.hasAttempted ? 'disabled' : ''}`}
                disabled={test.hasAttempted}
              >
                {test.hasAttempted ? 'Already Completed' : 'Start Test'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestList;