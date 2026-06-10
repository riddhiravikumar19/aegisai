import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";

function getColor(urgency) {
  if (urgency === "Critical") return "#FF3B5C";
  if (urgency === "High") return "#FFB547";
  if (urgency === "Medium") return "#00D4FF";
  return "#00E5A0";
}

export default function PriorityPage() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scannedCount, setScannedCount] = useState(0);

  async function loadMachines() {
    setLoading(true);

    try {
      const collected = [];
      const seenMachines = new Set();

      for (let i = 0; i < 40; i++) {
        const res = await fetch("http://127.0.0.1:8000/live-machines");
        const machine = await res.json();

        if (!seenMachines.has(machine.machine_id)) {
          seenMachines.add(machine.machine_id);

          collected.push({
            machine_id: machine.machine_id,
            Type: machine.type,
            air_temperature: machine.air_temperature,
            process_temperature: machine.process_temperature,
            rotational_speed: machine.rotational_speed,
            torque: machine.torque,
            tool_wear: machine.tool_wear,
          });
        }
      }

      setScannedCount(collected.length);

      const priorityRes = await fetch("http://127.0.0.1:8000/priority", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(collected),
      });

      const data = await priorityRes.json();

      const attentionMachines = data.queue
        .filter((machine) => machine.urgency !== "Low")
        .slice(0, 6);

      setQueue(
        attentionMachines.length > 0
          ? attentionMachines
          : data.queue.slice(0, 6)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to generate priority queue.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMachines();
  }, []);

  return (
    <PageShell>
      <div style={{ padding: "48px 40px" }}>
        <h1 style={{ fontSize: "52px", marginBottom: "12px" }}>
          Maintenance Priority Queue
        </h1>

        <p style={{ color: "#8892A4", marginBottom: "12px" }}>
          Real-time maintenance ranking generated from live machine telemetry,
          failure risk, RUL, and urgency.
        </p>

        <p style={{ color: "#00D4FF", marginBottom: "24px" }}>
          {scannedCount > 0
            ? `Scanned ${scannedCount} live machines and ranked highest-priority assets.`
            : "Preparing live maintenance ranking..."}
        </p>

        <button
          onClick={loadMachines}
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
          {loading ? "Ranking Machines..." : "Refresh Priority Queue"}
        </button>

        <div style={{ display: "grid", gap: "18px" }}>
          {queue.map((item, index) => {
            const color = getColor(item.urgency);

            return (
              <div
                key={`${item.machine_id}-${index}`}
                style={{
                  background: "#111318",
                  border: `1px solid ${color}55`,
                  borderRadius: "20px",
                  padding: "24px",
                  display: "grid",
                  gridTemplateColumns: "80px 1fr 1fr 1fr 1fr 1.4fr",
                  gap: "18px",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ color: "#8892A4", fontSize: "12px" }}>Rank</div>
                  <div style={{ color, fontSize: "32px", fontWeight: 800 }}>
                    #{index + 1}
                  </div>
                </div>

                <div>
                  <div style={{ color: "#8892A4", fontSize: "12px" }}>
                    Machine
                  </div>
                  <div
                    style={{
                      color: "#F0F2F8",
                      fontSize: "22px",
                      fontWeight: 700,
                    }}
                  >
                    {item.machine_id}
                  </div>
                </div>

                <div>
                  <div style={{ color: "#8892A4", fontSize: "12px" }}>Risk</div>
                  <div style={{ color }}>{item.risk_score}%</div>
                </div>

                <div>
                  <div style={{ color: "#8892A4", fontSize: "12px" }}>RUL</div>
                  <div style={{ color }}>{item.rul_days} days</div>
                </div>

                <div>
                  <div style={{ color: "#8892A4", fontSize: "12px" }}>
                    Priority
                  </div>
                  <div style={{ color }}>{item.priority_score}</div>
                </div>

                <div>
                  <div style={{ color, fontWeight: 700 }}>{item.urgency}</div>
                  <div style={{ color: "#8892A4", marginTop: "6px" }}>
                    {item.action}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {queue.length === 0 && !loading && (
          <p style={{ color: "#8892A4" }}>No machines ranked yet.</p>
        )}
      </div>
    </PageShell>
  );
}