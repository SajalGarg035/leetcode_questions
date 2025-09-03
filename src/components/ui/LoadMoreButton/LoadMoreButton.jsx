import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const LoadMoreButton = ({ onClick, loading = false }) => {
  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={loading}
      className="w-full py-4 px-6 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-primary-200"
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" className="border-white/30 border-t-white" />
          Loading More...
        </>
      ) : (
        <>
          Load More Questions
          <ChevronDownIcon className="w-5 h-5" />
        </>
      )}
    </motion.button>
  );
};

export default LoadMoreButton;