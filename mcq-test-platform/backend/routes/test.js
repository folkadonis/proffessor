const express = require('express');
const router = express.Router();
const { approvedUserAuth } = require('../middleware/auth');
const TestModule = require('../models/TestModule');
const TestAttempt = require('../models/TestAttempt');
const Question = require('../models/Question');

router.get('/available', approvedUserAuth, async (req, res) => {
  try {
    const testModules = await TestModule.find({ isActive: true })
      .select('-questions')
      .populate('createdBy', 'name');

    const userAttempts = await TestAttempt.find({
      user: req.user._id,
      isCompleted: true
    }).select('testModule');

    const attemptedTestIds = userAttempts.map(a => a.testModule.toString());

    const testsWithStatus = testModules.map(test => ({
      ...test.toObject(),
      hasAttempted: attemptedTestIds.includes(test._id.toString())
    }));

    res.json(testsWithStatus);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/start/:testId', approvedUserAuth, async (req, res) => {
  try {
    const existingAttempt = await TestAttempt.findOne({
      user: req.user._id,
      testModule: req.params.testId,
      isCompleted: false
    });

    if (existingAttempt) {
      return res.status(400).json({
        error: 'Test already in progress',
        attemptId: existingAttempt._id
      });
    }

    const completedAttempt = await TestAttempt.findOne({
      user: req.user._id,
      testModule: req.params.testId,
      isCompleted: true
    });

    if (completedAttempt) {
      return res.status(400).json({ error: 'Test already completed' });
    }

    const testModule = await TestModule.findById(req.params.testId)
      .populate('questions');

    if (!testModule || !testModule.isActive) {
      return res.status(404).json({ error: 'Test not found or inactive' });
    }

    const attempt = new TestAttempt({
      user: req.user._id,
      testModule: req.params.testId,
      answers: testModule.questions.map(q => ({
        question: q._id,
        selectedOption: null,
        isCorrect: false
      }))
    });

    await attempt.save();

    const questionsWithoutAnswers = testModule.questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options.map(opt => ({ text: opt.text })),
      difficulty: q.difficulty,
      category: q.category
    }));

    res.json({
      attemptId: attempt._id,
      test: {
        _id: testModule._id,
        title: testModule.title,
        description: testModule.description,
        duration: testModule.duration,
        questions: questionsWithoutAnswers
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/attempt/:attemptId', approvedUserAuth, async (req, res) => {
  try {
    const attempt = await TestAttempt.findOne({
      _id: req.params.attemptId,
      user: req.user._id
    }).populate({
      path: 'testModule',
      populate: {
        path: 'questions'
      }
    });

    if (!attempt) {
      return res.status(404).json({ error: 'Test attempt not found' });
    }

    if (attempt.isCompleted) {
      return res.status(400).json({ error: 'Test already completed' });
    }

    const questionsWithAnswers = attempt.testModule.questions.map(q => {
      const answer = attempt.answers.find(a =>
        a.question.toString() === q._id.toString()
      );

      return {
        _id: q._id,
        question: q.question,
        options: q.options.map(opt => ({ text: opt.text })),
        selectedOption: answer ? answer.selectedOption : null
      };
    });

    res.json({
      attemptId: attempt._id,
      test: {
        _id: attempt.testModule._id,
        title: attempt.testModule.title,
        description: attempt.testModule.description,
        duration: attempt.testModule.duration,
        questions: questionsWithAnswers
      },
      startedAt: attempt.startedAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/answer/:attemptId', approvedUserAuth, async (req, res) => {
  try {
    const { questionId, selectedOption } = req.body;

    const attempt = await TestAttempt.findOne({
      _id: req.params.attemptId,
      user: req.user._id,
      isCompleted: false
    });

    if (!attempt) {
      return res.status(404).json({ error: 'Test attempt not found or already completed' });
    }

    const answerIndex = attempt.answers.findIndex(
      a => a.question.toString() === questionId
    );

    if (answerIndex === -1) {
      return res.status(400).json({ error: 'Question not found in this test' });
    }

    attempt.answers[answerIndex].selectedOption = selectedOption;
    await attempt.save();

    res.json({ message: 'Answer saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/submit/:attemptId', approvedUserAuth, async (req, res) => {
  try {
    const attempt = await TestAttempt.findOne({
      _id: req.params.attemptId,
      user: req.user._id,
      isCompleted: false
    }).populate('testModule');

    if (!attempt) {
      return res.status(404).json({ error: 'Test attempt not found or already completed' });
    }

    const questions = await Question.find({
      _id: { $in: attempt.testModule.questions }
    });

    let correctAnswers = 0;
    attempt.answers.forEach(answer => {
      const question = questions.find(
        q => q._id.toString() === answer.question.toString()
      );

      if (question && answer.selectedOption !== null) {
        const isCorrect = question.options[answer.selectedOption]?.isCorrect || false;
        answer.isCorrect = isCorrect;
        if (isCorrect) correctAnswers++;
      }
    });

    const totalQuestions = questions.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const isPassed = percentage >= attempt.testModule.passingScore;

    attempt.score = correctAnswers;
    attempt.percentage = percentage;
    attempt.isPassed = isPassed;
    attempt.isCompleted = true;
    attempt.completedAt = new Date();

    await attempt.save();

    res.json({
      score: correctAnswers,
      totalQuestions,
      percentage,
      isPassed,
      passingScore: attempt.testModule.passingScore
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/result/:attemptId', approvedUserAuth, async (req, res) => {
  try {
    const attempt = await TestAttempt.findOne({
      _id: req.params.attemptId,
      user: req.user._id,
      isCompleted: true
    }).populate({
      path: 'testModule',
      populate: {
        path: 'questions'
      }
    });

    if (!attempt) {
      return res.status(404).json({ error: 'Test result not found' });
    }

    const detailedAnswers = attempt.answers.map(answer => {
      const question = attempt.testModule.questions.find(
        q => q._id.toString() === answer.question.toString()
      );

      return {
        question: question.question,
        options: question.options,
        selectedOption: answer.selectedOption,
        isCorrect: answer.isCorrect,
        explanation: question.explanation
      };
    });

    res.json({
      test: {
        title: attempt.testModule.title,
        description: attempt.testModule.description
      },
      score: attempt.score,
      totalQuestions: attempt.testModule.questions.length,
      percentage: attempt.percentage,
      isPassed: attempt.isPassed,
      passingScore: attempt.testModule.passingScore,
      completedAt: attempt.completedAt,
      duration: Math.round((attempt.completedAt - attempt.startedAt) / 1000 / 60),
      answers: detailedAnswers
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;