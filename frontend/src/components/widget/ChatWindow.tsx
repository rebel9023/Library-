import React, { useState, useRef, useEffect } from 'react';
import { Send, Minimize2, X, RefreshCw, Moon, Sun, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage as ChatMessageType } from '../../types';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { QuickPrompts } from './QuickPrompts';
import { streamChatMessage } from '../../services/chatService';

interface ChatWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  initialQuery?: string | null;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  onClose,
  onMinimize,
  isDarkMode,
  onToggleTheme,
  initialQuery
}) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: "Namaste! Welcome to **Library मित्र** — your official AI Digital Library Assistant for **Gyanoday Bhavan, Parul University**.\n\nI am your virtual librarian. How can I help you find research papers, question papers, books, or NPTEL courses today?",
      sources: [
        { title: 'Gyanoday Bhavan Library Homepage', url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/home', category: 'Website' }
      ],
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [userId] = useState(() => `user-${Math.floor(Math.random() * 100000)}`);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const lastProcessedQuery = useRef<string | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuery && initialQuery.trim().length > 0 && lastProcessedQuery.current !== initialQuery) {
      lastProcessedQuery.current = initialQuery;
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const handleSend = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || isLoading) return;

    const userMsg: ChatMessageType = {
      id: `user-${Date.now()}-${Math.random()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    const botMsgId = `ai-${Date.now()}-${Math.random()}`;
    const botMsg: ChatMessageType = {
      id: botMsgId,
      sender: 'ai',
      text: '',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, botMsg]);

    try {
      await streamChatMessage(
        queryText,
        sessionId,
        userId,
        (token) => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === botMsgId ? { ...msg, text: msg.text + token } : msg
            )
          );
        },
        (sources, metadata) => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === botMsgId
                ? {
                    ...msg,
                    sources: sources || [],
                    intent: metadata?.intent,
                    agentName: metadata?.agentName,
                    agentRole: metadata?.agentRole,
                    responseTimeMs: metadata?.responseTimeMs
                  }
                : msg
            )
          );
        }
      );
    } catch (err) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === botMsgId
            ? {
                ...msg,
                text: "I apologize, but I encountered an issue retrieving that resource. Please try again or contact [library@paruluniversity.ac.in](mailto:library@paruluniversity.ac.in)."
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`fixed bottom-20 right-4 sm:right-6 w-[92vw] sm:w-[440px] h-[580px] max-h-[85vh] rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border ${
        isDarkMode
          ? 'bg-[#0D152D] border-slate-700/80 text-slate-100 shadow-amber-500/10'
          : 'bg-white border-slate-200 text-slate-900 shadow-slate-400/30'
      }`}
    >
      {/* Widget Header */}
      <div className="bg-gradient-to-r from-[#070B19] via-[#0D152D] to-[#070B19] p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-white tracking-wide">Library मित्र Assistant</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-[10px] text-slate-400">Senior Librarian & Research Consultant</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
          <button
            type="button"
            onClick={onMinimize}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            title="Minimize"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-rose-400 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} isDarkMode={isDarkMode} />
        ))}

        {isLoading && <TypingIndicator isDarkMode={isDarkMode} />}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts */}
      <QuickPrompts onSelectPrompt={(promptText) => handleSend(promptText)} isDarkMode={isDarkMode} />

      {/* Input Area */}
      <div className={`p-3 border-t ${isDarkMode ? 'bg-[#070B19] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Library मित्र about books, IEEE, Knimbus, question papers..."
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 rounded-2xl text-xs focus:outline-none transition-all ${
              isDarkMode
                ? 'bg-[#0D152D] text-slate-100 border border-slate-700/80 focus:border-amber-400 placeholder-slate-500'
                : 'bg-white text-slate-900 border border-slate-300 focus:border-amber-500 placeholder-slate-400'
            }`}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-md cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};
