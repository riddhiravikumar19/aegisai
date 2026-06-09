import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score

# Load dataset
df = pd.read_csv("data/ai4i2020.csv")

# Drop columns we don't need
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

# Convert Type column
df["Type"] = df["Type"].map({
    "L": 0,
    "M": 1,
    "H": 2
})

# Features
X = df.drop("Machine failure", axis=1)

# Target
y = df["Machine failure"]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Model
model = RandomForestClassifier(
    n_estimators=300,
    max_depth=10,
    class_weight="balanced",
    random_state=42
)
# Train
model.fit(X_train, y_train)

# Predict
predictions = model.predict(X_test)

print("\nAccuracy:")
print(accuracy_score(y_test, predictions))

print("\nClassification Report:")
print(classification_report(y_test, predictions))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, predictions))