from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI(
    title="ProdGuard AI - ML Service"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load trained model
model = joblib.load("gradient_boosting_model.pkl")

# Load feature names
model_features = joblib.load("model_features.pkl")


# -----------------------------
# INPUT MODEL
# -----------------------------

class ManufacturingInput(BaseModel):

    Type: str

    air_temperature: float
    process_temperature: float
    rotational_speed: float
    torque: float
    tool_wear: float

    material_delay: float
    workforce_constraint: float
    quality_issue_rate: float
    production_backlog: float


# -----------------------------
# RISK CALCULATION
# -----------------------------

def calculate_disruption_risk(
    machine_probability,
    material_delay,
    workforce_constraint,
    quality_issue_rate,
    production_backlog
):

    machine_risk = machine_probability * 100

    material_risk = min(
        (material_delay / 240) * 100,
        100
    )

    workforce_risk = min(
        (workforce_constraint / 40) * 100,
        100
    )

    quality_risk = min(
        (quality_issue_rate / 25) * 100,
        100
    )

    backlog_risk = min(
        (production_backlog / 500) * 100,
        100
    )

    overall_risk = (
        0.40 * machine_risk +
        0.20 * material_risk +
        0.15 * workforce_risk +
        0.15 * quality_risk +
        0.10 * backlog_risk
    )

    return round(overall_risk, 2)


# -----------------------------
# RISK LEVEL
# -----------------------------

def get_risk_level(score):

    if score <= 30:
        return "LOW"

    elif score <= 60:
        return "MEDIUM"

    elif score <= 80:
        return "HIGH"

    return "CRITICAL"


# -----------------------------
# ROOT CAUSES
# -----------------------------

def get_root_causes(
    machine_probability,
    material_delay,
    workforce_constraint,
    quality_issue_rate,
    production_backlog
):

    causes = []

    if machine_probability >= 0.50:
        causes.append(
            f"High machine failure probability "
            f"({machine_probability * 100:.1f}%)"
        )

    if material_delay >= 60:
        causes.append(
            f"Material delay of {material_delay} minutes"
        )

    if workforce_constraint >= 15:
        causes.append(
            f"Workforce shortage of {workforce_constraint}%"
        )

    if quality_issue_rate >= 5:
        causes.append(
            f"High quality issue rate ({quality_issue_rate}%)"
        )

    if production_backlog >= 150:
        causes.append(
            f"High production backlog ({production_backlog} units)"
        )

    if not causes:
        causes.append(
            "No significant disruption factors detected"
        )

    return causes


# -----------------------------
# RECOMMENDATIONS
# -----------------------------

def get_recommendations(
    machine_probability,
    material_delay,
    workforce_constraint,
    quality_issue_rate,
    production_backlog
):

    recommendations = []

    if machine_probability >= 0.50:
        recommendations.append(
            "Schedule immediate machine inspection and preventive maintenance."
        )

    if material_delay >= 60:
        recommendations.append(
            "Contact supplier and arrange alternative material availability."
        )

    if workforce_constraint >= 15:
        recommendations.append(
            "Reallocate workforce or arrange additional shift support."
        )

    if quality_issue_rate >= 5:
        recommendations.append(
            "Perform immediate quality inspection and process calibration."
        )

    if production_backlog >= 150:
        recommendations.append(
            "Prioritize critical orders and rebalance production capacity."
        )

    if not recommendations:
        recommendations.append(
            "Continue normal monitoring and preventive maintenance."
        )

    return recommendations


# -----------------------------
# PRIORITY SCORE
# -----------------------------

def calculate_priority_score(
    overall_risk,
    production_backlog
):

    impact_score = min(
        (production_backlog / 500) * 100,
        100
    )

    priority_score = (
        0.7 * overall_risk +
        0.3 * impact_score
    )

    return round(priority_score, 2)


# -----------------------------
# API ENDPOINT
# -----------------------------

@app.post("/predict")

def predict(data: ManufacturingInput):

    # Create dataframe using ORIGINAL
    # training column names

    input_df = pd.DataFrame([{
        "Type": data.Type,
        "Air temperature [K]": data.air_temperature,
        "Process temperature [K]": data.process_temperature,
        "Rotational speed [rpm]": data.rotational_speed,
        "Torque [Nm]": data.torque,
        "Tool wear [min]": data.tool_wear
    }])


    # One-hot encode Type
    input_df = pd.get_dummies(
        input_df,
        columns=["Type"],
        drop_first=True
    )


    # Match training features
    input_df = input_df.reindex(
        columns=model_features,
        fill_value=0
    )


    # Machine failure probability
    machine_probability = model.predict_proba(
        input_df
    )[0][1]


    # Overall disruption risk
    overall_risk = calculate_disruption_risk(
        machine_probability,
        data.material_delay,
        data.workforce_constraint,
        data.quality_issue_rate,
        data.production_backlog
    )


    risk_level = get_risk_level(
        overall_risk
    )


    root_causes = get_root_causes(
        machine_probability,
        data.material_delay,
        data.workforce_constraint,
        data.quality_issue_rate,
        data.production_backlog
    )


    recommendations = get_recommendations(
        machine_probability,
        data.material_delay,
        data.workforce_constraint,
        data.quality_issue_rate,
        data.production_backlog
    )


    priority_score = calculate_priority_score(
        overall_risk,
        data.production_backlog
    )


    return {

        "machine_failure_probability":
            round(machine_probability * 100, 2),

        "overall_disruption_risk":
            overall_risk,

        "risk_level":
            risk_level,

        "priority_score":
            priority_score,

        "root_causes":
            root_causes,

        "recommended_actions":
            recommendations
    }


@app.get("/")

def home():

    return {
        "message":
        "ProdGuard AI ML Service is running"
    }