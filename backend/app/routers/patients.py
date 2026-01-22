from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select, func
from typing import Optional
from uuid import UUID
from app.database import get_session
from app.models import Professional, Patient, CheckIn, Goal, ActivityLevel
from app.schemas import (
    PatientCreate,
    PatientUpdate,
    PatientResponse,
    PatientListResponse,
    PatientDetailResponse,
    CheckInResponse
)
from app.security import get_current_professional, encrypt_cpf, mask_cpf
from app.utils import calculate_imc
from datetime import datetime

router = APIRouter(prefix="/patients", tags=["patients"])


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


@router.get("", response_model=list[PatientListResponse])
async def list_patients(
    search: Optional[str] = Query(None, description="Busca por nome"),
    goal: Optional[Goal] = Query(None),
    activity_level: Optional[ActivityLevel] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    professional: Professional = Depends(get_current_professional),
    session: Session = Depends(get_session)
):
    """Lista pacientes do profissional logado com busca e filtros"""
    statement = select(Patient).where(Patient.professional_id == professional.id)
    
    if search:
        statement = statement.where(Patient.full_name.ilike(f"%{search}%"))
    
    if goal:
        statement = statement.where(Patient.goal == goal)
    
    if activity_level:
        statement = statement.where(Patient.activity_level == activity_level)
    
    statement = statement.order_by(Patient.created_at.desc()).offset(skip).limit(limit)
    patients = session.exec(statement).all()
    
    # Busca último check-in e IMC atual para cada paciente
    result = []
    for patient in patients:
        # Último check-in
        checkin_stmt = select(CheckIn).where(
            CheckIn.patient_id == patient.id
        ).order_by(CheckIn.date.desc()).limit(1)
        last_checkin = session.exec(checkin_stmt).first()
        
        # IMC atual (do último check-in ou calculado se não houver)
        current_imc = None
        if last_checkin:
            current_imc = last_checkin.imc
        elif patient.height_cm:
            # Se não houver check-in, não podemos calcular IMC sem peso
            pass
        
        result.append(PatientListResponse(
            id=patient.id,
            full_name=patient.full_name,
            goal=patient.goal,
            activity_level=patient.activity_level,
            created_at=patient.created_at,
            last_checkin_date=last_checkin.date if last_checkin else None,
            current_imc=current_imc
        ))
    
    return result


@router.post("", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
async def create_patient(
    data: PatientCreate,
    professional: Professional = Depends(get_current_professional),
    session: Session = Depends(get_session)
):
    """Cria novo paciente"""
    # Processa CPF se fornecido
    cpf_encrypted = None
    cpf_last4 = None
    
    if data.cpf:
        cpf_clean = "".join(filter(str.isdigit, data.cpf))
        cpf_encrypted = encrypt_cpf(cpf_clean)
        cpf_last4 = cpf_clean[-4:]
    
    patient = Patient(
        professional_id=professional.id,
        full_name=data.full_name,
        birth_date=data.birth_date,
        sex=data.sex,
        height_cm=data.height_cm,
        activity_level=data.activity_level,
        goal=data.goal,
        notes=data.notes,
        cpf_encrypted=cpf_encrypted,
        cpf_last4=cpf_last4
    )
    
    session.add(patient)
    session.commit()
    session.refresh(patient)
    
    # Retorna com CPF mascarado
    response = PatientResponse.model_validate(patient)
    if patient.cpf_last4:
        response.cpf_masked = mask_cpf("00000000000" + patient.cpf_last4)  # Placeholder para máscara
    
    return response


@router.get("/{patient_id}", response_model=PatientDetailResponse)
async def get_patient(
    patient_id: UUID,
    professional: Professional = Depends(get_current_professional),
    session: Session = Depends(get_session)
):
    """Retorna detalhes do paciente com check-ins"""
    patient = verify_patient_ownership(patient_id, professional, session)
    
    # Busca check-ins ordenados por data
    checkin_stmt = select(CheckIn).where(
        CheckIn.patient_id == patient.id
    ).order_by(CheckIn.date.desc())
    checkins = session.exec(checkin_stmt).all()
    
    response = PatientDetailResponse.model_validate(patient)
    if patient.cpf_last4:
        response.cpf_masked = mask_cpf("00000000000" + patient.cpf_last4)
    response.checkins = [CheckInResponse.model_validate(c) for c in checkins]
    
    return response


@router.put("/{patient_id}", response_model=PatientResponse)
async def update_patient(
    patient_id: UUID,
    data: PatientUpdate,
    professional: Professional = Depends(get_current_professional),
    session: Session = Depends(get_session)
):
    """Atualiza dados do paciente"""
    patient = verify_patient_ownership(patient_id, professional, session)
    
    # Atualiza campos fornecidos
    update_data = data.model_dump(exclude_unset=True)
    
    # Processa CPF se fornecido
    if "cpf" in update_data:
        cpf = update_data.pop("cpf")
        if cpf:
            cpf_clean = "".join(filter(str.isdigit, cpf))
            patient.cpf_encrypted = encrypt_cpf(cpf_clean)
            patient.cpf_last4 = cpf_clean[-4:]
        else:
            patient.cpf_encrypted = None
            patient.cpf_last4 = None
    
    for field, value in update_data.items():
        setattr(patient, field, value)
    
    patient.updated_at = datetime.utcnow()
    
    session.add(patient)
    session.commit()
    session.refresh(patient)
    
    response = PatientResponse.model_validate(patient)
    if patient.cpf_last4:
        response.cpf_masked = mask_cpf("00000000000" + patient.cpf_last4)
    
    return response


@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_patient(
    patient_id: UUID,
    professional: Professional = Depends(get_current_professional),
    session: Session = Depends(get_session)
):
    """Deleta paciente (cascata deleta check-ins)"""
    patient = verify_patient_ownership(patient_id, professional, session)
    
    session.delete(patient)
    session.commit()
    
    return None

