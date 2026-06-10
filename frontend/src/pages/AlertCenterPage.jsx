import { useState } from "react";
import PageShell from "../components/PageShell";
import { useMachine } from "../context/MachineContext";

function getAlertColor(severity) {
  if (severity === "Critical") return "#FF3B5C";
  if (severity === "High") return "#FFB547";
  if (severity === "Medium") return "#00D4FF";
  return "#00E5A0";
}

export default function AlertCenterPage() {
  const { selectedMachine } = useMachine();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generateAlert() {
    if (!selectedMachine) {
      alert("Please select a machine from Live Monitoring first.");
      return;
    }

    setLoading(true);

    const payload = {
      Type: selectedMachine.type,
      air_temperature: selectedMachine.air_temperature,
      process_temperature: selectedMachine.process_temperature,
      rotational_speed: selectedMachine.rotational_speed,
      torque: selectedMachine.torque,
      tool_wear: selectedMachine.tool_wear,
    };

    const predictRes = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const rulRes = await fetch("http://127.0.0.1:8000/rul", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const prediction = await predictRes.json();
    const rul = await rulRes.json();

    let severity = "Healthy";
    let message = "Machine is currently operating within normal limits.";
    let action = "Continue routine monitoring.";

    if (prediction.failure_probability >= 70 || rul.estimated_rul_days <= 7) {
      severity = "Critical";
      message = "High failure risk or very low remaining useful life detected.";
      action = "Schedule immediate maintenance inspection.";
    } else if (prediction.failure_probability >= 50 || rul.estimated_rul_days <= 21) {
      severity = "High";
      message = "Elevated risk detected. Maintenance should be scheduled soon.";
      action = "Schedule maintenance within 1–2 weeks.";
    } else if (prediction.failure_probability >= 30 || rul.estimated_rul_days <= 45) {
      severity = "Medium";
      message = "Moderate degradation pattern detected.";
      action = "Monitor closely and plan preventive maintenance.";
    }

    setAlert({
      machine_id: selectedMachine.machine_id,
      severity,
      risk: prediction.failure_probability,
      health: prediction.health_score,
      rul_days: rul.estimated_rul_days,
      urgency: rul.urgency,
      message,
      action,
      time: new Date().toLocaleString(),
    });

    setLoading(false);
  }

  return (
    <PageShell>
      <div style={{ padding: "48px 40px" }}>
        <h1 style={{ fontSize: "52px", marginBottom: "12px" }}>
          Alert Center
        </h1>

        <p style={{ color: "#8892A4", marginBottom: "20px" }}>
          Generate real AI maintenance alerts using prediction risk and RUL thresholds.
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
          onClick={generateAlert}
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
          {loading ? "Generating Alert..." : "Generate Alert"}
        </button>

        {alert ? (
          <div
            style={{
              background: "#111318",
              border: `1px solid ${getAlertColor(alert.severity)}55`,
              borderRadius: "22px",
              padding: "28px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2 style={{ marginTop: 0 }}>{alert.machine_id}</h2>
              <span style={{ color: getAlertColor(alert.severity) }}>
                {alert.time}
              </span>
            </div>

            <h3 style={{ color: getAlertColor(alert.severity) }}>
              {alert.severity} Alert
            </h3>

            <div style={{ color: "#8892A4", lineHeight: 1.9 }}>
              <div>Failure Probability: {alert.risk}%</div>
              <div>Health Score: {alert.health}/100</div>
              <div>Remaining Useful Life: {alert.rul_days} days</div>
              <div>RUL Urgency: {alert.urgency}</div>
            </div>

            <p style={{ color: "#F0F2F8", marginTop: "20px" }}>
              {alert.message}
            </p>

            <div
              style={{
                marginTop: "18px",
                padding: "16px",
                borderRadius: "14px",
                background: `${getAlertColor(alert.severity)}12`,
                border: `1px solid ${getAlertColor(alert.severity)}33`,
                color: getAlertColor(alert.severity),
                fontWeight: 700,
              }}
            >
              Recommended Action: {alert.action}
            </div>
          </div>
        ) : (
          <p style={{ color: "#8892A4" }}>
            Select a machine from Live Monitoring and generate an AI alert.
          </p>
        )}
      </div>
    </PageShell>
  );
}