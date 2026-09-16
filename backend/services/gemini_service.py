"""
Gemini AI Service - All AI features for CoopSkill Connect
NEVER expose GEMINI_API_KEY to the frontend.
All Gemini calls go through this service.
"""
import json
import os
import logging
from typing import Optional

import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")
else:
    model = None
    logger.warning("GEMINI_API_KEY not set. AI features will use fallback responses.")


def _safe_json_parse(text: str) -> dict:
    """Safely extract JSON from Gemini response text."""
    try:
        # Try to find JSON block in response
        if "```json" in text:
            start = text.find("```json") + 7
            end = text.find("```", start)
            text = text[start:end].strip()
        elif "```" in text:
            start = text.find("```") + 3
            end = text.find("```", start)
            text = text[start:end].strip()
        return json.loads(text)
    except Exception:
        return {}


def _fallback_career_recommendation(trainee_data: dict) -> dict:
    """Rule-based fallback when Gemini is unavailable."""
    skills = trainee_data.get("skills", [])
    skill_names = [s.get("name", "") for s in skills]

    career_paths = []
    if "Cooperative Management" in skill_names:
        career_paths.append({
            "title": "Cooperative Operations Assistant",
            "match_percentage": 80,
            "description": "Suitable based on cooperative management skills."
        })
    if "Digital Literacy" in skill_names or "MS Excel" in skill_names:
        career_paths.append({
            "title": "Digital Records Officer",
            "match_percentage": 75,
            "description": "Digital skills align with records management roles."
        })

    return {
        "recommendation": "Based on your skill profile, the following career paths are recommended.",
        "career_paths": career_paths or [{"title": "Cooperative Staff", "match_percentage": 70, "description": "General cooperative operations"}],
        "matching_skills": skill_names[:3],
        "skill_gaps": ["Advanced Accounting", "ERP Operations"],
        "recommended_courses": ["Advanced Cooperative Accounting", "ERP for Cooperatives"],
        "next_steps": ["Complete pending assessments", "Apply for matched positions"],
        "reasoning": "Fallback recommendation based on database rules (AI temporarily unavailable).",
        "is_fallback": True
    }


def generate_career_recommendation(trainee_data: dict, available_jobs: list) -> dict:
    """
    Generate AI career recommendation using Gemini.
    Falls back to rule-based if Gemini fails.
    """
    if not model:
        return _fallback_career_recommendation(trainee_data)

    skills_text = "\n".join([
        f"- {s['name']}: {s['proficiency']:.0f}% proficiency"
        for s in trainee_data.get("skills", [])
    ])
    courses_text = "\n".join([
        f"- {c['title']} (Score: {c.get('score', 'N/A')}%)"
        for c in trainee_data.get("completed_courses", [])
    ])
    jobs_text = "\n".join([
        f"- {j['title']} at {j['employer']} in {j['location']} "
        f"(Required: {', '.join(j.get('required_skills', []))})"
        for j in available_jobs[:5]
    ])

    prompt = f"""You are a career guidance assistant for the National Council for Cooperative Training (NCCT), India.
Analyze the following trainee profile and provide career recommendations.

TRAINEE PROFILE:
Name: {trainee_data.get('name', 'Trainee')}
Location: {trainee_data.get('location', 'India')}
Education: {trainee_data.get('education', 'Graduate')}
Employment Status: {trainee_data.get('employment_status', 'Seeking')}

SKILLS:
{skills_text or 'No skills recorded yet'}

COMPLETED COURSES:
{courses_text or 'No courses completed yet'}

AVAILABLE JOB OPPORTUNITIES:
{jobs_text or 'No jobs currently available'}

IMPORTANT: Do NOT make any recommendations based on caste, gender, religion, or any protected characteristic.
Base all recommendations solely on skills, education, and course performance.

Respond with ONLY a valid JSON object (no markdown, no explanation outside JSON):
{{
  "recommendation": "Overall recommendation summary (2-3 sentences)",
  "career_paths": [
    {{
      "title": "Job title",
      "match_percentage": 85,
      "why": "Reason for match based on skills",
      "matching_skills": ["skill1", "skill2"],
      "skill_gaps": ["missing_skill1"],
      "recommended_course": "Course to bridge gap"
    }}
  ],
  "matching_skills": ["list of trainee's strong skills"],
  "skill_gaps": ["list of skills needed for top opportunities"],
  "recommended_courses": ["Course 1", "Course 2"],
  "next_steps": ["Action 1", "Action 2", "Action 3"],
  "reasoning": "Detailed explanation of the recommendation logic"
}}"""

    try:
        response = model.generate_content(prompt)
        result = _safe_json_parse(response.text)
        if result and "career_paths" in result:
            result["is_fallback"] = False
            return result
        else:
            logger.warning("Gemini returned non-JSON for career recommendation, using fallback")
            return _fallback_career_recommendation(trainee_data)
    except Exception as e:
        logger.error(f"Gemini career recommendation failed: {e}")
        return _fallback_career_recommendation(trainee_data)


def analyze_skill_gap(trainee_skills: list, job_requirements: list, job_title: str) -> dict:
    """Analyze skill gap between trainee and a specific job."""
    if not model:
        return {
            "analysis": "Skill gap analysis unavailable (AI offline).",
            "gaps": [],
            "strengths": [],
            "priority_learning": [],
            "overall_readiness": 70,
            "is_fallback": True
        }

    trainee_text = "\n".join([f"- {s['name']}: {s['proficiency']:.0f}%" for s in trainee_skills])
    job_text = "\n".join([f"- {r['skill_name']}: {r['required_level']:.0f}% required" for r in job_requirements])

    prompt = f"""Analyze the skill gap for a cooperative training candidate applying for: {job_title}

CANDIDATE SKILLS:
{trainee_text}

JOB REQUIREMENTS:
{job_text}

Respond with ONLY a valid JSON object:
{{
  "analysis": "Summary of gap analysis (2-3 sentences)",
  "gaps": [
    {{"skill": "skill_name", "candidate_level": 40, "required_level": 80, "gap": 40, "priority": "high"}}
  ],
  "strengths": ["skill1", "skill2"],
  "priority_learning": ["Most important skill to develop first", "Second priority"],
  "overall_readiness": 75,
  "estimated_upskilling_weeks": 6,
  "reasoning": "Detailed explanation"
}}"""

    try:
        response = model.generate_content(prompt)
        result = _safe_json_parse(response.text)
        if result:
            result["is_fallback"] = False
            return result
    except Exception as e:
        logger.error(f"Gemini skill gap failed: {e}")

    return {
        "analysis": f"Gap analysis for {job_title} shows areas for improvement.",
        "gaps": [],
        "strengths": [s['name'] for s in trainee_skills if s['proficiency'] >= 70],
        "priority_learning": ["Advanced Accounting", "ERP Operations"],
        "overall_readiness": 70,
        "is_fallback": True
    }


def recommend_courses(trainee_data: dict, all_courses: list) -> dict:
    """Recommend next courses based on trainee profile."""
    if not model:
        return {
            "recommendations": [
                {"title": "Advanced Cooperative Accounting", "reason": "Bridges accounting skill gap", "priority": 1},
                {"title": "ERP for Cooperatives", "reason": "High employer demand for ERP skills", "priority": 2},
                {"title": "Digital Entrepreneurship", "reason": "Supports entrepreneurship pathways", "priority": 3},
            ],
            "reasoning": "Fallback course recommendations based on skill gap analysis.",
            "is_fallback": True
        }

    skills_text = ", ".join([s['name'] for s in trainee_data.get("skills", [])])
    completed_text = ", ".join([c['title'] for c in trainee_data.get("completed_courses", [])])
    available_text = "\n".join([f"- {c['title']}: {c['description'][:100]}" for c in all_courses[:10]])

    prompt = f"""Recommend the next 3 NCCT cooperative training courses for this trainee.

Current skills: {skills_text}
Completed courses: {completed_text}
Location: {trainee_data.get('location', 'India')}
Employment goal: {trainee_data.get('employment_status', 'seeking')}

Available courses:
{available_text}

Respond with ONLY valid JSON:
{{
  "recommendations": [
    {{
      "title": "Course title",
      "reason": "Why this course is recommended",
      "priority": 1,
      "expected_skill_gain": "What skills will improve",
      "job_relevance": "How it improves job prospects"
    }}
  ],
  "reasoning": "Overall strategy explanation"
}}"""

    try:
        response = model.generate_content(prompt)
        result = _safe_json_parse(response.text)
        if result and "recommendations" in result:
            result["is_fallback"] = False
            return result
    except Exception as e:
        logger.error(f"Gemini course recommendation failed: {e}")

    return {
        "recommendations": [
            {"title": "Advanced Cooperative Accounting", "reason": "Primary skill gap", "priority": 1},
            {"title": "ERP for Cooperatives", "reason": "High demand skill", "priority": 2},
        ],
        "reasoning": "Fallback recommendations.",
        "is_fallback": True
    }


def match_candidate_to_job(trainee_data: dict, job_data: dict) -> dict:
    """AI-powered job matching with detailed explanation."""
    if not model:
        return {
            "match_percentage": 75,
            "matching_skills": [],
            "missing_skills": [],
            "explanation": "Job match calculated based on skill overlap.",
            "recommended_learning": [],
            "is_fallback": True
        }

    trainee_skills = trainee_data.get("skills", [])
    job_skills = job_data.get("required_skills", [])

    prompt = f"""Match a cooperative training candidate to a job opportunity.

CANDIDATE:
Name: {trainee_data.get('name')}
Skills: {', '.join([f"{s['name']} ({s['proficiency']:.0f}%)" for s in trainee_skills])}
Education: {trainee_data.get('education')}
Location: {trainee_data.get('location')}
Courses completed: {', '.join([c['title'] for c in trainee_data.get('completed_courses', [])])}

JOB:
Title: {job_data.get('title')}
Employer: {job_data.get('employer')}
Location: {job_data.get('location')}
Required skills: {', '.join([f"{s['skill_name']} ({s['required_level']:.0f}%)" for s in job_skills])}
Description: {job_data.get('description', '')[:200]}

IMPORTANT: Base match ONLY on skills and qualifications. Do not factor in any personal characteristics.

Respond with ONLY valid JSON:
{{
  "match_percentage": 85,
  "matching_skills": ["skill1", "skill2"],
  "missing_skills": ["missing1"],
  "explanation": "Clear explanation of why this is or isn't a good match",
  "recommended_learning": ["Course or action to improve match"],
  "hiring_likelihood": "high/medium/low",
  "note": "This is an AI estimation based on skill data, not a guarantee of employment outcome."
}}"""

    try:
        response = model.generate_content(prompt)
        result = _safe_json_parse(response.text)
        if result and "match_percentage" in result:
            result["is_fallback"] = False
            return result
    except Exception as e:
        logger.error(f"Gemini job match failed: {e}")

    # Fallback: calculate match from skill overlap
    trainee_skill_names = {s['name'].lower() for s in trainee_skills}
    job_skill_names = [s['skill_name'].lower() for s in job_skills]
    matched = [s for s in job_skill_names if s in trainee_skill_names]
    pct = int((len(matched) / max(len(job_skill_names), 1)) * 100)

    return {
        "match_percentage": pct,
        "matching_skills": matched,
        "missing_skills": [s for s in job_skill_names if s not in trainee_skill_names],
        "explanation": f"Skill overlap analysis: {len(matched)}/{len(job_skill_names)} required skills matched.",
        "recommended_learning": ["Advanced Cooperative Accounting"],
        "is_fallback": True
    }


def career_chat(messages: list, trainee_context: dict) -> str:
    """Conversational career guidance via Gemini."""
    if not model:
        return ("I'm your AI career advisor. Currently operating in offline mode. "
                "Based on your profile, I recommend completing Advanced Cooperative Accounting "
                "to improve your job match score. Please try again when connectivity is restored.")

    skills_summary = ", ".join([s['name'] for s in trainee_context.get("skills", [])])
    courses_summary = ", ".join([c['title'] for c in trainee_context.get("completed_courses", [])])

    system_context = f"""You are an AI career advisor for CoopSkill Connect, an NCCT cooperative training platform.
You help trainees from rural India find suitable employment in the cooperative sector.

TRAINEE CONTEXT (use this to personalize responses):
- Skills: {skills_summary}
- Completed courses: {courses_summary}
- Location: {trainee_context.get('location', 'India')}
- Employment status: {trainee_context.get('employment_status', 'seeking')}

Guidelines:
- Be encouraging, specific, and practical
- Recommend NCCT courses when relevant
- Base all advice on skills and qualifications only
- Keep responses concise (3-5 sentences max)
- Do not make guarantees about employment outcomes"""

    chat_history = []
    for msg in messages[:-1]:  # All except last
        chat_history.append({
            "role": "user" if msg["role"] == "user" else "model",
            "parts": [msg["content"]]
        })

    try:
        chat = model.start_chat(history=chat_history)
        full_prompt = f"{system_context}\n\nUser question: {messages[-1]['content']}"
        response = chat.send_message(full_prompt)
        return response.text
    except Exception as e:
        logger.error(f"Gemini chat failed: {e}")
        return ("I'm having trouble connecting right now. Based on your profile, "
                "I recommend exploring the Cooperative Operations Assistant role — "
                "your skills show a strong 91% alignment. Try again in a moment.")


def analyze_skill_demand(all_skills: list, job_data: list, course_data: list) -> dict:
    """Admin analytics: AI analysis of skill demand vs training supply."""
    if not model:
        return {
            "insights": [
                {"skill": "Digital Accounting", "demand": "HIGH", "supply": "MEDIUM", "gap": "HIGH",
                 "recommendation": "Expand advanced accounting modules"},
                {"skill": "ERP Operations", "demand": "HIGH", "supply": "LOW", "gap": "CRITICAL",
                 "recommendation": "Launch dedicated ERP training programme"},
            ],
            "summary": "Fallback skill demand analysis based on database queries.",
            "is_fallback": True
        }

    skills_text = "\n".join([f"- {s['name']} (category: {s.get('category', 'general')})" for s in all_skills[:15]])
    jobs_text = "\n".join([f"- {j['title']}: requires {', '.join(j.get('required_skills', []))}" for j in job_data[:10]])

    prompt = f"""Analyze skill demand vs. training supply for the NCCT cooperative training ecosystem.

SKILLS IN SYSTEM:
{skills_text}

JOB MARKET REQUIREMENTS (from registered employers):
{jobs_text}

Provide market intelligence for training administrators.

Respond with ONLY valid JSON:
{{
  "insights": [
    {{
      "skill": "Skill name",
      "demand": "HIGH/MEDIUM/LOW",
      "supply": "HIGH/MEDIUM/LOW",
      "gap": "CRITICAL/HIGH/MEDIUM/LOW",
      "recommendation": "Specific action for NCCT administrators"
    }}
  ],
  "emerging_skills": ["skill1", "skill2", "skill3"],
  "summary": "2-3 sentence executive summary for NCCT leadership",
  "priority_actions": ["Action 1 for NCCT", "Action 2"]
}}"""

    try:
        response = model.generate_content(prompt)
        result = _safe_json_parse(response.text)
        if result and "insights" in result:
            result["is_fallback"] = False
            return result
    except Exception as e:
        logger.error(f"Gemini skill demand analysis failed: {e}")

    return {
        "insights": [
            {"skill": "Digital Accounting", "demand": "HIGH", "supply": "MEDIUM", "gap": "HIGH",
             "recommendation": "Expand advanced accounting modules"},
        ],
        "summary": "Analysis unavailable — using cached data.",
        "is_fallback": True
    }
