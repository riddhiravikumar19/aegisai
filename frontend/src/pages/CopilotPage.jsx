import { useState } from "react";
import PageShell from "../components/PageShell";

const responses = {
  "why is mch-017 marked critical":
    "MCH-017 is critical because torque is elevated, tool wear is high, and rotational speed is unstable. Recommended action: inspect spindle assembly within 24 hours.",
  "what should i inspect first":
    "Inspect torque load, spindle assembly, lubrication, and tool wear condition first. These are the strongest contributing factors.",
  "which machine needs urgent maintenance":
    "MCH-017 requires urgent maintenance with a 94% risk score. MCH-042 should be scheduled today.",
};

export default function CopilotPage() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello. I am Aegis Copilot. Ask me about machine risk, root causes, or maintenance actions.",
    },
  ]);

  const [input, setInput] = useState("");

  function sendMessage() {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    const key = input.toLowerCase().trim();

    const aiMessage = {
      sender: "ai",
      text:
        responses[key] ||
        "Based on current fleet telemetry, I recommend checking torque, tool wear, and RPM stability before scheduling maintenance.",
    };

    setMessages([...messages, userMessage, aiMessage]);
    setInput("");
  }

  return (
    <PageShell>
      <div style={{ padding: "48px 40px" }}>
        <h1 style={{ fontSize: "52px", marginBottom: "12px" }}>
          AI Maintenance Copilot
        </h1>

        <p style={{ color: "#8892A4", marginBottom: "32px" }}>
          Ask diagnostic questions about machine risk, root causes, and maintenance actions.
        </p>

        <div
          style={{
            background: "#111318",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "22px",
            padding: "24px",
            maxWidth: "900px",
            minHeight: "460px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flex: 1 }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "14px 18px",
                    borderRadius: "16px",
                    background:
                      msg.sender === "user"
                        ? "rgba(0,212,255,0.14)"
                        : "rgba(255,255,255,0.05)",
                    border:
                      msg.sender === "user"
                        ? "1px solid rgba(0,212,255,0.3)"
                        : "1px solid rgba(255,255,255,0.08)",
                    color: "#F0F2F8",
                    lineHeight: 1.6,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask: Why is MCH-017 marked critical?"
              style={{
                flex: 1,
                background: "#0A0B0F",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "14px",
                padding: "14px 16px",
                color: "#F0F2F8",
                outline: "none",
              }}
            />

            <button
              onClick={sendMessage}
              style={{
                background: "#00D4FF",
                color: "#0A0B0F",
                border: "none",
                borderRadius: "14px",
                padding: "14px 22px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}