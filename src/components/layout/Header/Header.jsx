import React from 'react';
import { motion } from 'framer-motion';
import { AcademicCapIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

const Header = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8 lg:mb-12"
    >
      <div className="bg-white/60 backdrop-blur-sm shadow-card-lg rounded-2xl p-6 lg:p-8 border border-white/40">
        <motion.div 
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.12, type: "spring", stiffness: 220 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <div className="relative">
            <CodeBracketIcon className="w-10 h-10 text-primary-600" aria-hidden="true" />
            <AcademicCapIcon className="w-6 h-6 text-warning-500 absolute -top-1 -right-1" aria-hidden="true" />
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 leading-tight"
        >
          <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 bg-clip-text text-transparent">
            LeetCode Company Practice
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed"
        >
          Master coding interviews with company-specific questions and track your progress.
        </motion.p>

        <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#questions"
            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary-600 text-white text-sm font-medium shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            Get Started
          </a>
          <button
            type="button"
            className="text-sm text-slate-700 hover:text-slate-900 focus:outline-none"
            aria-label="How it works"
          >
            How it works
          </button>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs sm:text-sm text-slate-500"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse" aria-hidden="true"></span>
            <span>Real Interview Questions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" aria-hidden="true"></span>
            <span>Progress Tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-warning-500 rounded-full animate-pulse" aria-hidden="true"></span>
            <span>Company Focused</span>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;