import React, { useState, useEffect } from 'react';
import { Database, Search, ExternalLink, BookOpen } from 'lucide-react';
import { fetchResources } from '../../services/api';
import { LibraryResource } from '../../types';

export const KnowledgeBaseManager: React.FC = () => {
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchResources(selectedCategory).then(setResources).catch(() => {});
  }, [selectedCategory]);

  const filtered = resources.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="font-bold text-white text-sm">Indexed Library Knowledge Base</h3>
          <p className="text-xs text-slate-400">Searchable catalogue of vectors stored in Qdrant & PostgreSQL</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter indexed records..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-amber-300 focus:outline-none focus:border-amber-500"
          >
            <option value="">All Categories</option>
            <option value="External Databases">External Databases</option>
            <option value="Question Papers">Question Papers</option>
            <option value="NPTEL">NPTEL</option>
            <option value="Institutional Repository">Institutional Repository</option>
            <option value="Library Services">Library Services</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="col-span-full py-8 text-center text-slate-500 text-xs">
            No knowledge base documents match filter criteria.
          </div>
        ) : (
          filtered.map((res) => (
            <div key={res.id} className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {res.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{res.type}</span>
                </div>
                <h4 className="font-semibold text-xs text-slate-100 line-clamp-1 mb-1">{res.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">{res.summary}</p>
              </div>

              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>View Direct Resource</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
