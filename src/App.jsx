import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import RoleBanner from './components/RoleBanner';
import RiskCards from './components/RiskCards';
import AlertCenter from './components/AlertCenter';
import PredictionForm from './components/PredictionForm';
import RiskGauge from './components/RiskGauge';
import RiskCharts from './components/RiskCharts';
import PredictionHistoryChart from './components/PredictionHistoryChart';
import RootCauses from './components/RootCauses';
import RecommendedActions from './components/RecommendedActions';
import AIExplanation from './components/AIExplanation';
import WorkflowPanel from './components/WorkflowPanel';
import PredictionHistory from './components/PredictionHistory';

import { predictProductionRisk, checkBackendHealth } from './services/api';
import { PRESETS } from './utils/presets';
import { 
  getStoredHistory, 
  saveStoredHistory, 
  getStoredActionStates, 
  saveStoredActionStates,
  getStoredWorkflow,
  saveStoredWorkflow
} from './utils/riskUtils';

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeRole, setActiveRole] = useState('manager'); // 'manager' | 'supervisor' | 'maintenance'
  const [formData, setFormData] = useState(PRESETS[0].data);
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);
  const [lastAnalyzedTime, setLastAnalyzedTime] = useState(null);

  // LocalStorage Persisted States
  const [history, setHistory] = useState(() => getStoredHistory());
  const [actionStatuses, setActionStatuses] = useState(() => getStoredActionStates());
  const [workflowState, setWorkflowState] = useState(() => {
    const saved = getStoredWorkflow();
    return saved || {
      currentStage: 'DETECTED',
      assignedTeam: 'Maintenance Team',
      notes: '',
      escalated: false,
      incidentId: 'INC-1042',
      lastUpdated: '10:00 AM'
    };
  });

  // Execute risk prediction against backend
  const executeAnalysis = useCallback(async (dataToAnalyze) => {
    setLoading(true);
    setError(null);

    const payload = dataToAnalyze || formData;

    try {
      const result = await predictProductionRisk(payload);
      setPredictionResult(result);
      setBackendConnected(true);
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastAnalyzedTime(currentTime);

      // Save into History
      const historyItem = {
        id: Date.now(),
        time: currentTime,
        date: new Date().toLocaleDateString(),
        Type: payload.Type,
        machine_type: payload.Type,
        risk_score: result.overall_disruption_risk,
        overall_disruption_risk: result.overall_disruption_risk,
        risk_level: result.risk_level,
        priority_score: result.priority_score,
        machine_failure_probability: result.machine_failure_probability,
        input_data: { ...payload }
      };

      setHistory(prev => {
        const next = [historyItem, ...prev.slice(0, 9)];
        saveStoredHistory(next);
        return next;
      });

      // Update default workflow stage to ANALYZED on fresh run
      setWorkflowState(prev => {
        const next = {
          ...prev,
          currentStage: result.risk_level === 'CRITICAL' ? 'ACTION_ASSIGNED' : 'ANALYZED',
          lastUpdated: currentTime
        };
        saveStoredWorkflow(next);
        return next;
      });

    } catch (err) {
      console.error('Failed to run analysis:', err);
      setError(err.message || 'Failed to connect to FastAPI backend at http://127.0.0.1:8000/predict');
      setBackendConnected(false);
    } finally {
      setLoading(false);
    }
  }, [formData]);

  // Initial load: test backend and run default prediction
  useEffect(() => {
    const initApp = async () => {
      const isHealthy = await checkBackendHealth();
      setBackendConnected(isHealthy);
      // Run initial baseline analysis
      executeAnalysis(PRESETS[0].data);
    };

    initApp();
  }, []);

  // Preset Selection Handler
  const handleSelectPreset = (preset) => {
    setFormData(preset.data);
    executeAnalysis(preset.data);
  };

  // Action status updates
  const handleUpdateActionStatus = (index, status) => {
    setActionStatuses(prev => {
      const next = { ...prev, [index]: status };
      saveStoredActionStates(next);
      return next;
    });
  };

  const handleResetActions = () => {
    setActionStatuses({});
    saveStoredActionStates({});
  };

  // Clear history
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all prediction history?')) {
      setHistory([]);
      saveStoredHistory([]);
    }
  };

  // Load history item into form
  const handleLoadHistoryItem = (item) => {
    if (item.input_data) {
      setFormData(item.input_data);
      executeAnalysis(item.input_data);
    }
    const elem = document.getElementById('assessment');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToActions = () => {
    const elem = document.getElementById('actions');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToWorkflow = () => {
    const elem = document.getElementById('workflow');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        backendConnected={backendConnected}
      />

      {/* Main Content Area */}
      <div className="app-main-wrapper">
        <Header 
          activeRole={activeRole}
          setActiveRole={setActiveRole}
          onSelectPreset={handleSelectPreset}
          onRunAnalysis={() => executeAnalysis(formData)}
          loading={loading}
          riskLevel={predictionResult?.risk_level}
        />

        <main className="app-content-container">
          {/* Section 1: Persona Lens Banner */}
          <RoleBanner 
            activeRole={activeRole} 
            predictionResult={predictionResult} 
            inputData={formData}
          />

          {/* Section 2: Alert Center */}
          <AlertCenter 
            predictionResult={predictionResult}
            onJumpToWorkflow={scrollToWorkflow}
            onJumpToActions={scrollToActions}
          />

          {/* Section 3: Overview KPI Cards */}
          <div id="dashboard" className="dashboard-overview-anchor">
            <RiskCards 
              predictionResult={predictionResult} 
              activeRole={activeRole} 
            />
          </div>

          {/* Section 4: Gauges & Visualizations Grid */}
          <div className="overview-visuals-grid">
            {/* Left: Overall Risk Gauge */}
            <div className="gauge-column">
              <RiskGauge 
                score={predictionResult?.overall_disruption_risk} 
                riskLevel={predictionResult?.risk_level} 
              />
            </div>

            {/* Right: Risk Factor Composition and Priority Comparison */}
            <div className="charts-column">
              <RiskCharts 
                inputData={formData} 
                predictionResult={predictionResult} 
              />
            </div>
          </div>

          {/* Section 5: Risk Assessment Input Form */}
          <PredictionForm 
            formData={formData}
            setFormData={setFormData}
            onSubmit={() => executeAnalysis(formData)}
            loading={loading}
            error={error}
            lastAnalyzedTime={lastAnalyzedTime}
          />

          {/* Section 6: Risk Prioritization & Root Causes */}
          <RootCauses 
            predictionResult={predictionResult}
            onFocusAction={scrollToActions}
          />

          {/* Section 7: AI Recommended Actions */}
          <RecommendedActions 
            recommendedActions={predictionResult?.recommended_actions}
            actionStatuses={actionStatuses}
            onUpdateActionStatus={handleUpdateActionStatus}
            onResetActions={handleResetActions}
          />

          {/* Section 8: Natural Language AI Explanation */}
          <AIExplanation 
            inputData={formData}
            predictionResult={predictionResult}
            activeRole={activeRole}
          />

          {/* Section 9: Incident Workflow & Escalation */}
          <WorkflowPanel 
            workflowState={workflowState}
            setWorkflowState={setWorkflowState}
            predictionResult={predictionResult}
            onSaveWorkflow={saveStoredWorkflow}
          />

          {/* Section 10: Prediction Trajectory Chart & History Table */}
          <div className="history-section-wrapper">
            <PredictionHistoryChart history={history} />
            <PredictionHistory 
              history={history}
              onClearHistory={handleClearHistory}
              onLoadHistoryItem={handleLoadHistoryItem}
            />
          </div>
        </main>

        {/* Global Page Footer */}
        <footer className="global-page-footer">
          <div className="footer-left">
            <span className="footer-brand">ProdGuard AI</span>
            <span className="footer-pipe">|</span>
            <span>AI-Enabled Production Disruption Early Warning System</span>
          </div>
          <div className="footer-right">
            <span className="footer-tag">Hackathon Edition · FastAPI + Gradient Boosting ML + React</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
