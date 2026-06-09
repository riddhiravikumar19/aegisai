import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import "../dashboard.css";

const METRICS = [
  { label: "Fleet Health", value: 87, unit: "%", delta: "+3.2", good: true },
  { label: "At-Risk Assets", value: 12, unit: "", delta: "-4", good: true },
  { label: "Uptime (30d)", value: 99.1, unit: "%", delta: "+0.4", good: true },
  { label: "Avoided Cost", value: "₹4.2", unit: "L", delta: "+₹0.8L", good: true },
  { label: "Open Alerts", value: 3, unit: "", delta: "+1", good: false },
];

const MODULES = [
  {
    id: "priority",
    route: "/priority",
    label: "Maintenance Priority Queue",
    sub: "Ranked machine urgency across your fleet",
    tag: "OPERATIONS",
    stat: "12 machines queued",
    accent: "#FFB547",
    badge: "3 CRITICAL",
  },
  {
    id: "cost",
    route: "/cost-savings",
    label: "Cost Savings Engine",
    sub: "Quantified ROI from proactive interventions",
    tag: "FINANCE",
    stat: "₹4.2L saved this month",
    accent: "#00E5A0",
    badge: "↑ 18% MoM",
  },
  {
    id: "rca",
    route: "/root-cause",
    label: "Root Cause Analysis",
    sub: "Failure attribution using explainable AI",
    tag: "DIAGNOSTICS",
    stat: "7 failure causes identified",
    accent: "#00D4FF",
    badge: "SHAP",
  },
  {
    id: "health",
    route: "/health",
    label: "Machine Health Center",
    sub: "Per-asset vitals, trends, and health status",
    tag: "MONITORING",
    stat: "247 assets online",
    accent: "#A78BFA",
    badge: "2 DEGRADING",
  },
  {
    id: "copilot",
    route: "/copilot",
    label: "AI Maintenance Copilot",
    sub: "Natural language diagnostics for your fleet",
    tag: "AI ASSISTANT",
    stat: "Ask anything about machine risk",
    accent: "#A78BFA",
    badge: "COPILOT",
  },
  {
    id: "predict",
    route: "/predict",
    label: "Live Failure Prediction",
    sub: "Run real-time ML inference on machine telemetry",
    tag: "ML ENGINE",
    stat: "FastAPI model online",
    accent: "#00D4FF",
    badge: "LIVE",
  },
  {
    id: "alerts",
    route: "/alerts",
    label: "Alert Center",
    sub: "Real-time AI generated failure alerts",
    tag: "MONITORING",
    stat: "3 Active Alerts",
    accent: "#FF3B5C",
    badge: "LIVE",
  },
  {
    id: "live",
    route: "/live-monitoring",
    label: "Live Monitoring Stream",
    sub: "AI4I telemetry streamed through FastAPI",
    tag: "REAL TIME",
    stat: "ML inference every 3s",
    accent: "#00E5A0",
    badge: "STREAM",
  },
  {
    id: "rul",
    route: "/rul",
    label: "Remaining Useful Life",
    sub: "Predict maintenance horizon and remaining machine lifespan",
    tag: "RUL",
    stat: "35 days remaining",
    accent: "#00E5A0",
    badge: "ACTIVE",
  },
  {
    id: "drift",
    route: "/drift",
    label: "Drift Monitoring",
    sub: "Monitor training vs live data distribution changes",
    tag: "MLOPS",
    stat: "1 critical drift detected",
    accent: "#FF3B5C",
    badge: "ALERT",
  },
  {
    id: "benchmark",
    route: "/model-performance",
    label: "Model Benchmarking",
    sub: "Compare Random Forest and XGBoost performance",
    tag: "AI MODELS",
    stat: "ROC-AUC: 96.93%",
    accent: "#00D4FF",
    badge: "XGBOOST",
  },
];

function useClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(new Date().toUTCString().slice(17, 25) + " UTC");
    tick();

    const id = setInterval(tick, 1000);

    return () => clearInterval(id);
  }, []);

  return time;
}

function MetricBar() {
  return (
    <div className="db-metric-bar">
      {METRICS.map((m) => (
        <div key={m.label} className="db-metric-cell">
          <span className="db-metric-label">{m.label}</span>

          <span className="db-metric-val">
            {m.value}
            <span className="db-metric-unit">{m.unit}</span>
          </span>

          <span className={`db-metric-delta ${m.good ? "delta-good" : "delta-bad"}`}>
            {m.delta}
          </span>
        </div>
      ))}
    </div>
  );
}

function ModuleCard({ mod, index, onClick }) {
  return (
    <div
      className="db-card"
      style={{
        "--card-accent": mod.accent,
        animationDelay: `${index * 80}ms`,
      }}
      onClick={onClick}
    >
      <div className="db-card-top">
        <div
          className="db-card-tag"
          style={{
            color: mod.accent,
            borderColor: `${mod.accent}35`,
            background: `${mod.accent}12`,
          }}
        >
          {mod.tag}
        </div>

        <div
          className="db-card-badge"
          style={{
            color: mod.accent,
            borderColor: `${mod.accent}35`,
            background: `${mod.accent}12`,
          }}
        >
          {mod.badge}
        </div>
      </div>

      <div className="db-card-mid">
        <div
          className="db-card-icon-wrap"
          style={{
            borderColor: `${mod.accent}35`,
            background: `${mod.accent}14`,
            color: mod.accent,
          }}
        >
          ●
        </div>

        <div className="db-card-label-group">
          <h3 className="db-card-title">{mod.label}</h3>
          <p className="db-card-sub">{mod.sub}</p>
        </div>
      </div>

      <div className="db-card-bottom">
        <div className="db-card-stat" style={{ color: mod.accent }}>
          {mod.stat}
        </div>

        <div className="db-card-arrow" style={{ color: mod.accent }}>
          →
        </div>
      </div>

      <div className="db-card-accent-line" style={{ background: mod.accent }} />
    </div>
  );
}

export default function DashboardHome() {
  const navigate = useNavigate();
  const time = useClock();

  return (
    <PageShell>
      <div className="db-root">
        <div className="db-bg-grid" />
        <div className="db-bg-scan" />

        <MetricBar />

        <div className="db-header">
          <div className="db-header-left">
            <div className="db-header-eyebrow">
              <span className="db-live-dot" />
              OPERATIONAL · {time}
            </div>

            <h1 className="db-header-title">Command Center</h1>

            <p className="db-header-sub">
              Select a module to begin your analysis session
            </p>
          </div>

          <div className="db-header-right">
            <div className="db-alert-strip">
              <span className="db-alert-dot" />
              <span className="db-alert-text">
                MCH-017 · Critical risk threshold exceeded
              </span>
            </div>

            <div className="db-alert-strip db-alert-warn">
              <span className="db-alert-dot db-alert-dot-warn" />
              <span className="db-alert-text">
                MCH-042 · Torque variance above baseline
              </span>
            </div>
          </div>
        </div>

        <div className="db-module-grid">
          {MODULES.map((mod, i) => (
            <ModuleCard
              key={mod.id}
              mod={mod}
              index={i}
              onClick={() => navigate(mod.route)}
            />
          ))}
        </div>

        <div className="db-footer-row">
          <span className="db-footer-item">AegisAI v2.1.0</span>
          <span className="db-footer-sep">·</span>
          <span className="db-footer-item">Model: Random Forest</span>
          <span className="db-footer-sep">·</span>
          <span className="db-footer-item db-footer-ok">
            All systems operational
          </span>
        </div>
      </div>
    </PageShell>
  );
}