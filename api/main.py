import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from api.live_data import router as live_router
from api.explain import router as explain_router

model = joblib.load("models/aegis_model.pkl")

app = FastAPI(title="AegisAI Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(live_router)
app.include_router(explain_router)


class MachineInput(BaseModel):
    Type: int
    air_temperature: float
    process_temperature: float
    rotational_speed: int
    torque: float
    tool_wear: int


def build_input_df(data: MachineInput):
    return pd.DataFrame([
        {
            "Type": data.Type,
            "Air temperature [K]": data.air_temperature,
            "Process temperature [K]": data.process_temperature,
            "Rotational speed [rpm]": data.rotational_speed,
            "Torque [Nm]": data.torque,
            "Tool wear [min]": data.tool_wear,
        }
    ])


@app.get("/")
def home():
    return {"message": "AegisAI API is running"}


@app.post("/predict")
def predict(data: MachineInput):
    input_df = build_input_df(data)

    probability = model.predict_proba(input_df)[0][1]
    prediction = model.predict(input_df)[0]

    risk_score = float(round(probability * 100, 2))
    health_score = float(round(100 - risk_score, 2))

    if risk_score < 30:
        risk_level = "Low"
        recommendation = "Machine is operating normally."
    elif risk_score < 70:
        risk_level = "Medium"
        recommendation = "Monitor machine closely and schedule inspection."
    else:
        risk_level = "High"
        recommendation = "Urgent maintenance recommended."

    return {
        "prediction": int(prediction),
        "failure_probability": risk_score,
        "health_score": health_score,
        "risk_level": risk_level,
        "recommendation": recommendation,
    }


@app.post("/rul")
def estimate_rul(data: MachineInput):
    input_df = build_input_df(data)

    probability = model.predict_proba(input_df)[0][1]
    risk_score = float(round(probability * 100, 2))

    wear_remaining = max(0, 260 - data.tool_wear)

    stress_penalty = 0

    if data.torque > 60:
        stress_penalty += 8
    if data.torque > 70:
        stress_penalty += 8
    if data.rotational_speed < 1400:
        stress_penalty += 6
    if data.air_temperature > 303:
        stress_penalty += 4
    if data.process_temperature > 315:
        stress_penalty += 4

    base_days = wear_remaining / 4
    risk_penalty = risk_score / 5

    estimated_days = round(max(1, base_days - stress_penalty - risk_penalty))

    confidence_low = max(1, estimated_days - 5)
    confidence_high = estimated_days + 6

    if estimated_days <= 7:
        urgency = "Critical"
        recommendation = "Schedule maintenance immediately."
    elif estimated_days <= 21:
        urgency = "High"
        recommendation = "Schedule maintenance within the next 1-2 weeks."
    elif estimated_days <= 45:
        urgency = "Medium"
        recommendation = "Plan preventive maintenance soon."
    else:
        urgency = "Low"
        recommendation = "Machine has sufficient operating window."

    return {
        "estimated_rul_days": estimated_days,
        "confidence_range": {
            "low": confidence_low,
            "high": confidence_high,
        },
        "risk_score": risk_score,
        "urgency": urgency,
        "recommendation": recommendation,
    }