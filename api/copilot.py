from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


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
    fallback = f"""
AegisAI Copilot Report

Machine: {data.machine_id}

Failure Probability: {data.failure_probability}%
Health Score: {data.health_score}/100
Risk Level: {data.risk_level}

Remaining Useful Life: {data.rul_days} days
Urgency: {data.urgency}

Potential Savings: ₹{data.potential_savings}

Root Causes:
{data.root_causes}

Recommended Action:
- Critical: Immediate shutdown and inspection.
- High: Schedule maintenance within one week.
- Medium: Preventive maintenance required.
- Low: Continue routine monitoring.

Business Impact:
This machine should be prioritized based on its failure probability, remaining useful life, urgency, and potential avoidable cost.
"""

    return {
        "answer": fallback,
        "mode": "fallback"
    }
