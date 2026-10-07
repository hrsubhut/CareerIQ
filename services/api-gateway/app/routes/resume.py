from fastapi import APIRouter, UploadFile, File, HTTPException
from app.clients.resume_client import resume_client

router = APIRouter(prefix="/api/v1/resume", tags=["Resume Parsing"])

@router.post("/parse")
async def parse_resume(file: UploadFile = File(...)):
    try:
        content = await file.read()
        return await resume_client.parse_resume(file_bytes=content, filename=file.filename)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Resume service communication failed: {str(e)}")
