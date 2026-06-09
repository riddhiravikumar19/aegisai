export default function StatCard({
    title,
    value,
    color
  }) {
    return (
      <div
        style={{
          background: "#111318",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "20px",
          padding: "24px",
          minHeight: "140px"
        }}
      >
        <div
          style={{
            color: "#8892A4",
            fontSize: "14px",
            marginBottom: "16px"
          }}
        >
          {title}
        </div>
  
        <div
          style={{
            fontSize: "42px",
            fontWeight: 700,
            color
          }}
        >
          {value}
        </div>
      </div>
    );
  }