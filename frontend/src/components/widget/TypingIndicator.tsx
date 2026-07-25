import React from 'react';
import { motion } from 'framer-motion';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-800/80 border border-slate-700/50 rounded-2xl w-fit">
      <span className="text-xs font-medium text-amber-400 mr-1">GyanAI is searching</span>
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
