import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Answer {
  question: string;
  options: { text: string; isCorrect: boolean }[];
  selectedOption: number | null;
  isCorrect: boolean;
  explanation?: string;
}

interface TestResult {
  test: {
    title: string;
    description?: string;
  };
  score: number;
  totalQuestions: number;
  percentage: number;
  isPassed: boolean;
  passingScore: number;
  completedAt: string;
  duration: number;
  answers: Answer[];
}

const TestResultPage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchTestResult();
  }, [attemptId]);

  const fetchTestResult = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/test/result/${attemptId}`);
      setResult(response.data);
    } catch (error) {
      console.error('Error fetching test result:', error);
      alert('Error loading test result');
      navigate('/tests');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading test result...</div>;
  }

  if (!result) {
    return <div className="error">Result not found</div>;
  }

  return (
    <div className="test-result-page">
      <div className="result-header">
        <h1>Test Result</h1>
        <h2>{result.test.title}</h2>
        {result.test.description && <p>{result.test.description}</p>}
      </div>

      <div className={`result-card ${result.isPassed ? 'passed' : 'failed'}`}>
        <div className="result-status">
          {result.isPassed ? (
            <div className="pass-message">
              <span className="status-icon">✓</span>
              <h3>Congratulations! You Passed!</h3>
            </div>
          ) : (
            <div className="fail-message">
              <span className="status-icon">✗</span>
              <h3>Test Not Passed</h3>
            </div>
          )}
        </div>

        <div className="result-stats">
          <div className="stat">
            <label>Score:</label>
            <span>{result.score} / {result.totalQuestions}</span>
          </div>
          <div className="stat">
            <label>Percentage:</label>
            <span>{result.percentage}%</span>
          </div>
          <div className="stat">
            <label>Passing Score:</label>
            <span>{result.passingScore}%</span>
          </div>
          <div className="stat">
            <label>Time Taken:</label>
            <span>{result.duration} minutes</span>
          </div>
          <div className="stat">
            <label>Completed At:</label>
            <span>{new Date(result.completedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="result-actions">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="toggle-details-btn"
        >
          {showDetails ? 'Hide' : 'Show'} Detailed Answers
        </button>
        <button onClick={() => navigate('/tests')} className="back-btn">
          Back to Tests
        </button>
        <button onClick={() => navigate('/history')} className="history-btn">
          View History
        </button>
      </div>

      {showDetails && (
        <div className="answers-detail">
          <h3>Detailed Answers</h3>
          {result.answers.map((answer, index) => (
            <div
              key={index}
              className={`answer-card ${answer.isCorrect ? 'correct' : 'incorrect'}`}
            >
              <div className="answer-header">
                <span className="question-number">Question {index + 1}</span>
                <span className={`answer-status ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                  {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>

              <div className="question-text">
                <strong>{answer.question}</strong>
              </div>

              <div className="options-review">
                {answer.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`option-review ${
                      option.isCorrect ? 'correct-option' : ''
                    } ${
                      answer.selectedOption === optIndex ? 'selected-option' : ''
                    }`}
                  >
                    <span className="option-marker">
                      {answer.selectedOption === optIndex && '→ '}
                      {option.isCorrect && '✓ '}
                    </span>
                    {optIndex + 1}. {option.text}
                  </div>
                ))}
              </div>

              {answer.selectedOption === null && (
                <div className="not-answered">Not answered</div>
              )}

              {answer.explanation && (
                <div className="explanation">
                  <strong>Explanation:</strong> {answer.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestResultPage;