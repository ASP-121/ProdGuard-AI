# ProdGuard AI 🏭

### AI-Enabled Production Disruption Early Warning System

> **TCS Hackathon Project** — Proactively preventing manufacturing line disruptions by unifying machine telemetry, supply chain, workforce, and quality signals into a single intelligent dashboard.

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution Overview](#-solution-overview)
- [Demo Preview](#-demo-preview)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Features](#-features)
- [AI & ML Engine](#-ai--ml-engine)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Team](#-team)

---

## 🎯 Problem Statement

Manufacturing plant managers currently rely on **fragmented, siloed reports** spread across four independent systems:

| Silo | System | Data |
|------|--------|------|
| 🔧 Machine Health | SCADA / IoT Sensors | Telemetry, vibration, thermal data |
| 📦 Supply Chain | ERP System | Material delays, inventory levels |
| 👷 Workforce | HR System | Shift absenteeism, shortage levels |
| ✅ Quality | QA Reports | Scrap rate, defect counts, rework |

By the time a manager pieces together all four reports, the line has **already stopped**. There is no unified proactive view.

---

## 💡 Solution Overview

**ProdGuard AI** combines these four operational silos into a **single real-time early warning system** powered by a Gradient Boosting ML model and a Multi-Factor Disruption Risk Engine.

> **Key Value Proposition:** A **2 to 6-hour proactive intervention window** before line stoppage or heavy scrap accumulation occurs.

### How it works:

```
User Inputs Machine + Operational Parameters
           ↓
  React Frontend calls FastAPI Backend
           ↓
  Gradient Boosting ML Model (scikit-learn)
  predicts Machine Failure Probability
           ↓
  Multi-Factor Disruption Risk Engine
  calculates Overall Risk Score (0–100%)
           ↓
  Root Cause Analysis Engine identifies
  which signals are driving the risk
           ↓
Dashboard displays:
  ✓ Machine Failure Probability
  ✓ Overall Disruption Risk Score
  ✓ Risk Level (LOW / MEDIUM / HIGH / CRITICAL)
  ✓ Priority Score for Triage
  ✓ Ranked Root Causes
  ✓ AI Recommended Actions
  ✓ Natural Language Explanation
  ✓ Incident Escalation Workflow
```

---

## 🖥️ Demo Preview

| Section | Description |
|---------|-------------|
| **Dashboard KPI Cards** | Live machine failure probability, disruption risk, risk level, and priority score |
| **Role Persona Lens** | Plant Manager · Line Supervisor · Maintenance Lead views |
| **Risk Gauge** | Animated semi-circular arc gauge (0–100%) with color-coded thresholds |
| **Risk Factor Charts** | Recharts bar & radar charts for 5 risk drivers |
| **AI Explanation** | Natural language "Why is this happening?" synthesis |
| **Incident Workflow** | 5-stage escalation lifecycle tracker |
| **Prediction History** | 10-run local audit log with trajectory chart |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.8 | Component-based UI framework |
| **Vite** | 8.2.2 | Build tool & HMR dev server |
| **Recharts** | 3.10.1 | Interactive data visualizations |
| **Lucide React** | 1.34.0 | Industrial icon system |
| **Custom CSS3** | — | Industrial dark-mode design system |
| **Fetch API + AbortController** | Native | Backend HTTP communication |
| **localStorage** | Web Storage API | Prototype state persistence |

### Backend & ML
| Technology | Version | Purpose |
|------------|---------|---------|
| **FastAPI** | Latest | REST API framework |
| **Uvicorn** | 0.49.0 | ASGI production web server |
| **Python** | 3.14.2 | Backend runtime |
| **scikit-learn** | Latest | Gradient Boosting ML model |
| **Pandas** | Latest | Feature engineering & OHE |
| **Pydantic** | v2 | Request schema validation |
| **Joblib** | Latest | Model serialization (.pkl) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER (React + Vite)                    │
│                                                              │
│  Role Switcher → KPI Cards → Risk Gauge → Charts            │
│  Root Causes → Actions Checklist → AI Explanation           │
│  Workflow Panel → Escalation → Prediction History           │
└─────────────────────────┬───────────────────────────────────┘
                          │ POST /predict (JSON)
                          │ http://127.0.0.1:8000
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  FASTAPI BACKEND (Python)                    │
│                                                              │
│  Pydantic Validation → Pandas Feature Matrix                 │
│  → Gradient Boosting Model (predict_proba)                  │
│  → Multi-Factor Risk Engine                                  │
│  → Root Cause Threshold Checks                              │
│  → Prescriptive Action Matcher                              │
│  → JSON Response                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### 🎭 Role-Based Persona Lenses
Switch between three stakeholder views without separate logins:
- **Plant Manager** — OEE, financial impact, delivery SLA, executive escalation
- **Line Supervisor** — Workforce constraints, material staging, queue backlog
- **Maintenance Lead** — CNC telemetry, tool wear, torque analysis, mechanical health

### 📊 Prediction Dashboard
- 4 dynamic KPI cards with color-coded risk indicators
- Animated semi-circular SVG risk gauge (LOW → CRITICAL)
- Risk Factor Composition chart (Bar + Radar view toggle)
- Priority Metrics comparison chart
- Prediction trajectory area chart

### 🔍 Risk Assessment Form
- Dual-layer input form (Physical Telemetry + Operational Signals)
- Interactive sliders + number inputs with real-time value display
- Client-side validation with descriptive error feedback
- 4 one-click demo presets (Nominal / Supply Crunch / Mechanical Strain / Critical Crisis)

### 🚦 Risk Prioritization
- Ranked root cause cards with domain tags and operational impact
- Top Priority Spotlight Hero card — *"What should I solve first?"*
- Severity classification (Critical / High / Medium / Low)

### ✅ AI Recommended Actions
- Interactive execution checklist from backend recommendations
- Priority tiers (P1 Immediate → P4 Standard)
- Status toggles: Pending → In Progress → Completed
- Progress bar: *"X of 4 Actions Completed"*
- localStorage state persistence across sessions

### 🤖 Natural Language AI Explanation
- Dynamic *"Why is this happening?"* synthesis per risk level
- *"Recommended Next Step"* directive
- Role-specific operational lens insight
- Proactive vs. reactive framing narrative

### 🔄 Incident Workflow & Escalation
- 5-stage lifecycle: Detected → Analyzed → Action Assigned → In Progress → Resolved
- Team assignment (Maintenance / Quality / Supply Chain / Production Manager)
- Shift notes & audit log
- Simulated emergency escalation modal with incident ticket generation

### 📜 Prediction History
- Last 10 predictions stored locally
- Table with Time, Machine Type, Risk Score, Risk Level, Priority Score
- 1-click "Load Input" to replay any historical parameters
- Risk trajectory area chart across runs

---

## 🧠 AI & ML Engine

### Machine Learning Model: Gradient Boosting Classifier
```
Input Features (Physical Sensors):
  Type, Air Temperature, Process Temperature,
  Rotational Speed, Torque, Tool Wear

Model: scikit-learn GradientBoostingClassifier
Output: P(Machine Failure) ∈ [0.0, 1.0]
```

### Multi-Factor Disruption Risk Formula
```
Overall Disruption Risk =
  0.40 × Machine Risk   (from ML model)
  0.20 × Material Delay Risk
  0.15 × Workforce Shortage Risk
  0.15 × Quality Defect Risk
  0.10 × Backlog Pressure Risk

Risk Levels:
  0–30%   → LOW (Stable)
  31–60%  → MEDIUM (Emerging Concern)
  61–80%  → HIGH (Severe Risk)
  81–100% → CRITICAL (Emergency)
```

### Root Cause Thresholds
```
P(Failure)    ≥ 50%     → Machine failure risk
Material Delay ≥ 60 min  → Supply chain bottleneck
Workforce      ≥ 15%     → Labor constraint
Quality Rate   ≥ 5%      → Scrap / rework surge
Backlog        ≥ 150 u   → Delivery commitment at risk
```

### Priority Score
```
Priority Score = 0.70 × Disruption Risk + 0.30 × Backlog Impact
```

---

## 📁 Project Structure

```
prodguard-ai/                       ← React + Vite Frontend
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx                     ← Core orchestrator
    ├── index.css                   ← Industrial dark-mode design system
    ├── components/
    │   ├── Sidebar.jsx             ← Navigation + backend status
    │   ├── Header.jsx              ← Role switcher + presets + live clock
    │   ├── RoleBanner.jsx          ← Persona-specific insight banner
    │   ├── RiskCards.jsx           ← 4 KPI metric cards
    │   ├── AlertCenter.jsx         ← Dynamic alert banners
    │   ├── PredictionForm.jsx      ← Dual-layer telemetry input form
    │   ├── RiskGauge.jsx           ← SVG semi-circular arc gauge
    │   ├── RiskCharts.jsx          ← Recharts composition + comparison
    │   ├── PredictionHistoryChart.jsx ← Trajectory area chart
    │   ├── RootCauses.jsx          ← Ranked prioritization panel
    │   ├── RecommendedActions.jsx  ← AI action checklist
    │   ├── AIExplanation.jsx       ← NLG explanation section
    │   ├── WorkflowPanel.jsx       ← Incident escalation workflow
    │   └── PredictionHistory.jsx   ← Historical audit table
    ├── services/
    │   └── api.js                  ← Fetch API client (POST /predict)
    └── utils/
        ├── riskUtils.js            ← Risk calc, NLG engine, localStorage helpers
        └── presets.js              ← 4 industrial demo scenarios

ml-service/                         ← FastAPI Backend
├── app.py                          ← FastAPI app + ML pipeline
├── train_model.py                  ← Model training script
├── gradient_boosting_model.pkl     ← Trained ML model
└── model_features.pkl              ← Feature alignment vector
```

---

## 🚀 Getting Started

### Prerequisites
- **Python** 3.10+ (3.14 recommended)
- **Node.js** 18+ and **npm** 9+

---

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/prodguard-ai.git
cd prodguard-ai
```

---

### 2. Start the FastAPI Backend

```bash
cd ml-service
pip install fastapi uvicorn scikit-learn pandas joblib
python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```

✅ Verify at: http://127.0.0.1:8000
> Expected: `{"message": "ProdGuard AI ML Service is running"}`

📖 Interactive API Docs: http://127.0.0.1:8000/docs

---

### 3. Start the React Frontend

Open a **new terminal**:

```bash
cd prodguard-ai
npm install
npm run dev
```

✅ Open in browser: **http://localhost:5173**

---

### 4. Quick Demo

Click **"Load Preset Scenarios"** in the header to instantly test:
| Preset | Expected Risk Level |
|--------|-------------------|
| Nominal Operations | 🟢 LOW |
| Supply Chain & Backlog Spike | 🟡 MEDIUM |
| Tool Wear & Thermal Strain | 🟠 HIGH |
| Critical Multi-Factor Crisis | 🔴 CRITICAL |

---

## 📡 API Reference

### `POST /predict`

**Endpoint:** `http://127.0.0.1:8000/predict`

**Request Body:**
```json
{
  "Type": "M",
  "air_temperature": 300.5,
  "process_temperature": 310.2,
  "rotational_speed": 1500,
  "torque": 45.0,
  "tool_wear": 180,
  "material_delay": 90,
  "workforce_constraint": 18,
  "quality_issue_rate": 7,
  "production_backlog": 220
}
```

**Response:**
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

| Field | Type | Description |
|-------|------|-------------|
| `machine_failure_probability` | float | ML model output (0–100%) |
| `overall_disruption_risk` | float | Composite disruption score (0–100%) |
| `risk_level` | string | `LOW`, `MEDIUM`, `HIGH`, or `CRITICAL` |
| `priority_score` | float | Triage urgency ranking (0–100) |
| `root_causes` | list[str] | Detected bottlenecks above threshold |
| `recommended_actions` | list[str] | Prescribed mitigation SOPs |

---

## ⚠️ Known Limitations (Prototype)

- **localStorage persistence** — Workflow, action states, and prediction history are stored in the browser only. Not persisted server-side (by design for prototype).
- **No authentication** — Single-dashboard prototype; role lenses are UI-only views.
- **Escalation** — Simulated notification dispatch; no actual email or alerting integration.
- **ML Training Data** — Model trained on UCI AI4I 2020 Predictive Maintenance Dataset.

---

## 👥 Team

Built with ❤️ for the **TCS Hackathon**

| Role | Contribution |
|------|-------------|
| **ML Engineer** | Gradient Boosting model training, FastAPI backend, risk scoring engine |
| **Frontend Engineer** | React dashboard, Recharts visualizations, UX design system |
| **Product / Domain** | Manufacturing domain logic, SOP mappings, escalation workflows |

---

## 📄 License

This project was built as a **hackathon prototype** for demonstration purposes.

---

<div align="center">
  <strong>ProdGuard AI</strong> · AI-Enabled Production Disruption Early Warning System<br/>
  <em>Turning reactive firefighting into proactive operational intelligence.</em>
</div>
