# 🏭 ProdGuard AI — Production Disruption Early Warning System

> **AI-Enabled Proactive Manufacturing Intelligence Platform**  
> Built for TCS Hackathon · Powered by Gradient Boosting ML + FastAPI + React + Supabase

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.2+-61DAFB?style=flat&logo=react)](https://react.dev/)
[![React Router](https://img.shields.io/badge/React_Router-v6-CA4245?style=flat&logo=react-router)](https://reactrouter.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-ML-F7931E?style=flat&logo=scikit-learn)](https://scikit-learn.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2+-646CFF?style=flat&logo=vite)](https://vitejs.dev/)

---

## 📌 Problem Statement

Manufacturing plants currently rely on **fragmented, siloed reports** — disparate maintenance logs, supply chain spreadsheets, HR shift shortages, and QA defect logs. By the time plant managers connect the dots, machines have jammed, scrap rates have spiked, and assembly lines have halted.

**ProdGuard AI** bridges these silos by correlating **physical machine sensor telemetry** with **macro operational indicators** in real-time, delivering a **2 to 6-hour proactive intervention window** before line failure occurs.

---

## 🎯 Key Capabilities

| Capability | Description |
|---|---|
| 🤖 **Gradient Boosting Failure Predictor** | Machine Learning model predicts physical CNC failure probability from live SCADA telemetry |
| 📊 **Multi-Factor Disruption Engine** | 0–100% composite index combining machine health, supply chain lag, labor gap, quality, and backlog |
| 🗂️ **Multi-Page Modular Navigation** | Clean, uncluttered UI with dedicated routing across Dashboard, Assessment, RCA, Actions, Workflow, and History |
| ☁️ **Cloud Database (Supabase)** | PostgreSQL persistence for telemetry audit logs and incident states, with offline resilience |
| 👥 **Role-Based Persona Lenses** | Personalized operational views for Plant Managers, Line Supervisors, and Maintenance Leads |
| 🎯 **Automated Root Cause Triage** | Instant threshold-based RCA identifying primary and secondary disruption drivers |
| ✅ **Prescriptive Action SOPs** | Interactive mitigation checklists prioritized from P1 (Immediate) to P4 (Standard) |
| 🔄 **5-Stage Incident Escalation** | Full lifecycle tracking: Detected → Analyzed → Action Assigned → In Progress → Resolved |

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 19 + Vite 8)                    │
│   Modular Multi-Page Routing via React Router v6                      │
│                                                                        │
│   /dashboard      /predict       /root-causes   /actions  /workflow    │
│   ┌─────────────┐ ┌────────────┐ ┌────────────┐ ┌───────┐ ┌──────────┐ │
│   │Overview KPIs│ │Dual-Layer  │ │Ranked RCA  │ │SOP    │ │5-Stage   │ │
│   │Risk Gauge   │ │Telemetry   │ │AI Natural  │ │Task   │ │Incident  │ │
│   │Factor Radar │ │Form        │ │Explanation │ │List   │ │Workflow  │ │
│   └─────────────┘ └────────────┘ └────────────┘ └───────┘ └──────────┘ │
└───────────────────────┬───────────────────────────────┬────────────────┘
                        │ HTTP POST /predict            │ Cloud Database Sync
                        │ JSON Telemetry                │ Real-time SQL (PostgREST)
                        ▼                               ▼
┌───────────────────────────────────────┐   ┌────────────────────────────┐
│         BACKEND (FastAPI + ML)        │   │    DATABASE (Supabase)     │
│                                       │   │                            │
│  Pydantic Schema Validation           │   │  • prediction_history      │
│  → Scikit-Learn Gradient Boosting ML  │   │  • workflow_incidents      │
│  → Multi-Factor Disruption Engine     │   │  • Row-Level Security      │
│  → Dynamic RCA & Action Matcher       │   │  • Real-time Audit Trail   │
└───────────────────────────────────────┘   └────────────────────────────┘
```

---

## 🧠 AI & ML Engine

### 1. Machine Failure Probability (GBM Classifier)
- **Algorithm:** `sklearn.ensemble.GradientBoostingClassifier`
- **Trained on:** Physical sensor telemetry (Machine Type, Air Temp, Process Temp, RPM, Torque, Tool Wear).
- **Output:** \(P(\text{Machine Failure}) \in [0.0, 1.0]\).
- **Advantage:** Captures complex, non-linear thermal-mechanical interactions (e.g. high torque coupled with cumulative tool wear accelerates breakdown exponentially).

### 2. Multi-Factor Disruption Risk Formula
```
Disruption Risk = 0.40 × Machine_Risk
                + 0.20 × Material_Delay_Risk
                + 0.15 × Workforce_Shortage_Risk
                + 0.15 × Quality_Defect_Risk
                + 0.10 × Backlog_Pressure_Risk
```

### 3. Risk Level Classifications
| Score Range | Risk Level | Operational State | Protocol |
|---|---|---|---|
| 0 – 30% | 🟢 **LOW** | Nominal Operations | Routine SCADA Monitoring |
| 31 – 60% | 🟡 **MEDIUM** | Emerging Anomaly | Preventive Review |
| 61 – 80% | 🟠 **HIGH** | Severe Threat | Supervisor Intervention |
| 81 – 100% | 🔴 **CRITICAL** | Emergency Disruption | Immediate Line Escalation |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.2+ | Component UI Framework |
| **Vite** | 8.2+ | Fast Build Tool & Dev Server |
| **React Router** | 6.30+ | Multi-Page Client-side Routing |
| **@supabase/supabase-js** | Latest | Cloud Database Client |
| **Recharts** | 3.10+ | Responsive Industrial Data Visualizations |
| **Lucide React** | 1.34+ | Industrial SVG Icon Library |
| **CSS3 Theme** | Custom | Industrial Cyber-Physical Dark Theme |

### Backend & Database
| Technology | Version | Purpose |
|---|---|---|
| **FastAPI** | 0.115+ | High-Performance REST API |
| **Uvicorn** | 0.49+ | Production ASGI Web Server |
| **Python** | 3.10+ | ML Inference Runtime |
| **Scikit-Learn** | 1.4+ | Gradient Boosting Classifier |
| **Pandas & Joblib** | Latest | Feature Transformations & Model Serialization |
| **Supabase** | Cloud | Managed PostgreSQL Database & Auth |

---

## 📂 Project Structure

```
prodguard-ai/                           ← Frontend Application Root
├── index.html
├── package.json
├── vite.config.js
├── supabase_schema.sql                 ← Supabase database setup script
└── src/
    ├── App.jsx                         ← Router configuration & state sync
    ├── main.jsx
    ├── index.css                       ← Industrial dark CSS design system
    ├── pages/                          ← Modular Multi-Page Views
    │   ├── Dashboard.jsx               ← KPIs, Risk Gauge, Factor Radar
    │   ├── Prediction.jsx              ← Sensor telemetry input form
    │   ├── RootCausesPage.jsx          ← RCA rankings + AI explanations
    │   ├── ActionsPage.jsx             ← Prescriptive mitigation checklist
    │   ├── WorkflowPage.jsx            ← Incident escalation lifecycle
    │   └── HistoryPage.jsx             ← Historical trajectory & audit log
    ├── components/                     ← Shared Reusable UI Components
    │   ├── Sidebar.jsx                 ← Router navigation + API status
    │   ├── Header.jsx                  ← Persona switcher + preset selector
    │   ├── RoleBanner.jsx              ← Stakeholder-specific guidance
    │   ├── RiskCards.jsx               ← 4 primary KPI metric tiles
    │   ├── AlertCenter.jsx             ← Risk-adaptive advisory banners
    │   ├── PredictionForm.jsx          ← Dual-layer sensor controls
    │   ├── RiskGauge.jsx               ← Custom SVG radial arc gauge
    │   ├── RiskCharts.jsx              ← Factor composition charts
    │   ├── RootCauses.jsx              ← Ranked bottleneck cards
    │   ├── RecommendedActions.jsx      ← SOP checklist with progress bar
    │   ├── AIExplanation.jsx           ← NLG narrative engine
    │   ├── WorkflowPanel.jsx           ← Incident stages & team assignment
    │   └── PredictionHistory.jsx       ← Cloud/local audit trail table
    ├── services/
    │   ├── api.js                      ← FastAPI client (POST /predict)
    │   └── supabase.js                 ← Supabase PostgreSQL client & queries
    └── utils/
        ├── riskUtils.js                ← Formula definitions & local fallback
        └── presets.js                  ← 4 pre-calibrated industrial scenarios

ml-service/                             ← Backend Application Root
├── app.py                              ← FastAPI service + Disruption engine
├── train_model.py                      ← Scikit-Learn training pipeline
├── gradient_boosting_model.pkl         ← Pretrained Gradient Boosting model
└── model_features.pkl                  ← One-Hot Encoded feature signature
```

---

## 🚀 Getting Started

### Prerequisites
- **Python** 3.10+
- **Node.js** 18+ and **npm** 9+
- A free **Supabase** project account

---

### 1. Database Setup (Supabase)
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) and open the **SQL Editor**.
2. Copy and run the contents of [`supabase_schema.sql`](./supabase_schema.sql).
3. Tables `prediction_history` and `workflow_incidents` will be created with Row-Level Security (RLS) configured for instant prototyping.

---

### 2. Start the Backend ML Service

```bash
# Navigate to the backend directory
cd ml-service

# Install Python requirements
pip install fastapi uvicorn scikit-learn pandas joblib pydantic

# Launch the FastAPI server
python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```

- Backend API: `http://127.0.0.1:8000`
- Interactive Swagger Documentation: `http://127.0.0.1:8000/docs`

---

### 3. Start the Frontend Dashboard

```bash
# In a new terminal, navigate to the frontend directory
cd prodguard-ai

# Install Node dependencies
npm install

# Start Vite dev server
npm start
```

- Access the Dashboard at: **`http://localhost:5173`**

---

## 📡 API Reference

### `POST /predict`
Submits machine telemetry and plant parameters for disruption scoring.

**Request Payload:**
```json
{
  "Type": "M",
  "air_temperature": 300.5,
  "process_temperature": 310.2,
  "rotational_speed": 1500,
  "torque": 45.0,
  "tool_wear": 180,
  "material_delay": 90.0,
  "workforce_constraint": 18.0,
  "quality_issue_rate": 7.0,
  "production_backlog": 220.0
}
```

**Response Payload:**
```json
{
  "machine_failure_probability": 3.0,
  "overall_disruption_risk": 22.86,
  "risk_level": "LOW",
  "priority_score": 29.2,
  "root_causes": [
    "Material delay of 90.0 minutes",
    "Workforce shortage of 18.0%",
    "High quality issue rate (7.0%)",
    "High production backlog (220.0 units)"
  ],
  "recommended_actions": [
    "Contact supplier and arrange alternative material availability.",
    "Reallocate workforce or arrange additional shift support.",
    "Perform immediate quality inspection and process calibration.",
    "Prioritize critical orders and rebalance production capacity."
  ]
}
```

---

## 🎭 Pre-Calibrated Demo Scenarios

Quickly simulate real plant conditions using the **"Load Preset Scenarios"** dropdown:

| Scenario | Primary Trigger | Expected Risk Level |
|---|---|---|
| 🟢 **Nominal Operations** | Balanced physical telemetry, minimal delays | **LOW** |
| 🟡 **Supply Chain Crunch** | 90m material delay + 220-unit queue backlog | **MEDIUM** |
| 🟠 **Mechanical Tool Wear** | 180-min tool degradation, high torque load | **HIGH** |
| 🔴 **Compound Multi-Crisis** | Concurrently high torque, labor loss, and material shortage | **CRITICAL** |

---

## 📄 License

This project is licensed under the MIT License for prototype and academic evaluation purposes.
