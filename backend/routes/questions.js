const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Question = require('../models/Question');
const aiService = require('../services/aiService');
const scraperService = require('../services/scraperService');
const cacheService = require('../services/redis');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// GET /api/questions - Get questions with filters
router.get('/', [
  query('domain').optional().isIn(['all', 'dsa', 'cp', 'interview', 'system-design']),
  query('difficulty').optional().isIn(['all', 'easy', 'medium', 'hard']),
  query('platform').optional().isIn(['all', 'leetcode', 'codeforces', 'codechef', 'atcoder', 'gfg', 'interviewbit']),
  query('topic').optional().isIn(['all', 'arrays', 'strings', 'trees', 'graphs', 'dp', 'greedy', 'sorting', 'searching', 'math', 'other']),
  query('sourceType').optional().isIn(['all', 'ai', 'scraped', 'curated', 'user-submitted']),
  query('mode').optional().isIn(['practice', 'contest']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], handleValidationErrors, async (req, res) => {
  try {
    const {
      domain,
      difficulty,
      platform,
      topic,
      sourceType,
      mode = 'practice',
      page = 1,
      limit = 20
    } = req.query;

    // Create cache key
    const cacheKey = `questions:${JSON.stringify(req.query)}`;
    
    // Try to get from cache first
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Build filters (exclude 'all' values)
    const filters = {};
    if (domain && domain !== 'all') filters.domain = domain;
    if (difficulty && difficulty !== 'all') filters.difficulty = difficulty;
    if (platform && platform !== 'all') filters.platform = platform;
    if (topic && topic !== 'all') filters.topic = topic;
    if (sourceType && sourceType !== 'all') filters.sourceType = sourceType;

    // Get questions from database
    let questions = await Question.findByFilters(filters)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) * parseInt(page))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    // For contest mode, limit to 5 questions and add time constraints
    if (mode === 'contest') {
      questions = questions.slice(0, 5).map(q => ({
        ...q,
        timeLimit: 30, // 30 minutes per question
        contestMode: true
      }));
    }

    // If we don't have enough questions, generate some with AI (mock)
    if (questions.length < parseInt(limit)) {
      try {
        // Generate questions with valid enum values only
        const aiFilters = {
          domain: filters.domain || 'dsa',
          difficulty: filters.difficulty || 'medium',
          platform: filters.platform || 'leetcode',
          topic: filters.topic || 'arrays',
          count: parseInt(limit) - questions.length
        };
        
        const aiQuestions = await aiService.generateQuestions(aiFilters);
        
        // Save AI questions to database
        const savedAiQuestions = await Question.insertMany(aiQuestions);
        questions = questions.concat(savedAiQuestions);
      } catch (aiError) {
        console.error('AI generation failed:', aiError.message);
      }
    }

    const response = {
      data: questions,
      total: questions.length,
      page: parseInt(page),
      limit: parseInt(limit),
      mode
    };

    // Cache for 1 hour
    await cacheService.setex(cacheKey, 3600, JSON.stringify(response));

    res.json(response);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      error: 'Failed to fetch questions',
      message: error.message
    });
  }
});

// GET /api/questions/:id - Get specific question
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const cacheKey = `question:${id}`;
    const cached = await cacheService.get(cacheKey);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const question = await Question.findById(id).lean();
    
    if (!question) {
      return res.status(404).json({
        error: 'Question not found'
      });
    }

    const response = { data: question };
    
    // Cache for 24 hours
    await cacheService.setex(cacheKey, 86400, JSON.stringify(response));

    res.json(response);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({
      error: 'Failed to fetch question',
      message: error.message
    });
  }
});

// POST /api/questions/:id/submit - Submit solution
router.post('/:id/submit', [
  body('code').notEmpty().withMessage('Code is required'),
  body('language').isIn(['javascript', 'python', 'java', 'cpp']).withMessage('Invalid language')
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const { code, language } = req.body;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({
        error: 'Question not found'
      });
    }

    // Mock solution execution for now
    // In production, this would run code in a sandboxed environment
    const testResults = await executeCode(code, language, question.testCases);
    
    // Update question stats
    if (testResults.every(r => r.passed)) {
      await question.incrementSolved();
    } else {
      await question.incrementSubmission();
    }

    res.json({
      success: true,
      testResults,
      allPassed: testResults.every(r => r.passed)
    });
  } catch (error) {
    console.error('Error submitting solution:', error);
    res.status(500).json({
      error: 'Failed to submit solution',
      message: error.message
    });
  }
});

// POST /api/questions/generate - Generate questions with AI
router.post('/generate', [
  body('filters').optional().isObject(),
  body('count').optional().isInt({ min: 1, max: 10 })
], handleValidationErrors, async (req, res) => {
  try {
    const { filters = {}, count = 5 } = req.body;

    // Ensure valid enum values for AI generation
    const validFilters = {
      domain: filters.domain === 'all' ? 'dsa' : (filters.domain || 'dsa'),
      difficulty: filters.difficulty === 'all' ? 'medium' : (filters.difficulty || 'medium'),
      platform: filters.platform === 'all' ? 'leetcode' : (filters.platform || 'leetcode'),
      topic: filters.topic === 'all' ? 'arrays' : (filters.topic || 'arrays'),
      count
    };

    const questions = await aiService.generateQuestions(validFilters);

    // Save to database
    const savedQuestions = await Question.insertMany(questions);

    res.json({
      data: savedQuestions,
      generated: savedQuestions.length
    });
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({
      error: 'Failed to generate questions',
      message: error.message
    });
  }
});

// POST /api/questions/scrape - Trigger scraping
router.post('/scrape', [
  body('platforms').optional().isArray(),
  body('force').optional().isBoolean()
], handleValidationErrors, async (req, res) => {
  try {
    const { platforms = ['leetcode', 'codeforces'], force = false } = req.body;

    // Add scraping job to queue
    const jobId = await scraperService.addScrapeJob(platforms, force);

    res.json({
      message: 'Scraping job queued',
      jobId
    });
  } catch (error) {
    console.error('Error queuing scrape job:', error);
    res.status(500).json({
      error: 'Failed to queue scraping job',
      message: error.message
    });
  }
});

// Mock code execution function
async function executeCode(code, language, testCases) {
  // This is a simplified mock implementation
  // In production, you'd use a proper code execution service
  
  const results = [];
  
  for (const testCase of testCases.slice(0, 3)) { // Limit to first 3 test cases
    try {
      // Simple validation based on code content
      const hasReturn = code.includes('return');
      const hasLogic = code.length > 50;
      const hasLoop = code.includes('for') || code.includes('while');
      
      // Mock result based on code quality
      const passed = hasReturn && hasLogic;
      
      results.push({
        passed,
        input: JSON.stringify(testCase.input),
        output: passed ? JSON.stringify(testCase.output) : 'undefined',
        expected: JSON.stringify(testCase.output)
      });
    } catch (error) {
      results.push({
        passed: false,
        input: JSON.stringify(testCase.input),
        output: 'Error: ' + error.message,
        expected: JSON.stringify(testCase.output)
      });
    }
  }
  
  return results;
}

module.exports = router;
