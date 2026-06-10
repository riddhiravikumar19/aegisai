from fastapi import APIRouter
import joblib
import pandas as pd

router = APIRouter()

model = joblib.load("models/aegis_model.pkl")


@router.get("/feature-importance")
def feature_importance():
    feature_names = [
        "Machine Type",
        "Air Temperature",
        "Process Temperature",
        "Rotational Speed",
        "Torque",
        "Tool Wear",
    ]

    importances = model.feature_importances_

    result = []

    for name, value in zip(feature_names, importances):
        result.append({
            "feature": name,
            "importance": round(float(value) * 100, 2)
        })

    result.sort(key=lambda x: x["importance"], reverse=True)

    return {"feature_importance": result}


@router.get("/model-benchmark")
def model_benchmark():
    df = pd.read_csv("reports/model_benchmark_results.csv")
    return {"models": df.to_dict(orient="records")}


@router.get("/dataset-summary")
def dataset_summary():
    df = pd.read_csv("data/ai4i2020.csv")

    total_records = len(df)
    failures = int(df["Machine failure"].sum())
    healthy = total_records - failures
    failure_rate = round((failures / total_records) * 100, 2)

    return {
        "dataset": "AI4I 2020 Predictive Maintenance Dataset",
        "total_records": total_records,
        "healthy_machines": healthy,
        "failed_machines": failures,
        "failure_rate": failure_rate
    }