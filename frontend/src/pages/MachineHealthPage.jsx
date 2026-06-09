import PageShell from "../components/PageShell";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const healthTrend = [
  { day: "Mon", health: 94 },
  { day: "Tue", health: 91 },
  { day: "Wed", health: 88 },
  { day: "Thu", health: 82 },
  { day: "Fri", health: 76 },
  { day: "Sat", health: 68 },
  { day: "Sun", health: 61 },
];

const machines = [
  { id: "MCH-017", health: 42, risk: "Critical", status: "Immediate inspection" },
  { id: "MCH-042", health: 68, risk: "High", status: "Schedule today" },
  { id: "MCH-091", health: 74, risk: "Medium", status: "Monitor closely" },
  { id: "MCH-008", health: 96, risk: "Low", status: "Stable" },
];

function getRiskColor(risk) {
  if (risk === "Critical") return "#FF3B5C";
  if (risk === "High") return "#FFB547";
  if (risk === "Medium") return "#00D4FF";
  return "#00E5A0";
}

export default function MachineHealthPage() {
  return (
    <PageShell>
      <div style={{ padding: "48px 40px" }}>
        <h1 style={{ fontSize: "52px", marginBottom: "12px" }}>
          Machine Health Center
        </h1>

        <p style={{ color: "#8892A4", marginBottom: "32px" }}>
          Monitor fleet health, machine degradation, and sensor-driven operational status.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          {[
            ["Fleet Health", "87%", "#00E5A0"],
            ["Machines Online", "247", "#00D4FF"],
            ["Critical Assets", "12", "#FF3B5C"],
            ["Healthy Assets", "219", "#00E5A0"],
          ].map(([label, value, color]) => (
            <div
              key={label}
              style={{
                background: "#111318",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "18px",
                padding: "24px",
              }}
            >
              <p style={{ color: "#8892A4", margin: 0 }}>{label}</p>
              <h2 style={{ color, fontSize: "36px", marginTop: "12px" }}>
                {value}
              </h2>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "#111318",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "32px",
          }}
        >
          <h2>Fleet Health Trend</h2>

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={healthTrend}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="day" stroke="#8892A4" />
                <YAxis stroke="#8892A4" />
                <Tooltip
                  contentStyle={{
                    background: "#0A0B0F",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#F0F2F8",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="health"
                  stroke="#00D4FF"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          style={{
            background: "#111318",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            padding: "24px",
          }}
        >
          <h2>Machine Status Table</h2>

          <div style={{ display: "grid", gap: "14px", marginTop: "20px" }}>
            {machines.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 2fr",
                  gap: "16px",
                  alignItems: "center",
                  padding: "18px",
                  background: "#0A0B0F",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "14px",
                }}
              >
                <strong>{m.id}</strong>
                <span>{m.health}/100 Health</span>
                <span style={{ color: getRiskColor(m.risk) }}>{m.risk}</span>
                <span style={{ color: "#8892A4" }}>{m.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}