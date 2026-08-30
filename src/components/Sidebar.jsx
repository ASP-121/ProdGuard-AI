// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  SlidersHorizontal, 
  AlertTriangle, 
  CheckSquare, 
  Bot, 
  GitPullRequest, 
  History, 
  Activity, 
  Layers, 
  ShieldCheck, 
  Server
} from 'lucide-react';

export default function Sidebar({ backendConnected }) {
  // We swapped the "id" for the URL "path" that we defined in App.jsx
  const navItems = [
    { path: '/dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { path: '/predict', label: 'Risk Assessment', icon: SlidersHorizontal },
    { path: '/root-causes', label: 'Root Causes & Explanations', icon: AlertTriangle },
    { path: '/actions', label: 'Recommended Actions', icon: CheckSquare },
    { path: '/workflow', label: 'Workflow & Escalation', icon: GitPullRequest },
    { path: '/history', label: 'Prediction History', icon: History }
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-icon-wrapper">
          <Layers className="brand-icon" />
        </div>
        <div className="brand-text">
          <div className="brand-title">ProdGuard AI</div>
          <div className="brand-tagline">Early Warning System</div>
        </div>
      </div>

      {/* Backend Status Pill */}
      <div className="sidebar-status-box">
        <div className="status-row">
          <span className="status-label">
            <Server size={14} className="status-icon" /> Backend API
          </span>
          <span className={`status-indicator ${backendConnected ? 'online' : 'offline'}`}>
            <span className="indicator-dot"></span>
            {backendConnected ? '127.0.0.1:8000' : 'Connecting...'}
          </span>
        </div>
        <div className="status-sub">
          <ShieldCheck size={13} className="sub-icon text-emerald-400" />
          <span>Gradient Boosting ML Engine</span>
        </div>
      </div>

      {/* Navigation updated to use NavLink */}
      <nav className="sidebar-nav">
        <div className="nav-group-title">COMMAND CENTER</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                  {isActive && <span className="active-glow-bar" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Demo Badge & System Footer */}
      <div className="sidebar-footer">
        <div className="demo-notice-badge">
          <Activity size={12} />
          <span>Demo Mode · Local Prototype</span>
        </div>
        <p className="footer-subtext">
          AI-Enabled Production Disruption Early Warning System
        </p>
      </div>
    </aside>
  );
}