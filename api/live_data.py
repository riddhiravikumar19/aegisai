import pandas as pd
from fastapi import APIRouter

router = APIRouter()

df = pd.read_csv("data/ai4i2020.csv")

current_index = 0

type_map = {
    "L": 0,
    "M": 1,
    "H": 2,
}

@router.get("/live-machines")
def get_live_machine():
    global current_index

    row = df.iloc[current_index]
    current_index += 1

    if current_index >= len(df):
        current_index = 0

    machine_type_text = row["Type"]
    machine_type_encoded = type_map[machine_type_text]

    return {
        "machine_id": f"MCH-{current_index:03}",
        "type": machine_type_encoded,
        "type_label": machine_type_text,
        "air_temperature": float(row["Air temperature [K]"]),
        "process_temperature": float(row["Process temperature [K]"]),
        "rotational_speed": int(row["Rotational speed [rpm]"]),
        "torque": float(row["Torque [Nm]"]),
        "tool_wear": int(row["Tool wear [min]"]),
    }