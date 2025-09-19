const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Question = require('../models/Question');
const TestModule = require('../models/TestModule');
const TestAttempt = require('../models/TestAttempt');

router.get('/pending-users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ isApproved: false, role: 'user' })
      .select('-password')
      .sort('-createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/approve-user/:userId', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isApproved: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User approved successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/reject-user/:userId', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User rejected and removed' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/toggle-user-status/:userId', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/all-users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort('-createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/questions', adminAuth, async (req, res) => {
  try {
    const { question, options, explanation, difficulty, category } = req.body;

    if (!question || !options || options.length < 2) {
      return res.status(400).json({ error: 'Invalid question data' });
    }

    const hasCorrectAnswer = options.some(opt => opt.isCorrect);
    if (!hasCorrectAnswer) {
      return res.status(400).json({ error: 'At least one correct answer is required' });
    }

    const newQuestion = new Question({
      question,
      options,
      explanation,
      difficulty,
      category,
      createdBy: req.user._id
    });

    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/questions', adminAuth, async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('createdBy', 'name email')
      .sort('-createdAt');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/questions/:id', adminAuth, async (req, res) => {
  try {
    const { question, options, explanation, difficulty, category } = req.body;

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      { question, options, explanation, difficulty, category },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/questions/:id', adminAuth, async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    await TestModule.updateMany(
      { questions: req.params.id },
      { $pull: { questions: req.params.id } }
    );

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/test-modules', adminAuth, async (req, res) => {
  try {
    const { title, description, questions, duration, passingScore } = req.body;

    if (!title || !questions || questions.length === 0 || !duration) {
      return res.status(400).json({ error: 'Invalid test module data' });
    }

    const testModule = new TestModule({
      title,
      description,
      questions,
      duration,
      passingScore,
      createdBy: req.user._id
    });

    await testModule.save();
    await testModule.populate('questions');

    res.status(201).json(testModule);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/test-modules', adminAuth, async (req, res) => {
  try {
    const testModules = await TestModule.find()
      .populate('createdBy', 'name email')
      .populate('questions')
      .sort('-createdAt');
    res.json(testModules);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/test-modules/:id', adminAuth, async (req, res) => {
  try {
    const { title, description, questions, duration, passingScore, isActive } = req.body;

    const testModule = await TestModule.findByIdAndUpdate(
      req.params.id,
      { title, description, questions, duration, passingScore, isActive },
      { new: true }
    ).populate('questions');

    if (!testModule) {
      return res.status(404).json({ error: 'Test module not found' });
    }

    res.json(testModule);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/test-modules/:id', adminAuth, async (req, res) => {
  try {
    const testModule = await TestModule.findByIdAndDelete(req.params.id);

    if (!testModule) {
      return res.status(404).json({ error: 'Test module not found' });
    }

    await TestAttempt.deleteMany({ testModule: req.params.id });

    res.json({ message: 'Test module deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/dashboard-stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const pendingUsers = await User.countDocuments({ role: 'user', isApproved: false });
    const totalQuestions = await Question.countDocuments();
    const totalTests = await TestModule.countDocuments();
    const totalAttempts = await TestAttempt.countDocuments();

    res.json({
      totalUsers,
      pendingUsers,
      totalQuestions,
      totalTests,
      totalAttempts
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;