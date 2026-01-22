from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from uuid import UUID
from app.database import get_session
from app.models import Professional, Patient, CheckIn
from app.schemas import CheckInCreate, CheckInUpdate, CheckInResponse
from app.security import get_current_professional
from app.utils import calculate_imc, suggest_next_return_date
from datetime import datetime

router = APIRouter(prefix="/checkins", tags=["checkins"])


def verify_patient_ownership(
    patient_id: UUID,
    professional: Professional,
    session: Session
) -> Patient:
    """Verifica ownership e retorna paciente ou levanta exceção"""
    statement = select(Patient).where(
        Patient.id == patient_id,
        Patient.professional_id == professional.id
    )
    patient = session.exec(statement).first()
    
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paciente não encontrado"
        )
    
    return patient


def verify_checkin_ownership(
    checkin_id: UUID,
    professional: Professional,
    session: Session
) -> CheckIn:
    """Verifica ownership do check-in via paciente"""
    statement = select(CheckIn).join(Patient).where(
        CheckIn.id == checkin_id,
        Patient.professional_id == professional.id
    )
    checkin = session.exec(statement).first()
    
    if not checkin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Check-in não encontrado"
        )
    
    return checkin


@router.get("/patients/{patient_id}/checkins", response_model=list[CheckInResponse])
async def list_checkins(
    patient_id: UUID,
    professional: Professional = Depends(get_current_professional),
    session: Session = Depends(get_session)
):
    """Lista check-ins de um paciente"""
    verify_patient_ownership(patient_id, professional, session)
    
    statement = select(CheckIn).where(
        CheckIn.patient_id == patient_id
    ).order_by(CheckIn.date.desc())
    
    checkins = session.exec(statement).all()
    return [CheckInResponse.model_validate(c) for c in checkins]


@router.post("/patients/{patient_id}/checkins", response_model=CheckInResponse, status_code=status.HTTP_201_CREATED)
async def create_checkin(
    patient_id: UUID,
    data: CheckInCreate,
    professional: Professional = Depends(get_current_professional),
    session: Session = Depends(get_session)
):
    """Cria novo check-in para um paciente"""
    patient = verify_patient_ownership(patient_id, professional, session)
    
    # Calcula IMC
    imc = calculate_imc(data.weight_kg, patient.height_cm)
    
    # Sugere próximo retorno se não fornecido
    next_return = data.next_return_date
    if not next_return:
        next_return = suggest_next_return_date(
            patient.goal,
            data.adherence,
            data.date
        )
    
    checkin = CheckIn(
        patient_id=patient_id,
        date=data.date,
        weight_kg=data.weight_kg,
        waist_cm=data.waist_cm,
        hip_cm=data.hip_cm,
        body_fat_pct=data.body_fat_pct,
        adherence=data.adherence,
        observations=data.observations,
        imc=imc,
        recommendation_template_diet=data.recommendation_template_diet,
        recommendation_template_training=data.recommendation_template_training,
        recommendation_template_lifestyle=data.recommendation_template_lifestyle,
        next_return_date=next_return
    )
    
    session.add(checkin)
    session.commit()
    session.refresh(checkin)
    
    return CheckInResponse.model_validate(checkin)


@router.get("/{checkin_id}", response_model=CheckInResponse)
async def get_checkin(
    checkin_id: UUID,
    professional: Professional = Depends(get_current_professional),
    session: Session = Depends(get_session)
):
    """Retorna detalhes de um check-in"""
    checkin = verify_checkin_ownership(checkin_id, professional, session)
    return CheckInResponse.model_validate(checkin)


@router.put("/{checkin_id}", response_model=CheckInResponse)
async def update_checkin(
    checkin_id: UUID,
    data: CheckInUpdate,
    professional: Professional = Depends(get_current_professional),
    session: Session = Depends(get_session)
):
    """Atualiza um check-in"""
    checkin = verify_checkin_ownership(checkin_id, professional, session)
    
    # Busca paciente para recalcular IMC se peso mudou
    patient = session.get(Patient, checkin.patient_id)
    
    update_data = data.model_dump(exclude_unset=True)
    
    # Recalcula IMC se peso ou altura mudaram
    weight = update_data.get("weight_kg", checkin.weight_kg)
    if "weight_kg" in update_data or "height_cm" not in update_data:
        # Se peso mudou, recalcula IMC
        imc = calculate_imc(weight, patient.height_cm)
        update_data["imc"] = imc
    
    # Sugere próximo retorno se não fornecido e adesão mudou
    if "adherence" in update_data and "next_return_date" not in update_data:
        if not checkin.next_return_date or update_data["adherence"] != checkin.adherence:
            date = update_data.get("date", checkin.date)
            next_return = suggest_next_return_date(
                patient.goal,
                update_data.get("adherence"),
                date
            )
            update_data["next_return_date"] = next_return
    
    for field, value in update_data.items():
        setattr(checkin, field, value)
    
    session.add(checkin)
    session.commit()
    session.refresh(checkin)
    
    return CheckInResponse.model_validate(checkin)


@router.delete("/{checkin_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_checkin(
    checkin_id: UUID,
    professional: Professional = Depends(get_current_professional),
    session: Session = Depends(get_session)
):
    """Deleta um check-in"""
    checkin = verify_checkin_ownership(checkin_id, professional, session)
    
    session.delete(checkin)
    session.commit()
    
    return None

