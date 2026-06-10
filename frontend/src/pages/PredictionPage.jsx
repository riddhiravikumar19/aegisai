import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import { useMachine } from "../context/MachineContext";

export default function PredictionPage() {
  const { selectedMachine } = useMachine();

  const [form, setForm] = useState({
    Type: 0,
    air_temperature: 298.1,
    process_temperature: 308.6,
    rotational_speed: 1551,
    torque: 42.8,
    tool_wear: 0,
  });

  const [result, setResult] = useState(null);

  useEffect(() => {
    if (selectedMachine) {
      setForm({
        Type: selectedMachine.type,
        air_temperature: selectedMachine.air_temperature,
        process_temperature: selectedMachine.process_temperature,
        rotational_speed: selectedMachine.rotational_speed,
        torque: selectedMachine.torque,
        tool_wear: selectedMachine.tool_wear,
      });
      setResult(null);
    }
  }, [selectedMachine]);

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
    ["air_temperature", "Air Temperature [K]", 250, 350, 0.1],
    ["process_temperature", "Process Temperature [K]", 250, 400, 0.1],
    ["rotational_speed", "Rotational Speed [rpm]", 1000, 3000, 1],
    ["torque", "Torque [Nm]", 0, 100, 0.1],
    ["tool_wear", "Tool Wear [min]", 0, 300, 1],
  ];

  return (
    <PageShell>
      <div style={{ padding: "48px 40px" }}>
        <h1 style={{ fontSize: "52px", marginBottom: "12px" }}>
          Live Failure Prediction
        </h1>

        <p style={{ color: "#8892A4", marginBottom: "20px" }}>
          Send machine telemetry to the FastAPI backend and receive real ML model predictions.
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
                style={inputStyle}
              >
                <option value={0}>L - Low Quality</option>
                <option value={1}>M - Medium Quality</option>
                <option value={2}>H - High Quality</option>
              </select>
            </div>

            {fields.map(([key, label, min, max, step]) => (
              <div key={key} style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", color: "#8892A4", marginBottom: "8px" }}>
                  {label}
                </label>

                <input
                  type="number"
                  min={min}
                  max={max}
                  step={step}
                  value={form[key]}
                  onChange={(e) => updateField(key, Number(e.target.value))}
                  style={inputStyle}
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
                {selectedMachine
                  ? "Selected machine loaded. Run prediction to analyze failure risk."
                  : "Enter machine telemetry or select a machine from Live Monitoring."}
              </p>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

const inputStyle = {
  width: "100%",
  background: "#0A0B0F",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  padding: "12px",
  color: "#F0F2F8",
};