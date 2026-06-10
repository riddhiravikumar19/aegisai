import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import { useMachine } from "../context/MachineContext";

function getColor(level) {
  if (level === "High") return "#FF3B5C";
  if (level === "Medium") return "#FFB547";
  return "#00E5A0";
}

export default function LiveMonitoringPage() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setSelectedMachine } = useMachine();

  async function fetchAndPredictMachine() {
    try {
      setLoading(true);

      const liveRes = await fetch("http://127.0.0.1:8000/live-machines");
      const liveData = await liveRes.json();

      const predictRes = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Type: liveData.type,
          air_temperature: liveData.air_temperature,
          process_temperature: liveData.process_temperature,
          rotational_speed: liveData.rotational_speed,
          torque: liveData.torque,
          tool_wear: liveData.tool_wear,
        }),
      });

      const prediction = await predictRes.json();

      const mergedMachine = {
        ...liveData,
        failure_probability: prediction.failure_probability,
        health_score: prediction.health_score,
        risk_level: prediction.risk_level,
        recommendation: prediction.recommendation,
      };

      setMachines((prev) => [mergedMachine, ...prev].slice(0, 6));
    } catch (error) {
      console.error("Live monitoring error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAndPredictMachine();
    const timer = setInterval(fetchAndPredictMachine, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <PageShell>
      <div style={{ padding: "48px 40px" }}>
        <h1 style={{ fontSize: "52px", marginBottom: "12px" }}>
          Live Monitoring Stream
        </h1>

        <p style={{ color: "#8892A4", marginBottom: "16px" }}>
          Streaming real AI4I dataset rows from FastAPI and running live ML inference every 3 seconds.
        </p>

        <p style={{ color: loading ? "#00D4FF" : "#8892A4", marginBottom: "32px" }}>
          {loading ? "Running model inference..." : "Model online · Auto-refresh enabled"}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {machines.map((machine) => {
            const color = getColor(machine.risk_level);

            return (
              <div
                key={machine.machine_id}
                style={{
                  background: "#111318",
                  border: `1px solid ${color}55`,
                  borderRadius: "20px",
                  padding: "24px",
                  boxShadow:
                    machine.risk_level === "High"
                      ? `0 0 24px ${color}22`
                      : "none",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                  <h2 style={{ margin: 0 }}>{machine.machine_id}</h2>
                  <span style={{ color }}>{machine.risk_level}</span>
                </div>

                <h3 style={{ color }}>
                  Failure Probability: {machine.failure_probability}%
                </h3>

                <h3 style={{ color: "#00E5A0" }}>
                  Health: {machine.health_score}/100
                </h3>

                <div style={{ color: "#8892A4", lineHeight: 1.8, marginTop: "18px" }}>
                  <div>Type: {machine.type_label}</div>
                  <div>RPM: {machine.rotational_speed}</div>
                  <div>Torque: {machine.torque} Nm</div>
                  <div>Air Temp: {machine.air_temperature} K</div>
                  <div>Process Temp: {machine.process_temperature} K</div>
                  <div>Tool Wear: {machine.tool_wear} min</div>
                </div>

                <div
                  style={{
                    marginTop: "18px",
                    padding: "12px",
                    borderRadius: "12px",
                    background: "rgba(0,212,255,0.08)",
                    color: "#00D4FF",
                  }}
                >
                  {machine.recommendation}
                </div>

                {machine.risk_level === "High" && (
                  <div
                    style={{
                      marginTop: "14px",
                      padding: "12px",
                      borderRadius: "12px",
                      background: "rgba(255,59,92,0.12)",
                      color: "#FF3B5C",
                    }}
                  >
                    ⚠ Critical alert generated by ML model
                  </div>
                )}

                <button
                  onClick={() => {
                    setSelectedMachine(machine);
                    navigate("/predict");
                  }}
                  style={{
                    marginTop: "16px",
                    width: "100%",
                    background: "#00D4FF",
                    color: "#0A0B0F",
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Analyze Machine →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}