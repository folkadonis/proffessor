const mongoose = require('mongoose');

const testAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testModule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestModule',
    required: true
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    selectedOption: {
      type: Number
    },
    isCorrect: {
      type: Boolean
    }
  }],
  score: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  isPassed: {
    type: Boolean,
    default: false
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('TestAttempt', testAttemptSchema);