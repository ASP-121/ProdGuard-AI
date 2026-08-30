import React from 'react';
import RootCauses from '../components/RootCauses';
import AIExplanation from '../components/AIExplanation';

export default function RootCausesPage({ predictionResult, formData, activeRole }) {
  return (
    <>
      <RootCauses
        predictionResult={predictionResult}
      />
      <AIExplanation
        inputData={formData}
        predictionResult={predictionResult}
        activeRole={activeRole}
      />
    </>
  );
}
