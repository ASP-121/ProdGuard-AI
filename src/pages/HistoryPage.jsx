import React from 'react';
import PredictionHistoryChart from '../components/PredictionHistoryChart';
import PredictionHistory from '../components/PredictionHistory';

export default function HistoryPage({ history, onClearHistory, onLoadHistoryItem }) {
  return (
    <div className="history-section-wrapper">
      <PredictionHistoryChart history={history} />
      <PredictionHistory
        history={history}
        onClearHistory={onClearHistory}
        onLoadHistoryItem={onLoadHistoryItem}
      />
    </div>
  );
}