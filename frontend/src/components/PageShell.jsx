import { useNavigate, useLocation } from "react-router-dom";
import "../dashboard.css";

export default function PageShell({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === "/dashboard";

  return (
    <div className="shell-root">
      <header className="shell-topbar">
        <div className="shell-topbar-left">
          <button
            className="shell-back-btn"
            onClick={() => navigate(isDashboard ? "/" : "/dashboard")}
          >
            <span className="shell-back-arrow">←</span>
            {isDashboard ? "Landing Page" : "Command Center"}
          </button>
        </div>

        <div className="shell-topbar-center">
          <div className="shell-status-pill">
            <span className="shell-live-dot" />
            LIVE · 247 assets monitored
          </div>
        </div>

        <div className="shell-topbar-right">
          <div className="shell-sys-stat shell-sys-ok">
            <span className="shell-sys-dot" />
            Systems Nominal
          </div>
        </div>
      </header>

      <main className="shell-main">{children}</main>
    </div>
  );
}