from fastapi import APIRouter
from pydantic import BaseModel
import pandas as pd
import joblib

router = APIRouter()

model = joblib.load("models/aegis_model.pkl")


class MachineInput(BaseModel):
    machine_id: str
    Type: int
    air_temperature: float
    process_temperature: float
    rotational_speed: int
    torque: float
    tool_wear: int


@router.post("/priority")
def generate_priority_queue(machines: list[MachineInput]):
    queue = []

    for machine in machines:
        input_df = pd.DataFrame([{
            "Type": machine.Type,
            "Air temperature [K]": machine.air_temperature,
            "Process temperature [K]": machine.process_temperature,
            "Rotational speed [rpm]": machine.rotational_speed,
            "Torque [Nm]": machine.torque,
            "Tool wear [min]": machine.tool_wear,
        }])

        probability = model.predict_proba(input_df)[0][1]
        risk = round(probability * 100, 2)

        health = round(100 - risk, 2)

        rul = max(
            1,
            round(
                (260 - machine.tool_wear) / 4
                - risk / 5
            )
        )

        if risk >= 70 or rul <= 7:
          urgency = "Critical"
          urgency_weight = 40
          action = "Immediate shutdown and inspection"

        elif risk >= 40 or rul <= 21:
          urgency = "High"
          urgency_weight = 30
          action = "Schedule maintenance within 1 week"

        elif risk >= 20 or rul <= 45:
          urgency = "Medium"
          urgency_weight = 20
          action = "Preventive maintenance required"

        else:
          urgency = "Low"
          urgency_weight = 10
          action = "Routine monitoring"

        priority_score = round(

            (risk * 1.5)
            + urgency_weight
            + max(0, 45 - rul),
            2,
        )

        queue.append({
            "machine_id": machine.machine_id,
            "risk_score": risk,
            "health_score": health,
            "rul_days": rul,
            "urgency": urgency,
            "priority_score": priority_score,
            "action": action,
        })

    queue.sort(
        key=lambda x: x["priority_score"],
        reverse=True,
    )

    return {"queue": queue}