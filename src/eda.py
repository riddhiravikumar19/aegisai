import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv("data/ai4i2020.csv")

print(df.head())

# Failure distribution
plt.figure(figsize=(6,4))
sns.countplot(x="Machine failure", data=df)
plt.title("Machine Failure Distribution")
plt.savefig("reports/failure_distribution.png")
plt.show()

# Correlation heatmap
plt.figure(figsize=(10,6))

corr = df.select_dtypes(include=["int64","float64"]).corr()

sns.heatmap(
    corr,
    cmap="coolwarm",
    annot=True,
    fmt=".2f"
)

plt.title("Feature Correlation Heatmap")
plt.savefig("reports/correlation_heatmap.png")
plt.show()