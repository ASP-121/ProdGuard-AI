import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { TrendingUp, Clock } from 'lucide-react';

export default function PredictionHistoryChart({ history = [] }) {
  if (!history || history.length === 0) {
    return (
      <div className="section-card history-chart-empty">
        <Clock size={28} className="text-slate-500 mb-2" />
        <p className="text-slate-400 text-sm">No historical predictions recorded yet.</p>
        <p className="text-slate-500 text-xs">Run analysis simulations to view risk trajectory trends.</p>
      </div>
    );
  }

  // Format data in chronological order for graph
  const chartData = [...history].reverse().map((item, index) => ({
    time: item.time || `#${index + 1}`,
    riskScore: parseFloat(item.risk_score || item.overall_disruption_risk || 0),
    priorityScore: parseFloat(item.priority_score || 0),
    machineProb: parseFloat(((item.machine_failure_probability || 0) * 100).toFixed(1)),
    riskLevel: item.risk_level || 'LOW',
    machineType: item.machine_type || item.Type || 'M'
  }));

  const CustomHistoryTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-custom-tooltip">
          <div className="tooltip-title flex items-center justify-between gap-3">
            <span>{label}</span>
            <span className={`preset-item-tag risk-badge-${data.riskLevel.toLowerCase()}`}>
              {data.riskLevel}
            </span>
          </div>
          <div className="tooltip-stat-row">
            <span className="text-slate-400">Machine Type:</span>
            <span className="font-semibold text-slate-200">{data.machineType}</span>
          </div>
          <div className="tooltip-stat-row">
            <span className="text-purple-400">Disruption Risk:</span>
            <span className="font-bold text-purple-300">{data.riskScore}%</span>
          </div>
          <div className="tooltip-stat-row">
            <span className="text-amber-400">Priority Score:</span>
            <span className="font-bold text-amber-300">{data.priorityScore}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="section-card history-trend-card">
      <div className="card-header-row">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-purple-400" />
            <h3 className="section-title">Prediction Trajectory History</h3>
          </div>
          <p className="section-subtitle">
            Timeline tracking disruption score and dispatch priority across last {history.length} assessment runs.
          </p>
        </div>
        <span className="history-count-badge">{history.length} Runs Logged</span>
      </div>

      <div className="chart-container-inner" style={{ height: 230 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 15, right: 25, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="riskAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="priorityAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} unit="%" />
            <Tooltip content={<CustomHistoryTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36} 
              formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
            />
            <Area
              type="monotone"
              dataKey="riskScore"
              name="Disruption Risk Score"
              stroke="#a855f7"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#riskAreaGrad)"
            />
            <Area
              type="monotone"
              dataKey="priorityScore"
              name="Priority Urgency Score"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#priorityAreaGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
