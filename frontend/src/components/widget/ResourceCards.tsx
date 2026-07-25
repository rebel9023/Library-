import React from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';

interface ResourceCardsProps {
  sources?: Array<{ title: string; url: string; category: string }>;
}

export const ResourceCards: React.FC<ResourceCardsProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 pt-2 border-t border-slate-700/40">
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
        Verified Sources & Resources:
      </p>
      <div className="flex flex-col gap-1.5">
        {sources.map((src, idx) => (
          <a
            key={idx}
            href={src.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/50 text-xs text-amber-300 transition-all duration-200 group"
          >
            <div className="flex items-center gap-2 truncate">
              <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate font-medium text-slate-200 group-hover:text-amber-300">
                {src.title}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                {src.category}
              </span>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-amber-400" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
