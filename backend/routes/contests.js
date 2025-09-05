const express = require('express');
const Question = require('../models/Question');

const router = express.Router();

// GET /api/contests/generate - Generate contest questions
router.get('/generate', async (req, res) => {
  try {
    const {
      difficulty = 'medium',
      domain = 'dsa',
      count = 5
    } = req.query;

    // Get random questions for contest
    const questions = await Question.aggregate([
      {
        $match: {
          difficulty: difficulty,
          domain: domain,
          isActive: true
        }
      },
      { $sample: { size: parseInt(count) } }
    ]);

    // Add contest metadata
    const contestQuestions = questions.map(q => ({
      ...q,
      timeLimit: 30, // 30 minutes per question
      maxScore: 100,
      contestMode: true
    }));

    res.json({
      data: contestQuestions,
      totalTime: contestQuestions.length * 30, // Total contest time in minutes
      startTime: new Date(),
      mode: 'contest'
    });

  } catch (error) {
    console.error('Error generating contest:', error);
    res.status(500).json({
      error: 'Failed to generate contest',
      message: error.message
    });
  }
});

module.exports = router;
