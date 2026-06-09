export default function CostSavings() {
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
        <h3 style={{ fontSize: "32px", marginBottom: "18px" }}>
          Cost Savings Engine
        </h3>
  
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
          }}
        >
          <div>
            <p style={{ color: "#8892A4" }}>Potential Downtime Cost</p>
            <h2 style={{ color: "#FF3B5C" }}>$24,000</h2>
          </div>
  
          <div>
            <p style={{ color: "#8892A4" }}>Preventive Maintenance Cost</p>
            <h2 style={{ color: "#FFB547" }}>$5,600</h2>
          </div>
  
          <div>
            <p style={{ color: "#8892A4" }}>Estimated Savings</p>
            <h2 style={{ color: "#00E5A0" }}>$18,400</h2>
          </div>
        </div>
      </div>
    );
  }