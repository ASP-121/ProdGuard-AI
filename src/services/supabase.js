import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hyzvnxzikwdrfjfsikhz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5enZueHppa3dkcmZqZnNpa2h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MjE1NjAsImV4cCI6MjEwMzk5NzU2MH0.uzaUKDe1tQW28-4X_-QMlZEknzyr8Qpm23JLS-NdHG4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Save prediction run to Supabase
 */
export async function savePredictionToDb(item) {
  try {
    const payload = {
      time: item.time,
      date: item.date,
      machine_type: item.machine_type || item.Type || 'M',
      risk_score: item.risk_score ?? item.overall_disruption_risk,
      risk_level: item.risk_level,
      priority_score: item.priority_score,
      machine_failure_probability: item.machine_failure_probability,
      input_data: item.input_data || {}
    };

    const { data, error } = await supabase
      .from('prediction_history')
      .insert([payload])
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (err) {
    console.warn('Supabase save prediction error:', err.message);
    return null;
  }
}

/**
 * Fetch latest prediction runs from Supabase
 */
export async function fetchHistoryFromDb(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('prediction_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data.map(item => ({
      ...item,
      Type: item.machine_type,
      overall_disruption_risk: item.risk_score
    }));
  } catch (err) {
    console.warn('Supabase fetch history error:', err.message);
    return null;
  }
}

/**
 * Delete all prediction history from Supabase
 */
export async function clearHistoryFromDb() {
  try {
    const { error } = await supabase
      .from('prediction_history')
      .delete()
      .neq('id', 0); // Deletes all rows

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Supabase clear history error:', err.message);
    return false;
  }
}

/**
 * Save current workflow state to Supabase
 */
export async function saveWorkflowToDb(workflow) {
  try {
    const { data, error } = await supabase
      .from('workflow_incidents')
      .upsert({
        incident_id: workflow.incidentId || 'INC-1042',
        current_stage: workflow.currentStage,
        assigned_team: workflow.assignedTeam,
        notes: workflow.notes || '',
        escalated: Boolean(workflow.escalated),
        last_updated: workflow.lastUpdated || new Date().toLocaleTimeString()
      }, { onConflict: 'incident_id' })
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (err) {
    console.warn('Supabase save workflow error:', err.message);
    return null;
  }
}

/**
 * Fetch latest workflow state from Supabase
 */
export async function fetchWorkflowFromDb(incidentId = 'INC-1042') {
  try {
    const { data, error } = await supabase
      .from('workflow_incidents')
      .select('*')
      .eq('incident_id', incidentId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      incidentId: data.incident_id,
      currentStage: data.current_stage,
      assignedTeam: data.assigned_team,
      notes: data.notes || '',
      escalated: data.escalated,
      lastUpdated: data.last_updated
    };
  } catch (err) {
    console.warn('Supabase fetch workflow error:', err.message);
    return null;
  }
}
