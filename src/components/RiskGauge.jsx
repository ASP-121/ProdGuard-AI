import React from 'react';
import { getRiskConfig } from '../utils/riskUtils';
import { Shield, Flame, AlertTriangle, AlertOctagon } from 'lucide-react';

export default function RiskGauge({ score = 0, riskLevel = 'LOW' }) {
  const cleanScore = Math.max(0, Math.min(100, parseFloat(score) || 0));
  const config = getRiskConfig(riskLevel);

  // SVG Gauge calculations
  // Semi-circle arc: from -180 deg to 0 deg (or 180 to 360)
  // Radius = 90, Center = (110, 110)
  const radius = 80;
  const cx = 100;
  const cy = 95;
  const strokeWidth = 14;

  // Circumference for half circle = PI * r
  const arcLength = Math.PI * radius; // approx 251.3
  const progressLength = (cleanScore / 100) * arcLength;
  const dashOffset = arcLength - progressLength;

  // Needle angle: 0% -> -90 deg (facing left), 100% -> 90 deg (facing right)
  const needleAngle = (cleanScore / 100) * 180 - 90;

  return (
    <div className="risk-gauge-card">
      <div className="gauge-header">
        <span className="gauge-title">Overall Disruption Risk Index</span>
        <span className="gauge-subtitle">Composite Multi-Layer Score</span>
      </div>

      <div className="gauge-visual-container">
        <svg viewBox="0 0 200 120" className="gauge-svg">
          <defs>
            {/* Background Arc Gradient */}
            <linearGradient id="gaugeBgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="30%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="75%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background track (Grey outline) */}
          <path
            d="M 20 95 A 80 80 0 0 1 180 95"
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Threshold zone indicator dashes */}
          {/* 0-30 LOW */}
          <path
            d="M 20 95 A 80 80 0 0 1 180 95"
            fill="none"
            stroke="url(#gaugeBgGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength}`}
            strokeDashoffset="0"
            strokeLinecap="round"
            opacity="0.25"
          />

          {/* Active Progress Arc */}
          <path
            d="M 20 95 A 80 80 0 0 1 180 95"
            fill="none"
            stroke={config.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            filter="url(#gaugeGlow)"
            className="gauge-active-arc"
          />

          {/* Center Hub */}
          <circle cx={cx} cy={cy} r="7" fill="#0f172a" stroke={config.color} strokeWidth="3" />

          {/* Needle Indicator */}
          <g transform={`rotate(${needleAngle} ${cx} ${cy})`} className="gauge-needle-group">
            <line
              x1={cx}
              y1={cy}
              x2={cx}
              y2={cy - 68}
              stroke="#f8fafc"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx={cx} cy={cy - 68} r="3.5" fill={config.color} />
          </g>

          {/* Scale Labels */}
          <text x="18" y="112" fill="#64748b" fontSize="8" textAnchor="middle">0%</text>
          <text x="65" y="42" fill="#10b981" fontSize="7" textAnchor="middle">30%</text>
          <text x="100" y="22" fill="#f59e0b" fontSize="7" textAnchor="middle">60%</text>
          <text x="140" y="42" fill="#f97316" fontSize="7" textAnchor="middle">80%</text>
          <text x="182" y="112" fill="#ef4444" fontSize="8" textAnchor="middle">100%</text>
        </svg>

        {/* Digital Readout Box */}
        <div className="gauge-digital-readout">
          <div className="readout-number" style={{ color: config.color }}>
            {cleanScore.toFixed(1)}<span className="readout-percent">%</span>
          </div>
          <div className={`readout-level-badge ${config.badgeClass}`}>
            {riskLevel} RISK
          </div>
        </div>
      </div>

      {/* Threshold Zone Legend */}
      <div className="gauge-threshold-legend">
        <div className={`legend-zone ${riskLevel === 'LOW' ? 'active' : ''}`}>
          <span className="zone-dot bg-emerald-500" />
          <span className="zone-name">0-30 LOW</span>
        </div>
        <div className={`legend-zone ${riskLevel === 'MEDIUM' ? 'active' : ''}`}>
          <span className="zone-dot bg-amber-500" />
          <span className="zone-name">31-60 MED</span>
        </div>
        <div className={`legend-zone ${riskLevel === 'HIGH' ? 'active' : ''}`}>
          <span className="zone-dot bg-orange-500" />
          <span className="zone-name">61-80 HIGH</span>
        </div>
        <div className={`legend-zone ${riskLevel === 'CRITICAL' ? 'active' : ''}`}>
          <span className="zone-dot bg-rose-500" />
          <span className="zone-name">81-100 CRIT</span>
        </div>
      </div>
    </div>
  );
}
