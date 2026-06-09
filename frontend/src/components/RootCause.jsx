const causes = [
    { factor: "Torque", impact: 34, reason: "Operating above normal torque range", color: "#FFB547" },
    { factor: "Rotational Speed", impact: 29, reason: "RPM instability detected", color: "#00D4FF" },
    { factor: "Tool Wear", impact: 21, reason: "Tool wear is approaching risky range", color: "#FF3B5C" },
  ];
  
  export default function RootCause() {
    return (
      <div
        style={{
          marginTop: "40px",
          background: "#111318",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "22px",
          padding: "28px",
        }}
      >
        <h3 style={{ fontSize: "32px", marginBottom: "10px" }}>
          Root Cause Analysis
        </h3>
  
        <p style={{ color: "#8892A4", marginBottom: "24px" }}>
          AegisAI explains which sensor patterns are contributing most to machine failure risk.
        </p>
  
        <div style={{ display: "grid", gap: "18px" }}>
          {causes.map((c) => (
            <div key={c.factor}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <strong>{c.factor}</strong>
                <span style={{ color: c.color }}>{c.impact}% impact</span>
              </div>
  
              <div
                style={{
                  height: "8px",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "999px",
                  overflow: "hidden",
                  marginBottom: "6px",
                }}
              >
                <div
                  style={{
                    width: `${c.impact}%`,
                    height: "100%",
                    background: c.color,
                  }}
                />
              </div>
  
              <p style={{ color: "#8892A4", margin: 0 }}>
                {c.reason}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }