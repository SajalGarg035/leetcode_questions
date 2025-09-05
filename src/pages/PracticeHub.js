import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  ClockIcon,
  CodeBracketIcon,
  TrophyIcon,
  BookOpenIcon,
  ChevronDownIcon,
  PlayIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import practiceService from '../services/practiceService';

const PracticeHub = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('practice'); // 'practice' or 'contest'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Filter states with better defaults
  const [filters, setFilters] = useState({
    domain: 'all',
    difficulty: 'all', 
    platform: 'all',
    topic: 'all',
    sourceType: 'all'
  });

  const domains = [
    { value: 'all', label: 'All Domains' },
    { value: 'dsa', label: 'Data Structures & Algorithms' },
    { value: 'cp', label: 'Competitive Programming' },
    { value: 'interview', label: 'Interview Preparation' }
  ];

  const difficulties = [
    { value: 'all', label: 'All Difficulties' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const platforms = [
    { value: 'all', label: 'All Platforms' },
    { value: 'leetcode', label: 'LeetCode' },
    { value: 'codeforces', label: 'Codeforces' },
    { value: 'codechef', label: 'CodeChef' },
    { value: 'atcoder', label: 'AtCoder' },
    { value: 'gfg', label: 'GeeksforGeeks' },
    { value: 'interviewbit', label: 'InterviewBit' }
  ];

  const topics = [
    { value: 'all', label: 'All Topics' },
    { value: 'arrays', label: 'Arrays' },
    { value: 'strings', label: 'Strings' },
    { value: 'trees', label: 'Trees' },
    { value: 'graphs', label: 'Graphs' },
    { value: 'dp', label: 'Dynamic Programming' },
    { value: 'greedy', label: 'Greedy' },
    { value: 'sorting', label: 'Sorting' },
    { value: 'searching', label: 'Searching' }
  ];

  const sourceTypes = [
    { value: 'all', label: 'All Sources' },
    { value: 'ai', label: 'AI Generated' },
    { value: 'scraped', label: 'Web Scraped' },
    { value: 'curated', label: 'Curated Sheets' }
  ];

  useEffect(() => {
    fetchQuestions();
  }, [filters, mode]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await practiceService.getQuestions(filters, mode);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Set empty array on error
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
      'leetcode': 'bg-orange-100 text-orange-800',
      'codeforces': 'bg-blue-100 text-blue-800',
      'codechef': 'bg-yellow-100 text-yellow-800',
      'atcoder': 'bg-purple-100 text-purple-800',
      'gfg': 'bg-green-100 text-green-800',
      'interviewbit': 'bg-indigo-100 text-indigo-800'
    };
    return colors[platform?.toLowerCase()] || 'bg-slate-100 text-slate-800';
  };

  const getSourceTypeIcon = (sourceType) => {
    switch (sourceType) {
      case 'ai': return <StarIcon className="w-4 h-4" />;
      case 'scraped': return <BookOpenIcon className="w-4 h-4" />;
      case 'curated': return <TrophyIcon className="w-4 h-4" />;
      default: return <CodeBracketIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/40 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <FunnelIcon className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-slate-900">Practice Hub</h1>
            </div>
            
            {/* Mode Switch */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setMode('practice')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'practice' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpenIcon className="w-4 h-4 inline mr-2" />
                Practice Mode
              </button>
              <button
                onClick={() => setMode('contest')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'contest' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TrophyIcon className="w-4 h-4 inline mr-2" />
                Contest Mode
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.aside
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className="w-80 flex-shrink-0"
              >
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-xl sticky top-24">
                  <div className="flex items-center gap-2 mb-6">
                    <AdjustmentsHorizontalIcon className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Domain Filter */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Domain
                      </label>
                      <div className="relative">
                        <select
                          value={filters.domain}
                          onChange={(e) => handleFilterChange('domain', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 appearance-none bg-white"
                        >
                          {domains.map(domain => (
                            <option key={domain.value} value={domain.value}>
                              {domain.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Difficulty Filter */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Difficulty
                      </label>
                      <div className="relative">
                        <select
                          value={filters.difficulty}
                          onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 appearance-none bg-white"
                        >
                          {difficulties.map(diff => (
                            <option key={diff.value} value={diff.value}>
                              {diff.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Platform Filter */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Platform
                      </label>
                      <div className="relative">
                        <select
                          value={filters.platform}
                          onChange={(e) => handleFilterChange('platform', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 appearance-none bg-white"
                        >
                          {platforms.map(platform => (
                            <option key={platform.value} value={platform.value}>
                              {platform.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Topic Filter */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Topic
                      </label>
                      <div className="relative">
                        <select
                          value={filters.topic}
                          onChange={(e) => handleFilterChange('topic', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 appearance-none bg-white"
                        >
                          {topics.map(topic => (
                            <option key={topic.value} value={topic.value}>
                              {topic.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Source Type Filter */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Source
                      </label>
                      <div className="relative">
                        <select
                          value={filters.sourceType}
                          onChange={(e) => handleFilterChange('sourceType', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 appearance-none bg-white"
                        >
                          {sourceTypes.map(source => (
                            <option key={source.value} value={source.value}>
                              {source.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Clear Filters */}
                    <button
                      onClick={() => setFilters({
                        domain: 'all',
                        difficulty: 'all',
                        platform: 'all',
                        topic: 'all',
                        sourceType: 'all'
                      })}
                      className="w-full px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            {/* Stats Bar */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">
                    Showing {questions.length} questions
                    {mode === 'contest' && ' • Contest Mode Active'}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <StarIcon className="w-4 h-4" />
                    AI Generated
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpenIcon className="w-4 h-4" />
                    Web Scraped
                  </span>
                  <span className="flex items-center gap-1">
                    <TrophyIcon className="w-4 h-4" />
                    Curated
                  </span>
                </div>
              </div>
            </div>

            {/* Question Feed Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/40 animate-pulse">
                    <div className="h-4 bg-slate-200 rounded mb-3"></div>
                    <div className="h-3 bg-slate-200 rounded mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {questions.map((question, index) => (
                  <motion.div
                    key={question.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                  >
                    {/* Question Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {getSourceTypeIcon(question.sourceType)}
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                          {question.title}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                      {question.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getPlatformColor(question.platform)}`}>
                        {question.platform}
                      </span>
                      {question.topic && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium">
                          {question.topic}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        to={`/practice/${question.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                      >
                        <PlayIcon className="w-4 h-4" />
                        Practice
                      </Link>
                      {question.externalUrl && (
                        <a
                          href={question.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                        >
                          Source
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && questions.length === 0 && (
              <div className="text-center py-12">
                <CodeBracketIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No questions found</h3>
                <p className="text-slate-600">Try adjusting your filters to see more results.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeHub;
