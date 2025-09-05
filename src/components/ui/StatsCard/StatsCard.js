import React from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const StatsCard = ({ completed, total, percentage }) => {
  const getProgressColor = (percent) => {
    if (percent >= 80) return 'from-green-400 to-emerald-500';
    if (percent >= 50) return 'from-yellow-400 to-orange-500';
    return 'from-blue-400 to-blue-500';
  };

  const getProgressBgColor = (percent) => {
    if (percent >= 80) return 'bg-green-50';
    if (percent >= 50) return 'bg-yellow-50';
    return 'bg-blue-50';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-6 rounded-2xl border border-white/60 shadow-lg ${getProgressBgColor(percentage)} backdrop-blur-sm`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 bg-gradient-to-r ${getProgressColor(percentage)} rounded-xl flex items-center justify-center`}>
          <ChartBarIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Progress</h3>
          <p className="text-sm text-slate-600">Your completion rate</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-slate-900">{percentage}%</span>
          <span className="text-sm text-slate-600">{completed}/{total}</span>
        </div>
        
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${getProgressColor(percentage)} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <CheckCircleIcon className="w-4 h-4" />
          <span>{completed} questions completed</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
