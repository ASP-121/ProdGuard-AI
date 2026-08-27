/**
 * ProdGuard AI - Risk Utilities & Helper Functions
 */

export const RISK_LEVELS = {
  LOW: {
    label: 'LOW',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.35)',
    glow: 'rgba(16, 185, 129, 0.25)',
    range: '0 - 30%',
    badgeClass: 'risk-badge-low',
    alertMessage: 'Production conditions are currently stable. Telemetry is within acceptable tolerance. Continue standard monitoring.',
    severityText: 'Stable / Nominal',
    dispatchUrgency: 'Standard Protocol'
  },
  MEDIUM: {
    label: 'MEDIUM',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.35)',
    glow: 'rgba(245, 158, 11, 0.25)',
    range: '31 - 60%',
    badgeClass: 'risk-badge-medium',
    alertMessage: 'Potential disruption detected. Inbound or mechanical anomalies emerging. Preventive action is recommended to avoid line degradation.',
    severityText: 'Emerging Concern',
    dispatchUrgency: 'Priority Review'
  },
  HIGH: {
    label: 'HIGH',
    color: '#f97316',
    bg: 'rgba(249, 115, 22, 0.12)',
    border: 'rgba(249, 115, 22, 0.35)',
    glow: 'rgba(249, 115, 22, 0.25)',
    range: '61 - 80%',
    badgeClass: 'risk-badge-high',
    alertMessage: 'High production disruption risk detected. Multiple operational bottlenecks compounding. Immediate supervisor intervention required.',
    severityText: 'Severe Risk',
    dispatchUrgency: 'Urgent Intervention'
  },
  CRITICAL: {
    label: 'CRITICAL',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.15)',
    border: 'rgba(239, 68, 68, 0.45)',
    glow: 'rgba(239, 68, 68, 0.35)',
    range: '81 - 100%',
    badgeClass: 'risk-badge-critical',
    alertMessage: 'Critical production disruption risk detected! Imminent line stoppage or heavy scrap rate predicted. Immediate escalation required.',
    severityText: 'Immediate Action Required',
    dispatchUrgency: 'Emergency Escalation'
  }
};

/**
 * Normalizes risk level string to standard configuration
 */
export function getRiskConfig(level) {
  const normalized = String(level || 'LOW').toUpperCase();
  return RISK_LEVELS[normalized] || RISK_LEVELS.LOW;
}

/**
 * Maps raw input data & backend outputs into calibrated 0-100 indicators for visual charts
 */
export function computeRiskIndicators(inputData, predictionResult) {
  if (!inputData || !predictionResult) {
    return [
      { factor: 'Machine Failure', value: 10, fullMark: 100, fill: '#3b82f6' },
      { factor: 'Material Delay', value: 20, fullMark: 100, fill: '#8b5cf6' },
      { factor: 'Workforce Gap', value: 15, fullMark: 100, fill: '#ec4899' },
      { factor: 'Quality Defect', value: 10, fullMark: 100, fill: '#f59e0b' },
      { factor: 'Backlog Load', value: 25, fullMark: 100, fill: '#10b981' }
    ];
  }

  // Machine Risk derived from machine_failure_probability (0-1 or 0-100) and tool wear/torque
  const probVal = predictionResult.machine_failure_probability || 0;
  const rawProb = probVal <= 1 ? probVal * 100 : probVal;
  const wearScore = Math.min(100, ((inputData.tool_wear || 0) / 250) * 100);
  const machineRisk = Math.min(100, Math.round(Math.max(rawProb, (rawProb * 0.7) + (wearScore * 0.3))));

  // Material Delay Risk: scaled up to 180 min
  const materialDelayRisk = Math.min(100, Math.round(((inputData.material_delay || 0) / 150) * 100));

  // Workforce constraint: scaled from 0-50%
  const workforceRisk = Math.min(100, Math.round(((inputData.workforce_constraint || 0) / 40) * 100));

  // Quality Issue: scaled from 0-20%
  const qualityRisk = Math.min(100, Math.round(((inputData.quality_issue_rate || 0) / 15) * 100));

  // Backlog: scaled from 0-500 units
  const backlogRisk = Math.min(100, Math.round(((inputData.production_backlog || 0) / 400) * 100));

  return [
    { factor: 'Machine Risk', value: machineRisk, fullMark: 100, fill: '#3b82f6' },
    { factor: 'Material Delay', value: materialDelayRisk, fullMark: 100, fill: '#8b5cf6' },
    { factor: 'Workforce Gap', value: workforceRisk, fullMark: 100, fill: '#ec4899' },
    { factor: 'Quality Defects', value: qualityRisk, fullMark: 100, fill: '#f59e0b' },
    { factor: 'Backlog Stress', value: backlogRisk, fullMark: 100, fill: '#10b981' }
  ];
}

/**
 * Roles definition for Persona Lens Switcher
 */
export const ROLES = [
  {
    id: 'manager',
    label: 'Plant Manager',
    icon: 'Briefcase',
    tagline: 'OEE, Financial Impact & Delivery Commitments',
    focusMetrics: ['Overall Disruption Risk', 'Delivery SLA Impact', 'Executive Escalation'],
    insightPrompt: 'Focuses on cross-departmental bottlenecks, SLA risks, and total production throughput capacity.'
  },
  {
    id: 'supervisor',
    label: 'Line Supervisor',
    icon: 'Users',
    tagline: 'Shift Operations, Bottlenecks & Line Rebalancing',
    focusMetrics: ['Workforce Shortage', 'Material Delay Staging', 'Queue Backlog'],
    insightPrompt: 'Focuses on real-time shift staffing, material starvation at stations, and immediate tactical workarounds.'
  },
  {
    id: 'maintenance',
    label: 'Maintenance Lead',
    icon: 'Wrench',
    tagline: 'Machine Telemetry, Mechanical Health & Tool Wear',
    focusMetrics: ['Failure Probability', 'Torque / Speed Delta', 'Tool Wear Cycles'],
    insightPrompt: 'Focuses on spindle strain, thermal dissipation, mechanical fatigue, and preventive parts replacement.'
  }
];

/**
 * Generates tailored Natural Language Explanations
 */
export function generateNaturalLanguageExplanation(inputData, predictionResult, activeRole = 'manager') {
  if (!predictionResult) {
    return {
      whyExplanation: 'ProdGuard AI is awaiting initial telemetry data to calculate disruption vectors and synthesize root causes.',
      nextStep: 'Select a preset or input parameters to initiate the multi-vector AI risk assessment.',
      roleInsight: 'Select a persona above to inspect customized operational implications.'
    };
  }

  const {
    machine_failure_probability = 0,
    overall_disruption_risk = 0,
    risk_level = 'LOW',
    priority_score = 0,
    root_causes = []
  } = predictionResult;

  const rawFailProb = machine_failure_probability || 0;
  const machineProbPercent = rawFailProb <= 1 ? (rawFailProb * 100).toFixed(1) : parseFloat(rawFailProb).toFixed(1);
  const disruptionPercent = parseFloat(overall_disruption_risk).toFixed(1);
  const priorityVal = parseFloat(priority_score).toFixed(1);

  let whyExplanation = '';
  let nextStep = '';
  let roleInsight = '';

  // 1. Core Synthesis Narrative
  if (risk_level === 'LOW') {
    whyExplanation = `ProdGuard AI has assessed the current production state as LOW disruption risk (${disruptionPercent}%) with a priority score of ${priorityVal}. The physical machine indicators exhibit steady operational stability with only a ${machineProbPercent}% probability of mechanical failure. Operational signals indicate healthy material flow and manageable backlog levels.`;
    nextStep = `Maintain continuous telemetry ingestion and proceed with the standard shift production schedule.`;
  } else if (risk_level === 'MEDIUM') {
    const causesText = root_causes.length > 0 ? root_causes.slice(0, 2).join(' and ') : 'emerging operational constraints';
    whyExplanation = `ProdGuard AI has detected a MEDIUM disruption risk (${disruptionPercent}%) driven primarily by ${causesText}. While machine hardware probability remains at ${machineProbPercent}%, compounding delays in material availability and queue buildup pose a threat to upcoming cycle completions if left unaddressed.`;
    nextStep = `Deploy preventive countermeasures: Rebalance production queues and confirm alternative material buffer availability within the next 90 minutes.`;
  } else if (risk_level === 'HIGH') {
    const causesText = root_causes.length > 0 ? root_causes.join(', ') : 'heightened mechanical wear and material bottlenecks';
    whyExplanation = `ProdGuard AI has flagged a HIGH disruption risk (${disruptionPercent}%) with an elevated priority score of ${priorityVal}. Production integrity is severely challenged by ${causesText}. Mechanical telemetry reflects significant wear combined with operational strain across upstream buffers.`;
    nextStep = `Execute immediate triage: Issue rapid line rebalancing, mobilize standby maintenance resources, and alert shift supervisors to avert cascading downtime.`;
  } else {
    // CRITICAL
    whyExplanation = `CRITICAL ALERT: ProdGuard AI has detected an immediate disruption threat (${disruptionPercent}%) with a maximum urgency score of ${priorityVal}. Severe failure probability (${machineProbPercent}%) combined with acute operational starvation threatens total production line stoppage.`;
    nextStep = `Emergency Protocol: Dispatch the maintenance strike team immediately for tool and mechanical inspection. Escalate to Plant Operations for emergency shift redistribution.`;
  }

  // 2. Role-specific lens synthesis
  if (activeRole === 'manager') {
    roleInsight = `Executive Lens: At ${disruptionPercent}% risk, potential delivery delay on current batch stands at ${Math.min(100, Math.round(overall_disruption_risk * 0.9))}% probability. Recommended executive action is reviewing customer order priorities and securing buffer capacity.`;
  } else if (activeRole === 'supervisor') {
    roleInsight = `Shift Floor Lens: Current line pacing is throttled by ${inputData?.material_delay || 0}m material lag and ${inputData?.workforce_constraint || 0}% workforce deficit. Reallocate floor technicians to critical bottleneck stations.`;
  } else {
    roleInsight = `Maintenance Lens: Machine Type ${inputData?.Type || 'M'} is operating with ${inputData?.tool_wear || 0} min tool wear and ${inputData?.torque || 0} Nm torque. Mechanical degradation requires rapid calibration before failure threshold is breached.`;
  }

  return {
    whyExplanation,
    nextStep,
    roleInsight
  };
}

/**
 * LocalStorage Helpers with error resilience
 */
const STORAGE_KEYS = {
  HISTORY: 'prodguard_prediction_history_v1',
  ACTION_STATUSES: 'prodguard_action_statuses_v1',
  WORKFLOW_STATE: 'prodguard_workflow_state_v1'
};

export function getStoredHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.warn('Unable to load history from localStorage', err);
    return [];
  }
}

export function saveStoredHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(0, 10)));
  } catch (err) {
    console.warn('Unable to save history to localStorage', err);
  }
}

export function getStoredActionStates() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACTION_STATUSES);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function saveStoredActionStates(states) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTION_STATUSES, JSON.stringify(states));
  } catch {
    // Ignore
  }
}

export function getStoredWorkflow() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WORKFLOW_STATE);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveStoredWorkflow(state) {
  try {
    localStorage.setItem(STORAGE_KEYS.WORKFLOW_STATE, JSON.stringify(state));
  } catch {
    // Ignore
  }
}
