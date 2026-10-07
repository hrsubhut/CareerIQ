from fastapi import APIRouter, UploadFile, File, HTTPException
import re
from app.extractors.pdf import extract_text_from_pdf
from app.extractors.docx import extract_text_from_docx
from app.extractors.text import extract_text_from_txt
from app.processors.skill_extractor import extract_skills
from app.processors.experience_extractor import extract_experience, extract_education, extract_role
from app.schemas.resume import ResumeParseResponse, ResumeProfileData

router = APIRouter(prefix="/api/v1/resume", tags=["Resume Parsing"])

@router.post("/parse", response_model=ResumeParseResponse)
async def parse_resume(file: UploadFile = File(...)):
    filename = file.filename.lower()
    content = await file.read()

    if filename.endswith(".pdf"):
        raw_text = extract_text_from_pdf(content)
    elif filename.endswith(".docx") or filename.endswith(".doc"):
        raw_text = extract_text_from_docx(content)
    else:
        raw_text = extract_text_from_txt(content)

    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from the uploaded resume file.")

    # Extract contact info
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', raw_text)
    email = email_match.group(0) if email_match else None

    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', raw_text)
    phone = phone_match.group(0) if phone_match else None

    # Name heuristic: First non-contact short line
    name = None
    lines = [l.strip() for l in raw_text.split("\n") if l.strip()]
    for line in lines[:5]:
        if "@" not in line and not re.search(r'\d', line) and 2 <= len(line.split()) <= 4 and len(line) < 35:
            name = line
            break
    if not name and lines:
        name = file.filename.rsplit(".", 1)[0].replace("_", " ").title()

    skills = extract_skills(raw_text)
    exp = extract_experience(raw_text)
    edu = extract_education(raw_text)
    role = extract_role(raw_text)

    # Location heuristic
    loc = None
    for line in lines[:10]:
        if any(c in line.lower() for c in ["bengaluru", "bangalore", "mumbai", "delhi", "pune", "hyderabad", "chennai", "remote", "gurugram"]):
            loc = line
            break

    profile = ResumeProfileData(
        name=name,
        email=email,
        phone=phone,
        skills=skills,
        experience_years=exp,
        education=edu,
        current_role=role,
        location=loc or "Bengaluru"
    )

    return ResumeParseResponse(profile=profile, filename=file.filename)
