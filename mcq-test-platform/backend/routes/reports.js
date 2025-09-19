const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const TestAttempt = require('../models/TestAttempt');
const TestModule = require('../models/TestModule');
const User = require('../models/User');

// Get all test reports for admin (all users)
router.get('/admin/all-reports', adminAuth, async (req, res) => {
  try {
    const reports = await TestAttempt.find({ isCompleted: true })
      .populate('user', 'name email')
      .populate('test', 'title')
      .sort('-completedAt');

    const formattedReports = reports.map(report => ({
      userName: report.user?.name || 'Unknown',
      userEmail: report.user?.email || 'Unknown',
      testTitle: report.test?.title || 'Unknown Test',
      score: report.score,
      totalQuestions: report.totalQuestions,
      percentage: ((report.score / report.totalQuestions) * 100).toFixed(2),
      isPassed: report.isPassed,
      timeTaken: report.duration,
      completedAt: report.completedAt
    }));

    res.json(formattedReports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get individual user's test reports
router.get('/user/my-reports', auth, async (req, res) => {
  try {
    const reports = await TestAttempt.find({
      user: req.user._id,
      isCompleted: true
    })
      .populate('test', 'title description')
      .sort('-completedAt');

    const formattedReports = reports.map(report => ({
      testTitle: report.test?.title || 'Unknown Test',
      testDescription: report.test?.description || '',
      score: report.score,
      totalQuestions: report.totalQuestions,
      percentage: ((report.score / report.totalQuestions) * 100).toFixed(2),
      isPassed: report.isPassed,
      timeTaken: report.duration,
      completedAt: report.completedAt,
      attemptId: report._id
    }));

    res.json(formattedReports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Export reports as CSV data (frontend will convert to Excel)
router.get('/export/:type', auth, async (req, res) => {
  try {
    const { type } = req.params;
    let data = [];

    if (type === 'admin' && req.user.role === 'admin') {
      // Admin can export all reports
      const reports = await TestAttempt.find({ isCompleted: true })
        .populate('user', 'name email')
        .populate('test', 'title')
        .sort('-completedAt');

      data = reports.map(report => ({
        'User Name': report.user?.name || 'Unknown',
        'Email': report.user?.email || 'Unknown',
        'Test': report.test?.title || 'Unknown',
        'Score': `${report.score}/${report.totalQuestions}`,
        'Percentage': `${((report.score / report.totalQuestions) * 100).toFixed(2)}%`,
        'Status': report.isPassed ? 'Passed' : 'Failed',
        'Time (minutes)': report.duration,
        'Date': new Date(report.completedAt).toLocaleDateString(),
        'Time': new Date(report.completedAt).toLocaleTimeString()
      }));
    } else {
      // User can export their own reports
      const reports = await TestAttempt.find({
        user: req.user._id,
        isCompleted: true
      })
        .populate('test', 'title')
        .sort('-completedAt');

      data = reports.map(report => ({
        'Test': report.test?.title || 'Unknown',
        'Score': `${report.score}/${report.totalQuestions}`,
        'Percentage': `${((report.score / report.totalQuestions) * 100).toFixed(2)}%`,
        'Status': report.isPassed ? 'Passed' : 'Failed',
        'Time (minutes)': report.duration,
        'Date': new Date(report.completedAt).toLocaleDateString(),
        'Time': new Date(report.completedAt).toLocaleTimeString()
      }));
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get detailed statistics for admin dashboard
router.get('/admin/statistics', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ role: 'user', isActive: true });
    const totalTests = await TestModule.countDocuments();
    const totalAttempts = await TestAttempt.countDocuments({ isCompleted: true });
    const passedAttempts = await TestAttempt.countDocuments({ isCompleted: true, isPassed: true });

    const passRate = totalAttempts > 0
      ? ((passedAttempts / totalAttempts) * 100).toFixed(2)
      : 0;

    res.json({
      totalUsers,
      activeUsers,
      totalTests,
      totalAttempts,
      passedAttempts,
      passRate
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;