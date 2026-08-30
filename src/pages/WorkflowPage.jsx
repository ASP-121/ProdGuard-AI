import React from 'react';
import WorkflowPanel from '../components/WorkflowPanel';

export default function WorkflowPage({ workflowState, setWorkflowState, predictionResult, onSaveWorkflow }) {
  return (
    <>
      <WorkflowPanel
        workflowState={workflowState}
        setWorkflowState={setWorkflowState}
        predictionResult={predictionResult}
        onSaveWorkflow={onSaveWorkflow}
      />
    </>
  );
}