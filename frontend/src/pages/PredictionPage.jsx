import { useState } from "react";
import PageShell from "../components/PageShell";

export default function PredictionPage() {
  const [form, setForm] = useState({
    Type: 0,
    air_temperature: 298.1,
    process_temperature: 308.6,
    rotational_speed: 1551,
    torque: 42.8,
    tool_wear: 0,
  });

  const [result, setResult] = useState(null);

  function updateField(field, value) {
    setForm({
      ...form,
      [field]: value,
    });
  }

  async function predictRisk() {
    const res = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setResult(data);
  }

  const fields = [
    {
      key: "air_temperature",
      label: "Air Temperature [K]",
      min: 250,
      max: 350,
      step: 0.1,
    },
    {
      key: "process_temperature",
      label: "Process Temperature [K]",
      min: 250,
      max: 400,
      step: 0.1,
    },
    {
      key: "rotational_speed",
      label: "Rotational Speed [rpm]",
      min: 1000,
      max: 3000,
      step: 1,
    },
    {
      key: "torque",
      label: "Torque [Nm]",
      min: 0,
      max: 100,
      step: 0.1,
    },
    {
      key: "tool_wear",
      label: "Tool Wear [min]",
      min: 0,
      max: 300,
      step: 1,
    },
  ];

  return (
    <PageShell>
      <div style={{ padding: "48px 40px" }}>
        <h1 style={{ fontSize: "52px", marginBottom: "12px" }}>
          Live Failure Prediction
        </h1>

        <p style={{ color: "#8892A4", marginBottom: "32px" }}>
          Send machine telemetry to the FastAPI backend and receive real ML model predictions.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
          }}
        >
          <div
            style={{
              background: "#111318",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px",
              padding: "24px",
            }}
          >
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", color: "#8892A4", marginBottom: "8px" }}>
                Machine Type
              </label>

              <select
                value={form.Type}
                onChange={(e) => updateField("Type", Number(e.target.value))}
                style={{
                  width: "100%",
                  background: "#0A0B0F",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "12px",
                  color: "#F0F2F8",
                }}
              >
                <option value={0}>L - Low Quality</option>
                <option value={1}>M - Medium Quality</option>
                <option value={2}>H - High Quality</option>
              </select>
            </div>

            {fields.map((field) => (
              <div key={field.key} style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", color: "#8892A4", marginBottom: "8px" }}>
                  {field.label}
                </label>

                <input
                  type="number"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={form[field.key]}
                  onChange={(e) => updateField(field.key, Number(e.target.value))}
                  style={{
                    width: "100%",
                    background: "#0A0B0F",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    padding: "12px",
                    color: "#F0F2F8",
                  }}
                />
              </div>
            ))}

            <button
              onClick={predictRisk}
              style={{
                background: "#00D4FF",
                color: "#0A0B0F",
                border: "none",
                borderRadius: "12px",
                padding: "14px 20px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Predict Failure Risk
            </button>
          </div>

          <div
            style={{
              background: "#111318",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px",
              padding: "24px",
            }}
          >
            <h2>Prediction Result</h2>

            {result ? (
              <>
                <h3 style={{ color: "#00D4FF" }}>
                  Failure Probability: {result.failure_probability}%
                </h3>

                <h3 style={{ color: "#00E5A0" }}>
                  Health Score: {result.health_score}/100
                </h3>

                <h3>Risk Level: {result.risk_level}</h3>

                <p style={{ color: "#8892A4" }}>{result.recommendation}</p>
              </>
            ) : (
              <p style={{ color: "#8892A4" }}>
                Enter machine telemetry and run prediction.
              </p>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}