import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionItem from '../QuestionItem/QuestionItem';
import LoadMoreButton from '../../ui/LoadMoreButton/LoadMoreButton';
import LoadingSpinner from '../../ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../ui/EmptyState/EmptyState';
import { BuildingOfficeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const QuestionList = ({ 
  company, 
  questions, 
  displayedQuestions, 
  completedQuestions, 
  onQuestionToggle, 
  onLoadMore, 
  hasMore, 
  loading 
}) => {
  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-effect card-shadow rounded-2xl p-8"
      >
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <h3 className="text-xl font-semibold text-slate-800 mt-4 mb-2">
            Loading Questions
          </h3>
          <p className="text-slate-600">
            Fetching {company} interview questions...
          </p>
        </div>
      </motion.div>
    );
  }

  if (!questions.length) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-effect card-shadow rounded-2xl p-8"
      >
        <EmptyState 
          icon={BuildingOfficeIcon}
          title="No Questions Found"
          description={`No questions found for ${company}. Please check if the CSV file exists and has valid data.`}
        />
      </motion.div>
    );
  }

  const difficultyStats = questions.reduce((acc, q) => {
    const difficulty = q.difficulty?.toLowerCase() || 'unknown';
    acc[difficulty] = (acc[difficulty] || 0) + 1;
    return acc;
  }, {});

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-effect card-shadow rounded-2xl p-6 lg:p-8"
    >
      <div className="border-b border-slate-200 pb-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary-100 rounded-lg">
            <BuildingOfficeIcon className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-800">
              {company} Questions
            </h2>
            <p className="text-slate-600">
              {completedQuestions.size} of {questions.length} completed
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {Object.entries(difficultyStats).map(([difficulty, count]) => (
            <div 
              key={difficulty}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                difficulty === 'easy' ? 'bg-success-100 text-success-700' :
                difficulty === 'medium' ? 'bg-warning-100 text-warning-700' :
                difficulty === 'hard' ? 'bg-error-100 text-error-700' :
                'bg-slate-100 text-slate-700'
              }`}
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}: {count}
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <AnimatePresence>
          {displayedQuestions.map((question, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <QuestionItem
                question={question}
                index={index}
                isCompleted={completedQuestions.has(index)}
                onToggle={() => onQuestionToggle(index)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6"
        >
          <LoadMoreButton onClick={onLoadMore} />
        </motion.div>
      )}

      {!hasMore && questions.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 text-center p-6 bg-gradient-to-r from-success-50 to-primary-50 rounded-xl border border-success-200"
        >
          <CheckCircleIcon className="w-12 h-12 text-success-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-success-700 mb-1">
            All Questions Loaded!
          </h3>
          <p className="text-success-600">
            Keep practicing to master your interview skills
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuestionList;