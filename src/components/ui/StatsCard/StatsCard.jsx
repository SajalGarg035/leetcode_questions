import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const StatsCard = ({ completed, total, percentage }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-4 text-white min-w-[200px]"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <CheckCircleIcon className="w-5 h-5" />
          <span className="font-semibold">Progress</span>
        </div>
        <span className="text-2xl font-bold">{percentage}%</span>
      </div>
      
      <div className="flex items-center justify-between text-sm opacity-90">
        <span>{completed} completed</span>
        <span>{total - completed} remaining</span>
      </div>
      
      <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full bg-white rounded-full"
        />
      </div>
    </motion.div>
  );
};

export default StatsCard;