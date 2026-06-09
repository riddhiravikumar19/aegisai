import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AuthPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  async function handleAuth() {
    setMessage("");

    if (!email || (mode !== "reset" && !password)) {
      setMessage("Please fill all required fields.");
      setMessageType("error");
      return;
    }

    if (mode === "reset") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:5173/reset-password",
      });

      if (error) {
        setMessage(error.message);
        setMessageType("error");
      } else {
        setMessage("Password reset link sent to your email.");
        setMessageType("success");
      }

      return;
    }

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (result.error) {
      setMessage(result.error.message);
      setMessageType("error");
      return;
    }

    if (mode === "signup") {
      setMessage("Account created. Please check your email or login.");
      setMessageType("success");
      setMode("login");
      return;
    }

    navigate("/dashboard");
  }

  return (
    <main style={styles.page}>
      <section style={styles.left}>
        <div style={styles.badge}>Industrial AI Platform</div>

        <h1 style={styles.logo}>AegisAI</h1>

        <h2 style={styles.title}>
          Predict. Protect. Perform.
        </h2>

        <p style={styles.subtitle}>
          Secure access to your predictive maintenance command center.
        </p>
      </section>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>
          {mode === "login" && "Welcome back"}
          {mode === "signup" && "Create account"}
          {mode === "reset" && "Reset password"}
        </h2>

        <p style={styles.cardSub}>
          {mode === "login" && "Login to continue to AegisAI Command Center."}
          {mode === "signup" && "Create your AegisAI operator account."}
          {mode === "reset" && "Enter your email to receive a reset link."}
        </p>

        {message && (
          <div
            style={{
              ...styles.message,
              borderColor:
                messageType === "error"
                  ? "rgba(255,59,92,0.35)"
                  : "rgba(0,229,160,0.35)",
              color: messageType === "error" ? "#FF3B5C" : "#00E5A0",
              background:
                messageType === "error"
                  ? "rgba(255,59,92,0.08)"
                  : "rgba(0,229,160,0.08)",
            }}
          >
            {message}
          </div>
        )}

        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {mode !== "reset" && (
          <>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              placeholder="Enter password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}

        <button style={styles.primaryBtn} onClick={handleAuth}>
          {mode === "login" && "Sign In"}
          {mode === "signup" && "Create Account"}
          {mode === "reset" && "Send Reset Link"}
        </button>

        {mode === "login" && (
          <button style={styles.linkBtn} onClick={() => setMode("reset")}>
            Forgot password?
          </button>
        )}

        <div style={styles.switchText}>
          {mode === "login" && "New to AegisAI?"}
          {mode === "signup" && "Already have an account?"}
          {mode === "reset" && "Remembered your password?"}

          <button
            style={styles.switchBtn}
            onClick={() =>
              setMode(mode === "login" ? "signup" : "login")
            }
          >
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 20% 20%, rgba(0,212,255,0.16), transparent 30%), radial-gradient(circle at 80% 80%, rgba(0,229,160,0.12), transparent 35%), #0A0B0F",
    color: "#F0F2F8",
    display: "grid",
    gridTemplateColumns: "1fr 440px",
    gap: "48px",
    alignItems: "center",
    padding: "60px 8%",
    fontFamily: "DM Sans, sans-serif",
  },
  left: {
    maxWidth: "680px",
  },
  badge: {
    display: "inline-block",
    color: "#00D4FF",
    border: "1px solid rgba(0,212,255,0.25)",
    borderRadius: "999px",
    padding: "8px 14px",
    marginBottom: "24px",
  },
  logo: {
    fontSize: "96px",
    margin: 0,
    letterSpacing: "-0.06em",
    background: "linear-gradient(90deg, #F0F2F8, #00D4FF)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  title: {
    fontSize: "36px",
    marginTop: "16px",
  },
  subtitle: {
    color: "#8892A4",
    fontSize: "18px",
    lineHeight: 1.7,
    maxWidth: "560px",
  },
  card: {
    background: "rgba(17,19,24,0.92)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "28px",
    padding: "36px",
    boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
  },
  cardTitle: {
    fontSize: "34px",
    margin: 0,
  },
  cardSub: {
    color: "#8892A4",
    marginBottom: "24px",
    lineHeight: 1.6,
  },
  message: {
    border: "1px solid",
    borderRadius: "12px",
    padding: "12px 14px",
    marginBottom: "18px",
    fontSize: "14px",
  },
  label: {
    display: "block",
    color: "#8892A4",
    marginTop: "16px",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    background: "#0A0B0F",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "14px",
    padding: "15px",
    color: "#F0F2F8",
    outline: "none",
  },
  primaryBtn: {
    width: "100%",
    background: "#00D4FF",
    color: "#0A0B0F",
    border: "none",
    borderRadius: "14px",
    padding: "15px",
    fontWeight: 800,
    marginTop: "24px",
    cursor: "pointer",
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#00D4FF",
    marginTop: "16px",
    cursor: "pointer",
  },
  switchText: {
    color: "#8892A4",
    marginTop: "24px",
  },
  switchBtn: {
    background: "none",
    border: "none",
    color: "#00D4FF",
    marginLeft: "8px",
    cursor: "pointer",
  },
};