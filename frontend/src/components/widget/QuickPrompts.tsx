import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  FileText, 
  Search, 
  Video, 
  HelpCircle, 
  Clock, 
  CheckCircle, 
  Database,
  GraduationCap
} from 'lucide-react';

interface QuickPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  isDarkMode?: boolean;
}

const PROMPTS = [
  { label: 'Find IEEE', icon: Database, query: 'How do I access IEEE research papers and journals?' },
  { label: 'Search SCOPUS', icon: Search, query: 'How to search SCOPUS index and citations at Parul University?' },
  { label: 'Question Papers', icon: FileText, query: 'Where can I find previous year semester question papers?' },
  { label: 'NPTEL Courses', icon: GraduationCap, query: 'How to enroll in NPTEL & SWAYAM video courses for credit transfer?' },
  { label: 'Video Library', icon: Video, query: 'What video lectures and online tutorials are available in the e-library?' },
  { label: 'Research Support', icon: HelpCircle, query: 'What research writing and publishing support does Gyanoday Bhavan offer?' },
  { label: 'OPAC Search', icon: BookOpen, query: 'How do I search for printed library books on OPAC catalog?' },
  { label: 'Library Timings', icon: Clock, query: 'What are the central library working hours and reading hall schedule?' },
  { label: 'Turnitin Support', icon: CheckCircle, query: 'How do I get my Ph.D / Master dissertation checked for plagiarism via Turnitin?' },
  { label: 'Institutional Repository', icon: Database, query: 'How to access Parul University theses, patents, and faculty publications in DSpace?' }
];

export const QuickPrompts: React.FC<QuickPromptsProps> = ({ onSelectPrompt, isDarkMode = true }) => {
  return (
    <div className={`p-3 border-t ${isDarkMode ? 'border-slate-800 bg-[#070B19]' : 'border-slate-200 bg-slate-50'}`}>
      <p className="text-[11px] font-semibold tracking-wider text-amber-400 uppercase mb-2">
        Suggested Library Queries:
      </p>
      <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
        {PROMPTS.map((p, idx) => {
          const Icon = p.icon;
          return (
            <motion.button
              key={idx}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelectPrompt(p.query);
              }}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 border rounded-full transition-all duration-200 shadow-sm cursor-pointer ${
                isDarkMode
                  ? 'bg-[#0D152D] hover:bg-slate-800 text-slate-200 hover:text-amber-300 border-slate-700 hover:border-amber-500/40'
                  : 'bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-600 border-slate-300 hover:border-amber-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{p.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
