import PageShell from "../components/PageShell";

export default function RULPage() {
  const machine = {
    id: "MCH-017",
    toolWear: 218,
    torque: 68.5,
    rpm: 1280,
    health: 42,
  };

  const remainingDays = Math.max(3, Math.round((260 - machine.toolWear) / 2));
  const lowerBound = Math.max(1, remainingDays - 5);
  const upperBound = remainingDays + 6;

  return (
    <PageShell>
      <div style={{ padding: "48px 40px" }}>
        <h1 style={{ fontSize: "52px", marginBottom: "12px" }}>
          Remaining Useful Life
        </h1>

        <p style={{ color: "#8892A4", marginBottom: "40px" }}>
          Estimate the remaining safe operating period before maintenance is required.
        </p>

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
              borderRadius: "22px",
              padding: "32px",
            }}
          >
            <h2>{machine.id}</h2>

            <div
              style={{
                fontSize: "78px",
                fontWeight: 800,
                color: "#00E5A0",
                marginTop: "20px",
              }}
            >
              {remainingDays}
            </div>

            <p style={{ color: "#8892A4", fontSize: "20px" }}>
              Estimated days remaining
            </p>

            <div
              style={{
                marginTop: "28px",
                padding: "18px",
                borderRadius: "14px",
                background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.18)",
                color: "#00D4FF",
              }}
            >
              Confidence Band: {lowerBound}–{upperBound} days
            </div>
          </div>

          <div
            style={{
              background: "#111318",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "22px",
              padding: "32px",
            }}
          >
            <h2>RUL Factors</h2>

            <Info label="Tool Wear" value={`${machine.toolWear} min`} color="#FF3B5C" />
            <Info label="Torque" value={`${machine.torque} Nm`} color="#FFB547" />
            <Info label="RPM" value={machine.rpm} color="#00D4FF" />
            <Info label="Health Score" value={`${machine.health}/100`} color="#00E5A0" />

            <p style={{ color: "#8892A4", lineHeight: 1.8, marginTop: "24px" }}>
              AegisAI estimates RUL using tool wear, torque load, and machine health.
              Maintenance should be scheduled before the confidence band reaches the lower threshold.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Info({ label, value, color }) {
  return (
    <div style={{ marginTop: "18px" }}>
      <div style={{ color: "#8892A4" }}>{label}</div>
      <div style={{ color, fontSize: "28px", fontWeight: 700 }}>{value}</div>
    </div>
  );
}