import React from 'react';
import { motion } from 'framer-motion';

interface TypingIndicatorProps {
  isDarkMode?: boolean;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isDarkMode = true }) => {
  return (
    <div className={`flex items-center gap-1.5 px-4 py-3 rounded-2xl w-fit border ${
      isDarkMode ? 'bg-[#0D152D] border-slate-700/80' : 'bg-slate-100 border-slate-200'
    }`}>
      <span className="text-xs font-semibold text-amber-400 mr-1">Library मित्र is searching</span>
      <motion.div
        className="w-1.5 h-1.5 bg-amber-400 rounded-full"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.1 }}
      />
      <motion.div
        className="w-1.5 h-1.5 bg-amber-400 rounded-full"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.2 }}
      />
      <motion.div
        className="w-1.5 h-1.5 bg-amber-400 rounded-full"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.3 }}
      />
    </div>
  );
};
