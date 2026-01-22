from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.models import Sex, ActivityLevel, Goal, Adherence


# Auth
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    professional_id: Optional[UUID] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


# Professional
class ProfessionalCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class ProfessionalResponse(BaseModel):
    id: UUID
    name: str
    email: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# Patient
class PatientCreate(BaseModel):
    full_name: str
    birth_date: datetime
    sex: Sex
    height_cm: float
    activity_level: ActivityLevel
    goal: Goal
    notes: Optional[str] = None
    cpf: Optional[str] = None
    
    @field_validator("height_cm")
    @classmethod
    def validate_height(cls, v):
        if v < 50 or v > 300:
            raise ValueError("Altura deve estar entre 50 e 300 cm")
        return v
    
    @field_validator("cpf")
    @classmethod
    def validate_cpf(cls, v):
        if v:
            # Remove formatação
            cpf_clean = "".join(filter(str.isdigit, v))
            if len(cpf_clean) != 11:
                raise ValueError("CPF deve ter 11 dígitos")
        return v


class PatientUpdate(BaseModel):
    full_name: Optional[str] = None
    birth_date: Optional[datetime] = None
    sex: Optional[Sex] = None
    height_cm: Optional[float] = None
    activity_level: Optional[ActivityLevel] = None
    goal: Optional[Goal] = None
    notes: Optional[str] = None
    cpf: Optional[str] = None
    
    @field_validator("height_cm")
    @classmethod
    def validate_height(cls, v):
        if v and (v < 50 or v > 300):
            raise ValueError("Altura deve estar entre 50 e 300 cm")
        return v


class PatientResponse(BaseModel):
    id: UUID
    professional_id: UUID
    full_name: str
    birth_date: datetime
    sex: Sex
    height_cm: float
    activity_level: ActivityLevel
    goal: Goal
    notes: Optional[str] = None
    cpf_masked: Optional[str] = None  # Sempre mascarado
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class PatientListResponse(BaseModel):
    id: UUID
    full_name: str
    goal: Goal
    activity_level: ActivityLevel
    created_at: datetime
    last_checkin_date: Optional[datetime] = None
    current_imc: Optional[float] = None
    
    class Config:
        from_attributes = True


# CheckIn
class CheckInCreate(BaseModel):
    date: datetime
    weight_kg: float
    waist_cm: Optional[float] = None
    hip_cm: Optional[float] = None
    body_fat_pct: Optional[float] = None
    adherence: Optional[Adherence] = None
    observations: Optional[str] = None
    recommendation_template_diet: Optional[str] = None
    recommendation_template_training: Optional[str] = None
    recommendation_template_lifestyle: Optional[str] = None
    next_return_date: Optional[datetime] = None
    
    @field_validator("weight_kg")
    @classmethod
    def validate_weight(cls, v):
        if v < 10 or v > 500:
            raise ValueError("Peso deve estar entre 10 e 500 kg")
        return v


class CheckInUpdate(BaseModel):
    date: Optional[datetime] = None
    weight_kg: Optional[float] = None
    waist_cm: Optional[float] = None
    hip_cm: Optional[float] = None
    body_fat_pct: Optional[float] = None
    adherence: Optional[Adherence] = None
    observations: Optional[str] = None
    recommendation_template_diet: Optional[str] = None
    recommendation_template_training: Optional[str] = None
    recommendation_template_lifestyle: Optional[str] = None
    next_return_date: Optional[datetime] = None


class CheckInResponse(BaseModel):
    id: UUID
    patient_id: UUID
    date: datetime
    weight_kg: float
    waist_cm: Optional[float] = None
    hip_cm: Optional[float] = None
    body_fat_pct: Optional[float] = None
    adherence: Optional[Adherence] = None
    observations: Optional[str] = None
    imc: float
    recommendation_template_diet: Optional[str] = None
    recommendation_template_training: Optional[str] = None
    recommendation_template_lifestyle: Optional[str] = None
    next_return_date: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# Patient Detail with checkins
class PatientDetailResponse(PatientResponse):
    checkins: list[CheckInResponse] = []


# Templates
class DefaultTemplatesResponse(BaseModel):
    diet: str
    training: str
    lifestyle: str

