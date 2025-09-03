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
      <div className="glass-effect card-shadow rounded-2xl p-6 lg:p-8">
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <div className="relative">
            <CodeBracketIcon className="w-10 h-10 text-primary-600" />
            <AcademicCapIcon className="w-6 h-6 text-warning-500 absolute -top-1 -right-1" />
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl lg:text-5xl font-bold gradient-text mb-3"
        >
          LeetCode Company Practice
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-600 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Master coding interviews with company-specific questions and track your progress
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-500"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
            <span>Real Interview Questions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
            <span>Progress Tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-warning-500 rounded-full animate-pulse"></div>
            <span>Company Focused</span>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;