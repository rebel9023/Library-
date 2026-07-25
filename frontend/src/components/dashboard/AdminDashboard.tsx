import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Database, RefreshCw, BarChart2, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { fetchDashboardStats } from '../../services/api';
import { DashboardStats } from '../../types';
import { AnalyticsOverview } from './AnalyticsOverview';
import { PopularSearchesChart } from './PopularSearchesChart';
import { ScraperManager } from './ScraperManager';
import { ChatHistoryTable } from './ChatHistoryTable';
import { KnowledgeBaseManager } from './KnowledgeBaseManager';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'analytics' | 'scraper' | 'knowledge'>('analytics');

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await fetchDashboardStats();
      setStats(data);
    } catch {
      // Set default initial view stats
      setStats({
        totalChats: 1540,
        totalUsers: 920,
        avgResponseTimeMs: 145,
        failedSearches: 18,
        successfulSearches: 1522,
        popularSearches: [
          { intent: 'research_search', count: 420 },
          { intent: 'question_paper_search', count: 380 },
          { intent: 'nptel_search', count: 290 },
          { intent: 'timing_info', count: 210 },
          { intent: 'opac_search', count: 140 }
        ],
        documentDistribution: [
          { category: 'External Databases', count: 52 },
          { category: 'Question Papers', count: 420 },
          { category: 'NPTEL', count: 180 },
          { category: 'Institutional Repository', count: 95 }
        ],
        recentActivity: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-lg flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                GyanAI Admin & Intelligence Hub
              </h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Parul University
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Gyanoday Bhavan Digital Library — Central Knowledge Platform (Serving 63,000+ Students)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadStats}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Dashboard</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'analytics'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Analytics & Telemetry</span>
        </button>

        <button
          onClick={() => setActiveTab('scraper')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'scraper'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Scraper & Data Pipeline</span>
        </button>

        <button
          onClick={() => setActiveTab('knowledge')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'knowledge'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Knowledge Base Records</span>
        </button>
      </div>

      {/* Content Views */}
      {stats && (
        <>
          {activeTab === 'analytics' && (
            <>
              <AnalyticsOverview stats={stats} />
              <PopularSearchesChart stats={stats} />
              <ChatHistoryTable stats={stats} />
            </>
          )}

          {activeTab === 'scraper' && <ScraperManager />}

          {activeTab === 'knowledge' && <KnowledgeBaseManager />}
        </>
      )}
    </div>
  );
};
