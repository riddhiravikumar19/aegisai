import PageShell from "../components/PageShell";

const alerts = [
  {
    id: "AL-001",
    machine: "MCH-017",
    severity: "Critical",
    risk: 94,
    cause: "High torque + elevated tool wear",
    action: "Immediate inspection",
    time: "2 min ago",
    color: "#FF3B5C",
  },
  {
    id: "AL-002",
    machine: "MCH-042",
    severity: "High",
    risk: 78,
    cause: "RPM instability detected",
    action: "Schedule maintenance today",
    time: "8 min ago",
    color: "#FFB547",
  },
  {
    id: "AL-003",
    machine: "MCH-091",
    severity: "Medium",
    risk: 63,
    cause: "Temperature drift detected",
    action: "Monitor closely",
    time: "16 min ago",
    color: "#00D4FF",
  },
];

export default function AlertCenterPage() {
  return (
    <PageShell>
      <div style={{ padding: "48px 40px" }}>
        <h1 style={{ fontSize: "52px", marginBottom: "12px" }}>Alert Center</h1>

        <p style={{ color: "#8892A4", marginBottom: "32px" }}>
          AI-generated maintenance alerts triggered by failure probability thresholds.
        </p>

        <div style={{ display: "grid", gap: "18px" }}>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              style={{
                background: "#111318",
                border: `1px solid ${alert.color}55`,
                borderRadius: "20px",
                padding: "24px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2>{alert.machine}</h2>
                <span style={{ color: alert.color }}>{alert.time}</span>
              </div>

              <h3 style={{ color: alert.color }}>
                {alert.severity} Alert · {alert.risk}% Risk
              </h3>

              <p style={{ color: "#8892A4" }}>Cause: {alert.cause}</p>
              <p style={{ color: "#00D4FF" }}>Recommended Action: {alert.action}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}