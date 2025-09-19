import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './TakeTestPremium.css';

interface Question {
  _id: string;
  question: string;
  options: { text: string }[];
  selectedOption?: number | null;
}

interface Test {
  _id: string;
  title: string;
  description?: string;
  duration: number;
  questions: Question[];
}

const TakeTest: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();

  const [test, setTest] = useState<Test | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = 'Your test will be ended if you leave this page. Are you sure?';
  }, []);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      alert('Warning: Leaving the test page will end your test!');
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
      e.preventDefault();
      alert('Page refresh is disabled during the test');
    }
    if (e.altKey && e.key === 'Tab') {
      e.preventDefault();
    }
  }, []);

  useEffect(() => {
    fetchTestData();
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [attemptId, handleBeforeUnload, handleVisibilityChange, handleKeyDown]);

  useEffect(() => {
    if (test && startTime) {
      const timer = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        const remaining = Math.max(test.duration * 60 - elapsed, 0);
        setTimeLeft(remaining);

        if (remaining === 0) {
          handleSubmit();
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [test, startTime]);

  const fetchTestData = async () => {
    try {
      const response = await api.get(`/test/attempt/${attemptId}`);
      const testData = response.data;

      setTest(testData.test);
      setStartTime(new Date(testData.startTime));

      const savedAnswers = testData.answers || {};
      setAnswers(savedAnswers);

      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching test:', error);
      alert('Error loading test. Please try again.');
      navigate('/tests');
    }
  };

  const handleOptionSelect = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < test!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = async () => {
    const confirmed = window.confirm('Are you sure you want to submit your test?');
    if (!confirmed) return;

    setSubmitting(true);
    try {
      const response = await api.post(`/test/submit/${attemptId}`, {
        answers
      });

      navigate(`/result/${attemptId}`);
    } catch (error: any) {
      console.error('Error submitting test:', error);
      alert(error.response?.data?.error || 'Error submitting test');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="text-muted">Loading test...</p>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="empty-state">
        <h2>Test not found</h2>
        <button onClick={() => navigate('/tests')} className="btn btn-primary">
          Back to Tests
        </button>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const isAnswered = (questionId: string) => answers.hasOwnProperty(questionId);

  return (
    <div className="take-test-page">
      <div className="test-container">
        <div className="test-header-info">
          <div>
            <h2>{test.title}</h2>
            <p className="text-muted">Question {currentQuestionIndex + 1} of {test.questions.length}</p>
          </div>
          <div className={`test-timer ${timeLeft < 300 ? 'warning' : ''}`}>
            Time Left: {formatTime(timeLeft)}
          </div>
        </div>

        <div className="question-indicators">
          {test.questions.map((q, index) => (
            <button
              key={q._id}
              onClick={() => handleQuestionJump(index)}
              className={`indicator-btn ${
                index === currentQuestionIndex ? 'current' : ''
              } ${isAnswered(q._id) ? 'answered' : ''}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div className="question-content">
          <h3 className="question-text">{currentQuestion.question}</h3>

          <div className="options-list">
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="option-item">
                <label className="option-label">
                  <input
                    type="radio"
                    name={`question-${currentQuestion._id}`}
                    checked={answers[currentQuestion._id] === index}
                    onChange={() => handleOptionSelect(currentQuestion._id, index)}
                  />
                  <span>{option.text}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="question-navigation">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="btn btn-secondary"
          >
            Previous
          </button>

          <div className="question-progress">
            {Object.keys(answers).length} of {test.questions.length} answered
          </div>

          {currentQuestionIndex === test.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn btn-danger"
            >
              {submitting ? 'Submitting...' : 'Submit Test'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn btn-primary"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TakeTest;