import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

df = pd.read_csv("data/ai4i2020.csv")

df = df.drop(
    [
        "UDI",
        "Product ID",
        "TWF",
        "HDF",
        "PWF",
        "OSF",
        "RNF"
    ],
    axis=1
)

df["Type"] = df["Type"].map({
    "L": 0,
    "M": 1,
    "H": 2
})

X = df.drop("Machine failure", axis=1)
y = df["Machine failure"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    stratify=y,
    random_state=42
)

model = RandomForestClassifier(
    n_estimators=300,
    max_depth=10,
    class_weight="balanced",
    random_state=42
)

model.fit(X_train, y_train)

joblib.dump(
    model,
    "models/aegis_model.pkl"
)

print("Model saved successfully!")