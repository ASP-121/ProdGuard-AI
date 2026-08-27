/**
 * Manufacturing Telemetry Presets for Demo & Simulation
 */

export const PRESETS = [
  {
    id: 'nominal',
    name: 'Nominal Operations',
    tag: 'Stable Shift',
    badgeClass: 'badge-low',
    description: 'All parameters within optimal operating envelopes. Baseline production conditions.',
    data: {
      Type: 'M',
      air_temperature: 300.0,
      process_temperature: 310.0,
      rotational_speed: 1500,
      torque: 40.0,
      tool_wear: 60,
      material_delay: 15,
      workforce_constraint: 5,
      quality_issue_rate: 2,
      production_backlog: 50
    }
  },
  {
    id: 'supply_crunch',
    name: 'Supply Chain & Backlog Spike',
    tag: 'Operational Delay',
    badgeClass: 'badge-medium',
    description: 'Inbound component delay triggering production queue accumulation and line rebalancing needs.',
    data: {
      Type: 'M',
      air_temperature: 300.5,
      process_temperature: 310.2,
      rotational_speed: 1500,
      torque: 45.0,
      tool_wear: 180,
      material_delay: 90,
      workforce_constraint: 18,
      quality_issue_rate: 7,
      production_backlog: 220
    }
  },
  {
    id: 'mechanical_strain',
    name: 'Tool Wear & Thermal Strain',
    tag: 'Machine Failure Imminent',
    badgeClass: 'badge-high',
    description: 'High torque load, elevated spindle speed, and severe tool wear exceeding standard thresholds.',
    data: {
      Type: 'H',
      air_temperature: 304.2,
      process_temperature: 313.8,
      rotational_speed: 2550,
      torque: 66.0,
      tool_wear: 235,
      material_delay: 40,
      workforce_constraint: 12,
      quality_issue_rate: 8.5,
      production_backlog: 160
    }
  },
  {
    id: 'compound_crisis',
    name: 'Critical Multi-Factor Crisis',
    tag: 'Compound Disruption',
    badgeClass: 'badge-critical',
    description: 'Simultaneous mechanical wear, critical material starvation, high scrap rate, and heavy workforce absenteeism.',
    data: {
      Type: 'L',
      air_temperature: 303.5,
      process_temperature: 312.9,
      rotational_speed: 2400,
      torque: 64.0,
      tool_wear: 220,
      material_delay: 150,
      workforce_constraint: 40,
      quality_issue_rate: 15.0,
      production_backlog: 420
    }
  }
];
