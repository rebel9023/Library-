import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Bot, User, AlertCircle, Cpu } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types';
import { ResourceCards } from './ResourceCards';

interface ChatMessageProps {
  message: ChatMessageType;
  isDarkMode?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isDarkMode = true }) => {
  const isAi = message.sender === 'ai';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-2.5 ${isAi ? 'justify-start' : 'justify-end'} mb-4`}
    >
      {isAi && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 p-0.5 shadow-md shrink-0 flex items-center justify-center">
          <div className="w-full h-full bg-[#070B19] rounded-[10px] flex items-center justify-center">
            <Bot className="w-4 h-4 text-amber-400" />
          </div>
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm text-xs leading-relaxed ${
          isAi
            ? message.isFallback
              ? 'bg-red-950/40 border border-red-800/60 text-slate-200'
              : isDarkMode
              ? 'bg-[#0D152D] border border-slate-700/80 text-slate-100'
              : 'bg-slate-100 border border-slate-200 text-slate-900'
            : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-semibold rounded-tr-none shadow-md'
        }`}
      >
        {isAi && message.toolUsed && (
          <div className="mb-2 flex items-center gap-1.5 text-[10px] text-amber-300 font-mono bg-[#070B19] px-2 py-0.5 rounded border border-amber-500/30 w-fit shadow-sm">
            <Cpu className="w-3 h-3 text-amber-400" />
            <span>Agent: <strong className="text-amber-400 font-bold">{message.toolUsed}</strong></span>
          </div>
        )}

        {message.isFallback && (
          <div className="flex items-center gap-1.5 text-red-400 font-semibold mb-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Information Notice</span>
          </div>
        )}

        <div className="prose prose-invert prose-xs max-w-none">
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-amber-400 font-bold hover:underline"
                />
              )
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>

        {isAi && <ResourceCards sources={message.sources} />}

        <div
          className={`text-[9px] mt-1.5 text-right ${
            isAi ? 'text-slate-400' : 'text-slate-900/80 font-semibold'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {!isAi && (
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-amber-400" />
        </div>
      )}
    </motion.div>
  );
};
