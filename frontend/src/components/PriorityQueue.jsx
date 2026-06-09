const machines = [
    { id: "MCH-017", risk: 94, issue: "High torque + tool wear", action: "Immediate inspection", level: "Critical" },
    { id: "MCH-042", risk: 78, issue: "RPM instability", action: "Schedule today", level: "High" },
    { id: "MCH-091", risk: 63, issue: "Rising temperature", action: "Monitor closely", level: "Medium" },
    { id: "MCH-008", risk: 24, issue: "Normal behavior", action: "Routine check", level: "Low" },
  ];
  
  export default function PriorityQueue() {
    return (
      <div style={{ marginTop: "40px" }}>
        <h3 style={{ fontSize: "32px", marginBottom: "20px" }}>
          Maintenance Priority Queue
        </h3>
  
        <div style={{ display: "grid", gap: "14px" }}>
          {machines.map((m) => (
            <div
              key={m.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: "16px",
                padding: "20px",
                borderRadius: "18px",
                background: "#111318",
                border: "1px solid rgba(255,255,255,0.06)",
                alignItems: "center",
              }}
            >
              <strong>{m.id}</strong>
              <span>{m.risk}% Risk</span>
              <span style={{ color: "#8892A4" }}>{m.issue}</span>
              <span style={{ color: "#00D4FF" }}>{m.action}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }