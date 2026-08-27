import React from 'react';
import { 
  Briefcase, 
  Users, 
  Wrench, 
  Sparkles, 
  Target, 
  ShieldAlert, 
  CheckCircle2 
} from 'lucide-react';
import { ROLES, generateNaturalLanguageExplanation } from '../utils/riskUtils';

export default function RoleBanner({ activeRole, predictionResult, inputData }) {
  const currentRole = ROLES.find(r => r.id === activeRole) || ROLES[0];
  const { roleInsight } = generateNaturalLanguageExplanation(inputData, predictionResult, activeRole);

  const roleIcons = {
    manager: Briefcase,
    supervisor: Users,
    maintenance: Wrench
  };
  const Icon = roleIcons[activeRole] || Briefcase;

  return (
    <div className={`role-perspective-banner role-${activeRole}`}>
      <div className="role-banner-left">
        <div className="role-badge-icon">
          <Icon size={20} />
        </div>
        <div className="role-banner-text">
          <div className="role-banner-title-row">
            <span className="role-perspective-tag">PERSONA LENS:</span>
            <h2 className="role-perspective-name">{currentRole.label}</h2>
            <span className="role-tagline">{currentRole.tagline}</span>
          </div>
          <p className="role-insight-text">
            {roleInsight}
          </p>
        </div>
      </div>

      <div className="role-banner-right">
        <div className="role-focus-pills">
          <span className="focus-header">Key Priority Lenses:</span>
          <div className="focus-pill-list">
            {currentRole.focusMetrics.map((metric, i) => (
              <span key={i} className="focus-metric-pill">
                <Target size={12} className="pill-bullet" />
                {metric}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
