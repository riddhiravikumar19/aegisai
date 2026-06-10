import { useState } from "react";
import PageShell from "../components/PageShell";
import { useMachine } from "../context/MachineContext";

function formatFeatureName(feature) {
  const names = {
    Type: "Machine Type",
    air_temperature: "Air Temperature",
    process_temperature: "Process Temperature",
    rotational_speed: "Rotational Speed",
    torque: "Torque",
    tool_wear: "Tool Wear",
  };

  return names[feature] || feature;
}

export default function RootCausePage() {
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedMachine } = useMachine();

  async function runExplanation() {
    if (!selectedMachine) {
      alert("Please select a machine from Live Monitoring first.");
      return;
    }

    setLoading(true);

    const res = await fetch("http://127.0.0.1:8000/explain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Type: selectedMachine.type,
        air_temperature: selectedMachine.air_temperature,
        process_temperature: selectedMachine.process_temperature,
        rotational_speed: selectedMachine.rotational_speed,
        torque: selectedMachine.torque,
        tool_wear: selectedMachine.tool_wear,
      }),
    });

    const data = await res.json();

    setCauses(data.root_causes);
    setLoading(false);
  }

  return (
    <PageShell>
      <div style={{ padding: "48px 40px" }}>
        <h1 style={{ fontSize: "52px", marginBottom: "12px" }}>
          Root Cause Analysis
        </h1>

        <p style={{ color: "#8892A4", marginBottom: "20px" }}>
          Real SHAP-based explainability showing how each feature influenced the model prediction.
        </p>

        {selectedMachine && (
          <div
            style={{
              marginBottom: "24px",
              padding: "14px 18px",
              borderRadius: "14px",
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.2)",
              color: "#00D4FF",
              fontWeight: 700,
            }}
          >
            Selected Machine: {selectedMachine.machine_id}
          </div>
        )}

        <button
          onClick={runExplanation}
          disabled={loading}
          style={{
            background: loading ? "#445" : "#00D4FF",
            color: "#0A0B0F",
            border: "none",
            borderRadius: "12px",
            padding: "14px 20px",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "32px",
          }}
        >
          {loading ? "Generating Explanation..." : "Generate SHAP Explanation"}
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: "24px",
          }}
        >
          <div
            style={{
              background: "#111318",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px",
              padding: "28px",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Feature Contributions</h2>

            {causes.length === 0 ? (
              <p style={{ color: "#8892A4" }}>
                {selectedMachine
                  ? "Click the button to generate SHAP explanation for the selected machine."
                  : "Select a machine from Live Monitoring first."}
              </p>
            ) : (
              causes.map((cause) => {
                const isRiskIncreasing = cause.contribution > 0;
                const color = isRiskIncreasing ? "#FF3B5C" : "#00E5A0";
                const width = Math.min(Math.abs(cause.contribution) * 500, 100);

                return (
                  <div key={cause.feature} style={{ marginBottom: "26px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <strong>{formatFeatureName(cause.feature)}</strong>

                      <span style={{ color }}>
                        {isRiskIncreasing ? "+" : ""}
                        {cause.contribution}
                      </span>
                    </div>

                    <div
                      style={{
                        height: "10px",
                        background: "rgba(255,255,255,0.08)",
                        borderRadius: "999px",
                        overflow: "hidden",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: `${width}%`,
                          height: "100%",
                          background: color,
                          boxShadow: `0 0 18px ${color}66`,
                        }}
                      />
                    </div>

                    <p style={{ color: "#8892A4", margin: 0 }}>
                      {isRiskIncreasing
                        ? "This feature increased the predicted failure risk."
                        : "This feature reduced the predicted failure risk."}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          <div
            style={{
              background: "#111318",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px",
              padding: "28px",
            }}
          >
            <h2 style={{ marginTop: 0 }}>AI Diagnosis</h2>

            <p style={{ color: "#8892A4", lineHeight: 1.8 }}>
              SHAP explains how each input feature pushed the model toward either failure or healthy prediction.
            </p>

            <div
              style={{
                marginTop: "24px",
                padding: "18px",
                borderRadius: "14px",
                background: "rgba(255,59,92,0.08)",
                border: "1px solid rgba(255,59,92,0.18)",
                color: "#FF3B5C",
              }}
            >
              Red values increase failure risk.
            </div>

            <div
              style={{
                marginTop: "18px",
                padding: "18px",
                borderRadius: "14px",
                background: "rgba(0,229,160,0.08)",
                border: "1px solid rgba(0,229,160,0.18)",
                color: "#00E5A0",
              }}
            >
              Green values reduce failure risk.
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}