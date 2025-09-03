import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SparklesIcon, 
  PaperAirplaneIcon, 
  ClockIcon,
  TagIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import geminiService from '../../../services/geminiService';
import LoadingSpinner from '../../ui/LoadingSpinner/LoadingSpinner';

const QuestionGenerator = () => {
  const [userRequest, setUserRequest] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userRequest.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const generatedQuestions = await geminiService.generateQuestions(userRequest);
      setQuestions(generatedQuestions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-success-600 bg-success-50';
      case 'medium': return 'text-warning-600 bg-warning-50';
      case 'hard': return 'text-error-600 bg-error-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getPlatformColor = (platform) => {
    const colors = {
      'leetcode': 'bg-orange-100 text-orange-800',
      'codeforces': 'bg-blue-100 text-blue-800',
      'atcoder': 'bg-purple-100 text-purple-800',
      'codechef': 'bg-yellow-100 text-yellow-800',
      'interviewbit': 'bg-green-100 text-green-800'
    };
    return colors[platform?.toLowerCase()] || 'bg-slate-100 text-slate-800';
  };

  return (
    <div className="min-h-screen p-4 lg:p-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-white/60 backdrop-blur-sm shadow-card-lg rounded-2xl p-6 lg:p-8 border border-white/40">
            <div className="flex items-center justify-center gap-3 mb-4">
              <SparklesIcon className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-3">
              AI Question Generator
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Generate personalized coding questions from top platforms using AI. 
              Specify topics, difficulty, or let AI choose important concepts for you.
            </p>
          </div>
        </motion.header>

        {/* Request Form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 lg:p-8 mb-6 border border-white/30 shadow-card-lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="request" className="block text-sm font-medium text-slate-700 mb-2">
                What kind of questions would you like?
              </label>
              <div className="relative">
                <textarea
                  id="request"
                  rows={3}
                  value={userRequest}
                  onChange={(e) => setUserRequest(e.target.value)}
                  placeholder="e.g., 'Generate medium level dynamic programming questions' or 'I need array questions for Google interview' or just 'Give me some questions'"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 resize-none"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading || !userRequest.trim()}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <PaperAirplaneIcon className="w-4 h-4" />
                )}
                {loading ? 'Generating...' : 'Generate Questions'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setUserRequest('');
                  setQuestions([]);
                  setError(null);
                }}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
                disabled={loading}
              >
                Clear
              </button>
            </div>
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-4 bg-error-50 border border-error-200 rounded-lg"
            >
              <p className="text-error-700 text-sm">{error}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Generated Questions */}
        <AnimatePresence>
          {questions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-800">
                  Generated Questions ({questions.length})
                </h2>
              </div>

              {questions.map((question, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-white/40 shadow-card"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        {question.title}
                      </h3>
                      <p className="text-slate-600 mb-3">
                        {question.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlatformColor(question.platform)}`}>
                        {question.platform}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                    </div>
                  </div>

                  {question.example && (
                    <div className="bg-slate-50 rounded-md p-3 mb-4">
                      <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        Example
                      </h4>
                      <pre className="text-sm text-slate-600 whitespace-pre-wrap font-mono">
                        {question.example}
                      </pre>
                    </div>
                  )}

                  {question.tags && question.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <TagIcon className="w-4 h-4 text-slate-400" />
                      {question.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuestionGenerator;
