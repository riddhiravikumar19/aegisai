import joblib
import pandas as pd

model = joblib.load("models/aegis_model.pkl")


def predict_machine_failure(machine_data):
    df = pd.DataFrame([machine_data])

    probability = model.predict_proba(df)[0][1]
    prediction = model.predict(df)[0]

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


sample_machine = {
    "Type": 0,
    "Air temperature [K]": 298.1,
    "Process temperature [K]": 308.6,
    "Rotational speed [rpm]": 1551,
    "Torque [Nm]": 42.8,
    "Tool wear [min]": 0,
}

result = predict_machine_failure(sample_machine)

print(result)