import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { computeRiskIndicators, getRiskConfig } from '../utils/riskUtils';
import { BarChart3, Radar as RadarIcon, Info, Zap } from 'lucide-react';

export default function RiskCharts({ inputData, predictionResult }) {
  const [compositionViewMode, setCompositionViewMode] = useState('bar'); // 'bar' | 'radar'

  if (!predictionResult) return null;

  const indicators = computeRiskIndicators(inputData, predictionResult);
  const { 
    overall_disruption_risk = 0, 
    priority_score = 0, 
    machine_failure_probability = 0,
    risk_level = 'LOW'
  } = predictionResult;

  const config = getRiskConfig(risk_level);

  // Priority Comparison Data
  const comparisonData = [
    {
      metric: 'Overall Disruption Risk',
      value: parseFloat(overall_disruption_risk) || 0,
      unit: '%',
      color: config.color,
      description: 'Composite vulnerability score'
    },
    {
      metric: 'Priority Score',
      value: parseFloat(priority_score) || 0,
      unit: '/100',
      color: '#f59e0b',
      description: 'Urgency rank for plant dispatch'
    },
    {
      metric: 'Machine Failure Probability',
      value: parseFloat(((machine_failure_probability || 0) * 100).toFixed(1)),
      unit: '%',
      color: '#3b82f6',
      description: 'ML hardware failure estimate'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-custom-tooltip">
          <div className="tooltip-title">{data.factor || data.metric || label}</div>
          <div className="tooltip-value-row">
            <span className="tooltip-val-num">
              {payload[0].value}
              {data.unit || '%'}
            </span>
          </div>
          {data.description && <div className="tooltip-desc">{data.description}</div>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="risk-charts-wrapper">
      {/* CHART 1: Risk Composition Indicators */}
      <div className="section-card chart-card">
        <div className="card-header-row">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="section-title">Risk Factor Indicators</h3>
              <span className="chart-type-pill">Multi-Vector Drivers</span>
            </div>
            <p className="section-subtitle">
              Normalized impact across SCADA mechanical telemetry and ERP operational signals.
            </p>
          </div>

          <div className="chart-view-toggle">
            <button
              className={`toggle-btn ${compositionViewMode === 'bar' ? 'active' : ''}`}
              onClick={() => setCompositionViewMode('bar')}
              title="Bar View"
            >
              <BarChart3 size={14} />
            </button>
            <button
              className={`toggle-btn ${compositionViewMode === 'radar' ? 'active' : ''}`}
              onClick={() => setCompositionViewMode('radar')}
              title="Radar View"
            >
              <RadarIcon size={14} />
            </button>
          </div>
        </div>

        <div className="chart-disclaimer-banner">
          <Info size={13} className="shrink-0 text-blue-400" />
          <span>Note: Visual indicators calculated from telemetry signals and gradient booster model response.</span>
        </div>

        <div className="chart-container-inner" style={{ height: 260 }}>
          {compositionViewMode === 'bar' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={indicators}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 30, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  tick={{ fill: '#94a3b8', fontSize: 11 }} 
                  unit="%" 
                />
                <YAxis 
                  dataKey="factor" 
                  type="category" 
                  tick={{ fill: '#e2e8f0', fontSize: 12 }} 
                  width={110} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
                  {indicators.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={indicators} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="factor" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#475569" tick={{ fill: '#64748b', fontSize: 9 }} />
                <Radar
                  name="Risk Index"
                  dataKey="value"
                  stroke="#38bdf8"
                  fill="#38bdf8"
                  fillOpacity={0.4}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* CHART 2: Priority Comparison Chart */}
      <div className="section-card chart-card">
        <div className="card-header-row">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="section-title">Priority & Metric Comparison</h3>
              <span className="chart-type-pill">Triage Dynamics</span>
            </div>
            <p className="section-subtitle">
              Relative comparison of Overall Disruption Risk, Dispatch Priority, and Machine Probability.
            </p>
          </div>
        </div>

        <div className="chart-container-inner" style={{ height: 285 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="metric" 
                tick={{ fill: '#cbd5e1', fontSize: 11 }}
                interval={0}
              />
              <YAxis 
                domain={[0, 100]} 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                unit="%"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={42}>
                {comparisonData.map((entry, index) => (
                  <Cell key={`cell-comp-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
