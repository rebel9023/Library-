import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles, X } from 'lucide-react';
import { ChatWindow } from './ChatWindow';

interface FloatingWidgetProps {
  externalSuggestedQuery?: string | null;
}

export const FloatingWidget: React.FC<FloatingWidgetProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [initialQuery, setInitialQuery] = useState<string | null>(null);

  useEffect(() => {
    const handleOpenWithQuery = (e: any) => {
      if (e.detail && e.detail.query) {
        setInitialQuery(e.detail.query);
        setIsOpen(true);
      }
    };
    window.addEventListener('gyanai-open-with-query', handleOpenWithQuery);
    return () => {
      window.removeEventListener('gyanai-open-with-query', handleOpenWithQuery);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            onClose={() => setIsOpen(false)}
            onMinimize={() => setIsOpen(false)}
            isDarkMode={isDarkMode}
            onToggleTheme={() => setIsDarkMode(prev => !prev)}
            initialQuery={initialQuery}
          />
        )}
      </AnimatePresence>

      {/* Floating Trigger Button fixed to Bottom-Right */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 font-bold rounded-full shadow-2xl hover:shadow-amber-500/40 border border-yellow-200/50 cursor-pointer pulse-gold group"
      >
        <div className="relative flex items-center justify-center">
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <>
              <Sparkles className="w-5 h-5 animate-pulse text-slate-950" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
            </>
          )}
        </div>
        <span className="text-xs font-extrabold tracking-wide uppercase">
          {isOpen ? 'Close Assistant' : 'Library मित्र Assistant'}
        </span>
      </motion.button>
    </>
  );
};
