import { useState, useEffect, useRef } from "react";

const CYAN = "#00D4FF";
const DANGER = "#FF3B5C";
const WARN = "#FFB547";
const SUCCESS = "#00E5A0";

function useCountUp(target, duration = 2000, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const prog = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      setVal(Math.floor(ease * target));
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return val;
}

function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;
    const N = 60;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < N; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,212,255,0.4)";
        ctx.fill();
        for (let j = i + 1; j < N; j++) {
          const q = pts[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(0,212,255,${0.12 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

function FloatingCard({ style, children, delay = 0 }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      position: "absolute",
      background: "rgba(17,19,24,0.85)",
      border: "1px solid rgba(0,212,255,0.18)",
      borderRadius: 12,
      padding: "12px 16px",
      backdropFilter: "blur(12px)",
      boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,212,255,0.06)",
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(12px)",
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

function StatCard({ label, value, unit, color, delay, trend }) {
  const [started, setStarted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setStarted(true), delay + 400); return () => clearTimeout(t); }, [delay]);
  const count = useCountUp(value, 1800, started);
  return (
    <FloatingCard delay={delay} style={{}}>
      <div style={{ fontSize: 11, color: "#8892A4", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", marginBottom: 6, textTransform: "uppercase" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{count.toLocaleString()}</span>
        <span style={{ fontSize: 13, color: "#8892A4", fontFamily: "'JetBrains Mono', monospace" }}>{unit}</span>
      </div>
      {trend && <div style={{ marginTop: 4, fontSize: 11, color: SUCCESS, fontFamily: "'JetBrains Mono', monospace" }}>{trend}</div>}
    </FloatingCard>
  );
}

function RiskCard({ delay }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  const machines = [
    { id: "MCH-017", score: 94, status: DANGER, label: "CRITICAL" },
    { id: "MCH-042", score: 71, status: WARN, label: "HIGH" },
    { id: "MCH-008", score: 28, status: SUCCESS, label: "HEALTHY" },
  ];
  return (
    <FloatingCard delay={delay} style={{}}>
      <div style={{ fontSize: 11, color: "#8892A4", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", marginBottom: 10, textTransform: "uppercase" }}>Risk Monitor</div>
      {machines.map((m, i) => (
        <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < 2 ? 8 : 0, opacity: vis ? 1 : 0, transition: `opacity 0.5s ease ${delay + i * 150}ms` }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: m.status, flexShrink: 0, boxShadow: `0 0 8px ${m.status}` }} />
          <span style={{ fontSize: 12, color: "#8892A4", fontFamily: "'JetBrains Mono', monospace", flex: 1 }}>{m.id}</span>
          <div style={{ width: 60, height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${m.score}%`, height: "100%", background: m.status, borderRadius: 2, transition: `width 1.2s ease ${delay + i * 150 + 400}ms`, ...(vis ? {} : { width: 0 }) }} />
          </div>
          <span style={{ fontSize: 10, color: m.status, fontFamily: "'JetBrains Mono', monospace", minWidth: 44, textAlign: "right" }}>{m.label}</span>
        </div>
      ))}
    </FloatingCard>
  );
}

function SHAPCard({ delay }) {
  const bars = [
    { label: "Tool Wear", val: 0.73, color: DANGER },
    { label: "Torque", val: 0.51, color: WARN },
    { label: "RPM", val: 0.38, color: CYAN },
    { label: "Air Temp", val: 0.22, color: "#8892A4" },
  ];
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay + 300); return () => clearTimeout(t); }, [delay]);
  return (
    <FloatingCard delay={delay} style={{}}>
      <div style={{ fontSize: 11, color: "#8892A4", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", marginBottom: 10, textTransform: "uppercase" }}>SHAP Explainability</div>
      {bars.map((b, i) => (
        <div key={b.label} style={{ marginBottom: i < 3 ? 7 : 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ fontSize: 11, color: "#8892A4", fontFamily: "'DM Sans', sans-serif" }}>{b.label}</span>
            <span style={{ fontSize: 11, color: b.color, fontFamily: "'JetBrains Mono', monospace" }}>{b.val.toFixed(2)}</span>
          </div>
          <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 2, background: b.color, width: vis ? `${b.val * 100}%` : "0%", transition: `width 1s ease ${delay + i * 120 + 400}ms` }} />
          </div>
        </div>
      ))}
    </FloatingCard>
  );
}

function PulseDot({ color }) {
  return (
    <span style={{ position: "relative", display: "inline-block", width: 8, height: 8 }}>
      <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color, animation: "pulse-ring 2s ease-out infinite", opacity: 0.4 }} />
      <span style={{ position: "absolute", inset: 1, borderRadius: "50%", background: color }} />
    </span>
  );
}

export default function AegisHero() {
  const [titleVis, setTitleVis] = useState(false);
  const [subVis, setSubVis] = useState(false);
  const [ctaVis, setCtaVis] = useState(false);
  const [badgeVis, setBadgeVis] = useState(false);

  useEffect(() => {
    setTimeout(() => setBadgeVis(true), 100);
    setTimeout(() => setTitleVis(true), 300);
    setTimeout(() => setSubVis(true), 700);
    setTimeout(() => setCtaVis(true), 1100);
  }, []);

  const words = ["Predict.", "Protect.", "Perform."];
  const wordColors = [CYAN, SUCCESS, "#F0F2F8"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@400;500&display=swap');
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:.4} 70%{transform:scale(2.2);opacity:0} 100%{transform:scale(2.2);opacity:0} }
        @keyframes float-a { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
        @keyframes float-b { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(6px)} }
        @keyframes float-c { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-5px)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes scan { 0%{transform:translateY(-100%);opacity:0} 20%{opacity:1} 80%{opacity:1} 100%{transform:translateY(400%);opacity:0} }
        @keyframes title-word { 0%{opacity:0;transform:translateY(32px) skewY(4deg)} 100%{opacity:1;transform:translateY(0) skewY(0)} }
        @keyframes glow-pulse { 0%,100%{opacity:0.35} 50%{opacity:0.6} }
        @keyframes badge-in { 0%{opacity:0;transform:translateY(-8px)} 100%{opacity:1;transform:translateY(0)} }
        .hero-btn { background: transparent; border: 1px solid rgba(0,212,255,0.4); color: #00D4FF; padding: 14px 32px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.2s; letter-spacing: 0.01em; }
        .hero-btn:hover { background: rgba(0,212,255,0.08); border-color: rgba(0,212,255,0.8); box-shadow: 0 0 20px rgba(0,212,255,0.2); transform: translateY(-1px); }
        .hero-btn-ghost { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: #8892A4; padding: 14px 28px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 15px; cursor: pointer; transition: all 0.2s; }
        .hero-btn-ghost:hover { background: rgba(255,255,255,0.08); color: #F0F2F8; transform: translateY(-1px); }
        .float-card-a { animation: float-a 6s ease-in-out infinite; }
        .float-card-b { animation: float-b 7s ease-in-out infinite; }
        .float-card-c { animation: float-c 5.5s ease-in-out infinite; }
        .float-card-d { animation: float-a 8s ease-in-out infinite; }
      `}</style>

      <div style={{
        position: "relative",
        minHeight: "100vh",
        background: "#0A0B0F",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        padding: "80px 24px 120px",
      }}>
        {/* Particle canvas */}
        <ParticleCanvas />

        {/* Ambient glow orbs */}
        <div style={{ position: "absolute", top: "20%", left: "15%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)", animation: "glow-pulse 4s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,229,160,0.05) 0%, transparent 70%)", animation: "glow-pulse 5s ease-in-out infinite 1s", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "60%", left: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,59,92,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Scan line effect */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent)", animation: "scan 6s ease-in-out infinite 2s" }} />
        </div>

        {/* Grid overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }} />

        {/* Badge */}
        <div style={{
          opacity: badgeVis ? 1 : 0,
          transform: badgeVis ? "translateY(0)" : "translateY(-8px)",
          transition: "all 0.6s ease",
          marginBottom: 32,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(0,212,255,0.07)",
          border: "1px solid rgba(0,212,255,0.2)",
          borderRadius: 100,
          padding: "7px 18px",
          fontSize: 12,
          color: CYAN,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.06em",
        }}>
          <PulseDot color={SUCCESS} />
          <span style={{ marginLeft: 4 }}>LIVE · 247 machines monitored · 0 unplanned failures today</span>
        </div>

        {/* Main title */}
        <div style={{ textAlign: "center", position: "relative", zIndex: 2, maxWidth: 900, width: "100%" }}>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(72px, 12vw, 140px)",
            fontWeight: 800,
            lineHeight: 0.92,
            letterSpacing: "-0.04em",
            margin: "0 0 8px",
            background: "linear-gradient(135deg, #F0F2F8 30%, rgba(0,212,255,0.7) 70%, #F0F2F8 100%)",
            backgroundSize: "300% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: titleVis ? "shimmer 8s linear infinite" : "none",
            opacity: titleVis ? 1 : 0,
            transform: titleVis ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
          }}>
            AegisAI
          </h1>

          {/* Tagline — animated word by word */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginTop: 20,
            marginBottom: 32,
            flexWrap: "wrap",
          }}>
            {words.map((w, i) => (
              <span key={w} style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(24px, 4vw, 42px)",
                fontWeight: 700,
                color: wordColors[i],
                opacity: subVis ? 1 : 0,
                transform: subVis ? "translateY(0) skewY(0)" : "translateY(20px) skewY(3deg)",
                transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${700 + i * 120}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${700 + i * 120}ms`,
                textShadow: i === 0 ? `0 0 40px rgba(0,212,255,0.4)` : i === 1 ? `0 0 40px rgba(0,229,160,0.3)` : "none",
              }}>
                {w}
              </span>
            ))}
          </div>

          {/* Subtitle */}
          <p style={{
            fontSize: "clamp(15px, 2vw, 19px)",
            color: "#8892A4",
            maxWidth: 600,
            margin: "0 auto 48px",
            lineHeight: 1.65,
            opacity: subVis ? 1 : 0,
            transform: subVis ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease 1000ms, transform 0.7s ease 1000ms",
          }}>
            AI-powered predictive maintenance platform that eliminates unplanned downtime, reduces costs by up to 40%, and surfaces machine failures before they happen.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
            opacity: ctaVis ? 1 : 0,
            transform: ctaVis ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}>
           <button
  className="hero-btn"
  onClick={() => (window.location.href = "/auth")}
>
  Launch Dashboard →
</button>
<button
  className="hero-btn secondary"
  onClick={() => (window.location.href = "/auth")}
>
  View Demo
</button>
          </div>

          {/* Trust bar */}
          <div style={{
            marginTop: 64,
            display: "flex",
            justifyContent: "center",
            gap: 40,
            flexWrap: "wrap",
            opacity: ctaVis ? 1 : 0,
            transition: "opacity 0.8s ease 200ms",
          }}>
            {[
              { val: "99.2%", label: "Recall Rate" },
              { val: "40%", label: "Cost Reduction" },
              { val: "<50ms", label: "Inference Latency" },
              { val: "6 Models", label: "Benchmarked" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: "#F0F2F8" }}>{s.val}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#4A5568", textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Cards — desktop positioned around hero */}
        <div style={{ position: "absolute", top: "18%", left: "4%", zIndex: 3 }} className="float-card-a">
          <StatCard label="Fleet Health Score" value={87} unit="%" color={SUCCESS} delay={1400} trend="↑ 3.2% this week" />
        </div>

        <div style={{ position: "absolute", top: "22%", right: "8%", zIndex: 3 }} className="float-card-b">
          <StatCard label="Failures Predicted" value={12} unit="this month" color={WARN} delay={1600} trend="↓ 8 vs last month" />
        </div>

        <div style={{ position: "absolute", bottom: "22%", left: "3%", zIndex: 3 }} className="float-card-c">
          <RiskCard delay={1800} />
        </div>

        <div style={{ position: "absolute", bottom: "20%", right: "10%", zIndex: 3 }} className="float-card-d">
          <SHAPCard delay={2000} />
        </div>

        {/* Bottom gradient fade */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(transparent, #0A0B0F)", pointerEvents: "none" }} />
      </div>

      {/* Feature strip below hero */}
      <div style={{
        background: "#111318",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "64px 24px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 1,
      }}>
        {[
          { icon: "⚡", title: "Real-Time Risk Scoring", desc: "Calibrated failure probability across your entire fleet, updated every cycle." },
          { icon: "🔬", title: "SHAP Explainability", desc: "Understand exactly why each machine was flagged. Not a black box." },
          { icon: "📅", title: "Maintenance Scheduling", desc: "Automatically generate optimal maintenance windows based on RUL estimates." },
          { icon: "💬", title: "AI Copilot", desc: "Ask questions about any machine in natural language. Get instant diagnostic context." },
        ].map((f) => (
          <div key={f.title} style={{
            padding: "32px 28px",
            background: "#111318",
            borderRight: "1px solid rgba(255,255,255,0.04)",
          }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>{f.icon}</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#F0F2F8", marginBottom: 8 }}>{f.title}</div>
            <div style={{ fontSize: 14, color: "#8892A4", lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </>
  );
}
