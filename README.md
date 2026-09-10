# 🏭 ProdGuard AI — Production Disruption Early Warning System

> **AI-Enabled Proactive Manufacturing Intelligence Platform**  
> Built for TCS Hackathon · Powered by Gradient Boosting ML + FastAPI + React

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.2+-61DAFB?style=flat&logo=react)](https://react.dev/)
[![React Router](https://img.shields.io/badge/React_Router-v6-CA4245?style=flat&logo=react-router)](https://reactrouter.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-ML-F7931E?style=flat&logo=scikit-learn)](https://scikit-learn.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2+-646CFF?style=flat&logo=vite)](https://vitejs.dev/)

---

## 📌 Problem Statement

Manufacturing plants currently rely on **fragmented, siloed reports** — disparate maintenance logs, supply chain spreadsheets, HR shift shortage notices, and QA scrap reports. By the time plant supervisors connect these indicators, tooling has broken, queue backlogs have piled up, and assembly lines have stopped.

**ProdGuard AI** bridges this gap by unifying **physical machine SCADA telemetry** with **macro operational indicators** in real time, delivering a **2 to 6-hour proactive intervention window** before production disruptions occur.

---

## 🎯 Key Capabilities

| Capability | Description |
|---|---|
| 🤖 **Gradient Boosting Failure Predictor** | Machine Learning model predicting CNC machine failure probability from live physical sensor telemetry |
| 📊 **Multi-Factor Disruption Engine** | 0–100% composite disruption index combining machine health, supply chain lag, labor gap, quality, and queue backlog |
| 🗂️ **Multi-Page Modular Navigation** | Clean, responsive UI with dedicated routes across Dashboard, Assessment, RCA, Actions, Workflow, and History |
| 👥 **Role-Based Persona Lenses** | Tailored operational lenses for Plant Managers, Line Supervisors, and Maintenance Leads |
| 🎯 **Automated Root Cause Triage** | Instant threshold-based RCA identifying primary and secondary operational bottlenecks |
| ✅ **Prescriptive Action SOPs** | Interactive mitigation checklists prioritized from P1 (Immediate) to P4 (Standard) with progress tracking |
| 🔄 **5-Stage Incident Escalation** | Full incident lifecycle management: Detected → Analyzed → Action Assigned → In Progress → Resolved |
| 📈 **Audit Trail & History Replay** | Session-persisted prediction history with 1-click telemetry reload and trajectory charts |

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
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP POST /predict
                                    │ JSON Telemetry Payload
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        BACKEND (FastAPI + ML Engine)                   │
│                                                                        │
│  Pydantic Schema Validation → Scikit-Learn Gradient Boosting ML        │
│  → Multi-Factor Disruption Engine → Dynamic RCA & Action Matcher       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🧠 AI & ML Engine: Two-Tier Architecture

ProdGuard AI separates physical machine physics from overall plant disruptions through a **two-tier architecture**:

```
[ Tier 1: Physical Machine Model (GBM) ]
Air Temp, Process Temp, Rotational Speed, Torque, Tool Wear, Machine Type
                           │
                           ▼ (100% Sensor Telemetry)
               Machine Failure Probability
                           │
                           ▼ (Weighted at 40%)
┌─────────────────────────────────────────────────────────────┐
│          Tier 2: Multi-Factor Disruption Engine             │
│                                                             │
│   40%  Machine Health (from ML Model)                       │
│   20%  Material Delay (Supply Chain Lag)                    │
│   15%  Workforce Shortage (Labor Deficit)                   │
│   15%  Quality Issue Rate (Scrap / Rework)                  │
│   10%  Production Backlog (Queue Stress)                    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
             Overall Disruption Risk (0 - 100%)
```

### 1. Gradient Boosting Classifier (scikit-learn)
- **Inputs:** Machine Type, Air Temperature, Process Temperature, Rotational Speed (RPM), Torque, Tool Wear.
- **Output:** $P(\text{Machine Failure}) \in [0.0, 1.0]$
- **Physical Failure Modes Captured:**
  - **Heat Dissipation Failure (HDF):** Driven by process and air temperature difference ($\Delta T$).
  - **Power Failure (PWF):** Driven by torque and rotational speed product ($P = \tau \times \omega$).
  - **Overstrain Failure (OSF):** Resulting from high torque on degraded cutting tools.
  - **Tool Wear Failure (TWF):** Cumulative tooling degradation past critical wear limits.

### 2. Multi-Factor Disruption Formula
$$\begin{aligned}
\text{Overall Risk} = &\ \mathbf{0.40} \times \text{Machine Risk (from ML Model)} \\
&+ \mathbf{0.20} \times \text{Material Delay Risk} \\
&+ \mathbf{0.15} \times \text{Workforce Shortage Risk} \\
&+ \mathbf{0.15} \times \text{Quality Defect Risk} \\
&+ \mathbf{0.10} \times \text{Production Backlog Risk}
\end{aligned}$$

### 3. Risk Level Classifications
| Score Range | Risk Level | Operational State | Protocol |
|---|---|---|---|
| 0 – 30% | 🟢 **LOW** | Nominal Operations | Routine SCADA Monitoring |
| 31 – 60% | 🟡 **MEDIUM** | Emerging Anomaly | Preventive Review & Buffer Verification |
| 61 – 80% | 🟠 **HIGH** | Severe Threat | Shift Supervisor Intervention |
| 81 – 100% | 🔴 **CRITICAL** | Emergency Disruption | Immediate Line Escalation & Maintenance Triage |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.2+ | Component-Based UI Framework |
| **Vite** | 8.2+ | Fast Build Tool & Hot-Module Reloading Dev Server |
| **React Router** | 6.30+ | Multi-Page Client-Side Application Routing |
| **Recharts** | 3.10+ | Responsive Data Visualizations (Bar, Radar, Area) |
| **Lucide React** | 1.34+ | Industrial SVG Icon System |
| **CSS3 Theme** | Custom | Industrial Cyber-Physical Dark Theme |
| **localStorage API** | Web API | Zero-config client-side state persistence |

### Backend & Machine Learning
| Technology | Version | Purpose |
|---|---|---|
| **FastAPI** | 0.115+ | High-Performance Asynchronous REST API |
| **Uvicorn** | 0.49+ | Production ASGI Server |
| **Python** | 3.10+ | Backend Runtime |
| **Scikit-Learn** | 1.4+ | Gradient Boosting ML Classifier |
| **Pandas** | Latest | Tabular Feature Engineering & Alignment |
| **Pydantic** | v2 | Request/Response Data Validation |
| **Joblib** | Latest | Model Serialization & Loading |

---

## 📂 Project Structure

```
prodguard-ai/                           ← Frontend Application Root
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx                         ← Router configuration & state management
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
    │   └── PredictionHistory.jsx       ← Audit trail history table
    ├── services/
    │   └── api.js                      ← FastAPI client (POST /predict)
    └── utils/
        ├── riskUtils.js                ← Risk formulas, NLG logic & local persistence
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

---

### 1. Start the Backend (FastAPI ML Service)

```bash
# Navigate to the backend directory
cd ml-service

# Install Python requirements
pip install fastapi uvicorn scikit-learn pandas joblib pydantic

# Launch the FastAPI server
python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```

- Backend API: `http://127.0.0.1:8000`
- Interactive API Documentation: `http://127.0.0.1:8000/docs`

---

### 2. Start the Frontend (React Dashboard)

```bash
# In a new terminal, navigate to the frontend directory
cd prodguard-ai

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

- Access the Dashboard at: **`http://localhost:5173`**

---

## 📡 API Reference

### `POST /predict`
Evaluates physical machine telemetry alongside operational metrics to generate risk scores, root causes, and prescriptive actions.

**Request Body:**
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

**Response Body:**
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

## 🎭 Pre-Calibrated Demo Presets

Click **"Load Preset Scenarios"** in the top navigation to immediately demonstrate how the system responds to different plant conditions:

| Scenario | Trigger Factors | Expected Risk Level |
|---|---|---|
| 🟢 **Nominal Operations** | Balanced physical telemetry, standard production tolerances | **LOW** |
| 🟡 **Supply Chain Crunch** | 90-minute inbound material lag, high backlog buildup | **MEDIUM** |
| 🟠 **Mechanical Tool Wear** | Elevated tool wear (180 min), high operating torque | **HIGH** |
| 🔴 **Compound Multi-Crisis** | Concurrently high torque, labor shortage, and material starvation | **CRITICAL** |

---

## 👥 Role-Based Persona Lenses

ProdGuard AI enables stakeholders to analyze data from their operational vantage point without separate logins:

- **Plant Manager:** High-level OEE impacts, delivery SLA risks, order priority triage, and executive escalation.
- **Line Supervisor:** Station-level bottleneck pacing, shift staffing reallocations, and buffer availability.
- **Maintenance Lead:** Mechanical health diagnostics, torque/RPM anomalies, tool wear cycles, and preventive servicing.

---

## 🏆 Hackathon Context

Built for the **TCS Hackathon** to transform manufacturing from reactive firefighting into proactive operational intelligence.

---

## 📄 License

This project is open-source and intended for academic and demonstration purposes.
