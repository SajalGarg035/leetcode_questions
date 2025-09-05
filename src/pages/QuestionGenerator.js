import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SparklesIcon, 
  PaperAirplaneIcon, 
  ClockIcon,
  TagIcon,
  LinkIcon,
  ExclamationTriangleIcon,
  DocumentDuplicateIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import geminiService from '../services/geminiService';

const QuestionGenerator = () => {
  const [userRequest, setUserRequest] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(true);
  const [copyStatus, setCopyStatus] = useState({});

  // Filter states
  const [filters, setFilters] = useState({
    platform: '',
    difficulty: '',
    company: '',
    numQuestions: 5,
    topic: '',
    ratingRange: [1000, 2500] // For Codeforces/CodeChef
  });

  const platforms = ['LeetCode', 'Codeforces', 'AtCoder', 'CodeChef', 'InterviewBit'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const companies = [
    'Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix', 'Uber', 
    'Airbnb', 'LinkedIn', 'Twitter', 'Adobe', 'Salesforce', 'Oracle', 'IBM'
  ];
  const topics = [
    'Arrays', 'Strings', 'Dynamic Programming', 'Trees', 'Graphs', 
    'Binary Search', 'Two Pointers', 'Sliding Window', 'Hash Maps',
    'Stacks', 'Queues', 'Sorting', 'Greedy', 'Backtracking', 'Math',
    'Bit Manipulation', 'Heap', 'Trie', 'Union Find', 'Segment Tree'
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const buildFilteredPrompt = () => {
    let prompt = 'Generate coding questions with the following specifications:\n\n';
    
    // Always include user request first if provided
    if (userRequest.trim()) {
      prompt += `User Request: "${userRequest}"\n`;
    }
    
    // Add platform specification with emphasis
    if (filters.platform) {
      prompt += `Platform: ${filters.platform}\n`;
      prompt += `IMPORTANT: All questions must be specifically from ${filters.platform} and follow ${filters.platform}'s question format and style.\n`;
    }
    
    if (filters.difficulty) {
      prompt += `Difficulty: ${filters.difficulty}\n`;
    }
    
    if (filters.topic) {
      prompt += `Topic: ${filters.topic}\n`;
    }
    
    if (filters.company && filters.platform === 'InterviewBit') {
      prompt += `Company Focus: ${filters.company}\n`;
    }
    
    if ((filters.platform === 'Codeforces' || filters.platform === 'CodeChef') && filters.ratingRange) {
      prompt += `Rating Range: ${filters.ratingRange[0]} - ${filters.ratingRange[1]}\n`;
    }
    
    prompt += `Number of Questions: ${filters.numQuestions}\n\n`;
    
    // Add platform-specific instructions
    if (filters.platform) {
      prompt += `Platform-specific requirements:\n`;
      switch (filters.platform) {
        case 'LeetCode':
          prompt += `- Follow LeetCode's problem format with clear function signatures\n- Include input/output examples\n- Mention time/space complexity expectations\n`;
          break;
        case 'Codeforces':
          prompt += `- Follow competitive programming format\n- Include problem ratings if applicable\n- Focus on algorithmic challenges\n`;
          break;
        case 'CodeChef':
          prompt += `- Follow CodeChef's contest-style format\n- Include difficulty ratings\n- Focus on competitive programming problems\n`;
          break;
        case 'AtCoder':
          prompt += `- Follow AtCoder's clean problem statement format\n- Include sample inputs/outputs\n- Focus on algorithmic problems\n`;
          break;
        case 'InterviewBit':
          prompt += `- Focus on interview-style questions\n- Include hints for optimal solutions\n- Emphasize practical coding skills\n`;
          break;
      }
      prompt += `\n`;
    }
    
    prompt += `Please ensure all generated questions strictly adhere to the specified platform's style and format.`;
    
    return prompt;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);

    try {
      const prompt = buildFilteredPrompt();
      const generatedQuestions = await geminiService.generateQuestions(prompt);
      setQuestions(generatedQuestions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyQuestion = async (question, index) => {
    const questionText = `${question.title}

Platform: ${question.platform}
Difficulty: ${question.difficulty}
URL: ${question.url}

Description:
${question.description}

${question.example ? `Example:
${question.example}

` : ''}Tags: ${question.tags.join(', ')}`;
    
    try {
      await navigator.clipboard.writeText(questionText);
      setCopyStatus(prev => ({ ...prev, [index]: 'copied' }));
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [index]: null }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopyStatus(prev => ({ ...prev, [index]: 'error' }));
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [index]: null }));
      }, 2000);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'hard': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  const getPlatformColor = (platform) => {
    const colors = {
      'leetcode': 'bg-orange-100 text-orange-800 border-orange-200',
      'codeforces': 'bg-blue-100 text-blue-800 border-blue-200',
      'atcoder': 'bg-purple-100 text-purple-800 border-purple-200',
      'codechef': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'interviewbit': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[platform?.toLowerCase()] || 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-3xl p-8 lg:p-12 border border-white/40">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <SparklesIcon className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                AI Question Generator
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Generate personalized coding questions with advanced filters. 
                Choose platform, difficulty, topics, and more for targeted practice.
              </p>
            </div>
          </motion.header>

          {/* Filters Section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 lg:p-10 mb-8 border border-white/40 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <AdjustmentsHorizontalIcon className="w-6 h-6 text-primary-600" />
                Filters & Preferences
              </h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6"
                >
                  {/* First Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Platform */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Platform
                      </label>
                      <div className="relative">
                        <select
                          value={filters.platform}
                          onChange={(e) => handleFilterChange('platform', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 appearance-none bg-white"
                        >
                          <option value="">Any Platform</option>
                          {platforms.map(platform => (
                            <option key={platform} value={platform}>{platform}</option>
                          ))}
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Difficulty
                      </label>
                      <div className="relative">
                        <select
                          value={filters.difficulty}
                          onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 appearance-none bg-white"
                        >
                          <option value="">Any Difficulty</option>
                          {difficulties.map(difficulty => (
                            <option key={difficulty} value={difficulty}>{difficulty}</option>
                          ))}
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Topic */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Topic
                      </label>
                      <div className="relative">
                        <select
                          value={filters.topic}
                          onChange={(e) => handleFilterChange('topic', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 appearance-none bg-white"
                        >
                          <option value="">Any Topic</option>
                          {topics.map(topic => (
                            <option key={topic} value={topic}>{topic}</option>
                          ))}
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Second Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Company (only for InterviewBit) */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Company {filters.platform === 'InterviewBit' ? '' : '(InterviewBit only)'}
                      </label>
                      <div className="relative">
                        <select
                          value={filters.company}
                          onChange={(e) => handleFilterChange('company', e.target.value)}
                          disabled={filters.platform !== 'InterviewBit'}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 appearance-none bg-white disabled:bg-slate-100 disabled:text-slate-400"
                        >
                          <option value="">Any Company</option>
                          {companies.map(company => (
                            <option key={company} value={company}>{company}</option>
                          ))}
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Number of Questions */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Number of Questions
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={filters.numQuestions}
                        onChange={(e) => handleFilterChange('numQuestions', parseInt(e.target.value) || 5)}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                      />
                    </div>

                    {/* Rating Range (for Codeforces/CodeChef) */}
                    {(filters.platform === 'Codeforces' || filters.platform === 'CodeChef') && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                          Rating Range: {filters.ratingRange[0]} - {filters.ratingRange[1]}
                        </label>
                        <div className="space-y-2">
                          <input
                            type="range"
                            min="800"
                            max="3500"
                            value={filters.ratingRange[0]}
                            onChange={(e) => handleFilterChange('ratingRange', [parseInt(e.target.value), filters.ratingRange[1]])}
                            className="w-full"
                          />
                          <input
                            type="range"
                            min="800"
                            max="3500"
                            value={filters.ratingRange[1]}
                            onChange={(e) => handleFilterChange('ratingRange', [filters.ratingRange[0], parseInt(e.target.value)])}
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Custom Request */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Additional Requirements (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={userRequest}
                      onChange={(e) => setUserRequest(e.target.value)}
                      placeholder="e.g., 'Focus on interview questions from FAANG companies' or 'Include problems with optimal solutions'"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 resize-none"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generate Button */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-2xl text-lg font-semibold hover:from-primary-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-5 h-5" />
                    Generate Questions
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setUserRequest('');
                  setQuestions([]);
                  setError(null);
                  setFilters({
                    platform: '',
                    difficulty: '',
                    company: '',
                    numQuestions: 5,
                    topic: '',
                    ratingRange: [1000, 2500]
                  });
                }}
                className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-2xl text-lg font-semibold hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all duration-200"
                disabled={loading}
              >
                Reset All
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Generated Questions */}
          <AnimatePresence>
            {questions.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6"
              >
                <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-slate-900">
                    Generated Questions ({questions.length})
                  </h2>
                </motion.div>

                {questions.map((question, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">
                          {question.title}
                        </h3>
                        <p className="text-slate-600 text-lg leading-relaxed">
                          {question.description}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold border ${getPlatformColor(question.platform)}`}>
                          {question.platform}
                        </span>
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold border ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                      </div>
                    </div>

                    {question.example && (
                      <div className="bg-slate-50 rounded-2xl p-6 mb-6">
                        <h4 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                          <ClockIcon className="w-5 h-5" />
                          Example
                        </h4>
                        <pre className="text-slate-700 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                          {question.example}
                        </pre>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {question.tags && question.tags.length > 0 && (
                        <div className="flex items-center gap-3 flex-wrap">
                          <TagIcon className="w-5 h-5 text-slate-400" />
                          {question.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={() => copyQuestion(question, index)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                            copyStatus[index] === 'copied' 
                              ? 'bg-green-100 text-green-700' 
                              : copyStatus[index] === 'error'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <DocumentDuplicateIcon className="w-4 h-4" />
                          {copyStatus[index] === 'copied' ? 'Copied!' : copyStatus[index] === 'error' ? 'Error' : 'Copy'}
                        </button>
                        
                        {question.url && (
                          <a
                            href={question.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                          >
                            <LinkIcon className="w-4 h-4" />
                            Solve Problem
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-6"></div>
              <p className="text-xl text-slate-600 font-medium">Generating your customized questions...</p>
              <p className="text-sm text-slate-500 mt-2">This may take a few seconds</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionGenerator;
