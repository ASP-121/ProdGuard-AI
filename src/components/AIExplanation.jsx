import React from 'react';
import { 
  Bot, 
  Sparkles, 
  Compass, 
  Lightbulb, 
  ArrowRight, 
  Layers, 
  Clock,
  ShieldCheck,
  CheckCircle2,
  GitMerge
} from 'lucide-react';
import { generateNaturalLanguageExplanation, getRiskConfig } from '../utils/riskUtils';

export default function AIExplanation({ inputData, predictionResult, activeRole }) {
  if (!predictionResult) return null;

  const { whyExplanation, nextStep, roleInsight } = generateNaturalLanguageExplanation(
    inputData,
    predictionResult,
    activeRole
  );

  const { risk_level = 'LOW' } = predictionResult;
  const config = getRiskConfig(risk_level);

  return (
    <div className="section-card ai-explanation-section" id="explanation">
      <div className="card-header-row">
        <div>
          <div className="flex items-center gap-2">
            <Bot size={22} className="text-cyan-400" />
            <h2 className="section-title">Natural Language AI Synthesis & Operational Reasoning</h2>
          </div>
          <p className="section-subtitle">
            Automated multi-vector diagnostic explanation replacing fragmented siloed reports with clear proactive narrative.
          </p>
        </div>

        <div className="ai-engine-pill">
          <Sparkles size={13} className="text-amber-400" />
          <span>Rule & ML Synthesis Engine</span>
        </div>
      </div>

      <div className="explanation-cards-grid">
        {/* CARD 1: WHY IS THIS HAPPENING */}
        <div className="explanation-card why-card">
          <div className="explanation-card-header">
            <div className="flex items-center gap-2">
              <div className="icon-circle icon-cyan">
                <Lightbulb size={18} />
              </div>
              <h3 className="card-heading-title">Why is this happening?</h3>
            </div>
            <span className={`status-badge-inline ${config.badgeClass}`}>
              {risk_level} Posture
            </span>
          </div>

          <div className="explanation-body-text">
            <p>{whyExplanation}</p>
          </div>

          <div className="silo-breakdown-strip">
            <div className="silo-tag">
              <GitMerge size={12} className="text-blue-400" />
              <span>Unified 4 Silos: SCADA + ERP + HR + QA</span>
            </div>
          </div>
        </div>

        {/* CARD 2: RECOMMENDED NEXT STEP */}
        <div className="explanation-card next-step-card">
          <div className="explanation-card-header">
            <div className="flex items-center gap-2">
              <div className="icon-circle icon-amber">
                <Compass size={18} />
              </div>
              <h3 className="card-heading-title">Recommended Next Step</h3>
            </div>
            <span className="priority-pulse-tag">Actionable Directive</span>
          </div>

          <div className="explanation-body-text">
            <p className="next-step-highlight">{nextStep}</p>
          </div>

          <div className="role-lens-footnote">
            <span className="role-lens-title">Active Persona Lens Perspective:</span>
            <p className="role-lens-content">{roleInsight}</p>
          </div>
        </div>
      </div>

      {/* PROACTIVE VS REACTIVE VALUE CALLOUT */}
      <div className="proactive-callout-box">
        <div className="callout-icon">
          <Clock size={20} className="text-purple-400" />
        </div>
        <div className="callout-text">
          <h4 className="callout-title">Proactive Early-Warning vs. Fragmented Post-Mortem Reports</h4>
          <p className="callout-desc">
            Traditional manufacturing operations react only after line stoppage or scrap bin accumulation. 
            ProdGuard AI continuously combines predictive machine degradation with operational constraints to grant a <strong className="text-purple-300">2 to 6-hour proactive remediation horizon</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
