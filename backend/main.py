from typing import List, Literal
import json
import os

from dotenv import load_dotenv
from openai import OpenAI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

WEIGHTS = {
    "well_being": 0.30,
    "ethics": 0.20,
    "impact_on_others": 0.15,
    "practicality": 0.15,
    "long_term_growth": 0.20,
}

load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")
client = (
    OpenAI(
        api_key=groq_api_key,
        base_url="https://api.groq.com/openai/v1",
    )
    if groq_api_key
    else None
)

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


def compute_weighted_score(
    well_being: int,
    ethics: int,
    impact_on_others: int,
    practicality: int,
    long_term_growth: int,
) -> int:
    weighted = (
        well_being * WEIGHTS["well_being"]
        + ethics * WEIGHTS["ethics"]
        + impact_on_others * WEIGHTS["impact_on_others"]
        + practicality * WEIGHTS["practicality"]
        + long_term_growth * WEIGHTS["long_term_growth"]
    )
    return round(weighted * 5)


def fallback_options(payload: AnalyzeRequest) -> dict:
    category = payload.category.lower().strip()

    if category == "career":
        return {
            "options": [
                {
                    "name": "Negotiate timing or scope",
                    "description": "Ask for adjusted timing, reduced hours, or a delayed start to protect your workload.",
                    "rationale": "This keeps the opportunity while reducing the risk of burnout.",
                    "tradeoff": "You may need to delay immediate progress or accept a modified role.",
                },
                {
                    "name": "Accept with a support plan",
                    "description": "Take the opportunity, but build a concrete study and stress-management plan first.",
                    "rationale": "This preserves momentum while adding structure.",
                    "tradeoff": "Your stress level may still rise if your schedule becomes too tight.",
                },
                {
                    "name": "Decline for now",
                    "description": "Protect your academic stability and revisit similar opportunities later.",
                    "rationale": "This reduces immediate overload and protects short-term well-being.",
                    "tradeoff": "You may miss near-term career experience.",
                },
            ],
            "overall_rationale": "The most balanced path is usually the one that protects long-term stability without making a rushed sacrifice.",
            "suggested_next_step": "List your fixed weekly obligations and estimate whether this decision realistically fits your time and energy.",
        }

    if category == "academic":
        return {
            "options": [
                {
                    "name": "Ask for support first",
                    "description": "Talk to a professor, advisor, or mentor before making the final choice.",
                    "rationale": "Outside perspective can reduce isolation and improve decision quality.",
                    "tradeoff": "It may feel slower than acting immediately.",
                },
                {
                    "name": "Reduce commitments",
                    "description": "Scale back one obligation to create space for focus and recovery.",
                    "rationale": "Protecting bandwidth can improve academic performance and mental health.",
                    "tradeoff": "You may need to disappoint someone or delay another goal.",
                },
                {
                    "name": "Push through temporarily",
                    "description": "Stay with your current workload for now, but monitor stress closely.",
                    "rationale": "This preserves short-term continuity if the pressure is temporary.",
                    "tradeoff": "It increases burnout risk if the situation continues.",
                },
            ],
            "overall_rationale": "Academic decisions are often strongest when they reduce overwhelm and create room for support.",
            "suggested_next_step": "Write a short message to one trusted person explaining the pressure you’re under and what decision you’re weighing.",
        }

    return {
        "options": [
            {
                "name": "Pause and reflect",
                "description": "Take a short step back and review the situation from multiple perspectives.",
                "rationale": "A pause often reveals tradeoffs you miss while stressed.",
                "tradeoff": "It may feel uncomfortable to delay action.",
            },
            {
                "name": "Consult a trusted person",
                "description": "Bring in an outside perspective before deciding.",
                "rationale": "Another person can surface ethical or practical impacts you overlooked.",
                "tradeoff": "Their perspective may complicate the decision at first.",
            },
            {
                "name": "Take a limited first step",
                "description": "Choose a small reversible action instead of a full commitment.",
                "rationale": "This lowers risk while still moving forward.",
                "tradeoff": "It may not resolve the full dilemma immediately.",
            },
        ],
        "overall_rationale": "The best-balanced decisions usually come from reducing reactivity and increasing perspective.",
        "suggested_next_step": "Write down your top two choices and one likely short-term and long-term outcome for each.",
    }


def generate_llm_options(payload: AnalyzeRequest) -> dict:
    if not client:
        return fallback_options(payload)

    prompt = f"""
You are generating thoughtful decision-support options for a college student.

Return ONLY valid JSON.
Do not include markdown.
Do not include explanation outside the JSON.

User dilemma:
- dilemma: {payload.dilemma}
- category: {payload.category}
- urgency: {payload.urgency}/10
- emotion: {payload.emotion}
- stakeholders: {payload.stakeholders}
- goal: {payload.goal}

Rules:
- Be balanced, not extreme
- Consider emotional well-being, ethics, impact on others, practicality, and long-term growth
- Do not give legal, medical, or crisis advice
- Return exactly 3 realistic options
- Keep the response practical and supportive

Return exactly this JSON shape:
{{
  "options": [
    {{
      "name": "short option title",
      "description": "1-2 sentence explanation",
      "rationale": "why this option may help",
      "tradeoff": "main downside or tradeoff"
    }},
    {{
      "name": "short option title",
      "description": "1-2 sentence explanation",
      "rationale": "why this option may help",
      "tradeoff": "main downside or tradeoff"
    }},
    {{
      "name": "short option title",
      "description": "1-2 sentence explanation",
      "rationale": "why this option may help",
      "tradeoff": "main downside or tradeoff"
    }}
  ],
  "overall_rationale": "brief summary",
  "suggested_next_step": "one practical next step"
}}
"""

    try:
        response = client.responses.create(
            model="openai/gpt-oss-20b",
            input=prompt,
        )

        parsed = json.loads(response.output_text)

        if (
            "options" not in parsed
            or "overall_rationale" not in parsed
            or "suggested_next_step" not in parsed
            or not isinstance(parsed["options"], list)
            or len(parsed["options"]) != 3
        ):
            return fallback_options(payload)

        return parsed

    except Exception:
        return fallback_options(payload)


def heuristic_scores(payload: AnalyzeRequest, index: int) -> tuple[int, int, int, int, int]:
    urgency_penalty = 1 if payload.urgency >= 8 else 0
    emotion_text = payload.emotion.lower()

    stress_heavy = any(word in emotion_text for word in ["anxious", "overwhelmed", "stressed", "burnout", "burned out"])

    well_being = max(6, 9 - urgency_penalty - index)
    if stress_heavy:
        well_being = max(5, well_being - 1)

    ethics = 8
    impact_on_others = 8
    practicality = 8 if payload.category.lower().strip() in ["academic", "career"] else 7
    long_term_growth = max(6, 9 - index)

    return well_being, ethics, impact_on_others, practicality, long_term_growth


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

    llm_data = generate_llm_options(payload)
    raw_options = llm_data["options"]

    scored_options: List[OptionScore] = []

    for index, item in enumerate(raw_options):
        well_being, ethics, impact_on_others, practicality, long_term_growth = heuristic_scores(payload, index)

        scored_options.append(
            OptionScore(
                name=item["name"],
                description=item["description"],
                well_being=well_being,
                ethics=ethics,
                impact_on_others=impact_on_others,
                practicality=practicality,
                long_term_growth=long_term_growth,
                total_score=compute_weighted_score(
                    well_being,
                    ethics,
                    impact_on_others,
                    practicality,
                    long_term_growth,
                ),
            )
        )

    ranked_options = sorted(scored_options, key=lambda o: o.total_score, reverse=True)

    best_option = ranked_options[0].name
    second_best_option = ranked_options[1].name
    best_tradeoff = ""
    for item in raw_options:
        if item["name"] == best_option:
            best_tradeoff = item["tradeoff"]
            break

    biggest_tradeoff = best_tradeoff or raw_options[0]["tradeoff"]
    key_risk = "High-emotion or rushed choices can hide better long-term paths."
    rationale = llm_data["overall_rationale"]
    next_step = llm_data["suggested_next_step"]

    return AnalyzeResponse(
        detected_type=payload.category,
        urgency_level=urgency_level,
        key_risk=key_risk,
        best_option=best_option,
        second_best_option=second_best_option,
        biggest_tradeoff=biggest_tradeoff,
        rationale=rationale,
        next_step=next_step,
        options=ranked_options,
    )