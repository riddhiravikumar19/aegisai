from fastapi import APIRouter
from pydantic import BaseModel
import joblib
import shap
import numpy as np
import pandas as pd

router = APIRouter()

model = joblib.load("models/aegis_model.pkl")
explainer = shap.TreeExplainer(model)


class ExplainRequest(BaseModel):
    Type: int
    air_temperature: float
    process_temperature: float
    rotational_speed: float
    torque: float
    tool_wear: float


@router.post("/explain")
def explain(data: ExplainRequest):
    sample = pd.DataFrame([data.dict()])

    shap_values = explainer.shap_values(sample)

    if isinstance(shap_values, list):
        values = shap_values[1][0]

    elif len(np.array(shap_values).shape) == 3:
        values = shap_values[0, :, 1]

    else:
        values = shap_values[0]

    contributions = []

    for feature, value in zip(sample.columns, values):
        contributions.append({
            "feature": feature,
            "contribution": round(float(value), 4)
        })

    contributions.sort(
        key=lambda x: abs(x["contribution"]),
        reverse=True
    )

    return {
        "root_causes": contributions
    }