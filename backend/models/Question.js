const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 5000
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard'],
    lowercase: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['leetcode', 'codeforces', 'codechef', 'atcoder', 'gfg', 'interviewbit', 'custom'],
    lowercase: true
  },
  topic: {
    type: String,
    required: true,
    enum: ['arrays', 'strings', 'trees', 'graphs', 'dp', 'greedy', 'sorting', 'searching', 'math', 'other'],
    lowercase: true
  },
  domain: {
    type: String,
    required: true,
    enum: ['dsa', 'cp', 'interview', 'system-design'],
    lowercase: true
  },
  sourceType: {
    type: String,
    required: true,
    enum: ['ai', 'scraped', 'curated', 'user-submitted'],
    lowercase: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  constraints: [String],
  hints: [String],
  externalUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'External URL must be a valid HTTP/HTTPS URL'
    }
  },
  testCases: [{
    input: mongoose.Schema.Types.Mixed,
    output: mongoose.Schema.Types.Mixed,
    isPublic: {
      type: Boolean,
      default: true
    }
  }],
  solutions: [{
    language: String,
    code: String,
    timeComplexity: String,
    spaceComplexity: String,
    explanation: String
  }],
  rating: {
    type: Number,
    min: 800,
    max: 3500
  },
  solvedCount: {
    type: Number,
    default: 0
  },
  submissionCount: {
    type: Number,
    default: 0
  },
  companies: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  embedding: [Number], // For AI similarity matching
  lastScraped: Date,
  scrapingMetadata: {
    originalId: String,
    lastUpdated: Date,
    source: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
questionSchema.index({ platform: 1, difficulty: 1 });
questionSchema.index({ domain: 1, topic: 1 });
questionSchema.index({ sourceType: 1, isActive: 1 });
questionSchema.index({ title: 'text', description: 'text' });
questionSchema.index({ companies: 1 });
questionSchema.index({ createdAt: -1 });

// Virtual for success rate
questionSchema.virtual('successRate').get(function() {
  if (this.submissionCount === 0) return 0;
  return Math.round((this.solvedCount / this.submissionCount) * 100);
});

// Methods
questionSchema.methods.incrementSolved = function() {
  this.solvedCount += 1;
  this.submissionCount += 1;
  return this.save();
};

questionSchema.methods.incrementSubmission = function() {
  this.submissionCount += 1;
  return this.save();
};

// Statics
questionSchema.statics.findByFilters = function(filters) {
  const query = { isActive: true };
  
  // Only add filters that are not 'all' or undefined
  if (filters.domain && filters.domain !== 'all') {
    query.domain = filters.domain;
  }
  
  if (filters.difficulty && filters.difficulty !== 'all') {
    query.difficulty = filters.difficulty;
  }
  
  if (filters.platform && filters.platform !== 'all') {
    query.platform = filters.platform;
  }
  
  if (filters.topic && filters.topic !== 'all') {
    query.topic = filters.topic;
  }
  
  if (filters.sourceType && filters.sourceType !== 'all') {
    query.sourceType = filters.sourceType;
  }

  if (filters.companies && filters.companies.length > 0) {
    query.companies = { $in: filters.companies };
  }

  return this.find(query);
};

module.exports = mongoose.model('Question', questionSchema);
