import PageShell from "../components/PageShell";

const models = [
  {
    name: "Random Forest",
    accuracy: "96.80%",
    precision: "51.96%",
    recall: "77.94%",
    f1: "62.35%",
    auc: "96.84%",
    highlight: false,
  },
  {
    name: "XGBoost",
    accuracy: "96.15%",
    precision: "46.34%",
    recall: "83.82%",
    f1: "59.69%",
    auc: "96.93%",
    highlight: true,
  },
];

export default function ModelPerformancePage() {
  return (
    <PageShell showBackButton={true}>
      <div style={{ padding: "48px 40px" }}>
        <h1 style={{ fontSize: "52px", marginBottom: "12px" }}>
          Model Benchmarking
        </h1>

        <p style={{ color: "#8892A4", marginBottom: "40px" }}>
          Performance comparison between machine failure prediction models trained on the AI4I 2020 dataset.
        </p>

        <div
          style={{
            overflowX: "auto",
            background: "#111318",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#171A22" }}>
                {["Model", "Accuracy", "Precision", "Recall", "F1", "ROC-AUC"].map((item) => (
                  <th
                    key={item}
                    style={{
                      padding: "18px",
                      color: "#00D4FF",
                      textAlign: "left",
                    }}
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {models.map((model) => (
                <tr
                  key={model.name}
                  style={{
                    background: model.highlight
                      ? "rgba(0,212,255,0.05)"
                      : "transparent",
                  }}
                >
                  <Cell>{model.name}</Cell>
                  <Cell>{model.accuracy}</Cell>
                  <Cell>{model.precision}</Cell>
                  <Cell>{model.recall}</Cell>
                  <Cell>{model.f1}</Cell>
                  <Cell>{model.auc}</Cell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            marginTop: "32px",
            padding: "24px",
            borderRadius: "20px",
            background: "rgba(0,229,160,0.08)",
            border: "1px solid rgba(0,229,160,0.18)",
          }}
        >
          <h3 style={{ color: "#00E5A0" }}>
            Key Insight
          </h3>

          <p style={{ color: "#8892A4", lineHeight: 1.8 }}>
            Random Forest achieved stronger F1 balance, while XGBoost delivered higher recall (83.82%) and ROC-AUC (96.93%), making it more suitable for identifying potential failures in predictive maintenance scenarios.
          </p>
        </div>
      </div>
    </PageShell>
  );
}

function Cell({ children }) {
  return (
    <td
      style={{
        padding: "18px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        color: "#F0F2F8",
      }}
    >
      {children}
    </td>
  );
}