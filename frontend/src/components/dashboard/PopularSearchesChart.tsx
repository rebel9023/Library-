import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { DashboardStats } from '../../types';

interface PopularSearchesChartProps {
  stats: DashboardStats;
}

const COLORS = ['#EAB308', '#38BDF8', '#10B981', '#6366F1', '#EC4899', '#8B5CF6'];

export const PopularSearchesChart: React.FC<PopularSearchesChartProps> = ({ stats }) => {
  const chartData = stats.popularSearches.map(p => ({
    name: p.intent.replace('_search', '').replace('_', ' ').toUpperCase(),
    queries: p.count
  }));

  const docData = stats.documentDistribution.map(d => ({
    name: d.category,
    value: d.count
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Popular Intent Bar Chart */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
          <span>Popular Library Search Modules</span>
          <span className="text-xs font-normal text-slate-400">Total Queries</span>
        </h3>
        <div className="h-64">
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
        </div>
      </div>

      {/* Document Distribution Pie Chart */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
          <span>Knowledge Base Document Distribution</span>
          <span className="text-xs font-normal text-amber-400">Qdrant Indexed</span>
        </h3>
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={docData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                label={({ name }) => name}
              >
                {docData.map((entry, index) => (
                  <Cell key={`pie-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
