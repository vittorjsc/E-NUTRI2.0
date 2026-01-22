from fastapi import APIRouter, Depends
from app.schemas import DefaultTemplatesResponse
from app.models import Professional, Patient, Goal
from app.security import get_current_professional
from app.utils import get_default_templates
from sqlmodel import Session, select
from app.database import get_session
from uuid import UUID
from fastapi import HTTPException, status

router = APIRouter(prefix="/templates", tags=["templates"])


@router.get("/defaults/{goal}", response_model=DefaultTemplatesResponse)
async def get_default_templates_for_goal(goal: Goal):
    """Retorna templates padrão baseados no objetivo"""
    templates = get_default_templates(goal)
    return DefaultTemplatesResponse(
        diet=templates["diet"],
        training=templates["training"],
        lifestyle=templates["lifestyle"]
    )


@router.get("/defaults/patient/{patient_id}", response_model=DefaultTemplatesResponse)
async def get_default_templates_for_patient(
    patient_id: UUID,
    professional: Professional = Depends(get_current_professional),
    session: Session = Depends(get_session)
):
    """Retorna templates padrão baseados no objetivo do paciente"""
    from app.routers.patients import verify_patient_ownership
    
    patient = verify_patient_ownership(patient_id, professional, session)
    templates = get_default_templates(patient.goal)
    
    return DefaultTemplatesResponse(
        diet=templates["diet"],
        training=templates["training"],
        lifestyle=templates["lifestyle"]
    )

