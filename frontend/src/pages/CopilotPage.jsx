import { useState } from "react";
import PageShell from "../components/PageShell";
import { useMachine } from "../context/MachineContext";
import { API_BASE_URL } from "../lib/api";

export default function CopilotPage() {
  const { selectedMachine } = useMachine();

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello. I am AegisAI Copilot. Select a machine from Live Monitoring, then ask me about risk, RUL, root causes, or maintenance actions.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    if (!selectedMachine) {
      alert("Please select a machine from Live Monitoring first.");
      return;
    }

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const payload = {
        Type: selectedMachine.type,
        air_temperature: selectedMachine.air_temperature,
        process_temperature: selectedMachine.process_temperature,
        rotational_speed: selectedMachine.rotational_speed,
        torque: selectedMachine.torque,
        tool_wear: selectedMachine.tool_wear,
      };

      const [predictRes, rulRes, costRes, explainRes] = await Promise.all([
        fetch(`${API_BASE_URL}/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
        fetch(`${API_BASE_URL}/rul`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
        fetch(`${API_BASE_URL}/cost-savings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
        fetch(`${API_BASE_URL}/explain`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      ]);

      const prediction = await predictRes.json();
      const rul = await rulRes.json();
      const cost = await costRes.json();
      const explanation = await explainRes.json();

      const copilotRes = await fetch(`${API_BASE_URL}/copilot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: input,
          machine_id: selectedMachine.machine_id,
          failure_probability: prediction.failure_probability,
          health_score: prediction.health_score,
          risk_level: prediction.risk_level,
          rul_days: rul.estimated_rul_days,
          urgency: rul.urgency,
          potential_savings: cost.potential_savings,
          root_causes: explanation.root_causes,
        }),
      });

      const data = await copilotRes.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.answer || "Unable to generate copilot response.",
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Something went wrong while contacting AegisAI Copilot.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <div style={{ padding: "48px 40px" }}>
        <h1 style={{ fontSize: "52px", marginBottom: "12px" }}>
          AI Maintenance Copilot
        </h1>

        <p style={{ color: "#8892A4", marginBottom: "20px" }}>
          Ask diagnostic questions about machine risk, root causes, RUL, savings, and maintenance actions.
        </p>

        {selectedMachine && (
          <div style={selectedBoxStyle}>
            Selected Machine: {selectedMachine.machine_id}
          </div>
        )}

        <div style={chatBoxStyle}>
          <div style={{ flex: 1 }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    maxWidth: "75%",
                    padding: "14px 18px",
                    borderRadius: "16px",
                    whiteSpace: "pre-wrap",
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

            {loading && <p style={{ color: "#00D4FF" }}>Copilot is analyzing machine context...</p>}
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask: Explain this machine condition"
              style={inputStyle}
            />

            <button onClick={sendMessage} disabled={loading} style={sendButtonStyle(loading)}>
              Send
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

const selectedBoxStyle = {
  marginBottom: "24px",
  padding: "14px 18px",
  borderRadius: "14px",
  background: "rgba(0,212,255,0.08)",
  border: "1px solid rgba(0,212,255,0.2)",
  color: "#00D4FF",
  fontWeight: 700,
};

const chatBoxStyle = {
  background: "#111318",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "22px",
  padding: "24px",
  maxWidth: "900px",
  minHeight: "460px",
  display: "flex",
  flexDirection: "column",
};

const inputStyle = {
  flex: 1,
  background: "#0A0B0F",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "14px",
  padding: "14px 16px",
  color: "#F0F2F8",
  outline: "none",
};

const sendButtonStyle = (loading) => ({
  background: loading ? "#445" : "#00D4FF",
  color: "#0A0B0F",
  border: "none",
  borderRadius: "14px",
  padding: "14px 22px",
  fontWeight: 700,
  cursor: loading ? "not-allowed" : "pointer",
});