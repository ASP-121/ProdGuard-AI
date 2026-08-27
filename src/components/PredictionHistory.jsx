import React from 'react';
import { 
  History, 
  Trash2, 
  RotateCw, 
  ArrowUpRight, 
  Clock, 
  HardDrive, 
  Cpu, 
  ShieldCheck 
} from 'lucide-react';
import { getRiskConfig } from '../utils/riskUtils';

export default function PredictionHistory({ 
  history = [], 
  onClearHistory, 
  onLoadHistoryItem 
}) {
  return (
    <div className="section-card history-section" id="history">
      <div className="card-header-row">
        <div>
          <div className="flex items-center gap-2">
            <History size={20} className="text-purple-400" />
            <h2 className="section-title">Prediction History & Audit Log</h2>
          </div>
          <p className="section-subtitle">
            Historical log of recent inference passes (persisted up to 10 entries in local browser storage).
          </p>
        </div>

        <div className="history-header-actions">
          {history.length > 0 && (
            <button
              className="btn-danger-ghost"
              onClick={onClearHistory}
              title="Clear all stored prediction history"
            >
              <Trash2 size={14} />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <div className="history-empty-state">
          <Clock size={32} className="text-slate-600 mb-2" />
          <p className="text-slate-300 font-medium">No assessment history recorded yet</p>
          <p className="text-slate-500 text-xs">Run a risk analysis above to populate this telemetry audit log.</p>
        </div>
      ) : (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Machine Type</th>
                <th>Disruption Risk</th>
                <th>Risk Level</th>
                <th>Priority Score</th>
                <th>Machine Failure %</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => {
                const config = getRiskConfig(item.risk_level);
                const score = parseFloat(item.risk_score || item.overall_disruption_risk || 0).toFixed(1);
                const priority = parseFloat(item.priority_score || 0).toFixed(1);
                const failProb = ((item.machine_failure_probability || 0) * 100).toFixed(1);

                return (
                  <tr key={index} className="history-row">
                    <td className="font-mono text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-slate-500" />
                        <span>{item.time || 'N/A'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="machine-type-chip">
                        Type {item.machine_type || item.Type || 'M'}
                      </span>
                    </td>
                    <td>
                      <span className="font-bold text-slate-100">
                        {score}%
                      </span>
                    </td>
                    <td>
                      <span className={`table-risk-badge ${config.badgeClass}`}>
                        {item.risk_level || 'LOW'}
                      </span>
                    </td>
                    <td>
                      <span className="font-semibold text-amber-400 font-mono">
                        {priority}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-blue-400 text-xs">
                        {failProb}%
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        className="btn-table-load"
                        onClick={() => onLoadHistoryItem(item)}
                        title="Load these telemetry inputs into form"
                      >
                        <span>Load Input</span>
                        <ArrowUpRight size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="storage-prototype-footnote">
        <HardDrive size={13} className="text-slate-400" />
        <span>Stored in browser localStorage for prototype demo continuity.</span>
      </div>
    </div>
  );
}
