import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function updatePassword() {
    setMessage("");

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Password updated successfully. Redirecting to login...");

    setTimeout(() => {
      navigate("/auth");
    }, 1200);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0A0B0F",
        color: "#F0F2F8",
        display: "grid",
        placeItems: "center",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      <div
        style={{
          width: "420px",
          background: "#111318",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "32px",
        }}
      >
        <h1>Reset Password</h1>
        <p style={{ color: "#8892A4" }}>Enter your new password.</p>

        {message && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(0,212,255,0.08)",
              color: "#00D4FF",
            }}
          >
            {message}
          </div>
        )}

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            background: "#0A0B0F",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "14px",
            color: "#F0F2F8",
          }}
        />

        <button
          onClick={updatePassword}
          disabled={loading}
          style={{
            width: "100%",
            background: loading ? "#445" : "#00D4FF",
            color: "#0A0B0F",
            border: "none",
            borderRadius: "12px",
            padding: "14px",
            fontWeight: 700,
            marginTop: "20px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </main>
  );
}