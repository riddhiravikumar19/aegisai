import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";

function getHealthStatus(health) {
  if (health >= 90) return { label: "Excellent", color: "#00E5A0" };
  if (health >= 75) return { label: "Good", color: "#00D4FF" };
  if (health >= 50) return { label: "Warning", color: "#FFB547" };
  return { label: "Critical", color: "#FF3B5C" };
}

export default function MachineHealthPage() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadHealthData() {
    setLoading(true);

    try {
      const collected = [];
      const seen = new Set();

      for (let i = 0; i < 20; i++) {
        const liveRes = await fetch("http://127.0.0.1:8000/live-machines");
        const liveData = await liveRes.json();

        if (seen.has(liveData.machine_id)) continue;
        seen.add(liveData.machine_id);

        const payload = {
          Type: liveData.type,
          air_temperature: liveData.air_temperature,
          process_temperature: liveData.process_temperature,
          rotational_speed: liveData.rotational_speed,
          torque: liveData.torque,
          tool_wear: liveData.tool_wear,
        };

        const predictRes = await fetch("http://127.0.0.1:8000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const prediction = await predictRes.json();
        const status = getHealthStatus(prediction.health_score);

        collected.push({
          machine_id: liveData.machine_id,
          type_label: liveData.type_label,
          rpm: liveData.rotational_speed,
          torque: liveData.torque,
          tool_wear: liveData.tool_wear,
          risk: prediction.failure_probability,
          health: prediction.health_score,
          status: status.label,
          color: status.color,
        });
      }

      collected.sort((a, b) => a.health - b.health);
      setMachines(collected.slice(0, 8));
    } catch (error) {
      console.error(error);
      alert("Failed to load machine health data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHealthData();
  }, []);

  const averageHealth =
    machines.length > 0
      ? (
          machines.reduce((sum, machine) => sum + machine.health, 0) /
          machines.length
        ).toFixed(2)
      : 0;

  const criticalCount = machines.filter((m) => m.status === "Critical").length;
  const warningCount = machines.filter((m) => m.status === "Warning").length;

  return (
    <PageShell>
      <div style={{ padding: "48px 40px" }}>
        <h1 style={{ fontSize: "52px", marginBottom: "12px" }}>
          Machine Health Center
        </h1>

        <p style={{ color: "#8892A4", marginBottom: "24px" }}>
          Real-time fleet health overview generated from live machine telemetry and ML health scores.
        </p>

        <button
          onClick={loadHealthData}
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
          {loading ? "Scanning Fleet..." : "Refresh Health Center"}
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <SummaryCard title="Machines Scanned" value={machines.length} color="#00D4FF" />
          <SummaryCard title="Average Health" value={`${averageHealth}%`} color="#00E5A0" />
          <SummaryCard title="Warning Assets" value={warningCount} color="#FFB547" />
          <SummaryCard title="Critical Assets" value={criticalCount} color="#FF3B5C" />
        </div>

        <div style={{ display: "grid", gap: "18px" }}>
          {machines.map((machine) => (
            <div
              key={machine.machine_id}
              style={{
                background: "#111318",
                border: `1px solid ${machine.color}55`,
                borderRadius: "20px",
                padding: "24px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr 1.2fr",
                gap: "18px",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ color: "#8892A4", fontSize: "12px" }}>Machine</div>
                <div style={{ color: "#F0F2F8", fontSize: "22px", fontWeight: 700 }}>
                  {machine.machine_id}
                </div>
              </div>

              <div>
                <div style={{ color: "#8892A4", fontSize: "12px" }}>Health</div>
                <div style={{ color: machine.color, fontWeight: 700 }}>
                  {machine.health}/100
                </div>
              </div>

              <div>
                <div style={{ color: "#8892A4", fontSize: "12px" }}>Risk</div>
                <div style={{ color: machine.color }}>{machine.risk}%</div>
              </div>

              <div>
                <div style={{ color: "#8892A4", fontSize: "12px" }}>Tool Wear</div>
                <div style={{ color: "#F0F2F8" }}>{machine.tool_wear} min</div>
              </div>

              <div>
                <div style={{ color: machine.color, fontWeight: 800 }}>
                  {machine.status}
                </div>
                <div style={{ color: "#8892A4", marginTop: "6px" }}>
                  RPM {machine.rpm} · Torque {machine.torque} Nm
                </div>
              </div>
            </div>
          ))}
        </div>

        {machines.length === 0 && !loading && (
          <p style={{ color: "#8892A4" }}>No health data loaded yet.</p>
        )}
      </div>
    </PageShell>
  );
}

function SummaryCard({ title, value, color }) {
  return (
    <div
      style={{
        background: "#111318",
        border: `1px solid ${color}33`,
        borderRadius: "20px",
        padding: "24px",
      }}
    >
      <div style={{ color: "#8892A4", marginBottom: "10px" }}>{title}</div>
      <div style={{ color, fontSize: "34px", fontWeight: 800 }}>{value}</div>
    </div>
  );
}