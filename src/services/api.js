/**
 * ProdGuard AI - API Service
 * Handles communication with the FastAPI backend endpoint.
 */

const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Sends machine and operational telemetry to FastAPI backend for risk prediction.
 * @param {Object} data - Input payload matching FastAPI schema
 * @returns {Promise<Object>} Backend response
 */
export async function predictProductionRisk(data) {
  try {
    const payload = {
      Type: String(data.Type || 'M'),
      air_temperature: parseFloat(data.air_temperature),
      process_temperature: parseFloat(data.process_temperature),
      rotational_speed: parseInt(data.rotational_speed, 10),
      torque: parseFloat(data.torque),
      tool_wear: parseInt(data.tool_wear, 10),
      material_delay: parseFloat(data.material_delay),
      workforce_constraint: parseFloat(data.workforce_constraint),
      quality_issue_rate: parseFloat(data.quality_issue_rate),
      production_backlog: parseFloat(data.production_backlog)
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`Prediction API error (${response.status}): ${errorText || response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Prediction request timed out. Please check if the FastAPI backend is responsive.');
    }
    console.error('API Error in predictProductionRisk:', error);
    throw error;
  }
}

/**
 * Simple health check to verify if the FastAPI server is reachable.
 * @returns {Promise<boolean>}
 */
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Type: 'M',
        air_temperature: 300.0,
        process_temperature: 310.0,
        rotational_speed: 1500,
        torque: 40.0,
        tool_wear: 100,
        material_delay: 10,
        workforce_constraint: 5,
        quality_issue_rate: 2,
        production_backlog: 50
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}
