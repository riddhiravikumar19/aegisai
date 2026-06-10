import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import { API_BASE_URL } from "../lib/api";

export default function ModelPerformancePage() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadBenchmark() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/model-benchmark`);
      const data = await res.json();
      setModels(data.models || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load model benchmark results.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBenchmark();
  }, []);

  return (
    <PageShell showBackButton={true}>
      <div style={{ padding: "48px 40px" }}>
        <h1 style={{ fontSize: "52px", marginBottom: "12px" }}>
          Model Benchmarking
        </h1>

        <p style={{ color: "#8892A4", marginBottom: "40px" }}>
          Performance comparison between machine failure prediction models trained on the AI4I 2020 dataset.
        </p>

        {loading ? (
          <p style={{ color: "#00D4FF" }}>Loading benchmark results...</p>
        ) : (
          <div style={{ overflowX: "auto", background: "#111318", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#171A22" }}>
                  {["Model", "Accuracy", "Precision", "Recall", "F1 Score", "ROC AUC"].map((item) => (
                    <th key={item} style={{ padding: "18px", color: "#00D4FF", textAlign: "left" }}>
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {models.map((model) => (
                  <tr key={model.Model}>
                    <Cell>{model.Model}</Cell>
                    <Cell>{formatPercent(model.Accuracy)}</Cell>
                    <Cell>{formatPercent(model.Precision)}</Cell>
                    <Cell>{formatPercent(model.Recall)}</Cell>
                    <Cell>{formatPercent(model["F1 Score"])}</Cell>
                    <Cell>{formatPercent(model["ROC AUC"])}</Cell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={insightStyle}>
          <h3 style={{ color: "#00E5A0" }}>Key Insight</h3>

          <p style={{ color: "#8892A4", lineHeight: 1.8 }}>
            Random Forest achieved stronger F1 balance, while XGBoost delivered higher recall and ROC-AUC,
            making it useful for identifying potential failures in predictive maintenance scenarios.
          </p>
        </div>
      </div>
    </PageShell>
  );
}

function formatPercent(value) {
  if (value === undefined || value === null) return "-";
  return `${(Number(value) * 100).toFixed(2)}%`;
}

function Cell({ children }) {
  return (
    <td style={{ padding: "18px", borderTop: "1px solid rgba(255,255,255,0.05)", color: "#F0F2F8" }}>
      {children}
    </td>
  );
}

const insightStyle = {
  marginTop: "32px",
  padding: "24px",
  borderRadius: "20px",
  background: "rgba(0,229,160,0.08)",
  border: "1px solid rgba(0,229,160,0.18)",
};