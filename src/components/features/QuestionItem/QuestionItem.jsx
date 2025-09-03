import React from 'react';
import { motion } from 'framer-motion';
import { 
  LinkIcon, 
  FireIcon, 
  CheckCircleIcon,
  TagIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { AnimatePresence } from 'framer-motion';

const QuestionItem = ({ question, index, isCompleted, onToggle }) => {
  const getDifficultyConfig = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': 
        return { 
          bg: 'bg-success-50 border-success-200', 
          text: 'text-success-700',
          badge: 'bg-success-100 text-success-700'
        };
      case 'medium': 
        return { 
          bg: 'bg-warning-50 border-warning-200', 
          text: 'text-warning-700',
          badge: 'bg-warning-100 text-warning-700'
        };
      case 'hard': 
        return { 
          bg: 'bg-error-50 border-error-200', 
          text: 'text-error-700',
          badge: 'bg-error-100 text-error-700'
        };
      default: 
        return { 
          bg: 'bg-slate-50 border-slate-200', 
          text: 'text-slate-700',
          badge: 'bg-slate-100 text-slate-700'
        };
    }
  };

  const formatAcceptanceRate = (rate) => {
    if (!rate) return null;
    const percentage = Math.round(parseFloat(rate) * 100);
    return `${percentage}%`;
  };

  const formatFrequency = (freq) => {
    if (!freq) return null;
    return parseFloat(freq).toFixed(1);
  };

  const formatTopics = (topics) => {
    if (!topics) return null;
    const cleanTopics = topics.replace(/"/g, '');
    return cleanTopics.length > 40 ? `${cleanTopics.substring(0, 40)}...` : cleanTopics;
  };

  const difficultyConfig = getDifficultyConfig(question.difficulty);

  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`
        relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer
        ${isCompleted 
          ? 'bg-primary-50 border-primary-200 shadow-lg shadow-primary-100' 
          : `${difficultyConfig.bg} hover:shadow-lg hover:shadow-slate-200/50`
        }
      `}
      onClick={onToggle}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Custom Checkbox */}
          <div className="relative flex-shrink-0 mt-1">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`
                w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200
                ${isCompleted 
                  ? 'bg-primary-500 border-primary-500' 
                  : 'bg-white border-slate-300 hover:border-primary-400'
                }
              `}
            >
              <AnimatePresence>
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                  >
                    <CheckCircleIcon className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className={`text-lg font-semibold leading-tight ${
                isCompleted ? 'text-primary-800' : 'text-slate-800'
              }`}>
                {question.question || question.title || `Question ${index + 1}`}
              </h3>
              <span className="flex-shrink-0 px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                #{index + 1}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {question.difficulty && (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${difficultyConfig.badge}`}>
                  {question.difficulty.toUpperCase()}
                </span>
              )}
              
              {question.frequency && (
                <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                  <FireIcon className="w-3 h-3" />
                  {formatFrequency(question.frequency)}
                </div>
              )}
              
              {question.acceptanceRate && (
                <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                  <ChartBarIcon className="w-3 h-3" />
                  {formatAcceptanceRate(question.acceptanceRate)}
                </div>
              )}
              
              {question.category && (
                <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium max-w-[200px]">
                  <TagIcon className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate" title={question.category}>
                    {formatTopics(question.category)}
                  </span>
                </div>
              )}
              
              {question.link && (
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={question.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-xs font-medium transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <LinkIcon className="w-3 h-3" />
                  Solve
                </motion.a>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Completion indicator */}
      {isCompleted && (
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600"
        />
      )}
    </motion.div>
  );
};

export default QuestionItem;