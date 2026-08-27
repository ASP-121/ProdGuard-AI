import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Flame, 
  ArrowRight,
  TrendingUp,
  Clock3
} from 'lucide-react';
import { getRiskConfig } from '../utils/riskUtils';

export default function AlertCenter({ predictionResult, onJumpToWorkflow, onJumpToActions }) {
  if (!predictionResult) return null;

  const { risk_level = 'LOW', overall_disruption_risk = 0 } = predictionResult;
  const config = getRiskConfig(risk_level);

  const getIcon = () => {
    switch (risk_level) {
      case 'CRITICAL':
        return <Flame size={24} className="alert-hero-icon text-rose-500 animate-pulse" />;
      case 'HIGH':
        return <AlertOctagon size={24} className="alert-hero-icon text-orange-500" />;
      case 'MEDIUM':
        return <AlertTriangle size={24} className="alert-hero-icon text-amber-500" />;
      case 'LOW':
      default:
        return <ShieldCheck size={24} className="alert-hero-icon text-emerald-500" />;
    }
  };

  return (
    <div className={`alert-banner-box alert-${risk_level.toLowerCase()}`}>
      <div className="alert-banner-left">
        <div className="alert-icon-ring">
          {getIcon()}
        </div>
        <div className="alert-content">
          <div className="alert-title-row">
            <span className={`alert-status-badge ${config.badgeClass}`}>
              {risk_level} ALERT
            </span>
            <span className="alert-severity-tag">{config.severityText}</span>
            <span className="alert-proactive-horizon">
              <Clock3 size={13} />
              <span>Lead Time Window: Next 2-6 Hours (Proactive)</span>
            </span>
          </div>
          <p className="alert-message-text">
            {config.alertMessage}
          </p>
        </div>
      </div>

      <div className="alert-banner-actions">
        {risk_level !== 'LOW' ? (
          <button 
            className="btn-alert-action btn-escalate-quick"
            onClick={onJumpToWorkflow}
          >
            <span>Trigger Escalation</span>
            <ArrowRight size={14} />
          </button>
        ) : (
          <button 
            className="btn-alert-action btn-view-routine"
            onClick={onJumpToActions}
          >
            <span>Review Routine Steps</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
