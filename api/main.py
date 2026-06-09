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

@app.get("/")
def home():
    return {"message": "AegisAI API is running"}

@app.post("/predict")
def predict(data: MachineInput):
    input_df = pd.DataFrame([{
        "Type": data.Type,
        "Air temperature [K]": data.air_temperature,
        "Process temperature [K]": data.process_temperature,
        "Rotational speed [rpm]": data.rotational_speed,
        "Torque [Nm]": data.torque,
        "Tool wear [min]": data.tool_wear,
    }])

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
        "recommendation": recommendation
    }