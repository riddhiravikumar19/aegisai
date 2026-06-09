import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
)

from xgboost import XGBClassifier

df = pd.read_csv("data/ai4i2020.csv")

df = df.drop(
    ["UDI", "Product ID", "TWF", "HDF", "PWF", "OSF", "RNF"],
    axis=1
)

df["Type"] = df["Type"].map({
    "L": 0,
    "M": 1,
    "H": 2
})

df = df.rename(columns={
    "Air temperature [K]": "air_temperature",
    "Process temperature [K]": "process_temperature",
    "Rotational speed [rpm]": "rotational_speed",
    "Torque [Nm]": "torque",
    "Tool wear [min]": "tool_wear",
    "Machine failure": "machine_failure",
})

X = df.drop("machine_failure", axis=1)
y = df["machine_failure"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

models = {
    "Random Forest": RandomForestClassifier(
        n_estimators=300,
        max_depth=10,
        class_weight="balanced",
        random_state=42
    ),

    "XGBoost": XGBClassifier(
        n_estimators=300,
        max_depth=4,
        learning_rate=0.05,
        scale_pos_weight=(len(y_train) - sum(y_train)) / sum(y_train),
        eval_metric="logloss",
        random_state=42
    )
}

results = []

for name, model in models.items():
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    probs = model.predict_proba(X_test)[:, 1]

    results.append({
        "Model": name,
        "Accuracy": round(accuracy_score(y_test, preds), 4),
        "Precision": round(precision_score(y_test, preds), 4),
        "Recall": round(recall_score(y_test, preds), 4),
        "F1 Score": round(f1_score(y_test, preds), 4),
        "ROC AUC": round(roc_auc_score(y_test, probs), 4)
    })

results_df = pd.DataFrame(results)

print("\nMODEL BENCHMARK RESULTS")
print("=" * 60)
print(results_df)

results_df.to_csv("reports/model_benchmark_results.csv", index=False)

print("\nSaved to reports/model_benchmark_results.csv")