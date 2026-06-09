import streamlit as st
import joblib
import pandas as pd

model = joblib.load("models/aegis_model.pkl")

st.set_page_config(
    page_title="AegisAI",
    page_icon="⚙️",
    layout="wide"
)

st.markdown("""
<style>
.stApp {
    background: radial-gradient(circle at top left, #10233f 0%, #050914 45%, #02040a 100%);
    color: white;
}

.main-title {
    font-size: 64px;
    font-weight: 800;
    background: linear-gradient(90deg, #00E5FF, #7C3AED, #22C55E);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: glow 3s ease-in-out infinite alternate;
}

@keyframes glow {
    from { filter: drop-shadow(0 0 8px #00E5FF); }
    to { filter: drop-shadow(0 0 22px #7C3AED); }
}

.subtitle {
    font-size: 24px;
    color: #CBD5E1;
    margin-top: -20px;
}

.card {
    background: rgba(15, 23, 42, 0.85);
    border: 1px solid rgba(148, 163, 184, 0.25);
    border-radius: 22px;
    padding: 24px;
    box-shadow: 0 0 30px rgba(0, 229, 255, 0.08);
}

.metric-label {
    color: #94A3B8;
    font-size: 15px;
}

.metric-value {
    font-size: 36px;
    font-weight: 800;
    color: #F8FAFC;
}

.low {
    color: #22C55E;
}

.medium {
    color: #FACC15;
}

.high {
    color: #EF4444;
}
</style>
""", unsafe_allow_html=True)

st.markdown('<div class="main-title">AegisAI</div>', unsafe_allow_html=True)
st.markdown('<div class="subtitle">Predict. Protect. Perform.</div>', unsafe_allow_html=True)

st.write("")
st.write("AI-powered predictive maintenance platform for machine failure risk detection, health scoring, and preventive action planning.")

st.sidebar.header("⚙️ Machine Telemetry Input")

machine_type = st.sidebar.selectbox("Machine Type", ["L", "M", "H"])

type_map = {"L": 0, "M": 1, "H": 2}

air_temp = st.sidebar.slider("Air Temperature [K]", 250.0, 350.0, 298.1)
process_temp = st.sidebar.slider("Process Temperature [K]", 250.0, 400.0, 308.6)
rpm = st.sidebar.slider("Rotational Speed [rpm]", 1000, 3000, 1551)
torque = st.sidebar.slider("Torque [Nm]", 0.0, 100.0, 42.8)
tool_wear = st.sidebar.slider("Tool Wear [min]", 0, 300, 0)

machine_data = {
    "Type": type_map[machine_type],
    "Air temperature [K]": air_temp,
    "Process temperature [K]": process_temp,
    "Rotational speed [rpm]": rpm,
    "Torque [Nm]": torque,
    "Tool wear [min]": tool_wear,
}

input_df = pd.DataFrame([machine_data])

probability = model.predict_proba(input_df)[0][1]
prediction = model.predict(input_df)[0]

risk_score = float(round(probability * 100, 2))
health_score = float(round(100 - risk_score, 2))

if risk_score < 30:
    risk_level = "Low"
    risk_class = "low"
    recommendation = "Machine is operating normally. Continue routine monitoring."
elif risk_score < 70:
    risk_level = "Medium"
    risk_class = "medium"
    recommendation = "Potential degradation detected. Schedule inspection soon."
else:
    risk_level = "High"
    risk_class = "high"
    recommendation = "Critical risk detected. Immediate maintenance is recommended."

st.write("")
col1, col2, col3 = st.columns(3)

with col1:
    st.markdown(f"""
    <div class="card">
        <div class="metric-label">Failure Probability</div>
        <div class="metric-value {risk_class}">{risk_score}%</div>
    </div>
    """, unsafe_allow_html=True)

with col2:
    st.markdown(f"""
    <div class="card">
        <div class="metric-label">Machine Health Score</div>
        <div class="metric-value">{health_score}/100</div>
    </div>
    """, unsafe_allow_html=True)

with col3:
    st.markdown(f"""
    <div class="card">
        <div class="metric-label">Risk Level</div>
        <div class="metric-value {risk_class}">{risk_level}</div>
    </div>
    """, unsafe_allow_html=True)

st.write("")
st.divider()

left, right = st.columns([1.2, 1])

with left:
    st.subheader("Prediction Result")

    if prediction == 1:
        st.error("⚠️ AegisAI detects possible machine failure risk.")
    else:
        st.success("✅ AegisAI predicts the machine is currently healthy.")

    st.info(recommendation)

    st.subheader("Machine Telemetry Summary")
    st.dataframe(input_df, use_container_width=True)

with right:
    st.subheader("Risk Interpretation")

    if risk_score < 30:
        st.write("The machine is operating within a safe range.")
    elif risk_score < 70:
        st.write("The machine shows early warning signs. Monitoring is recommended.")
    else:
        st.write("The machine is in a critical zone and requires urgent action.")

    st.write("### Key monitored signals")
    st.write("- Torque")
    st.write("- Rotational Speed")
    st.write("- Tool Wear")
    st.write("- Air Temperature")
    st.write("- Process Temperature")

st.divider()

st.subheader("About AegisAI")
st.write("""
AegisAI uses machine learning to predict industrial machine failure risk using operational signals such as torque, rotational speed, temperature, and tool wear. 
The system converts raw sensor data into health scores, risk levels, and preventive maintenance recommendations.
""")