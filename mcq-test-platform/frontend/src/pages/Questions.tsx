import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Option {
  text: string;
  isCorrect: boolean;
}

interface Question {
  _id: string;
  question: string;
  options: Option[];
  explanation?: string;
  difficulty: string;
  category?: string;
}

const Questions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    explanation: '',
    difficulty: 'medium',
    category: ''
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/admin/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validOptions = formData.options.filter(opt => opt.text.trim());
    if (validOptions.length < 2) {
      alert('At least 2 options are required');
      return;
    }

    if (!validOptions.some(opt => opt.isCorrect)) {
      alert('At least one correct answer is required');
      return;
    }

    try {
      if (editingQuestion) {
        await api.put(`/admin/questions/${editingQuestion._id}`, {
          ...formData,
          options: validOptions
        });
      } else {
        await api.post('/admin/questions', {
          ...formData,
          options: validOptions
        });
      }

      fetchQuestions();
      resetForm();
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Error saving question');
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      options: [
        ...question.options,
        ...Array(4 - question.options.length).fill({ text: '', isCorrect: false })
      ].slice(0, 4),
      explanation: question.explanation || '',
      difficulty: question.difficulty,
      category: question.category || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      await api.delete(`/admin/questions/${id}`);
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Error deleting question');
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
      explanation: '',
      difficulty: 'medium',
      category: ''
    });
    setEditingQuestion(null);
    setShowForm(false);
  };

  const handleOptionChange = (index: number, field: 'text' | 'isCorrect', value: any) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <div className="questions-page">
      <div className="page-header">
        <h1>Questions Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="primary-btn"
        >
          {showForm ? 'Cancel' : 'Add New Question'}
        </button>
      </div>

      {showForm && (
        <div className="question-form">
          <h2>{editingQuestion ? 'Edit Question' : 'Add New Question'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Question</label>
              <textarea
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Options</label>
              {formData.options.map((option, index) => (
                <div key={index} className="option-input">
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={option.isCorrect}
                      onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                    />
                    Correct
                  </label>
                </div>
              ))}
            </div>

            <div className="form-group">
              <label>Explanation (Optional)</label>
              <textarea
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category (Optional)</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingQuestion ? 'Update Question' : 'Add Question'}
              </button>
              <button type="button" onClick={resetForm} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="questions-list">
        <h2>Questions ({questions.length})</h2>
        {questions.map((question) => (
          <div key={question._id} className="question-card">
            <div className="question-header">
              <h3>{question.question}</h3>
              <div className="question-meta">
                <span className={`difficulty ${question.difficulty}`}>
                  {question.difficulty}
                </span>
                {question.category && <span className="category">{question.category}</span>}
              </div>
            </div>

            <div className="options-list">
              {question.options.map((option, index) => (
                <div key={index} className={`option ${option.isCorrect ? 'correct' : ''}`}>
                  {index + 1}. {option.text}
                  {option.isCorrect && <span className="correct-badge">✓</span>}
                </div>
              ))}
            </div>

            {question.explanation && (
              <div className="explanation">
                <strong>Explanation:</strong> {question.explanation}
              </div>
            )}

            <div className="question-actions">
              <button onClick={() => handleEdit(question)} className="edit-btn">
                Edit
              </button>
              <button onClick={() => handleDelete(question._id)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questions;