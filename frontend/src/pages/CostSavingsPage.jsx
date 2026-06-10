import { useState } from "react";
import PageShell from "../components/PageShell";
import { useMachine } from "../context/MachineContext";

export default function CostSavingsPage() {
  const { selectedMachine } = useMachine();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function calculateSavings() {
    if (!selectedMachine) {
      alert("Please select a machine from Live Monitoring first.");
      return;
    }

    setLoading(true);

    const res = await fetch("http://127.0.0.1:8000/rul", {
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

    const emergencyFailureCost = 120000;
    const preventiveMaintenanceCost =
      data.urgency === "Critical" ? 45000 :
      data.urgency === "High" ? 35000 :
      data.urgency === "Medium" ? 25000 :
      15000;

    const savings = emergencyFailureCost - preventiveMaintenanceCost;
    const roi = Math.round((savings / preventiveMaintenanceCost) * 100);

    setResult({
      ...data,
      emergencyFailureCost,
      preventiveMaintenanceCost,
      savings,
      roi,
    });

    setLoading(false);
  }

  return (
    <PageShell>
      <div style={{ padding: "48px 40px" }}>
        <h1 style={{ fontSize: "52px", marginBottom: "12px" }}>
          Cost Savings Engine
        </h1>

        <p style={{ color: "#8892A4", marginBottom: "20px" }}>
          Estimate financial impact using selected machine risk and RUL analysis.
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
          onClick={calculateSavings}
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
          {loading ? "Calculating..." : "Calculate Cost Savings"}
        </button>

        {result ? (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
                gap: "24px",
              }}
            >
              <Card
                title="Emergency Failure Cost"
                value={`₹${result.emergencyFailureCost.toLocaleString()}`}
                color="#FF3B5C"
              />

              <Card
                title="Preventive Maintenance Cost"
                value={`₹${result.preventiveMaintenanceCost.toLocaleString()}`}
                color="#FFB547"
              />

              <Card
                title="Potential Savings"
                value={`₹${result.savings.toLocaleString()}`}
                color="#00E5A0"
              />

              <Card
                title="ROI"
                value={`${result.roi}%`}
                color="#00D4FF"
              />
            </div>

            <div
              style={{
                marginTop: "32px",
                background: "#111318",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "28px",
              }}
            >
              <h2>AI Financial Recommendation</h2>

              <p style={{ color: "#8892A4", lineHeight: 1.8 }}>
                AegisAI estimates that {selectedMachine.machine_id} has an RUL of{" "}
                <strong style={{ color: "#00D4FF" }}>
                  {result.estimated_rul_days} days
                </strong>{" "}
                with urgency level{" "}
                <strong style={{ color: "#FFB547" }}>{result.urgency}</strong>.
                Acting proactively could avoid ₹
                {result.savings.toLocaleString()} in emergency downtime and repair losses.
              </p>
            </div>
          </>
        ) : (
          <p style={{ color: "#8892A4" }}>
            Select a machine from Live Monitoring and calculate financial impact.
          </p>
        )}
      </div>
    </PageShell>
  );
}

function Card({ title, value, color }) {
  return (
    <div
      style={{
        background: "#111318",
        border: `1px solid ${color}33`,
        borderRadius: "20px",
        padding: "28px",
      }}
    >
      <div style={{ color: "#8892A4", marginBottom: "14px" }}>
        {title}
      </div>

      <div style={{ fontSize: "36px", fontWeight: 700, color }}>
        {value}
      </div>
    </div>
  );
}