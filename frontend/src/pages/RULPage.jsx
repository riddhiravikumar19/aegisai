import { useState } from "react";
import PageShell from "../components/PageShell";
import { useMachine } from "../context/MachineContext";

function getUrgencyColor(level) {
  if (level === "Critical") return "#FF3B5C";
  if (level === "High") return "#FFB547";
  if (level === "Medium") return "#00D4FF";
  return "#00E5A0";
}

export default function RULPage() {
  const { selectedMachine } = useMachine();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function estimateRUL() {
    if (!selectedMachine) {
      alert("Please select a machine from Live Monitoring first.");
      return;
    }

    try {
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

      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Failed to estimate RUL.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <div style={{ padding: "48px 40px" }}>
        <h1 style={{ fontSize: "52px", marginBottom: "12px" }}>
          Remaining Useful Life
        </h1>

        <p style={{ color: "#8892A4", marginBottom: "20px" }}>
          Estimate how long the selected machine can operate before maintenance becomes necessary.
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
          onClick={estimateRUL}
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
          {loading ? "Estimating..." : "Estimate Remaining Life"}
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
            <h2 style={{ marginTop: 0 }}>RUL Prediction</h2>

            {result ? (
              <>
                <h1
                  style={{
                    fontSize: "72px",
                    color: getUrgencyColor(result.urgency),
                    margin: "24px 0 12px",
                  }}
                >
                  {result.estimated_rul_days}
                </h1>

                <div
                  style={{
                    color: "#8892A4",
                    marginBottom: "20px",
                  }}
                >
                  Days Remaining
                </div>

                <div
                  style={{
                    color: getUrgencyColor(result.urgency),
                    fontWeight: 700,
                    fontSize: "20px",
                  }}
                >
                  Urgency: {result.urgency}
                </div>

                <p style={{ color: "#8892A4" }}>
                  {result.recommendation}
                </p>
              </>
            ) : (
              <p style={{ color: "#8892A4" }}>
                Select a machine and estimate its remaining useful life.
              </p>
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
            <h2 style={{ marginTop: 0 }}>Confidence Interval</h2>

            {result ? (
              <>
                <div style={{ marginTop: "20px" }}>
                  <div
                    style={{
                      color: "#00D4FF",
                      fontSize: "36px",
                      fontWeight: 700,
                    }}
                  >
                    {result.confidence_range.low} –{" "}
                    {result.confidence_range.high}
                  </div>

                  <div
                    style={{
                      color: "#8892A4",
                      marginBottom: "20px",
                    }}
                  >
                    Estimated operating window (days)
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "20px",
                    padding: "18px",
                    borderRadius: "14px",
                    background: "rgba(0,212,255,0.08)",
                    border: "1px solid rgba(0,212,255,0.18)",
                    color: "#00D4FF",
                  }}
                >
                  Current Risk Score: {result.risk_score}%
                </div>
              </>
            ) : (
              <p style={{ color: "#8892A4" }}>
                Confidence interval will appear after estimation.
              </p>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}