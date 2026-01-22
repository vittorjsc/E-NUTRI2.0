from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
from uuid import UUID, uuid4
from enum import Enum


class Sex(str, Enum):
    MASCULINO = "masculino"
    FEMININO = "feminino"
    OUTRO = "outro"


class ActivityLevel(str, Enum):
    SEDENTARIO = "sedentário"
    LEVE = "leve"
    MODERADO = "moderado"
    ALTO = "alto"


class Goal(str, Enum):
    EMAGRECIMENTO = "emagrecimento"
    HIPERTROFIA = "hipertrofia"
    MANUTENCAO = "manutenção"
    SAUDE_GERAL = "saúde geral"


class Adherence(str, Enum):
    BAIXA = "baixa"
    MEDIA = "média"
    ALTA = "alta"


class Professional(SQLModel, table=True):
    __tablename__ = "professionals"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    patients: List["Patient"] = Relationship(back_populates="professional")


class Patient(SQLModel, table=True):
    __tablename__ = "patients"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    professional_id: UUID = Field(foreign_key="professionals.id", index=True)
    full_name: str
    birth_date: datetime
    sex: Sex
    height_cm: float
    activity_level: ActivityLevel
    goal: Goal
    notes: Optional[str] = None
    cpf_last4: Optional[str] = None  # Últimos 4 dígitos para busca
    cpf_encrypted: Optional[str] = None  # CPF completo criptografado
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    professional: Professional = Relationship(back_populates="patients")
    checkins: List["CheckIn"] = Relationship(back_populates="patient")


class CheckIn(SQLModel, table=True):
    __tablename__ = "checkins"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    patient_id: UUID = Field(foreign_key="patients.id", index=True)
    date: datetime
    weight_kg: float
    waist_cm: Optional[float] = None
    hip_cm: Optional[float] = None
    body_fat_pct: Optional[float] = None
    adherence: Optional[Adherence] = None
    observations: Optional[str] = None
    imc: float  # Calculado e salvo
    recommendation_template_diet: Optional[str] = None
    recommendation_template_training: Optional[str] = None
    recommendation_template_lifestyle: Optional[str] = None
    next_return_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    patient: Patient = Relationship(back_populates="checkins")

