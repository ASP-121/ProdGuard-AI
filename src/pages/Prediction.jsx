import React from 'react';
import PredictionForm from '../components/PredictionForm';

export default function Prediction({ formData, setFormData, onSubmit, loading, error, lastAnalyzedTime }) {
  return (
    <>
      <PredictionForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        loading={loading}
        error={error}
        lastAnalyzedTime={lastAnalyzedTime}
      />
    </>
  );
}