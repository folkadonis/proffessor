import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

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
    window.addEventListener('keydown', handleKeyDown);

    document.addEventListener('contextmenu', (e) => e.preventDefault());

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', (e) => e.preventDefault());
    };
  }, [attemptId, handleBeforeUnload, handleVisibilityChange, handleKeyDown]);

  useEffect(() => {
    if (test && startTime) {
      const timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
        const remaining = Math.max(0, test.duration * 60 - elapsed);
        setTimeLeft(remaining);

        if (remaining === 0) {
          handleSubmitTest();
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [test, startTime]);

  const fetchTestData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/test/attempt/${attemptId}`);
      setTest(response.data.test);
      setStartTime(new Date(response.data.startedAt));

      const savedAnswers: { [key: string]: number } = {};
      response.data.test.questions.forEach((q: Question) => {
        if (q.selectedOption !== null && q.selectedOption !== undefined) {
          savedAnswers[q._id] = q.selectedOption;
        }
      });
      setAnswers(savedAnswers);
    } catch (error) {
      console.error('Error fetching test:', error);
      alert('Error loading test');
      navigate('/tests');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = async (questionId: string, optionIndex: number) => {
    setAnswers({ ...answers, [questionId]: optionIndex });

    try {
      await api.post(`/test/answer/${attemptId}`, {
        questionId,
        selectedOption: optionIndex
      });
    } catch (error) {
      console.error('Error saving answer:', error);
    }
  };

  const handleSubmitTest = async () => {
    if (!window.confirm('Are you sure you want to submit the test?')) return;

    try {
      setSubmitting(true);
      const response = await api.post(`/test/submit/${attemptId}`);
      navigate(`/result/${attemptId}`);
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Error submitting test');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="loading">Loading test...</div>;
  }

  if (!test) {
    return <div className="error">Test not found</div>;
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="take-test-page">
      <div className="test-header">
        <h2>{test.title}</h2>
        <div className="test-timer">
          <span className={timeLeft < 300 ? 'warning' : ''}>
            Time Left: {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="test-progress">
        <div className="progress-info">
          Question {currentQuestionIndex + 1} of {test.questions.length}
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentQuestionIndex + 1) / test.questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="question-container">
        <div className="question-text">
          <h3>{currentQuestion.question}</h3>
        </div>

        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <label key={index} className="option-label">
              <input
                type="radio"
                name={`question-${currentQuestion._id}`}
                checked={answers[currentQuestion._id] === index}
                onChange={() => handleAnswerSelect(currentQuestion._id, index)}
              />
              <span className="option-text">{option.text}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="navigation-container">
        <button
          onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
          disabled={currentQuestionIndex === 0}
          className="nav-btn"
        >
          Previous
        </button>

        <div className="question-indicators">
          {test.questions.map((q, index) => (
            <button
              key={q._id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`indicator ${index === currentQuestionIndex ? 'current' : ''} ${
                answers[q._id] !== undefined ? 'answered' : ''
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
          disabled={currentQuestionIndex === test.questions.length - 1}
          className="nav-btn"
        >
          Next
        </button>
      </div>

      <div className="test-footer">
        <div className="answered-info">
          Answered: {answeredCount} / {test.questions.length}
        </div>
        <button
          onClick={handleSubmitTest}
          className="submit-test-btn"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Test'}
        </button>
      </div>
    </div>
  );
};

export default TakeTest;