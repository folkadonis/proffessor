const express = require('express');
const router = express.Router();
const { approvedUserAuth } = require('../middleware/auth');
const TestAttempt = require('../models/TestAttempt');

router.get('/history', approvedUserAuth, async (req, res) => {
  try {
    const attempts = await TestAttempt.find({
      user: req.user._id,
      isCompleted: true
    })
    .populate('testModule', 'title description')
    .sort('-completedAt');

    const history = attempts.map(attempt => ({
      _id: attempt._id,
      test: {
        title: attempt.testModule.title,
        description: attempt.testModule.description
      },
      score: attempt.score,
      percentage: attempt.percentage,
      isPassed: attempt.isPassed,
      completedAt: attempt.completedAt
    }));

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/stats', approvedUserAuth, async (req, res) => {
  try {
    const attempts = await TestAttempt.find({
      user: req.user._id,
      isCompleted: true
    });

    const totalTests = attempts.length;
    const passedTests = attempts.filter(a => a.isPassed).length;
    const averageScore = totalTests > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / totalTests)
      : 0;

    res.json({
      totalTests,
      passedTests,
      failedTests: totalTests - passedTests,
      averageScore
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;