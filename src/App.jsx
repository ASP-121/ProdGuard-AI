// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// New Pages (We will create these next)
import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import RootCausesPage from './pages/RootCausesPage';
import ActionsPage from './pages/ActionsPage';
import WorkflowPage from './pages/WorkflowPage';
import HistoryPage from './pages/HistoryPage';

// Utilities & Services
import { predictProductionRisk, checkBackendHealth } from './services/api';
import { PRESETS } from './utils/presets';
import { 
  getStoredHistory, saveStoredHistory, 
  getStoredActionStates, saveStoredActionStates,
  getStoredWorkflow, saveStoredWorkflow
} from './utils/riskUtils';

export default function App() {
  // =========================================================================
  // 1. ALL YOUR EXISTING STATE AND LOGIC STAYS EXACTLY THE SAME
  // =========================================================================
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeRole, setActiveRole] = useState('manager'); 
  const [formData, setFormData] = useState(PRESETS[0].data);
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);
  const [lastAnalyzedTime, setLastAnalyzedTime] = useState(null);

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

      const historyItem = {
        id: Date.now(), time: currentTime, date: new Date().toLocaleDateString(),
        Type: payload.Type, machine_type: payload.Type,
        risk_score: result.overall_disruption_risk, overall_disruption_risk: result.overall_disruption_risk,
        risk_level: result.risk_level, priority_score: result.priority_score,
        machine_failure_probability: result.machine_failure_probability,
        input_data: { ...payload }
      };

      setHistory(prev => {
        const next = [historyItem, ...prev.slice(0, 9)];
        saveStoredHistory(next);
        return next;
      });

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
      setError(err.message || 'Failed to connect to FastAPI backend');
      setBackendConnected(false);
    } finally {
      setLoading(false);
    }
  }, [formData]);

  useEffect(() => {
    const initApp = async () => {
      const isHealthy = await checkBackendHealth();
      setBackendConnected(isHealthy);
      executeAnalysis(PRESETS[0].data);
    };
    initApp();
  }, []);

  const handleSelectPreset = (preset) => {
    setFormData(preset.data);
    executeAnalysis(preset.data);
  };

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

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all prediction history?')) {
      setHistory([]);
      saveStoredHistory([]);
    }
  };

  const handleLoadHistoryItem = (item) => {
    if (item.input_data) {
      setFormData(item.input_data);
      executeAnalysis(item.input_data);
    }
  };

  // =========================================================================
  // 2. THE RENDER BLOCK (Updated to use React Router and pass props)
  // =========================================================================
  return (
    <BrowserRouter>
      <div className="app-layout">
        {/* Sidebar remains visible on all pages */}
        <Sidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
          backendConnected={backendConnected}
        />

        <div className="app-main-wrapper">
          {/* Header remains visible on all pages */}
          <Header 
            activeRole={activeRole}
            setActiveRole={setActiveRole}
            onSelectPreset={handleSelectPreset}
            onRunAnalysis={() => executeAnalysis(formData)}
            loading={loading}
            riskLevel={predictionResult?.risk_level}
          />

          <main className="app-content-container">
            <Routes>
              {/* Default Redirect */}
              <Route path="/" element={<Navigate replace to="/dashboard" />} />

              {/* Page 1: Dashboard */}
              <Route path="/dashboard" element={
                <Dashboard 
                  activeRole={activeRole}
                  predictionResult={predictionResult}
                  formData={formData}
                />
              } />

              {/* Page 2: Prediction Input Form */}
              <Route path="/predict" element={
                <Prediction 
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={() => executeAnalysis(formData)}
                  loading={loading}
                  error={error}
                  lastAnalyzedTime={lastAnalyzedTime}
                />
              } />

              {/* Page 3: Root Causes & Explanations */}
              <Route path="/root-causes" element={
                <RootCausesPage 
                  predictionResult={predictionResult}
                  formData={formData}
                  activeRole={activeRole}
                />
              } />

              {/* Page 4: Recommended Actions */}
              <Route path="/actions" element={
                <ActionsPage 
                  predictionResult={predictionResult}
                  actionStatuses={actionStatuses}
                  onUpdateActionStatus={handleUpdateActionStatus}
                  onResetActions={handleResetActions}
                />
              } />

              {/* Page 5: Workflow Panel */}
              <Route path="/workflow" element={
                <WorkflowPage 
                  workflowState={workflowState}
                  setWorkflowState={setWorkflowState}
                  predictionResult={predictionResult}
                  onSaveWorkflow={saveStoredWorkflow}
                />
              } />

              {/* Page 6: History */}
              <Route path="/history" element={
                <HistoryPage 
                  history={history}
                  onClearHistory={handleClearHistory}
                  onLoadHistoryItem={handleLoadHistoryItem}
                />
              } />
            </Routes>
          </main>

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
    </BrowserRouter>
  );
}