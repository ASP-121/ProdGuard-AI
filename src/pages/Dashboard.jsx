import React from 'react';
import RoleBanner from '../components/RoleBanner';
import AlertCenter from '../components/AlertCenter';
import RiskCards from '../components/RiskCards';
import RiskGauge from '../components/RiskGauge';
import RiskCharts from '../components/RiskCharts';

export default function Dashboard({ activeRole, predictionResult, formData }) {
  return (
    <>
      <RoleBanner
        activeRole={activeRole}
        predictionResult={predictionResult}
        inputData={formData}
      />

      <AlertCenter predictionResult={predictionResult} />

      <div className="dashboard-overview-anchor">
        <RiskCards
          predictionResult={predictionResult}
          activeRole={activeRole}
        />
      </div>

      <div className="overview-visuals-grid">
        <div className="gauge-column">
          <RiskGauge
            score={predictionResult?.overall_disruption_risk}
            riskLevel={predictionResult?.risk_level}
          />
        </div>
        <div className="charts-column">
          <RiskCharts
            inputData={formData}
            predictionResult={predictionResult}
          />
        </div>
      </div>
    </>
  );
}