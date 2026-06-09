import joblib
import pandas as pd
import shap
import numpy as np

model = joblib.load("models/aegis_model.pkl")

df = pd.read_csv("data/ai4i2020.csv")

df = df.drop(
    ["UDI", "Product ID", "TWF", "HDF", "PWF", "OSF", "RNF"],
    axis=1,
)

df["Type"] = df["Type"].map({
    "L": 0,
    "M": 1,
    "H": 2,
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

sample = X.iloc[[100]]

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(sample)

print("SHAP raw shape/type:")
print(type(shap_values))
try:
    print(np.array(shap_values).shape)
except Exception:
    pass

if isinstance(shap_values, list):
    values = shap_values[1][0]
elif len(np.array(shap_values).shape) == 3:
    values = shap_values[0, :, 1]
else:
    values = shap_values[0]

features = sample.columns.tolist()

print("\nREAL SHAP CONTRIBUTIONS")
print("=" * 40)

for feature, value in zip(features, values):
    print(f"{feature}: {value:.4f}")