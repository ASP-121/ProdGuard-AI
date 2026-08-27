import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Cpu, 
  Boxes, 
  Users, 
  Thermometer, 
  Gauge, 
  Clock, 
  Percent, 
  Layers, 
  AlertCircle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { PRESETS } from '../utils/presets';

export default function PredictionForm({ 
  formData, 
  setFormData, 
  onSubmit, 
  loading, 
  error,
  lastAnalyzedTime
}) {
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateAndSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.Type) errors.Type = 'Required';
    if (isNaN(formData.air_temperature) || formData.air_temperature < 250 || formData.air_temperature > 350) {
      errors.air_temperature = 'Air Temp must be 250-350 K';
    }
    if (isNaN(formData.process_temperature) || formData.process_temperature < 250 || formData.process_temperature > 350) {
      errors.process_temperature = 'Process Temp must be 250-350 K';
    }
    if (isNaN(formData.rotational_speed) || formData.rotational_speed < 500 || formData.rotational_speed > 4000) {
      errors.rotational_speed = 'Speed must be 500-4000 rpm';
    }
    if (isNaN(formData.torque) || formData.torque < 0 || formData.torque > 150) {
      errors.torque = 'Torque must be 0-150 Nm';
    }
    if (isNaN(formData.tool_wear) || formData.tool_wear < 0 || formData.tool_wear > 400) {
      errors.tool_wear = 'Tool Wear must be 0-400 min';
    }
    if (isNaN(formData.material_delay) || formData.material_delay < 0) {
      errors.material_delay = 'Material Delay cannot be negative';
    }
    if (isNaN(formData.workforce_constraint) || formData.workforce_constraint < 0 || formData.workforce_constraint > 100) {
      errors.workforce_constraint = 'Workforce constraint must be 0-100%';
    }
    if (isNaN(formData.quality_issue_rate) || formData.quality_issue_rate < 0 || formData.quality_issue_rate > 100) {
      errors.quality_issue_rate = 'Quality issue rate must be 0-100%';
    }
    if (isNaN(formData.production_backlog) || formData.production_backlog < 0) {
      errors.production_backlog = 'Backlog cannot be negative';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    onSubmit();
  };

  const handleReset = () => {
    setFormData(PRESETS[0].data);
    setValidationErrors({});
  };

  return (
    <div className="section-card assessment-form-card" id="assessment">
      <div className="card-header-row">
        <div>
          <h2 className="section-title flex items-center gap-2">
            <Cpu className="text-blue-400" size={20} />
            <span>Production Risk Assessment</span>
          </h2>
          <p className="section-subtitle">
            Configure physical CNC machine telemetry and real-time operational constraints for ML inference.
          </p>
        </div>

        <div className="header-actions-group">
          <button 
            type="button" 
            onClick={handleReset} 
            className="btn-ghost"
            title="Reset to nominal baseline"
          >
            <RotateCcw size={14} />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="form-error-banner">
          <AlertCircle size={18} className="shrink-0" />
          <div className="error-text">
            <strong>Backend Connection Issue:</strong> {error}
            <div className="text-xs mt-1 text-rose-300">
              Ensure FastAPI backend is running at <code className="bg-rose-950 px-1 py-0.5 rounded">http://127.0.0.1:8000</code>.
            </div>
          </div>
        </div>
      )}

      <form onSubmit={validateAndSubmit} className="assessment-form">
        {/* SECTION 1: MACHINE TELEMETRY */}
        <div className="form-subpanel">
          <div className="subpanel-title-bar">
            <div className="flex items-center gap-2">
              <span className="step-num">1</span>
              <span className="subpanel-heading">Machine Telemetry (Physical Sensor Layer)</span>
            </div>
            <span className="subpanel-tag">SCADA & IoT Sensors</span>
          </div>

          <div className="form-grid-columns">
            {/* Machine Type */}
            <div className="form-control-block col-span-full">
              <label className="form-label">
                Machine Quality / Variant Type:
                <span className="label-hint">(L = Low, M = Medium, H = Heavy Duty Variant)</span>
              </label>
              <div className="machine-type-selector">
                {['L', 'M', 'H'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`machine-type-btn ${formData.Type === type ? 'active' : ''}`}
                    onClick={() => handleInputChange('Type', type)}
                  >
                    <span className="type-letter">{type}</span>
                    <span className="type-desc">
                      {type === 'L' ? 'Low Capacity' : type === 'M' ? 'Standard Medium' : 'Heavy Industrial'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Air Temperature */}
            <div className="form-control-block">
              <div className="label-with-value">
                <label className="form-label flex items-center gap-1.5">
                  <Thermometer size={14} className="text-blue-400" />
                  Air Temperature [K]
                </label>
                <span className="value-pill">{formData.air_temperature} K ({(formData.air_temperature - 273.15).toFixed(1)}°C)</span>
              </div>
              <div className="slider-input-combo">
                <input
                  type="range"
                  min="295"
                  max="315"
                  step="0.1"
                  value={formData.air_temperature}
                  onChange={(e) => handleInputChange('air_temperature', parseFloat(e.target.value))}
                  className="custom-range"
                />
                <input
                  type="number"
                  step="0.1"
                  value={formData.air_temperature}
                  onChange={(e) => handleInputChange('air_temperature', parseFloat(e.target.value) || 0)}
                  className="custom-number-input"
                />
              </div>
              {validationErrors.air_temperature && <span className="field-err">{validationErrors.air_temperature}</span>}
            </div>

            {/* Process Temperature */}
            <div className="form-control-block">
              <div className="label-with-value">
                <label className="form-label flex items-center gap-1.5">
                  <Thermometer size={14} className="text-orange-400" />
                  Process Temperature [K]
                </label>
                <span className="value-pill">{formData.process_temperature} K ({(formData.process_temperature - 273.15).toFixed(1)}°C)</span>
              </div>
              <div className="slider-input-combo">
                <input
                  type="range"
                  min="300"
                  max="325"
                  step="0.1"
                  value={formData.process_temperature}
                  onChange={(e) => handleInputChange('process_temperature', parseFloat(e.target.value))}
                  className="custom-range"
                />
                <input
                  type="number"
                  step="0.1"
                  value={formData.process_temperature}
                  onChange={(e) => handleInputChange('process_temperature', parseFloat(e.target.value) || 0)}
                  className="custom-number-input"
                />
              </div>
              {validationErrors.process_temperature && <span className="field-err">{validationErrors.process_temperature}</span>}
            </div>

            {/* Rotational Speed */}
            <div className="form-control-block">
              <div className="label-with-value">
                <label className="form-label flex items-center gap-1.5">
                  <Gauge size={14} className="text-cyan-400" />
                  Rotational Speed [rpm]
                </label>
                <span className="value-pill">{formData.rotational_speed} rpm</span>
              </div>
              <div className="slider-input-combo">
                <input
                  type="range"
                  min="1000"
                  max="3000"
                  step="25"
                  value={formData.rotational_speed}
                  onChange={(e) => handleInputChange('rotational_speed', parseInt(e.target.value, 10))}
                  className="custom-range"
                />
                <input
                  type="number"
                  step="10"
                  value={formData.rotational_speed}
                  onChange={(e) => handleInputChange('rotational_speed', parseInt(e.target.value, 10) || 0)}
                  className="custom-number-input"
                />
              </div>
              {validationErrors.rotational_speed && <span className="field-err">{validationErrors.rotational_speed}</span>}
            </div>

            {/* Torque */}
            <div className="form-control-block">
              <div className="label-with-value">
                <label className="form-label flex items-center gap-1.5">
                  <Cpu size={14} className="text-amber-400" />
                  Torque [Nm]
                </label>
                <span className="value-pill">{formData.torque} Nm</span>
              </div>
              <div className="slider-input-combo">
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="0.5"
                  value={formData.torque}
                  onChange={(e) => handleInputChange('torque', parseFloat(e.target.value))}
                  className="custom-range"
                />
                <input
                  type="number"
                  step="0.5"
                  value={formData.torque}
                  onChange={(e) => handleInputChange('torque', parseFloat(e.target.value) || 0)}
                  className="custom-number-input"
                />
              </div>
              {validationErrors.torque && <span className="field-err">{validationErrors.torque}</span>}
            </div>

            {/* Tool Wear */}
            <div className="form-control-block col-span-full">
              <div className="label-with-value">
                <label className="form-label flex items-center gap-1.5">
                  <Clock size={14} className="text-rose-400" />
                  Tool Wear [minutes accumulated]
                </label>
                <span className={`value-pill ${formData.tool_wear > 200 ? 'pill-danger' : 'pill-normal'}`}>
                  {formData.tool_wear} min / 250 min limit
                </span>
              </div>
              <div className="slider-input-combo">
                <input
                  type="range"
                  min="0"
                  max="300"
                  step="5"
                  value={formData.tool_wear}
                  onChange={(e) => handleInputChange('tool_wear', parseInt(e.target.value, 10))}
                  className="custom-range"
                />
                <input
                  type="number"
                  step="5"
                  value={formData.tool_wear}
                  onChange={(e) => handleInputChange('tool_wear', parseInt(e.target.value, 10) || 0)}
                  className="custom-number-input"
                />
              </div>
              {validationErrors.tool_wear && <span className="field-err">{validationErrors.tool_wear}</span>}
            </div>
          </div>
        </div>

        {/* SECTION 2: OPERATIONAL & SUPPLY SIGNALS */}
        <div className="form-subpanel">
          <div className="subpanel-title-bar">
            <div className="flex items-center gap-2">
              <span className="step-num">2</span>
              <span className="subpanel-heading">Operational & Supply Signals (Factory Floor Context)</span>
            </div>
            <span className="subpanel-tag">ERP / MES / HR Systems</span>
          </div>

          <div className="form-grid-columns">
            {/* Material Delay */}
            <div className="form-control-block">
              <div className="label-with-value">
                <label className="form-label flex items-center gap-1.5">
                  <Boxes size={14} className="text-purple-400" />
                  Material Delay [minutes]
                </label>
                <span className="value-pill">{formData.material_delay} min</span>
              </div>
              <div className="slider-input-combo">
                <input
                  type="range"
                  min="0"
                  max="180"
                  step="5"
                  value={formData.material_delay}
                  onChange={(e) => handleInputChange('material_delay', parseFloat(e.target.value))}
                  className="custom-range"
                />
                <input
                  type="number"
                  value={formData.material_delay}
                  onChange={(e) => handleInputChange('material_delay', parseFloat(e.target.value) || 0)}
                  className="custom-number-input"
                />
              </div>
              {validationErrors.material_delay && <span className="field-err">{validationErrors.material_delay}</span>}
            </div>

            {/* Workforce Constraint */}
            <div className="form-control-block">
              <div className="label-with-value">
                <label className="form-label flex items-center gap-1.5">
                  <Users size={14} className="text-pink-400" />
                  Workforce Constraint [% shortage]
                </label>
                <span className="value-pill">{formData.workforce_constraint}%</span>
              </div>
              <div className="slider-input-combo">
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={formData.workforce_constraint}
                  onChange={(e) => handleInputChange('workforce_constraint', parseFloat(e.target.value))}
                  className="custom-range"
                />
                <input
                  type="number"
                  value={formData.workforce_constraint}
                  onChange={(e) => handleInputChange('workforce_constraint', parseFloat(e.target.value) || 0)}
                  className="custom-number-input"
                />
              </div>
              {validationErrors.workforce_constraint && <span className="field-err">{validationErrors.workforce_constraint}</span>}
            </div>

            {/* Quality Issue Rate */}
            <div className="form-control-block">
              <div className="label-with-value">
                <label className="form-label flex items-center gap-1.5">
                  <Percent size={14} className="text-amber-400" />
                  Quality Issue Rate [% scrap/rework]
                </label>
                <span className="value-pill">{formData.quality_issue_rate}%</span>
              </div>
              <div className="slider-input-combo">
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="0.5"
                  value={formData.quality_issue_rate}
                  onChange={(e) => handleInputChange('quality_issue_rate', parseFloat(e.target.value))}
                  className="custom-range"
                />
                <input
                  type="number"
                  step="0.5"
                  value={formData.quality_issue_rate}
                  onChange={(e) => handleInputChange('quality_issue_rate', parseFloat(e.target.value) || 0)}
                  className="custom-number-input"
                />
              </div>
              {validationErrors.quality_issue_rate && <span className="field-err">{validationErrors.quality_issue_rate}</span>}
            </div>

            {/* Production Backlog */}
            <div className="form-control-block">
              <div className="label-with-value">
                <label className="form-label flex items-center gap-1.5">
                  <Layers size={14} className="text-emerald-400" />
                  Production Backlog [units queued]
                </label>
                <span className="value-pill">{formData.production_backlog} units</span>
              </div>
              <div className="slider-input-combo">
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={formData.production_backlog}
                  onChange={(e) => handleInputChange('production_backlog', parseFloat(e.target.value))}
                  className="custom-range"
                />
                <input
                  type="number"
                  step="10"
                  value={formData.production_backlog}
                  onChange={(e) => handleInputChange('production_backlog', parseFloat(e.target.value) || 0)}
                  className="custom-number-input"
                />
              </div>
              {validationErrors.production_backlog && <span className="field-err">{validationErrors.production_backlog}</span>}
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON WITH LOADING ANIMATION */}
        <div className="form-submit-row">
          <button
            type="submit"
            disabled={loading}
            className={`btn-analyze-submit ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <div className="loading-state-content">
                <div className="spinner-md" />
                <span className="loading-text-bold">AI is analyzing production risk...</span>
                <span className="loading-subtext">Executing ML gradient booster & multi-factor prioritization engine</span>
              </div>
            ) : (
              <div className="ready-state-content">
                <Play size={18} fill="currentColor" />
                <span className="btn-text-main">Analyze Production Risk</span>
                <span className="btn-text-badge">POST /predict</span>
              </div>
            )}
          </button>
          
          {lastAnalyzedTime && !loading && (
            <div className="last-sync-timestamp">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Last analyzed: {lastAnalyzedTime}</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
