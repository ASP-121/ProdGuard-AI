import React from 'react';
import { 
  AlertTriangle, 
  Flame, 
  ShieldAlert, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  Boxes, 
  Users, 
  Clock, 
  Percent, 
  Wrench,
  Sparkles
} from 'lucide-react';
import { getRiskConfig } from '../utils/riskUtils';

export default function RootCauses({ predictionResult, onFocusAction }) {
  if (!predictionResult) return null;

  const { root_causes = [], risk_level = 'LOW', priority_score = 0 } = predictionResult;
  const config = getRiskConfig(risk_level);

  // Helper to parse cause string into structured data
  const parseRootCause = (cause, index) => {
    const text = String(cause);
    let icon = AlertTriangle;
    let category = 'Operational Bottleneck';
    let impact = 'Compounding line throughput resistance';
    let severity = 'Medium';
    let severityClass = 'badge-medium';

    if (text.toLowerCase().includes('material')) {
      icon = Boxes;
      category = 'Supply Chain & Material Inflow';
      impact = 'Station starvation risk; potential downstream line idle time';
    } else if (text.toLowerCase().includes('workforce') || text.toLowerCase().includes('shortage')) {
      icon = Users;
      category = 'Staffing & Floor Operations';
      impact = 'Manual cycle slowdown; bottleneck at inspection & packing stations';
    } else if (text.toLowerCase().includes('quality') || text.toLowerCase().includes('rate')) {
      icon = Percent;
      category = 'Quality Control & Scrap Yield';
      impact = 'High rework cycle; finished good defect escalation';
    } else if (text.toLowerCase().includes('backlog')) {
      icon = Clock;
      category = 'Order Fulfillment & Queue Pressure';
      impact = 'SLA breach vulnerability; OTIF delivery risk';
    } else if (text.toLowerCase().includes('tool') || text.toLowerCase().includes('temp') || text.toLowerCase().includes('speed') || text.toLowerCase().includes('torque') || text.toLowerCase().includes('failure')) {
      icon = Wrench;
      category = 'Mechanical & Tooling Health';
      impact = 'Sudden catastrophic tool breakage risk and spindle damage';
    }

    if (index === 0) {
      severity = risk_level === 'CRITICAL' ? 'Critical' : 'High';
      severityClass = risk_level === 'CRITICAL' ? 'badge-critical' : 'badge-high';
    } else if (index === 1) {
      severity = 'High';
      severityClass = 'badge-high';
    } else if (index === 2) {
      severity = 'Medium';
      severityClass = 'badge-medium';
    } else {
      severity = 'Low';
      severityClass = 'badge-low';
    }

    const priorityLevels = ['1. Critical Priority', '2. High Priority', '3. Medium Priority', '4. Low Priority'];
    const priorityLabel = priorityLevels[Math.min(index, priorityLevels.length - 1)];

    return {
      name: text,
      rank: index + 1,
      category,
      impact,
      severity,
      severityClass,
      priorityLabel,
      icon
    };
  };

  const parsedCauses = root_causes.map((cause, idx) => parseRootCause(cause, idx));
  const topPriorityIssue = parsedCauses.length > 0 ? parsedCauses[0] : null;

  return (
    <div className="section-card root-causes-section" id="prioritization">
      <div className="card-header-row">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert size={20} className="text-amber-400" />
            <h2 className="section-title">Risk Prioritization & Root Cause Ranking</h2>
          </div>
          <p className="section-subtitle">
            Ranked hierarchy of detected production bottlenecks to answer: <strong className="text-slate-200">"What should I solve first?"</strong>
          </p>
        </div>
        <span className="causes-count-badge">
          {root_causes.length} Identified Root {root_causes.length === 1 ? 'Cause' : 'Causes'}
        </span>
      </div>

      {/* TOP PRIORITY SPOTLIGHT HERO CARD */}
      {topPriorityIssue ? (
        <div className={`top-priority-hero-card hero-${topPriorityIssue.severity.toLowerCase()}`}>
          <div className="hero-badge-strip">
            <span className="hero-spotlight-tag">
              <Sparkles size={13} />
              <span>TOP PRIORITY INTERVENTION</span>
            </span>
            <span className={`priority-rank-badge ${topPriorityIssue.severityClass}`}>
              {topPriorityIssue.priorityLabel}
            </span>
          </div>

          <div className="hero-body-content">
            <div className="hero-icon-container">
              <topPriorityIssue.icon size={28} />
            </div>
            <div className="hero-text-block">
              <h3 className="hero-issue-title">{topPriorityIssue.name}</h3>
              <div className="hero-details-row">
                <span className="hero-category">Domain: <strong>{topPriorityIssue.category}</strong></span>
                <span className="hero-impact-desc">Operational Impact: <strong>{topPriorityIssue.impact}</strong></span>
              </div>
            </div>
          </div>

          <div className="hero-footer-action">
            <div className="hero-manager-guidance">
              <Target size={14} className="text-amber-400 shrink-0" />
              <span>Plant Manager Action: Mitigate this primary constraint first to release downstream bottlenecks.</span>
            </div>
            <button 
              className="btn-hero-triage"
              onClick={onFocusAction}
            >
              <span>View Mitigation Step</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className="nominal-status-box">
          <CheckCircle2 size={24} className="text-emerald-400" />
          <div>
            <h4 className="font-semibold text-slate-100">Zero Critical Root Causes Detected</h4>
            <p className="text-xs text-slate-400 mt-0.5">Telemetry reflects balanced flow across material, workforce, quality, and CNC machines.</p>
          </div>
        </div>
      )}

      {/* ALL RANKED ISSUES LIST */}
      {parsedCauses.length > 0 && (
        <div className="ranked-causes-grid">
          {parsedCauses.map((issue) => {
            const IssueIcon = issue.icon;
            return (
              <div key={issue.rank} className="ranked-cause-card">
                <div className="cause-rank-indicator">
                  <span className="rank-num">#{issue.rank}</span>
                </div>

                <div className="cause-main-body">
                  <div className="cause-header-line">
                    <div className="flex items-center gap-2">
                      <IssueIcon size={16} className="text-slate-400" />
                      <h4 className="cause-name">{issue.name}</h4>
                    </div>
                    <span className={`cause-severity-badge ${issue.severityClass}`}>
                      {issue.severity} Severity
                    </span>
                  </div>

                  <div className="cause-meta-grid">
                    <div className="cause-meta-item">
                      <span className="meta-k">Domain:</span>
                      <span className="meta-v">{issue.category}</span>
                    </div>
                    <div className="cause-meta-item">
                      <span className="meta-k">Impact:</span>
                      <span className="meta-v text-slate-300">{issue.impact}</span>
                    </div>
                    <div className="cause-meta-item">
                      <span className="meta-k">Priority Level:</span>
                      <span className="meta-v font-medium text-amber-400">{issue.priorityLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
