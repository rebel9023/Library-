import React from 'react';
import { Users, MessageSquare, Clock, AlertTriangle, CheckCircle, ShieldCheck, ThumbsUp, Activity, Sparkles } from 'lucide-react';
import { DashboardStats } from '../../types';

interface AnalyticsOverviewProps {
  stats: DashboardStats;
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ stats }) => {
  const kpis = [
    { label: 'User Satisfaction', value: '> 95.4%', target: 'Target > 95%', icon: ThumbsUp, color: 'from-amber-500 to-yellow-400' },
    { label: 'Average Response Time', value: '1.2 sec', target: 'Target < 2 sec', icon: Clock, color: 'from-emerald-500 to-teal-400' },
    { label: 'RAG Retrieval Accuracy', value: '98.8%', target: 'Target > 92%', icon: CheckCircle, color: 'from-blue-500 to-cyan-400' },
    { label: 'Hallucination Rate', value: '< 1.2%', target: 'Target < 3%', icon: ShieldCheck, color: 'from-indigo-500 to-purple-400' },
    { label: 'System Uptime', value: '99.99%', target: 'Target > 99.9%', icon: Activity, color: 'from-cyan-500 to-blue-500' },
    { label: 'Successful Searches', value: '98.5%', target: 'Target > 90%', icon: Sparkles, color: 'from-teal-500 to-emerald-400' },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
        <Sparkles className="w-4 h-4" />
        <span>GyanAI Key Performance Indicators (KPIs)</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((k, idx) => {
          const Icon = k.icon;
          return (
            <div key={idx} className="glass-card p-3.5 rounded-2xl border border-slate-800 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-slate-400 font-medium truncate">{k.label}</span>
                <div className={`p-1.5 rounded-lg bg-gradient-to-tr ${k.color} text-slate-950 font-bold shadow-md`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-xl font-black text-white mb-0.5">{k.value}</div>
              <span className="text-[10px] text-emerald-400 font-semibold">{k.target}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
