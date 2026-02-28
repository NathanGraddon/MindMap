from typing import List, Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI(title="MindMap API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    dilemma: str
    category: str
    urgency: int
    emotion: str
    stakeholders: str
    goal: str


class OptionScore(BaseModel):
    name: str
    description: str
    well_being: int
    ethics: int
    impact_on_others: int
    practicality: int
    long_term_growth: int
    total_score: int


class AnalyzeResponse(BaseModel):
    detected_type: str
    urgency_level: Literal["Low", "Moderate", "High"]
    key_risk: str
    best_option: str
    second_best_option: str
    biggest_tradeoff: str
    rationale: str
    next_step: str
    options: List[OptionScore]


@app.get("/")
def root():
    return {"message": "MindMap API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "MindMap API"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze_decision(payload: AnalyzeRequest):
    urgency_level = "Low"
    if payload.urgency >= 8:
        urgency_level = "High"
    elif payload.urgency >= 4:
        urgency_level = "Moderate"

    category = payload.category.lower().strip()

    if category == "career":
        options = [
            OptionScore(
                name="Accept immediately",
                description="Take the opportunity now and adapt your schedule around it.",
                well_being=5,
                ethics=8,
                impact_on_others=7,
                practicality=8,
                long_term_growth=9,
                total_score=37,
            ),
            OptionScore(
                name="Negotiate timing or scope",
                description="Ask for adjusted timing, reduced hours, or a delayed start to protect your workload.",
                well_being=9,
                ethics=9,
                impact_on_others=8,
                practicality=8,
                long_term_growth=9,
                total_score=43,
            ),
            OptionScore(
                name="Decline for now",
                description="Protect your academic stability and revisit similar opportunities later.",
                well_being=8,
                ethics=8,
                impact_on_others=6,
                practicality=7,
                long_term_growth=6,
                total_score=35,
            ),
        ]
        key_risk = "Overcommitment may increase stress and reduce academic performance."
        best_option = "Negotiate timing or scope"
        second_best_option = "Accept immediately"
        biggest_tradeoff = "You may preserve your well-being, but risk delaying immediate experience."
        rationale = (
            "The strongest path balances opportunity with sustainability. "
            "A negotiated option protects mental health while preserving long-term career value."
        )
        next_step = (
            "Draft a short message asking whether the start date, hours, or responsibilities can be adjusted."
        )
    elif category == "academic":
        options = [
            OptionScore(
                name="Push through as planned",
                description="Continue with the current workload and try to manage through pressure.",
                well_being=4,
                ethics=8,
                impact_on_others=7,
                practicality=7,
                long_term_growth=7,
                total_score=33,
            ),
            OptionScore(
                name="Reduce commitments",
                description="Scale back one obligation to create space for focus and recovery.",
                well_being=9,
                ethics=9,
                impact_on_others=8,
                practicality=8,
                long_term_growth=8,
                total_score=42,
            ),
            OptionScore(
                name="Ask for support first",
                description="Talk to a professor, advisor, or mentor before making the final choice.",
                well_being=8,
                ethics=9,
                impact_on_others=9,
                practicality=9,
                long_term_growth=8,
                total_score=43,
            ),
        ]
        key_risk = "Stress accumulation may lead to burnout or reduced performance."
        best_option = "Ask for support first"
        second_best_option = "Reduce commitments"
        biggest_tradeoff = "Taking a pause to seek help may feel slower, but often improves the final decision."
        rationale = (
            "Getting perspective before acting reduces isolation and often leads to more responsible, informed decisions."
        )
        next_step = (
            "Identify one person you trust and prepare a 2–3 sentence summary of your situation to share with them."
        )
    else:
        options = [
            OptionScore(
                name="Act quickly",
                description="Resolve the issue fast to reduce immediate uncertainty.",
                well_being=5,
                ethics=7,
                impact_on_others=6,
                practicality=8,
                long_term_growth=6,
                total_score=32,
            ),
            OptionScore(
                name="Pause and reflect",
                description="Take a short step back and review the situation from multiple perspectives.",
                well_being=9,
                ethics=9,
                impact_on_others=8,
                practicality=8,
                long_term_growth=8,
                total_score=42,
            ),
            OptionScore(
                name="Consult a trusted person",
                description="Bring in an outside perspective before deciding.",
                well_being=8,
                ethics=9,
                impact_on_others=9,
                practicality=8,
                long_term_growth=8,
                total_score=42,
            ),
        ]
        key_risk = "Reacting from stress may hide better long-term options."
        best_option = "Pause and reflect"
        second_best_option = "Consult a trusted person"
        biggest_tradeoff = "Slowing down may feel uncomfortable, but it often improves decision quality."
        rationale = (
            "The most balanced path is usually the one that reduces reactive decision-making and introduces perspective."
        )
        next_step = (
            "Write down the top 2 choices you are considering and one likely consequence for each."
        )

    return AnalyzeResponse(
        detected_type=payload.category,
        urgency_level=urgency_level,
        key_risk=key_risk,
        best_option=best_option,
        second_best_option=second_best_option,
        biggest_tradeoff=biggest_tradeoff,
        rationale=rationale,
        next_step=next_step,
        options=options,
    )