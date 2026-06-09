import PageShell from "../components/PageShell";

export default function CostSavingsPage() {
  const failureCost = 120000;
  const maintenanceCost = 15000;

  const savings = failureCost - maintenanceCost;
  const roi = ((savings / maintenanceCost) * 100).toFixed(0);

  return (
    <PageShell showBackButton={true}>
      <div style={{ padding: "48px 40px" }}>
        <h1 style={{ fontSize: "52px", marginBottom: "12px" }}>
          Cost Savings Engine
        </h1>

        <p style={{ color: "#8892A4", marginBottom: "40px" }}>
          Estimate the financial impact of proactive maintenance decisions.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: "24px",
          }}
        >
          <Card
            title="Predicted Failure Cost"
            value={`₹${failureCost.toLocaleString()}`}
            color="#FF3B5C"
          />

          <Card
            title="Preventive Maintenance Cost"
            value={`₹${maintenanceCost.toLocaleString()}`}
            color="#FFB547"
          />

          <Card
            title="Potential Savings"
            value={`₹${savings.toLocaleString()}`}
            color="#00E5A0"
          />

          <Card
            title="ROI"
            value={`${roi}%`}
            color="#00D4FF"
          />
        </div>

        <div
          style={{
            marginTop: "32px",
            background: "#111318",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            padding: "28px",
          }}
        >
          <h2>AI Financial Recommendation</h2>

          <p
            style={{
              color: "#8892A4",
              lineHeight: 1.8,
              marginTop: "18px",
            }}
          >
            AegisAI predicts that proactive maintenance on high-risk machines
            could prevent approximately ₹1.2 lakh in downtime-related losses.
            Performing maintenance now costs only ₹15,000, resulting in an
            estimated ROI of {roi}%.
          </p>
        </div>
      </div>
    </PageShell>
  );
}

function Card({ title, value, color }) {
  return (
    <div
      style={{
        background: "#111318",
        border: `1px solid ${color}33`,
        borderRadius: "20px",
        padding: "28px",
      }}
    >
      <div
        style={{
          color: "#8892A4",
          marginBottom: "14px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "36px",
          fontWeight: 700,
          color,
        }}
      >
        {value}
      </div>
    </div>
  );
}