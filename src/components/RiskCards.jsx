import React from 'react';
import { 
  Activity, 
  AlertCircle, 
  Shield, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Cpu, 
  Gauge, 
  ArrowUpRight 
} from 'lucide-react';
import { getRiskConfig } from '../utils/riskUtils';

export default function RiskCards({ predictionResult, activeRole }) {
  if (!predictionResult) {
    return (
      <div className="risk-cards-grid">
        <div className="kpi-card skeleton-card">Loading KPI metrics...</div>
      </div>
    );
  }

  const {
    machine_failure_probability = 0,
    overall_disruption_risk = 0,
    risk_level = 'LOW',
    priority_score = 0
  } = predictionResult;

  const config = getRiskConfig(risk_level);
  const rawProb = machine_failure_probability || 0;
  const failProbPercent = rawProb <= 1 ? (rawProb * 100).toFixed(1) : parseFloat(rawProb).toFixed(1);
  const isHighProb = rawProb <= 1 ? rawProb > 0.4 : rawProb > 40;
  const isMedProb = rawProb <= 1 ? rawProb > 0.15 : rawProb > 15;
  const disruptionScore = parseFloat(overall_disruption_risk).toFixed(1);
  const priorityVal = parseFloat(priority_score).toFixed(1);

  return (
    <div className="risk-cards-grid">
      {/* Card 1: Machine Failure Probability */}
      <div className={`kpi-card ${activeRole === 'maintenance' ? 'kpi-role-focus' : ''}`}>
        <div className="kpi-card-header">
          <div className="kpi-title-block">
            <span className="kpi-label">Machine Failure Probability</span>
            <span className="kpi-sublabel">Gradient Boosting ML Model</span>
          </div>
          <div className="kpi-icon-badge icon-blue">
            <Cpu size={20} />
          </div>
        </div>

        <div className="kpi-value-row">
          <span className="kpi-main-value">{failProbPercent}%</span>
          <div className="kpi-badge-wrapper">
            <span className={`kpi-mini-status ${isHighProb ? 'status-critical' : isMedProb ? 'status-warning' : 'status-nominal'}`}>
              {isHighProb ? 'Critical Wear' : isMedProb ? 'Elevated Strain' : 'Nominal Health'}
            </span>
          </div>
        </div>

        <div className="kpi-footer-progress">
          <div className="progress-track">
            <div 
              className="progress-fill fill-blue" 
              style={{ width: `${Math.min(100, Math.max(5, failProbPercent))}%` }}
            />
          </div>
          <div className="kpi-progress-labels">
            <span>0% Safe</span>
            <span>Threshold: 15%</span>
            <span>100% Imminent</span>
          </div>
        </div>
      </div>

      {/* Card 2: Overall Disruption Risk */}
      <div className={`kpi-card ${activeRole === 'manager' ? 'kpi-role-focus' : ''}`}>
        <div className="kpi-card-header">
          <div className="kpi-title-block">
            <span className="kpi-label">Overall Disruption Risk</span>
            <span className="kpi-sublabel">Unified Multi-Silo Impact</span>
          </div>
          <div className="kpi-icon-badge icon-purple">
            <Gauge size={20} />
          </div>
        </div>

        <div className="kpi-value-row">
          <span className="kpi-main-value">{disruptionScore}%</span>
          <div className="kpi-badge-wrapper">
            <span className="kpi-trend-pill">
              <TrendingUp size={13} />
              <span>Multi-Factor Composite</span>
            </span>
          </div>
        </div>

        <div className="kpi-footer-progress">
          <div className="progress-track">
            <div 
              className="progress-fill fill-gradient-risk" 
              style={{ 
                width: `${Math.min(100, disruptionScore)}%`,
                backgroundColor: config.color 
              }}
            />
          </div>
          <div className="kpi-progress-labels">
            <span>0% Normal</span>
            <span>50% Moderate</span>
            <span>100% Stoppage</span>
          </div>
        </div>
      </div>

      {/* Card 3: Risk Level */}
      <div className={`kpi-card kpi-card-status ${config.badgeClass}`}>
        <div className="kpi-card-header">
          <div className="kpi-title-block">
            <span className="kpi-label">Risk Level</span>
            <span className="kpi-sublabel">Operational Posture</span>
          </div>
          <div className="kpi-icon-badge icon-status" style={{ color: config.color, background: config.bg }}>
            <Shield size={20} />
          </div>
        </div>

        <div className="kpi-value-row">
          <div className="kpi-status-display" style={{ color: config.color }}>
            <span className="status-pulse-dot" style={{ backgroundColor: config.color }}></span>
            <span className="status-bold-text">{risk_level}</span>
          </div>
          <div className="kpi-badge-wrapper">
            <span className="kpi-range-tag">{config.range}</span>
          </div>
        </div>

        <div className="kpi-status-subtext">
          <span>{config.severityText}</span>
          <span className="protocol-text">· {config.dispatchUrgency}</span>
        </div>
      </div>

      {/* Card 4: Priority Score */}
      <div className={`kpi-card ${activeRole === 'supervisor' ? 'kpi-role-focus' : ''}`}>
        <div className="kpi-card-header">
          <div className="kpi-title-block">
            <span className="kpi-label">Priority Score</span>
            <span className="kpi-sublabel">Triage Urgency Ranking</span>
          </div>
          <div className="kpi-icon-badge icon-amber">
            <Zap size={20} />
          </div>
        </div>

        <div className="kpi-value-row">
          <span className="kpi-main-value">{priorityVal}</span>
          <span className="kpi-unit-sub">/ 100</span>
          <div className="kpi-badge-wrapper">
            <span className="kpi-priority-tier">
              {priority_score >= 75 ? 'P1 Emergency' : priority_score >= 50 ? 'P2 High' : priority_score >= 25 ? 'P3 Moderate' : 'P4 Routine'}
            </span>
          </div>
        </div>

        <div className="kpi-footer-progress">
          <div className="progress-track">
            <div 
              className="progress-fill fill-amber" 
              style={{ width: `${Math.min(100, priorityVal)}%` }}
            />
          </div>
          <div className="kpi-progress-labels">
            <span>P4 Routine</span>
            <span>P3 Moderate</span>
            <span>P1 Immediate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
