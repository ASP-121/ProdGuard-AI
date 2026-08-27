import React from 'react';
import { 
  CheckSquare, 
  CheckCircle, 
  Clock, 
  PlayCircle, 
  AlertCircle, 
  Sparkles, 
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  HardDrive
} from 'lucide-react';

export default function RecommendedActions({ 
  recommendedActions = [], 
  actionStatuses = {}, 
  onUpdateActionStatus,
  onResetActions 
}) {
  const actions = recommendedActions && recommendedActions.length > 0
    ? recommendedActions
    : [
        'Maintain nominal monitoring frequency on CNC sensors.',
        'Review upcoming shift inventory staging queues.',
        'Perform standard end-of-shift tool wear visual inspection.',
        'Log shift cycle metrics in MES.'
      ];

  const totalActions = actions.length;
  const completedCount = actions.filter((_, idx) => actionStatuses[idx] === 'COMPLETED').length;
  const inProgressCount = actions.filter((_, idx) => actionStatuses[idx] === 'IN_PROGRESS').length;
  const progressPercent = totalActions > 0 ? Math.round((completedCount / totalActions) * 100) : 0;

  const getPriorityTag = (index) => {
    if (index === 0) return { label: 'Immediate P1', class: 'badge-critical' };
    if (index === 1) return { label: 'High P2', class: 'badge-high' };
    if (index === 2) return { label: 'Medium P3', class: 'badge-medium' };
    return { label: 'Standard P4', class: 'badge-low' };
  };

  return (
    <div className="section-card actions-section" id="actions">
      <div className="card-header-row">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare size={20} className="text-emerald-400" />
            <h2 className="section-title">AI Recommended Actions & Execution Checklist</h2>
          </div>
          <p className="section-subtitle">
            Actionable operational counter-measures synthesized by ProdGuard AI to remediate detected disruption vectors.
          </p>
        </div>

        <div className="actions-header-controls">
          <button
            className="btn-ghost"
            onClick={onResetActions}
            title="Reset action states to Pending"
          >
            <RotateCcw size={13} />
            <span>Reset Statuses</span>
          </button>
        </div>
      </div>

      {/* PROGRESS TRACKER BAR */}
      <div className="action-progress-container">
        <div className="progress-info-row">
          <div className="progress-status-summary">
            <span className="summary-bold">
              {completedCount} of {totalActions} Actions Completed
            </span>
            {inProgressCount > 0 && (
              <span className="summary-pill in-progress">
                {inProgressCount} in progress
              </span>
            )}
            {completedCount === totalActions && totalActions > 0 && (
              <span className="summary-pill all-done">
                <ShieldCheck size={13} /> All Remediations Completed
              </span>
            )}
          </div>
          <span className="progress-percent-label">{progressPercent}%</span>
        </div>

        <div className="action-progress-bar-track">
          <div 
            className={`action-progress-bar-fill ${completedCount === totalActions ? 'fill-completed' : ''}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* ACTIONS LIST */}
      <div className="actions-card-list">
        {actions.map((actionText, index) => {
          const status = actionStatuses[index] || 'PENDING';
          const priority = getPriorityTag(index);

          return (
            <div 
              key={index} 
              className={`action-item-card status-${status.toLowerCase()}`}
            >
              <div className="action-num-badge">
                <span>0{index + 1}</span>
              </div>

              <div className="action-content-body">
                <div className="action-header-line">
                  <span className="action-step-label">Step #{index + 1}</span>
                  <span className={`action-priority-badge ${priority.class}`}>
                    {priority.label}
                  </span>
                  <span className={`action-status-badge badge-${status.toLowerCase()}`}>
                    {status === 'COMPLETED' ? '✓ Completed' : status === 'IN_PROGRESS' ? '⏳ In Progress' : '○ Pending'}
                  </span>
                </div>

                <p className="action-instruction-text">
                  {actionText}
                </p>
              </div>

              <div className="action-btn-controls">
                <button
                  className={`btn-action-status btn-status-progress ${status === 'IN_PROGRESS' ? 'active' : ''}`}
                  onClick={() => onUpdateActionStatus(index, status === 'IN_PROGRESS' ? 'PENDING' : 'IN_PROGRESS')}
                >
                  <PlayCircle size={14} />
                  <span>{status === 'IN_PROGRESS' ? 'In Progress' : 'Mark In Progress'}</span>
                </button>

                <button
                  className={`btn-action-status btn-status-complete ${status === 'COMPLETED' ? 'active' : ''}`}
                  onClick={() => onUpdateActionStatus(index, status === 'COMPLETED' ? 'PENDING' : 'COMPLETED')}
                >
                  <CheckCircle2 size={14} />
                  <span>{status === 'COMPLETED' ? 'Completed' : 'Mark Complete'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="storage-prototype-footnote">
        <HardDrive size={13} className="text-slate-400" />
        <span>Action checklist states synced to local browser storage (Prototype Demo Mode).</span>
      </div>
    </div>
  );
}
