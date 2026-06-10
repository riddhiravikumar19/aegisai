import os
from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

router = APIRouter()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class CopilotRequest(BaseModel):
    question: str
    machine_id: str
    failure_probability: float | None = None
    health_score: float | None = None
    risk_level: str | None = None
    rul_days: int | None = None
    urgency: str | None = None
    potential_savings: int | None = None
    root_causes: list[dict] | None = None


@router.post("/copilot")
def copilot(data: CopilotRequest):
    context = f"""
Machine ID: {data.machine_id}
Failure Probability: {data.failure_probability}
Health Score: {data.health_score}
Risk Level: {data.risk_level}
Remaining Useful Life: {data.rul_days} days
Urgency: {data.urgency}
Potential Savings: ₹{data.potential_savings}
Root Causes: {data.root_causes}
User Question: {data.question}
"""

    try:
        response = client.responses.create(
            model="gpt-4o-mini",
            input=[
                {
                    "role": "system",
                    "content": (
                        "You are AegisAI Copilot, an industrial predictive maintenance assistant. "
                        "Explain machine health, failure risk, root causes, RUL, and maintenance actions "
                        "clearly for engineers and operations managers. Be practical and concise."
                    ),
                },
                {
                    "role": "user",
                    "content": context,
                },
            ],
        )

        return {
            "answer": response.output_text,
            "mode": "openai",
        }

    except Exception:
        fallback = f"""
AegisAI Copilot Report

Machine {data.machine_id} currently has a failure probability of {data.failure_probability}% 
and a health score of {data.health_score}/100.

Risk Level: {data.risk_level}
Remaining Useful Life: {data.rul_days} days
Urgency: {data.urgency}

Recommended Action:
Based on the current risk and RUL, maintenance should be prioritized according to the urgency level. 
If urgency is Critical or High, schedule inspection immediately. If urgency is Medium or Low, continue monitoring and plan preventive maintenance.

Business Impact:
Potential avoidable savings are estimated at ₹{data.potential_savings} if proactive maintenance is performed.
"""

        return {
            "answer": fallback,
            "mode": "fallback",
        }