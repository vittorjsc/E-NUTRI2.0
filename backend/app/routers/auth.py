from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.database import get_session
from app.models import Professional
from app.schemas import LoginRequest, Token, RefreshTokenRequest, ProfessionalResponse
from app.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token,
    get_current_professional
)
from datetime import timedelta
from app.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=ProfessionalResponse, status_code=status.HTTP_201_CREATED)
async def register(
    data: LoginRequest,
    session: Session = Depends(get_session)
):
    """Registra novo profissional (opcional, pode ser apenas via seed)"""
    # Verifica se email já existe
    statement = select(Professional).where(Professional.email == data.email)
    existing = session.exec(statement).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado"
        )
    
    professional = Professional(
        name=data.email.split("@")[0],  # Nome padrão do email
        email=data.email,
        password_hash=get_password_hash(data.password)
    )
    session.add(professional)
    session.commit()
    session.refresh(professional)
    return professional


@router.post("/login", response_model=Token)
async def login(
    data: LoginRequest,
    session: Session = Depends(get_session)
):
    """Login do profissional"""
    statement = select(Professional).where(Professional.email == data.email)
    professional = session.exec(statement).first()
    
    if not professional or not verify_password(data.password, professional.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": str(professional.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    refresh_token = create_refresh_token(data={"sub": str(professional.id)})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/refresh", response_model=Token)
async def refresh_token(
    data: RefreshTokenRequest,
    session: Session = Depends(get_session)
):
    """Renova access token usando refresh token"""
    payload = decode_token(data.refresh_token)
    
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token inválido ou expirado",
        )
    
    professional_id = payload.get("sub")
    if not professional_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
        )
    
    # Verifica se profissional ainda existe
    from uuid import UUID
    try:
        professional_id_uuid = UUID(professional_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
        )
    
    statement = select(Professional).where(Professional.id == professional_id_uuid)
    professional = session.exec(statement).first()
    
    if not professional:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Profissional não encontrado",
        )
    
    access_token = create_access_token(
        data={"sub": str(professional.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    refresh_token = create_refresh_token(data={"sub": str(professional.id)})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/logout")
async def logout():
    """Logout (client-side deve remover tokens)"""
    return {"message": "Logout realizado com sucesso"}


@router.get("/me", response_model=ProfessionalResponse)
async def get_current_user(
    professional: Professional = Depends(get_current_professional)
):
    """Retorna dados do profissional logado"""
    return professional

