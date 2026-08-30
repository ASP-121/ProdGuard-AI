import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Briefcase, 
  Users, 
  Wrench, 
  Clock, 
  Sparkles, 
  Factory,
  ChevronDown
} from 'lucide-react';
import { PRESETS } from '../utils/presets';
import { ROLES } from '../utils/riskUtils';

export default function Header({ 
  activeRole, 
  setActiveRole, 
  onSelectPreset, 
  onRunAnalysis, 
  loading,
  riskLevel 
}) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const roleIcons = {
    manager: Briefcase,
    supervisor: Users,
    maintenance: Wrench
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-title-block">
          <div className="flex items-center gap-2">
            <h1 className="header-title">Manufacturing Operations Intelligence</h1>
            <span className="live-plant-badge">
              <span className="live-dot"></span> Line 4 · Unit B
            </span>
          </div>
        </div>
      </div>

      <div className="header-right">
        {/* Role Lens Switcher */}
        <div className="role-switcher-container">
          <span className="role-label">VIEW LENS:</span>
          <div className="role-pill-group">
            {ROLES.map((role) => {
              const Icon = roleIcons[role.id] || Factory;
              const isActive = activeRole === role.id;
              return (
                <button
                  key={role.id}
                  className={`role-pill-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveRole(role.id)}
                  title={role.tagline}
                >
                  <Icon size={14} />
                  <span>{role.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Presets Dropdown */}
        <div className="preset-dropdown-wrapper">
          <button 
            className="preset-dropdown-btn"
            onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
          >
            <Sparkles size={14} className="text-amber-400" />
            <span>Load Preset Scenarios</span>
            <ChevronDown size={14} />
          </button>

          {presetDropdownOpen && (
            <div className="preset-dropdown-menu">
              <div className="preset-menu-header">DEMO SCENARIOS</div>
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  className="preset-menu-item"
                  onClick={() => {
                    onSelectPreset(preset);
                    setPresetDropdownOpen(false);
                  }}
                >
                  <div className="preset-item-title-row">
                    <span className="preset-item-name">{preset.name}</span>
                    <span className={`preset-item-tag ${preset.badgeClass}`}>{preset.tag}</span>
                  </div>
                  <div className="preset-item-desc">{preset.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Run Analysis Action */}
        <button
          className="btn-primary-action"
          onClick={onRunAnalysis}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner-sm" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Play size={16} fill="currentColor" />
              <span>Run Analysis</span>
            </>
          )}
        </button>

        {/* Live Plant Clock */}
        <div className="plant-clock">
          <Clock size={14} className="clock-icon" />
          <span>{time}</span>
        </div>
      </div>
    </header>
  );
}
