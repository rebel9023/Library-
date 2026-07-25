import React from 'react';
import { DashboardStats } from '../../types';
import { Clock, ShieldCheck, AlertCircle } from 'lucide-react';

interface ChatHistoryTableProps {
  stats: DashboardStats;
}

export const ChatHistoryTable: React.FC<ChatHistoryTableProps> = ({ stats }) => {
  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-800 mb-6">
      <h3 className="font-bold text-white text-sm mb-4 flex items-center justify-between">
        <span>Recent Real-Time Student AI Queries & RAG Diagnostics</span>
        <span className="text-xs text-slate-400 font-normal">Live System Telemetry</span>
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-3">Student Question</th>
              <th className="py-3 px-3">Tool Selected</th>
              <th className="py-3 px-3">Response Time</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-medium text-slate-200 max-w-xs truncate">{log.question}</td>
                  <td className="py-3 px-3 font-mono text-amber-400">{log.module}</td>
                  <td className="py-3 px-3 text-slate-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{log.response_time_ms} ms</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold flex items-center gap-1 w-fit ${
                      log.status === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {log.status === 'success' ? <ShieldCheck className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      <span>{log.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-500">
                  No query logs found. Ask questions in the floating widget to generate telemetry.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
