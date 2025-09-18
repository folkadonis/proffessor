import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface TestModule {
  _id: string;
  title: string;
  description?: string;
  questions: any[];
  duration: number;
  passingScore: number;
  isActive: boolean;
}

const TestModules: React.FC = () => {
  const [testModules, setTestModules] = useState<TestModule[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingModule, setEditingModule] = useState<TestModule | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: [] as string[],
    duration: 30,
    passingScore: 50,
    isActive: true
  });

  useEffect(() => {
    fetchTestModules();
    fetchQuestions();
  }, []);

  const fetchTestModules = async () => {
    try {
      const response = await api.get('/admin/test-modules');
      setTestModules(response.data);
    } catch (error) {
      console.error('Error fetching test modules:', error);
    }
  };

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

    if (formData.questions.length === 0) {
      alert('Please select at least one question');
      return;
    }

    try {
      if (editingModule) {
        await api.put(`/admin/test-modules/${editingModule._id}`, formData);
      } else {
        await api.post('/admin/test-modules', formData);
      }

      fetchTestModules();
      resetForm();
    } catch (error) {
      console.error('Error saving test module:', error);
      alert('Error saving test module');
    }
  };

  const handleEdit = (module: TestModule) => {
    setEditingModule(module);
    setFormData({
      title: module.title,
      description: module.description || '',
      questions: module.questions.map(q => q._id || q),
      duration: module.duration,
      passingScore: module.passingScore,
      isActive: module.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this test module?')) return;

    try {
      await api.delete(`/admin/test-modules/${id}`);
      fetchTestModules();
    } catch (error) {
      console.error('Error deleting test module:', error);
      alert('Error deleting test module');
    }
  };

  const toggleActive = async (module: TestModule) => {
    try {
      await api.put(`/admin/test-modules/${module._id}`, {
        ...module,
        isActive: !module.isActive,
        questions: module.questions.map(q => q._id || q)
      });
      fetchTestModules();
    } catch (error) {
      console.error('Error updating test module:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      questions: [],
      duration: 30,
      passingScore: 50,
      isActive: true
    });
    setEditingModule(null);
    setShowForm(false);
  };

  const handleQuestionToggle = (questionId: string) => {
    const newQuestions = formData.questions.includes(questionId)
      ? formData.questions.filter(id => id !== questionId)
      : [...formData.questions, questionId];

    setFormData({ ...formData, questions: newQuestions });
  };

  return (
    <div className="test-modules-page">
      <div className="page-header">
        <h1>Test Modules Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="primary-btn"
        >
          {showForm ? 'Cancel' : 'Create New Test Module'}
        </button>
      </div>

      {showForm && (
        <div className="module-form">
          <h2>{editingModule ? 'Edit Test Module' : 'Create Test Module'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Duration (minutes)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Passing Score (%)</label>
              <input
                type="number"
                value={formData.passingScore}
                onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                min="0"
                max="100"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                Active
              </label>
            </div>

            <div className="form-group">
              <label>Select Questions ({formData.questions.length} selected)</label>
              <div className="questions-selector">
                {questions.map((question) => (
                  <div key={question._id} className="question-select-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.questions.includes(question._id)}
                        onChange={() => handleQuestionToggle(question._id)}
                      />
                      <span>{question.question}</span>
                      <span className={`difficulty ${question.difficulty}`}>
                        {question.difficulty}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingModule ? 'Update Module' : 'Create Module'}
              </button>
              <button type="button" onClick={resetForm} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="modules-list">
        <h2>Test Modules ({testModules.length})</h2>
        {testModules.map((module) => (
          <div key={module._id} className="module-card">
            <div className="module-header">
              <h3>{module.title}</h3>
              <span className={`status ${module.isActive ? 'active' : 'inactive'}`}>
                {module.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {module.description && (
              <p className="module-description">{module.description}</p>
            )}

            <div className="module-info">
              <span>Questions: {module.questions.length}</span>
              <span>Duration: {module.duration} minutes</span>
              <span>Passing Score: {module.passingScore}%</span>
            </div>

            <div className="module-actions">
              <button onClick={() => handleEdit(module)} className="edit-btn">
                Edit
              </button>
              <button
                onClick={() => toggleActive(module)}
                className={module.isActive ? 'deactivate-btn' : 'activate-btn'}
              >
                {module.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => handleDelete(module._id)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestModules;