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
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="text-muted">Loading available tests...</p>
      </div>
    );
  }

  return (
    <div className="test-list-page">
      <div className="container">
        <div className="page-header">
          <h1>Available Tests</h1>
          <p className="text-muted">Select a test to begin your assessment</p>
        </div>

        {tests.length === 0 ? (
          <div className="empty-state">
            <h2>No Tests Available</h2>
            <p className="text-muted">There are no tests available at the moment. Please check back later.</p>
          </div>
        ) : (
          <div className="tests-grid">
            {tests.map((test) => (
              <div key={test._id} className="card">
                <div className="card-body">
                  <h3 className="card-title">{test.title}</h3>
                  <p className="card-text text-muted">
                    {test.description || 'No description available'}
                  </p>

                  <div className="test-meta">
                    <div className="test-duration">
                      <small className="text-muted">Duration: {test.duration} minutes</small>
                    </div>
                    {test.hasAttempted && (
                      <span className="badge badge-success">Completed</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleStartTest(test._id)}
                    className="btn btn-primary w-full mt-3"
                    disabled={test.hasAttempted}
                  >
                    {test.hasAttempted ? 'Already Attempted' : 'Start Test'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestList;