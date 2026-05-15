from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
import time
import hashlib
import re

router = APIRouter(prefix="/api/v1", tags=["analysis"])

class TextAnalysisRequest(BaseModel):
    content: str = Field(..., min_length=1, max_length=10000)
    language: Optional[str] = Field(None)

class AnalysisResponse(BaseModel):
    success: bool
    verdict: str
    confidence_score: float
    red_flags: List[dict] = []
    explanation: str
    recommended_action: str
    processing_time_ms: float
    content_hash: str

SCAM_PATTERNS = [
    (r"won\s*(rs\.?|rupees?)\s*\d+", "Prize/lottery scam", "HIGH"),
    (r"click\s*(here|this\s*link)", "Suspicious link", "MEDIUM"),
    (r"urgent.*action.*required", "Urgency tactic", "HIGH"),
    (r"KYC.*expir", "KYC scam", "HIGH"),
    (r"block.*(account|card)", "Account block threat", "HIGH"),
    (r"free.*(iphone|phone|laptop|gift)", "Free gift scam", "MEDIUM"),
    (r"job.*offer.*work.*from.*home", "Fake job offer", "HIGH"),
    (r"loan.*(instant|immediate).*approval", "Fake loan", "HIGH"),
    (r"crypto.*(double|guaranteed|profit)", "Crypto scam", "HIGH"),
    (r"government.*subsidy", "Government subsidy scam", "MEDIUM"),
    (r"electricity.*bill.*(disconnect|cut)", "Electricity bill scam", "MEDIUM"),
    (r"courier.*package.*(held|stuck)", "Courier scam", "MEDIUM"),
]

def analyze_content(content: str) -> dict:
    start = time.time()
    content_hash = hashlib.sha256(content.encode()).hexdigest()
    red_flags = []

    for pattern, flag, severity in SCAM_PATTERNS:
        if re.search(pattern, content, re.IGNORECASE):
            red_flags.append({
                "flag": flag,
                "severity": severity,
                "type": "pattern_match"
            })

    urls = re.findall(r'https?://[^\s<>"]+', content)
    for url in urls:
        if any(s in url for s in ['bit.ly', 'tinyurl', 'short.ly']):
            red_flags.append({
                "flag": f"Shortened URL: {url}",
                "severity": "MEDIUM",
                "type": "url_analysis"
            })

    high_count = sum(1 for f in red_flags if f['severity'] in ['HIGH', 'CRITICAL'])
    total = len(red_flags)

    if high_count >= 2 or total >= 4:
        verdict = "SCAM"
        confidence = min(98, 80 + total * 3)
        explanation = f"Strong scam indicators detected. {total} warning signs found."
        action = "Do NOT click links. Block sender immediately."
    elif high_count >= 1 or total >= 2:
        verdict = "SUSPICIOUS"
        confidence = min(75, 50 + total * 5)
        explanation = f"Suspicious elements detected. {total} warning signs found."
        action = "Verify through official channels."
    elif total == 0:
        verdict = "LIKELY_REAL"
        confidence = 70
        explanation = "No obvious scam patterns detected."
        action = "Standard caution advised."
    else:
        verdict = "UNCERTAIN"
        confidence = 40
        explanation = "Some unclear elements."
        action = "Exercise caution."

    return {
        "success": True,
        "verdict": verdict,
        "confidence_score": confidence,
        "red_flags": red_flags,
        "explanation": explanation,
        "recommended_action": action,
        "processing_time_ms": round((time.time() - start) * 1000, 2),
        "content_hash": content_hash,
    }

@router.post("/analyze/text", response_model=AnalysisResponse)
async def analyze_text(request: TextAnalysisRequest):
    try:
        return analyze_content(request.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "TrustChain Pro API",
        "version": "1.0.0",
        "timestamp": time.time()
    }