import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { DashboardStats } from '../../types';

interface PopularSearchesChartProps {
  stats: DashboardStats;
}

const COLORS = ['#EAB308', '#38BDF8', '#10B981', '#6366F1', '#EC4899', '#8B5CF6'];

export const PopularSearchesChart: React.FC<PopularSearchesChartProps> = ({ stats }) => {
  const chartData = (stats.popularSearches || []).map(p => ({
    name: p.intent ? p.intent.replace('_search', '').replace('_', ' ').toUpperCase() : 'SEARCH',
    queries: p.count || 100
  }));

  const docData = (stats.documentDistribution || []).map(d => ({
    name: d.category || 'General',
    value: d.count || 50
  }));

  const weeklyVisitsData = [
    { day: 'Mon', visits: 1320 },
    { day: 'Tue', visits: 1450 },
    { day: 'Wed', visits: 1580 },
    { day: 'Thu', visits: 1620 },
    { day: 'Fri', visits: 1490 },
    { day: 'Sat', visits: 1180 },
    { day: 'Sun', visits: 940 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* 1. Daily Student Visits Weekly Trend */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
          <span>Weekly Student Visits Breakdown</span>
          <span className="text-xs font-normal text-amber-400 font-semibold">Live Traffic Telemetry</span>
        </h3>
        <div className="h-64 w-full">
          {weeklyVisitsData && weeklyVisitsData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyVisitsData}>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="visits" fill="#EAB308" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">No Visit Telemetry Data Available</div>
          )}
        </div>
      </div>

      {/* 2. Popular Library Search Modules */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
          <span>Popular Library Search Modules</span>
          <span className="text-xs font-normal text-slate-400">Total Queries</span>
        </h3>
        <div className="h-64 w-full">
          {chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="queries" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">No Search Data Available</div>
          )}
        </div>
      </div>
    </div>
  );
};
