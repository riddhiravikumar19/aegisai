import StatCard from "./components/StatCard";
import PriorityQueue from "./components/PriorityQueue";
import CostSavings from "./components/CostSavings";
import RootCause from "./components/RootCause";

export default function DashboardPreview() {
  return (
    <section
      style={{
        minHeight: "100vh",
        background: "#0A0B0F",
        color: "#F0F2F8",
        padding: "80px 8%",
      }}
    >
      <h2 style={{ fontSize: "56px", marginBottom: "12px" }}>
        Command Center
      </h2>

      <p style={{ color: "#8892A4", marginBottom: "50px" }}>
        Monitor machine health, failure probability, root causes, and maintenance priorities.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "24px",
        }}
      >
        <StatCard title="Fleet Health" value="87%" color="#00E5A0" />
        <StatCard title="Critical Machines" value="12" color="#FF3B5C" />
        <StatCard title="Estimated Savings" value="$18k" color="#00D4FF" />
        <StatCard title="Average Health" value="92/100" color="#FFFFFF" />
      </div>

      <PriorityQueue />
      <CostSavings />
      <RootCause />
    </section>
  );
}