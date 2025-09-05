const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String,
    location: String,
    website: String
  },
  preferences: {
    favoriteTopics: [String],
    preferredDifficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    preferredLanguages: [String],
    dailyGoal: {
      type: Number,
      default: 1
    }
  },
  stats: {
    totalSolved: {
      type: Number,
      default: 0
    },
    easySolved: {
      type: Number,
      default: 0
    },
    mediumSolved: {
      type: Number,
      default: 0
    },
    hardSolved: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    maxStreak: {
      type: Number,
      default: 0
    },
    lastSolvedDate: Date
  },
  solvedQuestions: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    solvedAt: {
      type: Date,
      default: Date.now
    },
    attempts: {
      type: Number,
      default: 1
    },
    timeSpent: Number, // in seconds
    language: String
  }],
  submissions: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    code: String,
    language: String,
    status: {
      type: String,
      enum: ['accepted', 'wrong-answer', 'time-limit', 'runtime-error', 'compilation-error'],
      required: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    executionTime: Number,
    memory: Number
  }],
  contests: [{
    contest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contest'
    },
    score: Number,
    rank: Number,
    participatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  achievements: [{
    type: String,
    unlockedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  emailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'stats.totalSolved': -1 });

// Virtual for success rate
userSchema.virtual('successRate').get(function() {
  const totalSubmissions = this.submissions.length;
  if (totalSubmissions === 0) return 0;
  const accepted = this.submissions.filter(s => s.status === 'accepted').length;
  return Math.round((accepted / totalSubmissions) * 100);
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to update streak
userSchema.methods.updateStreak = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastSolved = this.stats.lastSolvedDate;
  
  if (!lastSolved) {
    this.stats.currentStreak = 1;
  } else {
    const lastSolvedDate = new Date(lastSolved);
    lastSolvedDate.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - lastSolvedDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    
    if (diffDays === 1) {
      this.stats.currentStreak += 1;
    } else if (diffDays === 0) {
      // Same day, don't change streak
    } else {
      this.stats.currentStreak = 1;
    }
  }
  
  if (this.stats.currentStreak > this.stats.maxStreak) {
    this.stats.maxStreak = this.stats.currentStreak;
  }
  
  this.stats.lastSolvedDate = new Date();
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
