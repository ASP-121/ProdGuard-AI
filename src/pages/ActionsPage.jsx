import React from 'react';
import RecommendedActions from '../components/RecommendedActions';

export default function ActionsPage({ predictionResult, actionStatuses, onUpdateActionStatus, onResetActions }) {
  return (
    <>
      <RecommendedActions
        recommendedActions={predictionResult?.recommended_actions}
        actionStatuses={actionStatuses}
        onUpdateActionStatus={onUpdateActionStatus}
        onResetActions={onResetActions}
      />
    </>
  );
}