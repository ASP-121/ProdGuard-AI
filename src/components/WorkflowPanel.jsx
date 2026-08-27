import React, { useState } from 'react';
import { 
  GitPullRequest, 
  Send, 
  UserCheck, 
  CheckCircle, 
  AlertOctagon, 
  FileText, 
  ArrowRight, 
  Clock, 
  ShieldAlert,
  Flame,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { getRiskConfig } from '../utils/riskUtils';

export default function WorkflowPanel({ 
  workflowState, 
  setWorkflowState, 
  predictionResult, 
  onSaveWorkflow 
}) {
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [escalationSuccess, setEscalationSuccess] = useState(false);

  const stages = [
    { id: 'DETECTED', label: '1. Detected', desc: 'Anomaly identified in telemetry stream' },
    { id: 'ANALYZED', label: '2. Analyzed', desc: 'Root cause and disruption risk scored' },
    { id: 'ACTION_ASSIGNED', label: '3. Action Assigned', desc: 'Ownership dispatched to floor department' },
    { id: 'IN_PROGRESS', label: '4. In Progress', desc: 'Technicians mitigating constraint' },
    { id: 'RESOLVED', label: '5. Resolved', desc: 'Parameters verified nominal & logged' }
  ];

  const teams = [
    'Maintenance Team',
    'Quality Team',
    'Supply Chain Team',
    'Production Manager'
  ];

  const currentStageIndex = stages.findIndex(s => s.id === workflowState.currentStage);
  const riskLevel = predictionResult?.risk_level || 'LOW';
  const config = getRiskConfig(riskLevel);

  const handleStageChange = (stageId) => {
    const nextState = {
      ...workflowState,
      currentStage: stageId,
      lastUpdated: new Date().toLocaleTimeString()
    };
    setWorkflowState(nextState);
    if (onSaveWorkflow) onSaveWorkflow(nextState);
  };

  const handleTeamChange = (team) => {
    const nextState = {
      ...workflowState,
      assignedTeam: team
    };
    setWorkflowState(nextState);
    if (onSaveWorkflow) onSaveWorkflow(nextState);
  };

  const handleNoteChange = (note) => {
    const nextState = {
      ...workflowState,
      notes: note
    };
    setWorkflowState(nextState);
    if (onSaveWorkflow) onSaveWorkflow(nextState);
  };

  const handleTriggerEscalation = () => {
    setShowEscalationModal(true);
  };

  const confirmEscalation = () => {
    setEscalationSuccess(true);
    const updatedState = {
      ...workflowState,
      currentStage: 'ACTION_ASSIGNED',
      escalated: true,
      escalationTime: new Date().toLocaleTimeString(),
      incidentId: `INC-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setWorkflowState(updatedState);
    if (onSaveWorkflow) onSaveWorkflow(updatedState);

    setTimeout(() => {
      setShowEscalationModal(false);
      setEscalationSuccess(false);
    }, 2500);
  };

  return (
    <div className="section-card workflow-section" id="workflow">
      <div className="card-header-row">
        <div>
          <div className="flex items-center gap-2">
            <GitPullRequest size={20} className="text-pink-400" />
            <h2 className="section-title">Production Incident & Escalation Center</h2>
          </div>
          <p className="section-subtitle">
            Lifecycle incident resolution tracking across plant maintenance, supply chain, and floor supervisors.
          </p>
        </div>

        <div className="workflow-status-tag">
          <span className="text-xs text-slate-400">Active Incident Stage:</span>
          <span className="font-semibold text-slate-200">
            {stages[currentStageIndex]?.label || '1. Detected'}
          </span>
        </div>
      </div>

      {/* 5-STAGE WORKFLOW STEPPER */}
      <div className="workflow-stepper-box">
        <div className="stepper-track">
          {stages.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <button
                key={stage.id}
                type="button"
                className={`step-node-item ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => handleStageChange(stage.id)}
              >
                <div className="step-badge">
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <div className="step-text-wrap">
                  <span className="step-title">{stage.label.split('. ')[1]}</span>
                  <span className="step-desc-sub">{stage.desc}</span>
                </div>
                {idx < stages.length - 1 && <div className="step-connector-line" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* WORKFLOW CONTROLS GRID */}
      <div className="workflow-controls-grid">
        {/* Assignee Team Selection */}
        <div className="workflow-sub-card">
          <label className="workflow-control-label flex items-center gap-1.5">
            <UserCheck size={16} className="text-blue-400" />
            <span>Assign Responsibility To:</span>
          </label>
          <div className="team-select-grid">
            {teams.map((team) => (
              <button
                key={team}
                type="button"
                className={`team-select-pill ${workflowState.assignedTeam === team ? 'active' : ''}`}
                onClick={() => handleTeamChange(team)}
              >
                <span className="team-check-dot"></span>
                <span>{team}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Shift Notes / Audit Field */}
        <div className="workflow-sub-card">
          <label className="workflow-control-label flex items-center gap-1.5">
            <FileText size={16} className="text-amber-400" />
            <span>Shift Incident & Action Log:</span>
          </label>
          <textarea
            className="workflow-textarea"
            placeholder="Add operational notes, dispatch logs, or containment actions taken on shift..."
            rows="3"
            value={workflowState.notes || ''}
            onChange={(e) => handleNoteChange(e.target.value)}
          />
        </div>
      </div>

      {/* ESCALATION BUTTON & FOOTER */}
      <div className="workflow-footer-bar">
        <div className="escalation-notice-area">
          {workflowState.escalated && (
            <div className="escalated-active-pill">
              <Flame size={14} className="text-rose-400 animate-pulse" />
              <span>
                Escalated Incident <strong>{workflowState.incidentId || 'INC-4821'}</strong> assigned to{' '}
                <strong>{workflowState.assignedTeam}</strong> at {workflowState.escalationTime || 'recently'}
              </span>
            </div>
          )}
        </div>

        <div className="workflow-action-buttons">
          <button
            type="button"
            className="btn-escalate-danger"
            onClick={handleTriggerEscalation}
          >
            <ShieldAlert size={16} />
            <span>Escalate Production Disruption</span>
          </button>
        </div>
      </div>

      <div className="storage-prototype-footnote">
        <HardDrive size={13} className="text-slate-400" />
        <span>Workflow lifecycle saved to local browser storage (Prototype Demo Mode).</span>
      </div>

      {/* ESCALATION CONFIRMATION MODAL */}
      {showEscalationModal && (
        <div className="modal-overlay">
          <div className="modal-content-card">
            <div className="modal-header-danger">
              <div className="modal-icon-danger">
                <AlertOctagon size={28} />
              </div>
              <div>
                <h3 className="modal-title">Confirm Production Escalation</h3>
                <p className="modal-subtitle">Dispatch urgent alert for {riskLevel} risk assessment</p>
              </div>
            </div>

            {escalationSuccess ? (
              <div className="modal-success-state">
                <CheckCircle2 size={42} className="text-emerald-400 animate-bounce mb-2" />
                <h4 className="text-lg font-bold text-slate-100">Disruption Incident Dispatched!</h4>
                <p className="text-sm text-slate-300 mt-1">
                  Assigned directly to <strong>{workflowState.assignedTeam}</strong>. Incident ticket generated.
                </p>
                <div className="text-xs text-slate-500 mt-3">
                  (Simulated escalation prototype for hackathon demonstration)
                </div>
              </div>
            ) : (
              <div className="modal-body-details">
                <p className="text-sm text-slate-300">
                  This action will prioritize the current line disruption, notify the{' '}
                  <strong className="text-slate-100">{workflowState.assignedTeam}</strong>, and transition the workflow stage to{' '}
                  <strong>ACTION ASSIGNED</strong>.
                </p>

                <div className="modal-summary-box">
                  <div className="modal-summary-item">
                    <span className="text-slate-400">Current Disruption Risk:</span>
                    <span className="font-bold text-rose-400">{predictionResult?.overall_disruption_risk || 0}%</span>
                  </div>
                  <div className="modal-summary-item">
                    <span className="text-slate-400">Priority Score:</span>
                    <span className="font-bold text-amber-400">{predictionResult?.priority_score || 0}</span>
                  </div>
                  <div className="modal-summary-item">
                    <span className="text-slate-400">Assigned Team:</span>
                    <span className="font-semibold text-slate-200">{workflowState.assignedTeam}</span>
                  </div>
                </div>

                <div className="modal-actions-row">
                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={() => setShowEscalationModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-modal-confirm"
                    onClick={confirmEscalation}
                  >
                    Confirm & Dispatch Alert
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
