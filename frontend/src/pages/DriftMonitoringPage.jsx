import PageShell from "../components/PageShell";

const driftMetrics = [
  {
    feature: "Torque",
    drift: 12,
    status: "Warning",
    color: "#FFB547",
  },
  {
    feature: "Tool Wear",
    drift: 21,
    status: "Critical",
    color: "#FF3B5C",
  },
  {
    feature: "Rotational Speed",
    drift: 4,
    status: "Healthy",
    color: "#00E5A0",
  },
  {
    feature: "Air Temperature",
    drift: 3,
    status: "Healthy",
    color: "#00E5A0",
  },
];

export default function DriftMonitoringPage() {
  return (
    <PageShell showBackButton={true}>
      <div style={{ padding: "48px 40px" }}>
        <h1 style={{ fontSize: "52px", marginBottom: "12px" }}>
          Data Drift Monitor
        </h1>

        <p style={{ color: "#8892A4", marginBottom: "40px" }}>
          Compare incoming machine telemetry against training data distributions.
        </p>

        <div
          style={{
            background: "#111318",
            borderRadius: "20px",
            padding: "28px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {driftMetrics.map((item) => (
            <div
              key={item.feature}
              style={{
                marginBottom: "28px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <strong>{item.feature}</strong>

                <span style={{ color: item.color }}>
                  {item.drift}% Drift
                </span>
              </div>

              <div
                style={{
                  height: "10px",
                  background: "#222",
                  borderRadius: "999px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${item.drift * 3}%`,
                    height: "100%",
                    background: item.color,
                  }}
                />
              </div>

              <div
                style={{
                  marginTop: "8px",
                  color: item.color,
                }}
              >
                {item.status}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "28px",
            padding: "24px",
            borderRadius: "20px",
            background: "rgba(255,59,92,0.08)",
            border: "1px solid rgba(255,59,92,0.15)",
          }}
        >
          <h3 style={{ color: "#FF3B5C" }}>
            Drift Alert
          </h3>

          <p style={{ color: "#8892A4" }}>
            Tool Wear distribution differs significantly from the training dataset.
            Consider retraining the model with recent production data.
          </p>
        </div>
      </div>
    </PageShell>
  );
}