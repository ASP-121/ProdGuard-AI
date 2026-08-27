import React from 'react';
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

export default function Sidebar({ activeSection, setActiveSection, backendConnected }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'assessment', label: 'Risk Assessment', icon: SlidersHorizontal },
    { id: 'prioritization', label: 'Risk Prioritization', icon: AlertTriangle },
    { id: 'actions', label: 'Recommended Actions', icon: CheckSquare },
    { id: 'explanation', label: 'AI Explanation', icon: Bot },
    { id: 'workflow', label: 'Workflow & Escalation', icon: GitPullRequest },
    { id: 'history', label: 'Prediction History', icon: History }
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside className="app-sidebar">
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

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-group-title">COMMAND CENTER</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => scrollToSection(item.id)}
            >
              <Icon size={18} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
              {isActive && <span className="active-glow-bar" />}
            </button>
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
